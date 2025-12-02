'use client';

import { Search, Plus, X } from 'lucide-react';

interface KeywordsEditorProps {
  value: string[] | undefined;
  editValue: string[] | undefined;
  isEditing: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (keyword: string) => void;
}

export function KeywordsEditor({
  value,
  editValue,
  isEditing,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
}: KeywordsEditorProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        Tracked Keywords
      </label>
      {isEditing ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a keyword..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={onAdd}
              disabled={!inputValue.trim()}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50 rounded-lg">
            {editValue?.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => onRemove(keyword)}
                  className="hover:text-indigo-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(!editValue || editValue.length === 0) && (
              <span className="text-slate-400 text-sm">No keywords added</span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(value?.length ?? 0) > 0 ? (
            value?.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))
          ) : (
            <span className="text-slate-400">No keywords tracked</span>
          )}
        </div>
      )}
      <p className="text-xs text-slate-400 mt-2">
        These keywords are used to monitor social media for mentions relevant to your brand.
      </p>
    </div>
  );
}
