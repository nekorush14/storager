import { http, HttpResponse } from 'msw';
import type { Stuff } from '../../types/stuff';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Mock data
let mockStuffs: Stuff[] = [
  {
    id: 1,
    name: 'テスト用アイテム1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'テスト用アイテム2',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

let nextId = 3;

export const handlers = [
  // GET /api/v1/stuffs - Get all stuffs
  http.get(`${API_BASE_URL}/stuffs`, () => {
    return HttpResponse.json(mockStuffs);
  }),

  // GET /api/v1/stuffs/:id - Get stuff by ID
  http.get(`${API_BASE_URL}/stuffs/:id`, ({ params }) => {
    const id = parseInt(params.id as string);
    const stuff = mockStuffs.find((s) => s.id === id);
    
    if (!stuff) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(stuff);
  }),

  // POST /api/v1/stuffs - Create new stuff
  http.post(`${API_BASE_URL}/stuffs`, async ({ request }) => {
    const body = await request.json() as { stuff: { name: string } };
    const newStuff: Stuff = {
      id: nextId++,
      name: body.stuff.name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockStuffs.push(newStuff);
    return HttpResponse.json(newStuff, { status: 201 });
  }),

  // PUT /api/v1/stuffs/:id - Update stuff
  http.put(`${API_BASE_URL}/stuffs/:id`, async ({ params, request }) => {
    const id = parseInt(params.id as string);
    const body = await request.json() as { stuff: { name: string } };
    const stuffIndex = mockStuffs.findIndex((s) => s.id === id);
    
    if (stuffIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockStuffs[stuffIndex] = {
      ...mockStuffs[stuffIndex],
      name: body.stuff.name,
      updated_at: new Date().toISOString(),
    };
    
    return HttpResponse.json(mockStuffs[stuffIndex]);
  }),

  // DELETE /api/v1/stuffs/:id - Delete stuff
  http.delete(`${API_BASE_URL}/stuffs/:id`, ({ params }) => {
    const id = parseInt(params.id as string);
    const stuffIndex = mockStuffs.findIndex((s) => s.id === id);
    
    if (stuffIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockStuffs.splice(stuffIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];

// Helper function to reset mock data
export const resetMockData = () => {
  mockStuffs = [
    {
      id: 1,
      name: 'テスト用アイテム1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'テスト用アイテム2',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];
  nextId = 3;
};