import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt enforcing wellness safety, non-medical stance, and actionable advice
const COACH_SYSTEM_INSTRUCTION = `You are DeskMate, a calm, friendly, empathetic, and motivating AI workplace wellness coach for desk workers.
Your mission is to help users feel more comfortable, relieve stiffness, improve posture, and take regular micro-movement breaks.

IMPORTANT SAFETY & COMMUNICATION BOUNDARIES:
- You are a wellness assistant, NOT a doctor or medical diagnosis system.
- Never diagnose diseases, syndromes, or medical conditions.
- Never prescribe medication or treatments.
- If a user mentions persistent, sharp, radiating, or severe pain or numbness, gently encourage them to consult a qualified healthcare professional.
- Use encouraging, non-judgmental, warm wellness language (e.g. "Try bringing your monitor higher", "Let's give your shoulders a gentle reset").
- Keep responses concise, scannable, and actionable (usually 2 to 4 short paragraphs or bullet points).
- When appropriate, propose a specific 1-to-2 minute desk routine (e.g. Chin Tuck, Shoulder Rolls, Seated Twist, Wrist Extension).
- Avoid clinical jargon. Speak like a mindful, encouraging ergonomics specialist.`;

// POST /api/coach/chat
app.post('/api/coach/chat', async (req: Request, res: Response) => {
  try {
    const { message, context, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build enriched context
    const contextPrompt = context
      ? `\n[User Realtime Workplace Context: Sitting Time: ${context.sittingTimeMinutes || 0} min | Breaks today: ${context.breaksToday || 0} | Movement Score: ${context.movementScore || 70}/100 | Posture observation: ${context.postureStatus || 'Not checked recently'} | Primary Goal: ${context.primaryGoal || 'Better posture & movement'}]`
      : '';

    // If Gemini client is available, call the API with a timeout fallback
    if (ai) {
      try {
        // Assemble contents
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            if (item.sender === 'user') {
              contents.push({ role: 'user', parts: [{ text: item.text }] });
            } else if (item.sender === 'bot') {
              contents.push({ role: 'model', parts: [{ text: item.text }] });
            }
          }
        }

        contents.push({
          role: 'user',
          parts: [{ text: `${contextPrompt}\n\nUser message: ${message}` }],
        });

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: COACH_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timed out')), 4500)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const text = response?.text || "Let's take a quick 2-minute movement break to reset your neck and back.";
        return res.json({ reply: text });
      } catch (apiErr) {
        console.warn('Gemini API attempt timed out or failed, using heuristic engine:', apiErr);
        // Continue to fallback below
      }
    }

    // Graceful offline / heuristic fallback when API key is not configured
    const lower = message.toLowerCase();
    let reply = '';
    if (lower.includes('sitting') || lower.includes('hour') || lower.includes('long time')) {
      reply = `You've been focused for quite a stretch! Let's take a 2-minute reset right at your desk.\n\nTry standing up, rolling your shoulders backwards 5 times, and taking 3 slow, deep belly breaths. Your spine will thank you!`;
    } else if (lower.includes('neck') || lower.includes('stiff') || lower.includes('tight')) {
      reply = `Neck tension is very common when looking at screens for long periods.\n\nTry this gentle move: Sit tall, gently tuck your chin straight back like making a soft double chin, hold for 3 seconds, and release. Repeat 4 times. Remember to check if your screen is at eye level!`;
    } else if (lower.includes('shoulder') || lower.includes('upper back')) {
      reply = `Let's open up those shoulders! Drop your shoulders away from your ears, clasp your hands behind your lower back if comfortable, and gently roll your chest open. Hold for 15 seconds while breathing smoothly.`;
    } else if (lower.includes('eye') || lower.includes('screen') || lower.includes('headache')) {
      reply = `Your eyes need rest too! Let's try the 20-20-20 rule: Look away from your screen at an object at least 20 feet away for 20 seconds. Blink softly and let your eye muscles relax.`;
    } else if (lower.includes('tired') || lower.includes('fatigue') || lower.includes('slump')) {
      reply = `Afternoon slumps are natural. Instead of pushing through with stiffness, stand up for 60 seconds, stretch both arms overhead toward the ceiling, drink a glass of water, and shake out your hands. You'll feel recharged!`;
    } else {
      reply = `I'm here to support your workday posture and movement! Would you like a 2-minute shoulder & neck stretch, a quick posture alignment check, or tips to optimize your desk chair?`;
    }

    return res.json({ reply, fallback: true });
  } catch (error: any) {
    console.error('Coach API Error:', error);
    return res.status(500).json({
      error: 'Unable to reach coach right now',
      reply: "I'm having a little trouble connecting to the network, but here is a quick tip: roll your shoulders back and relax your jaw for 10 seconds. You're doing great!",
    });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: !!ai,
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
