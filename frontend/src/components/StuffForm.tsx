import React, { useState, useEffect, useMemo } from 'react';
import type { CreateStuffData, UpdateStuffData, Stuff } from '../types/stuff';

interface TagInput {
  id?: number;
  name: string;
  description: string;
  color_code: string;
  _destroy?: boolean;
}

interface StuffFormProps {
  onSubmit: (data: CreateStuffData | UpdateStuffData) => Promise<void>;
  initialData?: Stuff;
  isEdit?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function StuffForm({ onSubmit, initialData, isEdit = false, isLoading = false, onCancel }: StuffFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [tags, setTags] = useState<TagInput[]>(
    initialData?.tags?.map(tag => ({
      id: tag.id,
      name: tag.name,
      description: tag.description || '',
      color_code: tag.color_code || '#000000'
    })) || []
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initialData?.name || '');
    setTags(
      initialData?.tags?.map(tag => ({
        id: tag.id,
        name: tag.name,
        description: tag.description || '',
        color_code: tag.color_code || '#000000'
      })) || []
    );
    setError(null); // Reset error when data changes
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('アイテム名を入力してください');
      return;
    }

    try {
      setError(null);
      const submitData = {
        name: name.trim(),
        tags_attributes: tags.map(tag => ({
          ...(tag.id && { id: tag.id }),
          name: tag.name.trim(),
          description: tag.description.trim() || undefined,
          color_code: tag.color_code || undefined,
          ...(tag._destroy && { _destroy: true })
        })).filter(tag => tag.name || tag._destroy)
      };
      await onSubmit(submitData);
      if (!isEdit) {
        setName(''); // Reset form for create mode
        setTags([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  const addTag = () => {
    setTags([...tags, { name: '', description: '', color_code: '#000000' }]);
  };

  const removeTag = (index: number) => {
    const tag = tags[index];
    // If tag has an ID (existing tag), mark for deletion instead of removing
    if (tag.id) {
      setTags(tags.map((t, i) => i === index ? { ...t, _destroy: true } : t));
    } else {
      // If tag doesn't have an ID (new tag), remove it from state
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const updateTag = (index: number, field: keyof TagInput, value: string) => {
    const updatedTags = tags.map((tag, i) =>
      i === index ? { ...tag, [field]: value } : tag
    );
    setTags(updatedTags);
  };

  // Memoize visible tags for performance
  const visibleTags = useMemo(() =>
    tags.filter(tag => !tag._destroy), [tags]
  );

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

        <div className="form-group">
          <div className="flex justify-between items-center mb-2">
            <label className="form-label">
              タグ
            </label>
            <button
              type="button"
              onClick={addTag}
              className="button button-secondary text-sm"
              disabled={isLoading}
            >
              + タグを追加
            </button>
          </div>
          
          {tags.map((tag, actualIndex) => {
            if (tag._destroy) return null;
            const visibleIndex = tags.slice(0, actualIndex).filter(t => !t._destroy).length;
            return (
            <div key={tag.id || `new-${actualIndex}`} className="border border-gray-300 rounded p-3 mb-2">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">タグ {visibleIndex + 1}</span>
                <button
                  type="button"
                  onClick={() => removeTag(actualIndex)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  disabled={isLoading}
                  aria-label={`タグ ${visibleIndex + 1} を削除`}
                >
                  削除
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    名前 *
                  </label>
                  <input
                    type="text"
                    value={tag.name}
                    onChange={(e) => updateTag(actualIndex, 'name', e.target.value)}
                    placeholder="タグ名"
                    className="input text-sm"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    説明
                  </label>
                  <input
                    type="text"
                    value={tag.description}
                    onChange={(e) => updateTag(actualIndex, 'description', e.target.value)}
                    placeholder="説明（任意）"
                    className="input text-sm"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    色
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="color"
                      value={tag.color_code}
                      onChange={(e) => updateTag(actualIndex, 'color_code', e.target.value)}
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      disabled={isLoading}
                      aria-label={`タグ ${visibleIndex + 1} のカラーを選択`}
                    />
                    <input
                      type="text"
                      value={tag.color_code}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Validate hex color format
                        if (value === '' || /^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                          updateTag(actualIndex, 'color_code', value);
                        }
                      }}
                      placeholder="#000000"
                      className="input text-sm flex-1"
                      disabled={isLoading}
                      pattern="^#[0-9A-Fa-f]{6}$"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
          })}
          
          {visibleTags.length === 0 && (
            <p className="text-sm text-gray-500">タグはまだ追加されていません。上のボタンから追加できます。</p>
          )}
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