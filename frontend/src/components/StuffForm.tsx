import React, { useState } from 'react';
import type { CreateStuffData, UpdateStuffData, Stuff } from '../types/stuff';

interface StuffFormProps {
  onSubmit: (data: CreateStuffData | UpdateStuffData) => Promise<void>;
  initialData?: Stuff;
  isEdit?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function StuffForm({ onSubmit, initialData, isEdit = false, isLoading = false, onCancel }: StuffFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('アイテム名を入力してください');
      return;
    }

    try {
      setError(null);
      await onSubmit({ name: name.trim() });
      if (!isEdit) {
        setName(''); // Reset form for create mode
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'アイテムを編集' : '新しいアイテムを追加'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            アイテム名
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="アイテム名を入力してください"
            className="input"
            disabled={isLoading}
            autoFocus
          />
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="button"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? '保存中...' : (isEdit ? '更新' : '追加')}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="button button-secondary"
              disabled={isLoading}
            >
              キャンセル
            </button>
          )}
        </div>
      </form>
    </div>
  );
}