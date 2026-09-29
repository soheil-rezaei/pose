import { ChatMessage } from '../types';

export interface CoachContext {
  sittingTimeMinutes: number;
  breaksToday: number;
  movementScore: number;
  postureStatus: string;
  primaryGoal: string;
}

export async function sendCoachMessage(
  userText: string,
  context: CoachContext,
  history: ChatMessage[]
): Promise<{ text: string; actions?: ChatMessage['actions'] }> {
  try {
    const res = await fetch('/api/coach/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userText,
        context,
        history,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    const replyText = data.reply || "Let's take a quick 2-minute movement break to reset your posture.";

    // Parse contextual actions
    const lower = (userText + ' ' + replyText).toLowerCase();
    const actions: ChatMessage['actions'] = [];

    if (lower.includes('routine') || lower.includes('break') || lower.includes('exercise') || lower.includes('stretch')) {
      actions.push({
        label: 'Start 2-Minute Routine',
        actionType: 'start_break',
      });
    }

    if (lower.includes('posture') || lower.includes('align') || lower.includes('camera') || lower.includes('screen')) {
      actions.push({
        label: 'Check My Posture',
        actionType: 'check_posture',
      });
    }

    if (lower.includes('neck') || lower.includes('shoulder')) {
      actions.push({
        label: 'View Neck Exercises',
        actionType: 'open_exercise',
        payload: 'Neck',
      });
    }

    return {
      text: replyText,
      actions: actions.length > 0 ? actions : [
        { label: 'Start 2-Minute Reset', actionType: 'start_break' },
        { label: 'Check Posture', actionType: 'check_posture' },
      ],
    };
  } catch (err) {
    console.warn('AI Coach server unreachable, using offline wellness engine:', err);

    // High quality offline fallback
    let fallbackText = "I'm working in offline mode right now! To reset your spine right now: stand up, interlace your fingers behind your back to open your chest, and take 3 deep, relaxing breaths.";
    const lower = userText.toLowerCase();

    if (lower.includes('neck') || lower.includes('stiff')) {
      fallbackText = "For neck stiffness from screen work: Sit upright, gently tuck your chin straight back to align your cervical vertebrae, and hold for 3 seconds. Repeat 4 times.";
    } else if (lower.includes('shoulder')) {
      fallbackText = "Let's drop those shoulders away from your ears! Shrug your shoulders up, roll them back smoothly, and relax them down 5 times.";
    } else if (lower.includes('sitting') || lower.includes('hour')) {
      fallbackText = "Prolonged sitting compresses your spine. Taking just 90 seconds to stand, reach overhead, and walk in place will boost your energy instantly.";
    }

    return {
      text: fallbackText,
      actions: [
        { label: 'Start 2-Minute Reset', actionType: 'start_break' },
        { label: 'View Exercises', actionType: 'open_exercise' },
      ],
    };
  }
}
