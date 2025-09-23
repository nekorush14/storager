import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StuffForm } from './StuffForm';

describe('StuffForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create form correctly', () => {
    render(<StuffForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('新しいアイテムを追加')).toBeInTheDocument();
    expect(screen.getByLabelText('アイテム名')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'キャンセル' })).not.toBeInTheDocument();
  });

  it('should render edit form correctly', () => {
    const initialData = {
      id: 1,
      name: 'テストアイテム',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    render(
      <StuffForm
        onSubmit={mockOnSubmit}
        initialData={initialData}
        isEdit={true}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByText('アイテムを編集')).toBeInTheDocument();
    expect(screen.getByDisplayValue('テストアイテム')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '更新' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<StuffForm onSubmit={mockOnSubmit} />);
    
    const input = screen.getByLabelText('アイテム名');
    const submitButton = screen.getByRole('button', { name: '追加' });
    
    await user.type(input, '新しいアイテム');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ name: '新しいアイテム', tags: [] });
    });
  });

  it('should keep button disabled when name contains only spaces', async () => {
    const user = userEvent.setup();
    render(<StuffForm onSubmit={mockOnSubmit} />);
    
    const input = screen.getByLabelText('アイテム名');
    const submitButton = screen.getByRole('button', { name: '追加' });
    
    // Type only spaces - button should remain disabled
    await user.type(input, '   ');
    expect(submitButton).toBeDisabled();
    
    // Clear and type valid text - button should be enabled
    await user.clear(input);
    await user.type(input, 'valid name');
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable submit button when loading', () => {
    render(<StuffForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    const submitButton = screen.getByRole('button', { name: '保存中...' });
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when name is empty', async () => {
    const user = userEvent.setup();
    render(<StuffForm onSubmit={mockOnSubmit} />);
    
    const input = screen.getByLabelText('アイテム名');
    const submitButton = screen.getByRole('button', { name: '追加' });
    
    // Initially disabled when empty
    expect(submitButton).toBeDisabled();
    
    // Enabled when text is entered
    await user.type(input, 'テスト');
    expect(submitButton).not.toBeDisabled();
    
    // Disabled again when cleared
    await user.clear(input);
    expect(submitButton).toBeDisabled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <StuffForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEdit={true}
      />
    );
    
    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should reset form after successful create submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);
    
    render(<StuffForm onSubmit={mockOnSubmit} />);
    
    const input = screen.getByLabelText('アイテム名');
    const submitButton = screen.getByRole('button', { name: '追加' });
    
    await user.type(input, '新しいアイテム');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('should handle submission errors', async () => {
    const user = userEvent.setup();
    const errorMessage = 'サーバーエラーが発生しました';
    mockOnSubmit.mockRejectedValue(new Error(errorMessage));
    
    render(<StuffForm onSubmit={mockOnSubmit} />);
    
    const input = screen.getByLabelText('アイテム名');
    const submitButton = screen.getByRole('button', { name: '追加' });
    
    await user.type(input, '新しいアイテム');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Tag functionality', () => {
    it('should add and remove tags', async () => {
      const user = userEvent.setup();
      render(<StuffForm onSubmit={mockOnSubmit} />);
      
      // Add a tag
      const addTagButton = screen.getByRole('button', { name: '+ タグを追加' });
      await user.click(addTagButton);
      
      expect(screen.getByText('タグ 1')).toBeInTheDocument();
      
      // Fill tag data
      const tagNameInput = screen.getByPlaceholderText('タグ名');
      const tagDescInput = screen.getByPlaceholderText('説明（任意）');
      
      await user.type(tagNameInput, 'テストタグ');
      await user.type(tagDescInput, 'テスト説明');
      
      // Remove the tag
      const removeButton = screen.getByText('削除');
      await user.click(removeButton);
      
      expect(screen.queryByText('タグ 1')).not.toBeInTheDocument();
      expect(screen.getByText('タグはまだ追加されていません。上のボタンから追加できます。')).toBeInTheDocument();
    });

    it('should submit form with tags', async () => {
      const user = userEvent.setup();
      render(<StuffForm onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText('アイテム名');
      const addTagButton = screen.getByRole('button', { name: '+ タグを追加' });
      const submitButton = screen.getByRole('button', { name: '追加' });
      
      await user.type(nameInput, 'テストアイテム');
      await user.click(addTagButton);
      
      const tagNameInput = screen.getByPlaceholderText('タグ名');
      const tagDescInput = screen.getByPlaceholderText('説明（任意）');
      const tagColorInput = screen.getAllByDisplayValue('#000000')[1]; // text input
      
      await user.type(tagNameInput, 'テストタグ');
      await user.type(tagDescInput, 'テスト説明');
      await user.clear(tagColorInput);
      await user.type(tagColorInput, '#ff0000');
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'テストアイテム',
          tags: [{
            name: 'テストタグ',
            description: 'テスト説明',
            color_code: '#ff0000'
          }]
        });
      });
    });

    it('should filter out empty tag names', async () => {
      const user = userEvent.setup();
      render(<StuffForm onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText('アイテム名');
      const addTagButton = screen.getByRole('button', { name: '+ タグを追加' });
      const submitButton = screen.getByRole('button', { name: '追加' });
      
      await user.type(nameInput, 'テストアイテム');
      await user.click(addTagButton);
      
      // Leave tag name empty and click submit
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'テストアイテム',
          tags: []
        });
      });
    });

    it('should reset tags after successful create submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);
      
      render(<StuffForm onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText('アイテム名');
      const addTagButton = screen.getByRole('button', { name: '+ タグを追加' });
      const submitButton = screen.getByRole('button', { name: '追加' });
      
      await user.type(nameInput, 'テストアイテム');
      await user.click(addTagButton);
      
      const tagNameInput = screen.getByPlaceholderText('タグ名');
      await user.type(tagNameInput, 'テストタグ');
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(nameInput).toHaveValue('');
        expect(screen.getByText('タグはまだ追加されていません。上のボタンから追加できます。')).toBeInTheDocument();
      });
    });

    it('should render form with initial tag data for edit', () => {
      const initialData = {
        id: 1,
        name: 'テストアイテム',
        tags: [
          {
            id: 1,
            name: '既存タグ',
            description: '既存説明',
            color_code: '#ff0000',
            taggable_id: 1,
            taggable_type: 'Stuff'
          }
        ],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      render(
        <StuffForm
          onSubmit={mockOnSubmit}
          initialData={initialData}
          isEdit={true}
        />
      );
      
      expect(screen.getByDisplayValue('テストアイテム')).toBeInTheDocument();
      expect(screen.getByText('タグ 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('既存タグ')).toBeInTheDocument();
      expect(screen.getByDisplayValue('既存説明')).toBeInTheDocument();
      expect(screen.getAllByDisplayValue('#ff0000')).toHaveLength(2); // color and text input
    });
  });
});