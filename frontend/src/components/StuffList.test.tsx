import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StuffList } from './StuffList';
import type { Stuff } from '../types/stuff';

describe('StuffList', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const mockStuffs: Stuff[] = [
    {
      id: 1,
      name: 'テストアイテム1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'テストアイテム2',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    render(
      <StuffList
        stuffs={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isLoading={true}
      />
    );
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should render empty state when no stuffs', () => {
    render(
      <StuffList
        stuffs={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('まだアイテムがありません。')).toBeInTheDocument();
    expect(screen.getByText('上記のフォームから新しいアイテムを追加してください。')).toBeInTheDocument();
  });

  it('should render list of stuffs', () => {
    render(
      <StuffList
        stuffs={mockStuffs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('アイテム一覧')).toBeInTheDocument();
    expect(screen.getByText('テストアイテム1')).toBeInTheDocument();
    expect(screen.getByText('テストアイテム2')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('should show formatted creation dates', () => {
    render(
      <StuffList
        stuffs={mockStuffs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Check for formatted dates (Japanese locale)
    expect(screen.getByText(/作成日: 2024\/1\/1/)).toBeInTheDocument();
    expect(screen.getByText(/作成日: 2024\/1\/2/)).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <StuffList
        stuffs={mockStuffs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const editButtons = screen.getAllByText('編集');
    await user.click(editButtons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockStuffs[0]);
  });

  it('should show confirmation dialog and call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    render(
      <StuffList
        stuffs={mockStuffs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButtons = screen.getAllByText('削除');
    await user.click(deleteButtons[0]);
    
    expect(confirmSpy).toHaveBeenCalledWith('"テストアイテム1" を削除しますか？');
    expect(mockOnDelete).toHaveBeenCalledWith(1);
    
    confirmSpy.mockRestore();
  });

  it('should not call onDelete when confirmation is cancelled', async () => {
    const user = userEvent.setup();
    
    // Mock window.confirm to return false
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    render(
      <StuffList
        stuffs={mockStuffs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButtons = screen.getAllByText('削除');
    await user.click(deleteButtons[0]);
    
    expect(confirmSpy).toHaveBeenCalledWith('"テストアイテム1" を削除しますか？');
    expect(mockOnDelete).not.toHaveBeenCalled();
    
    confirmSpy.mockRestore();
  });

  it('should render multiple items in grid layout', () => {
    render(
      <StuffList
        stuffs={mockStuffs}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const editButtons = screen.getAllByText('編集');
    const deleteButtons = screen.getAllByText('削除');
    
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });
});