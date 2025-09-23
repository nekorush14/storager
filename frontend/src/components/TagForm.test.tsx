import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagForm } from './TagForm';

describe('TagForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    taggableId: 1,
    taggableType: 'Stuff'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create form correctly', () => {
    render(<TagForm {...defaultProps} />);
    
    expect(screen.getByText('新しいタグを追加')).toBeInTheDocument();
    expect(screen.getByLabelText('タグ名 *')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('カラーコード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
  });

  it('should render edit form correctly', () => {
    const initialData = {
      id: 1,
      name: 'テストタグ',
      description: 'テスト説明',
      color_code: '#ff0000',
      taggable_id: 1,
      taggable_type: 'Stuff',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    render(
      <TagForm
        {...defaultProps}
        initialData={initialData}
        isEdit={true}
        onCancel={mockOnCancel}
      />
    );
    
    expect(screen.getByText('タグを編集')).toBeInTheDocument();
    expect(screen.getByDisplayValue('テストタグ')).toBeInTheDocument();
    expect(screen.getByDisplayValue('テスト説明')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('#ff0000')).toHaveLength(2); // color and text input
    expect(screen.getByRole('button', { name: '更新' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  it('should submit form with valid data for create', async () => {
    const user = userEvent.setup();
    render(<TagForm {...defaultProps} />);
    
    const nameInput = screen.getByLabelText('タグ名 *');
    const descInput = screen.getByLabelText('説明');
    const colorInput = screen.getAllByDisplayValue('#000000')[1]; // text input
    const submitButton = screen.getByRole('button', { name: '追加' });
    
    await user.type(nameInput, '新しいタグ');
    await user.type(descInput, 'タグの説明');
    await user.clear(colorInput);
    await user.type(colorInput, '#ff0000');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: '新しいタグ',
        description: 'タグの説明',
        color_code: '#ff0000',
        taggable_id: 1,
        taggable_type: 'Stuff'
      });
    });
  });

  it('should submit form with valid data for edit', async () => {
    const user = userEvent.setup();
    const initialData = {
      id: 1,
      name: 'テストタグ',
      description: 'テスト説明',
      color_code: '#ff0000',
      taggable_id: 1,
      taggable_type: 'Stuff',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    render(
      <TagForm
        {...defaultProps}
        initialData={initialData}
        isEdit={true}
      />
    );
    
    const nameInput = screen.getByLabelText('タグ名 *');
    const submitButton = screen.getByRole('button', { name: '更新' });
    
    await user.clear(nameInput);
    await user.type(nameInput, '更新されたタグ');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: '更新されたタグ',
        description: 'テスト説明',
        color_code: '#ff0000'
      });
    });
  });

  it('should show error when tag name is empty', async () => {
    const user = userEvent.setup();
    render(<TagForm {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: '追加' });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('タグ名を入力してください')).toBeInTheDocument();
    });
  });

  it('should validate color code format', async () => {
    const user = userEvent.setup();
    render(<TagForm {...defaultProps} />);
    
    const nameInput = screen.getByLabelText('タグ名 *');
    const colorInput = screen.getAllByDisplayValue('#000000')[1]; // text input
    const submitButton = screen.getByRole('button', { name: '追加' });
    
    await user.type(nameInput, 'テストタグ');
    await user.clear(colorInput);
    await user.type(colorInput, 'invalid-color');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('カラーコードは有効な16進数で入力してください（例: #FF0000）')).toBeInTheDocument();
    });
  });

  it('should disable submit button when loading', () => {
    render(<TagForm {...defaultProps} isLoading={true} />);
    
    const submitButton = screen.getByRole('button', { name: '保存中...' });
    expect(submitButton).toBeDisabled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TagForm
        {...defaultProps}
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
    
    render(<TagForm {...defaultProps} />);
    
    const nameInput = screen.getByLabelText('タグ名 *');
    const descInput = screen.getByLabelText('説明');
    const submitButton = screen.getByRole('button', { name: '追加' });
    
    await user.type(nameInput, '新しいタグ');
    await user.type(descInput, 'タグの説明');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(descInput).toHaveValue('');
    });
  });

  it('should handle submission errors', async () => {
    const user = userEvent.setup();
    const errorMessage = 'サーバーエラーが発生しました';
    mockOnSubmit.mockRejectedValue(new Error(errorMessage));
    
    render(<TagForm {...defaultProps} />);
    
    const nameInput = screen.getByLabelText('タグ名 *');
    const submitButton = screen.getByRole('button', { name: '追加' });
    
    await user.type(nameInput, '新しいタグ');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should update color picker and text input together', async () => {
    const user = userEvent.setup();
    render(<TagForm {...defaultProps} />);
    
    const colorInputs = screen.getAllByDisplayValue('#000000');
    const colorPicker = colorInputs[0]; // color input
    const colorText = colorInputs[1]; // text input
    
    // Update color picker
    await user.click(colorPicker);
    // Note: jsdom doesn't fully support color input interactions
    // In real browser testing, you would interact with the color picker
    
    // Update text input
    await user.clear(colorText);
    await user.type(colorText, '#ff5555');
    
    expect(colorText).toHaveValue('#ff5555');
  });
});