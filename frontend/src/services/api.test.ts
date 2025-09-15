import { describe, it, expect } from 'vitest';
import { stuffApi, ApiError } from './api';

describe('stuffApi', () => {
  describe('getAll', () => {
    it('should fetch all stuffs successfully', async () => {
      const stuffs = await stuffApi.getAll();
      
      expect(stuffs).toHaveLength(2);
      expect(stuffs[0]).toEqual({
        id: 1,
        name: 'テスト用アイテム1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });
      expect(stuffs[1]).toEqual({
        id: 2,
        name: 'テスト用アイテム2',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      });
    });
  });

  describe('getById', () => {
    it('should fetch a specific stuff by ID', async () => {
      const stuff = await stuffApi.getById(1);
      
      expect(stuff).toEqual({
        id: 1,
        name: 'テスト用アイテム1',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });
    });

    it('should throw ApiError when stuff is not found', async () => {
      await expect(stuffApi.getById(999)).rejects.toThrow(ApiError);
    });
  });

  describe('create', () => {
    it('should create a new stuff successfully', async () => {
      const newStuffData = { name: '新しいアイテム' };
      const createdStuff = await stuffApi.create(newStuffData);
      
      expect(createdStuff).toEqual({
        id: expect.any(Number),
        name: '新しいアイテム',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
      expect(createdStuff.id).toBeGreaterThan(2);
    });

    it('should send the correct request body format', async () => {
      const newStuffData = { name: 'テスト作成' };
      const createdStuff = await stuffApi.create(newStuffData);
      
      expect(createdStuff.name).toBe('テスト作成');
    });
  });

  describe('update', () => {
    it('should update an existing stuff successfully', async () => {
      const updateData = { name: '更新されたアイテム' };
      const updatedStuff = await stuffApi.update(1, updateData);
      
      expect(updatedStuff).toEqual({
        id: 1,
        name: '更新されたアイテム',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: expect.any(String),
      });
    });

    it('should throw ApiError when trying to update non-existent stuff', async () => {
      const updateData = { name: '存在しないアイテム' };
      await expect(stuffApi.update(999, updateData)).rejects.toThrow(ApiError);
    });
  });

  describe('delete', () => {
    it('should delete a stuff successfully', async () => {
      const result = await stuffApi.delete(1);
      expect(result).toBeNull();
    });

    it('should throw ApiError when trying to delete non-existent stuff', async () => {
      await expect(stuffApi.delete(999)).rejects.toThrow(ApiError);
    });
  });

  describe('ApiError', () => {
    it('should have correct error properties', async () => {
      try {
        await stuffApi.getById(999);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(404);
        expect((error as ApiError).name).toBe('ApiError');
      }
    });
  });
});