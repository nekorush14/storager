import { useState } from 'react';
import type { Stuff } from './types/stuff';
import { StuffForm } from './components/StuffForm';
import { StuffList } from './components/StuffList';
import { useStuffs } from './hooks/useStuffs';

function App() {
  const { stuffs, loading, error, createStuff, updateStuff, deleteStuff } = useStuffs();
  const [editingStuff, setEditingStuff] = useState<Stuff | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = async (data: { name: string }) => {
    try {
      setFormLoading(true);
      await createStuff(data);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: { name: string }) => {
    if (!editingStuff) return;
    
    try {
      setFormLoading(true);
      await updateStuff(editingStuff.id, data);
      setEditingStuff(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (stuff: Stuff) => {
    setEditingStuff(stuff);
  };

  const handleCancelEdit = () => {
    setEditingStuff(null);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Storager</h1>
          <p className="text-secondary">家庭内の物品管理アプリケーション</p>
        </header>

        {error && (
          <div className="card mb-6" style={{ borderColor: 'var(--error)' }}>
            <div className="error-message text-center">
              <strong>エラー:</strong> {error}
            </div>
          </div>
        )}

        <div className="grid gap-6">
          <StuffForm
            onSubmit={editingStuff ? handleUpdate : handleCreate}
            initialData={editingStuff || undefined}
            isEdit={!!editingStuff}
            isLoading={formLoading}
            onCancel={editingStuff ? handleCancelEdit : undefined}
          />

          <StuffList
            stuffs={stuffs}
            onEdit={handleEdit}
            onDelete={deleteStuff}
            isLoading={loading}
          />
        </div>

        <footer className="text-center mt-8 p-4">
          <p className="text-sm text-secondary">
            Storager v1.0 - 物品管理システム
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;