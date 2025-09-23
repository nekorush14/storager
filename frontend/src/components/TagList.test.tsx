import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagList } from './TagList';
import type { Tag } from '../types/tag';

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(),
});

describe('TagList', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockConfirm = vi.mocked(window.confirm);

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  const mockTags: Tag[] = [
    {
      id: 1,
      name: 'タグ1',
      description: 'タグ1の説明',
      color_code: '#ff0000',
      taggable_id: 1,
      taggable_type: 'Stuff',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'タグ2',
      description: 'タグ2の説明',
      color_code: '#00ff00',
      taggable_id: 1,
      taggable_type: 'Stuff',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  it('should render loading state', () => {
    render(
      <TagList
        tags={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isLoading={true}
      />
    );
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should render empty state', () => {
    render(
      <TagList
        tags={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('まだタグがありません。')).toBeInTheDocument();
    expect(screen.getByText('上記のフォームから新しいタグを追加してください。')).toBeInTheDocument();
  });

  it('should render tags list correctly', () => {
    render(
      <TagList
        tags={mockTags}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('タグ一覧')).toBeInTheDocument();
    expect(screen.getByText('タグ1')).toBeInTheDocument();
    expect(screen.getByText('タグ2')).toBeInTheDocument();
    expect(screen.getByText('タグ1の説明')).toBeInTheDocument();
    expect(screen.getByText('タグ2の説明')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('should display tag colors correctly', () => {
    render(
      <TagList
        tags={mockTags}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Check if color elements exist (we can't easily test inline styles in jsdom)
    const colorElements = screen.getAllByTitle(/カラー:/);
    expect(colorElements).toHaveLength(2);
    expect(colorElements[0]).toHaveAttribute('title', 'カラー: #ff0000');
    expect(colorElements[1]).toHaveAttribute('title', 'カラー: #00ff00');
  });

  it('should display taggable information', () => {
    render(
      <TagList
        tags={mockTags}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getAllByText('対象: Stuff (ID: 1)')).toHaveLength(2); // Two tags with same taggable
  });

  it('should display creation dates', () => {
    render(
      <TagList
        tags={mockTags}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('作成日: 2024/1/1')).toBeInTheDocument();
    expect(screen.getByText('作成日: 2024/1/2')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TagList
        tags={mockTags}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const editButtons = screen.getAllByText('編集');
    await user.click(editButtons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockTags[0]);
  });

  it('should call onDelete when delete button is clicked and confirmed', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(true);
    
    render(
      <TagList
        tags={mockTags}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButtons = screen.getAllByText('削除');
    await user.click(deleteButtons[0]);
    
    expect(mockConfirm).toHaveBeenCalledWith('タグ "タグ1" を削除しますか？');
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('should not call onDelete when delete button is clicked but not confirmed', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(false);
    
    render(
      <TagList
        tags={mockTags}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButtons = screen.getAllByText('削除');
    await user.click(deleteButtons[0]);
    
    expect(mockConfirm).toHaveBeenCalledWith('タグ "タグ1" を削除しますか？');
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should render tags without description', () => {
    const tagsWithoutDesc: Tag[] = [
      {
        id: 1,
        name: 'タグ1',
        taggable_id: 1,
        taggable_type: 'Stuff',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    render(
      <TagList
        tags={tagsWithoutDesc}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('タグ1')).toBeInTheDocument();
    expect(screen.queryByText('タグ1の説明')).not.toBeInTheDocument();
  });

  it('should render tags without color', () => {
    const tagsWithoutColor: Tag[] = [
      {
        id: 1,
        name: 'タグ1',
        taggable_id: 1,
        taggable_type: 'Stuff',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    render(
      <TagList
        tags={tagsWithoutColor}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('タグ1')).toBeInTheDocument();
    expect(screen.queryByTitle(/カラー:/)).not.toBeInTheDocument();
  });
});