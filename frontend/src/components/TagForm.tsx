import React, { useState, useEffect } from 'react';
import type { CreateTagData, UpdateTagData, Tag } from '../types/tag';
import { validateTagName, validateTagDescription, validateColorCode, sanitizeText, sanitizeColorCode } from '../utils/validation';
import { DEFAULT_VALUES, VALIDATION_MESSAGES } from '../constants/validation';

interface TagFormProps {
  onSubmit: (data: CreateTagData | UpdateTagData) => Promise<void>;
  initialData?: Tag;
  isEdit?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
  taggableId: number;
  taggableType: string;
}

export function TagForm({ 
  onSubmit, 
  initialData, 
  isEdit = false, 
  isLoading = false, 
  onCancel,
  taggableId,
  taggableType
}: TagFormProps) {
  const [name, setName] = useState(initialData?.name || DEFAULT_VALUES.EMPTY_STRING);
  const [description, setDescription] = useState(initialData?.description || DEFAULT_VALUES.EMPTY_STRING);
  const [colorCode, setColorCode] = useState(initialData?.color_code || DEFAULT_VALUES.TAG_COLOR);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initialData?.name || DEFAULT_VALUES.EMPTY_STRING);
    setDescription(initialData?.description || DEFAULT_VALUES.EMPTY_STRING);
    setColorCode(initialData?.color_code || DEFAULT_VALUES.TAG_COLOR);
    setError(null);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name
    const nameError = validateTagName(name);
    if (nameError) {
      setError(nameError);
      return;
    }

    // Validate description
    const descriptionError = validateTagDescription(description);
    if (descriptionError) {
      setError(descriptionError);
      return;
    }

    // Validate and sanitize color code
    const colorError = validateColorCode(colorCode);
    if (colorError) {
      setError(colorError);
      return;
    }

    const sanitizedColorCode = sanitizeColorCode(colorCode);
    if (colorCode && !sanitizedColorCode) {
      setError(VALIDATION_MESSAGES.COLOR_CODE_INVALID);
      return;
    }

    try {
      setError(null);
      const submitData = isEdit 
        ? { 
            name: sanitizeText(name.trim()), 
            description: description.trim() ? sanitizeText(description.trim()) : undefined,
            color_code: sanitizedColorCode || undefined
          }
        : { 
            name: sanitizeText(name.trim()), 
            description: description.trim() ? sanitizeText(description.trim()) : undefined,
            color_code: sanitizedColorCode || undefined,
            taggable_id: taggableId,
            taggable_type: taggableType
          };
      
      await onSubmit(submitData);
      
      if (!isEdit) {
        // Reset form for create mode
        setName(DEFAULT_VALUES.EMPTY_STRING);
        setDescription(DEFAULT_VALUES.EMPTY_STRING);
        setColorCode(DEFAULT_VALUES.TAG_COLOR);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'タグを編集' : '新しいタグを追加'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            タグ名 *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="タグ名を入力してください"
            className="input"
            disabled={isLoading}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            説明
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="タグの説明を入力してください（任意）"
            className="input"
            disabled={isLoading}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="colorCode" className="form-label">
            カラーコード
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              id="colorCode"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              disabled={isLoading}
              aria-label="タグのカラーを選択"
            />
            <input
              type="text"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value)}
              placeholder="#000000"
              className="input flex-1"
              disabled={isLoading}
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

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