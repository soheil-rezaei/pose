import React, { useState, useMemo } from 'react';
import { EXERCISES } from '../data/exercises';
import { Exercise, ExerciseCategory } from '../types';
import { ExerciseIllustration } from '../components/common/ExerciseIllustration';
import {
  Search,
  Filter,
  Play,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onStartSingleExercise: (exercise: Exercise) => void;
  onStartRoutine: (routineId?: string) => void;
  selectedCategoryProp?: ExerciseCategory | null;
}

export const ExerciseLibraryPage: React.FC<Props> = ({
  onStartSingleExercise,
  onStartRoutine,
  selectedCategoryProp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    selectedCategoryProp || 'All'
  );
  const [filterPostureType, setFilterPostureType] = useState<'all' | 'seated' | 'standing'>('all');
  const [activeDetailExercise, setActiveDetailExercise] = useState<Exercise | null>(null);

  const categories = [
    'All',
    'Neck',
    'Shoulders',
    'Upper back',
    'Lower back',
    'Wrists',
    'Hips',
    'Legs',
    'Full body',
    'Eye relaxation',
    'Breathing',
  ];

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter((ex) => {
      // Category filter
      if (selectedCategory !== 'All' && ex.category !== selectedCategory) {
        return false;
      }
      // Seated / Standing filter
      if (filterPostureType === 'seated' && !ex.seated) return false;
      if (filterPostureType === 'standing' && ex.seated) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesTarget = ex.targetArea.toLowerCase().includes(q);
        const matchesCategory = ex.category.toLowerCase().includes(q);
        return matchesName || matchesTarget || matchesCategory;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, filterPostureType]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Desk-Friendly Movements</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Exercise Library
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Micro-stretches and gentle mobility resets you can do at your computer without sweating.
          </p>
        </div>

        <button
          onClick={() => onStartRoutine('quick-reset')}
          className="self-start sm:self-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-2xl shadow-xs transition active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Start 2-Min Reset Routine</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by muscle or move (e.g. neck, wrist, spine, eyes)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition text-stone-900 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Seated vs Standing Filter */}
          <div className="inline-flex rounded-2xl p-1 bg-stone-100 border border-stone-200 text-xs font-semibold self-start sm:self-auto shrink-0">
            {(['all', 'seated', 'standing'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterPostureType(type)}
                className={`px-3 py-1.5 rounded-xl capitalize transition ${
                  filterPostureType === type
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {type === 'all' ? 'All Positions' : type === 'seated' ? '🪑 Seated' : '🧍 Standing'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills (Horizontal Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercises Grid */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setActiveDetailExercise(exercise)}
              className="group p-5 rounded-3xl bg-white border border-stone-200/70 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 text-[11px] font-semibold text-stone-700">
                    {exercise.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{exercise.durationSeconds}s</span>
                  </span>
                </div>

                <div className="my-3">
                  <ExerciseIllustration
                    type={exercise.illustrationType}
                    className="w-full h-32"
                  />
                </div>

                <h4 className="text-base font-bold text-stone-900 group-hover:text-emerald-950 transition">
                  {exercise.name}
                </h4>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                  Target: {exercise.targetArea}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-stone-400">
                  {exercise.seated ? 'Seated move' : 'Standing move'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartSingleExercise(exercise);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition p-1"
                >
                  <span>Start move</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/70 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-stone-800">No exercises found</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setFilterPostureType('all');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {activeDetailExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-stone-200 p-6 sm:p-7 space-y-5 text-stone-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
                  {activeDetailExercise.category} • {activeDetailExercise.seated ? 'Seated' : 'Standing'}
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 mt-2">
                  {activeDetailExercise.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Target area: {activeDetailExercise.targetArea}
                </p>
              </div>

              <button
                onClick={() => setActiveDetailExercise(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ExerciseIllustration
              type={activeDetailExercise.illustrationType}
              className="w-full h-44 shadow-inner"
            />

            {/* Instructions */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Step-by-Step Instructions
              </h4>
              <div className="space-y-2 bg-stone-50 rounded-2xl p-4 border border-stone-200/60">
                {activeDetailExercise.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {activeDetailExercise.safetyNote && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{activeDetailExercise.safetyNote}</span>
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setActiveDetailExercise(null)}
                className="flex-1 py-3 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const ex = activeDetailExercise;
                  setActiveDetailExercise(null);
                  onStartSingleExercise(ex);
                }}
                className="flex-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-xs active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Exercise ({activeDetailExercise.durationSeconds}s)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
