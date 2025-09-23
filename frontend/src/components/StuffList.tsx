import type { Stuff } from '../types/stuff';

interface StuffListProps {
  stuffs: Stuff[];
  onEdit: (stuff: Stuff) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function StuffList({ stuffs, onEdit, onDelete, isLoading = false }: StuffListProps) {
  if (isLoading) {
    return (
      <div className="card">
        <div className="text-center">
          <p className="text-secondary">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (stuffs.length === 0) {
    return (
      <div className="card">
        <div className="text-center">
          <p className="text-secondary">まだアイテムがありません。</p>
          <p className="text-sm text-secondary mt-2">上記のフォームから新しいアイテムを追加してください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">アイテム一覧</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stuffs.map((stuff) => (
          <div key={stuff.id} className="card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{stuff.name}</h3>
              <span className="text-sm text-secondary">#{stuff.id}</span>
            </div>
            
            {stuff.tags && stuff.tags.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {stuff.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border"
                      style={{
                        backgroundColor: tag.color_code ? `${tag.color_code}20` : '#f3f4f6',
                        borderColor: tag.color_code || '#d1d5db',
                        color: tag.color_code || '#374151'
                      }}
                    >
                      {tag.color_code && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: tag.color_code }}
                        />
                      )}
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {stuff.created_at && (
              <p className="text-sm text-secondary mb-4">
                作成日: {new Date(stuff.created_at).toLocaleDateString('ja-JP')}
              </p>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(stuff)}
                className="button button-secondary text-sm"
              >
                編集
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`"${stuff.name}" を削除しますか？`)) {
                    onDelete(stuff.id);
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
}