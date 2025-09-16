import type { Stuff, CreateStuffData, UpdateStuffData } from '../types/stuff';

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

export { ApiError };