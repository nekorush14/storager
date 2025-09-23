export interface Tag {
  id: number;
  name: string;
  description?: string;
  color_code?: string;
  taggable_id: number;
  taggable_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTagData {
  name: string;
  description?: string;
  color_code?: string;
  taggable_id: number;
  taggable_type: string;
}

export interface UpdateTagData {
  name?: string;
  description?: string;
  color_code?: string;
}