export interface Stuff {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStuffData {
  name: string;
}

export interface UpdateStuffData {
  name: string;
}