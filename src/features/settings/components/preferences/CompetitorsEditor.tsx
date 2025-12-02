'use client';

import { Users, Plus, X } from 'lucide-react';

interface CompetitorsEditorProps {
  value: string[] | undefined;
  editValue: string[] | undefined;
  isEditing: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (competitor: string) => void;
}

const MAX_COMPETITORS = 5;

export function CompetitorsEditor({
  value,
  editValue,
  isEditing,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
}: CompetitorsEditorProps) {
  const currentCount = (editValue || []).length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="border-t border-slate-100 pt-6">
      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
        <Users className="w-4 h-4 text-orange-500" />
        Competitors
        <span className="text-xs font-normal text-slate-400">(optional, max {MAX_COMPETITORS})</span>
      </label>
      {isEditing ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a competitor..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button
              type="button"
              onClick={onAdd}
              disabled={!inputValue.trim() || currentCount >= MAX_COMPETITORS}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium hover:bg-orange-200 transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {(editValue || []).map((competitor, idx) => (
              <div
                key={competitor}
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center text-xs font-bold text-orange-700">
                    {idx + 1}
                  </span>
                  <span className="text-orange-800">{competitor}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(competitor)}
                  className="text-orange-400 hover:text-orange-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(value || []).length > 0 ? (
            (value || []).map((competitor, idx) => (
              <span
                key={competitor}
                className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm"
              >
                {idx + 1}. {competitor}
              </span>
            ))
          ) : (
            <span className="text-slate-400">No competitors tracked</span>
          )}
        </div>
      )}
    </div>
  );
}
