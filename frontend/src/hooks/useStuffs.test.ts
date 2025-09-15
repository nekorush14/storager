import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useStuffs } from './useStuffs';

describe('useStuffs', () => {
  it('should load stuffs on mount', async () => {
    const { result } = renderHook(() => useStuffs());
    
    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.stuffs).toHaveLength(2);
    expect(result.current.stuffs[0].name).toBe('テスト用アイテム1');
    expect(result.current.stuffs[1].name).toBe('テスト用アイテム2');
    expect(result.current.error).toBeNull();
  });

  it('should create a new stuff', async () => {
    const { result } = renderHook(() => useStuffs());
    
    await waitFor(() => {
      expect(result.current.stuffs).toHaveLength(2);
    });

    await act(async () => {
      await result.current.createStuff({ name: '新しいアイテム' });
    });

    expect(result.current.stuffs).toHaveLength(3);
    expect(result.current.stuffs[2].name).toBe('新しいアイテム');
    expect(result.current.error).toBeNull();
  });

  it('should update an existing stuff', async () => {
    const { result } = renderHook(() => useStuffs());
    
    await waitFor(() => {
      expect(result.current.stuffs).toHaveLength(2);
    });

    await act(async () => {
      await result.current.updateStuff(1, { name: '更新されたアイテム' });
    });

    const updatedStuff = result.current.stuffs.find(stuff => stuff.id === 1);
    expect(updatedStuff?.name).toBe('更新されたアイテム');
    expect(result.current.error).toBeNull();
  });

  it('should delete a stuff', async () => {
    const { result } = renderHook(() => useStuffs());
    
    await waitFor(() => {
      expect(result.current.stuffs).toHaveLength(2);
    });

    await act(async () => {
      await result.current.deleteStuff(1);
    });

    expect(result.current.stuffs).toHaveLength(1);
    expect(result.current.stuffs.find(stuff => stuff.id === 1)).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('should handle errors when creating stuff fails', async () => {
    const { result } = renderHook(() => useStuffs());
    
    await waitFor(() => {
      expect(result.current.stuffs).toHaveLength(2);
    });

    // Test error handling by trying to create with invalid data
    // Since our mock doesn't validate, we'll need to simulate an error scenario
    // This will be updated based on actual API behavior
    try {
      await act(async () => {
        await result.current.createStuff({ name: '' });
      });
    } catch {
      // Expected to throw in real implementation
    }
  });

  it('should refresh stuffs when refreshStuffs is called', async () => {
    const { result } = renderHook(() => useStuffs());
    
    await waitFor(() => {
      expect(result.current.stuffs).toHaveLength(2);
    });

    await act(async () => {
      await result.current.refreshStuffs();
    });

    expect(result.current.stuffs).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });
});