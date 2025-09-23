import type { Stuff, CreateStuffData, UpdateStuffData } from '../types/stuff';
import type { Tag, CreateTagData, UpdateTagData } from '../types/tag';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Ignore JSON parsing errors, use default message
    }
    throw new ApiError(errorMessage, response.status);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return null as T;
}

export const stuffApi = {
  // Get all stuffs
  async getAll(): Promise<Stuff[]> {
    const response = await fetch(`${API_BASE_URL}/stuffs`);
    return handleResponse<Stuff[]>(response);
  },

  // Get stuff by ID
  async getById(id: number): Promise<Stuff> {
    const response = await fetch(`${API_BASE_URL}/stuffs/${id}`);
    return handleResponse<Stuff>(response);
  },

  // Create new stuff
  async create(data: CreateStuffData): Promise<Stuff> {
    const response = await fetch(`${API_BASE_URL}/stuffs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stuff: data }),
    });
    return handleResponse<Stuff>(response);
  },

  // Update stuff
  async update(id: number, data: UpdateStuffData): Promise<Stuff> {
    const response = await fetch(`${API_BASE_URL}/stuffs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stuff: data }),
    });
    return handleResponse<Stuff>(response);
  },

  // Delete stuff
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/stuffs/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export const tagApi = {
  // Get all tags for a specific taggable resource
  async getByTaggable(taggableType: string, taggableId: number): Promise<Tag[]> {
    const response = await fetch(`${API_BASE_URL}/${taggableType}/${taggableId}/tags`);
    return handleResponse<Tag[]>(response);
  },

  // Get tag by ID
  async getById(id: number): Promise<Tag> {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`);
    return handleResponse<Tag>(response);
  },

  // Create new tag
  async create(data: CreateTagData): Promise<Tag> {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag: data }),
    });
    return handleResponse<Tag>(response);
  },

  // Update tag
  async update(id: number, data: UpdateTagData): Promise<Tag> {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag: data }),
    });
    return handleResponse<Tag>(response);
  },

  // Delete tag
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export { ApiError };