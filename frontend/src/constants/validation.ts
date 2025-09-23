export const VALIDATION_PATTERNS = {
  COLOR_CODE: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  HEX_COLOR: /^#[0-9A-Fa-f]{6}$/
} as const;

export const VALIDATION_LIMITS = {
  TAG_NAME_MAX_LENGTH: 50,
  TAG_DESCRIPTION_MAX_LENGTH: 200,
  STUFF_NAME_MAX_LENGTH: 100
} as const;

export const VALIDATION_MESSAGES = {
  TAG_NAME_REQUIRED: 'タグ名を入力してください',
  TAG_NAME_TOO_LONG: `タグ名は${VALIDATION_LIMITS.TAG_NAME_MAX_LENGTH}文字以内で入力してください`,
  TAG_DESCRIPTION_TOO_LONG: `説明は${VALIDATION_LIMITS.TAG_DESCRIPTION_MAX_LENGTH}文字以内で入力してください`,
  COLOR_CODE_INVALID: 'カラーコードは有効な16進数で入力してください（例: #FF0000）',
  STUFF_NAME_REQUIRED: 'アイテム名を入力してください',
  STUFF_NAME_TOO_LONG: `アイテム名は${VALIDATION_LIMITS.STUFF_NAME_MAX_LENGTH}文字以内で入力してください`
} as const;

export const DEFAULT_VALUES = {
  TAG_COLOR: '#000000',
  EMPTY_STRING: ''
} as const;