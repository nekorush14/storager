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
      expect(mockOnSubmit).toHaveBeenCalledWith({ name: '新しいアイテム' });
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
});