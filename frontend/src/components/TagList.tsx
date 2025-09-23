import React from 'react';
import type { Tag } from '../types/tag';

interface TagListProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export const TagList = React.memo(({ tags, onEdit, onDelete, isLoading = false }: TagListProps) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="text-center">
          <p className="text-secondary">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="card">
        <div className="text-center">
          <p className="text-secondary">まだタグがありません。</p>
          <p className="text-sm text-secondary mt-2">上記のフォームから新しいタグを追加してください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">タグ一覧</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <div key={tag.id} className="card">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {tag.color_code && (
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: tag.color_code }}
                    title={`カラー: ${tag.color_code}`}
                  />
                )}
                <h3 className="text-lg font-medium">{tag.name}</h3>
              </div>
              <span className="text-sm text-secondary">#{tag.id}</span>
            </div>
            
            {tag.description && (
              <p className="text-sm text-gray-600 mb-2">{tag.description}</p>
            )}
            
            <div className="text-xs text-secondary mb-4">
              <p>対象: {tag.taggable_type} (ID: {tag.taggable_id})</p>
              {tag.created_at && (
                <p>作成日: {new Date(tag.created_at).toLocaleDateString('ja-JP')}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(tag)}
                className="button button-secondary text-sm"
              >
                編集
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`タグ "${tag.name}" を削除しますか？`)) {
                    onDelete(tag.id);
                  }
                }}
                className="button button-danger text-sm"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

TagList.displayName = 'TagList';