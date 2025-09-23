import type { Tag } from './tag';

export interface Stuff {
  id: number;
  name: string;
  tags?: Tag[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateStuffData {
  name: string;
  tags?: { name: string; description?: string; color_code?: string }[];
}

export interface UpdateStuffData {
  name: string;
  tags?: { name: string; description?: string; color_code?: string }[];
}