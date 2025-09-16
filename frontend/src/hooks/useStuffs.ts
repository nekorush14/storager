import { useState, useEffect } from 'react';
import type { Stuff, CreateStuffData, UpdateStuffData } from '../types/stuff';
import { stuffApi, ApiError } from '../services/api';

export function useStuffs() {
  const [stuffs, setStuffs] = useState<Stuff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStuffs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await stuffApi.getAll();
      setStuffs(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'データの取得に失敗しました';
      setError(message);
      console.error('Failed to load stuffs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createStuff = async (data: CreateStuffData) => {
    try {
      const newStuff = await stuffApi.create(data);
      setStuffs(prev => [...prev, newStuff]);
    } catch (err) {
      // Re-throw to allow the form component to handle the error.
      throw err;
    }
  };

  const updateStuff = async (id: number, data: UpdateStuffData) => {
    try {
      const updatedStuff = await stuffApi.update(id, data);
      setStuffs(prev => prev.map(stuff =>
        stuff.id === id ? updatedStuff : stuff
      ));
    } catch (err) {
      // Re-throw to allow the form component to handle the error.
      throw err;
    }
  };

  const deleteStuff = async (id: number) => {
    try {
      setError(null);
      await stuffApi.delete(id);
      setStuffs(prev => prev.filter(stuff => stuff.id !== id));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'アイテムの削除に失敗しました';
      setError(message);
      console.error('Failed to delete stuff:', err);
    }
  };

  useEffect(() => {
    loadStuffs();
  }, []);

  return {
    stuffs,
    loading,
    error,
    createStuff,
    updateStuff,
    deleteStuff,
    refreshStuffs: loadStuffs,
  };
}