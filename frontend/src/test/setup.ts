import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';
import { resetMockData } from './mocks/handlers';

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers and mock data after each test
afterEach(() => {
  server.resetHandlers();
  resetMockData();
});

// Stop MSW server after all tests
afterAll(() => {
  server.close();
});