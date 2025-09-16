import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders Storager heading', () => {
    render(<App />);
    const heading = screen.getByText('Storager');
    expect(heading).toBeInTheDocument();
  });

  it('renders application description', () => {
    render(<App />);
    const description = screen.getByText('家庭内の物品管理アプリケーション');
    expect(description).toBeInTheDocument();
  });

  it('renders form section', () => {
    render(<App />);
    const formHeading = screen.getByText('新しいアイテムを追加');
    expect(formHeading).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<App />);
    const footer = screen.getByText('Storager v1.0 - 物品管理システム');
    expect(footer).toBeInTheDocument();
  });
});