# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

storageは、家庭内の物品管理を行うアプリケーションです。各アイテムを仮想的な収納ボックスに保存して管理できます。

## Architecture

このプロジェクトは以下の技術スタックを使用します：

- **Frontend**: Next.js
- **Backend**: Ruby on Rails 8.0.2 (APIモード)
- **Database**: PostgreSQL
- **Testing**: RSpec with FactoryBot
- **Code Quality**: RuboCop Rails Omakase

### Project Structure

- `backend/` - Rails APIアプリケーション
- `app/models/` - データモデル (Stuff等)
- `app/controllers/api/v1/` - API v1エンドポイント
- `spec/` - RSpecテストファイル

## Common Commands

### Development Setup
```bash
cd backend
bundle install
rails db:setup
```

### Running the Server
```bash
rails server
```

### Testing
```bash
# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/models/stuff_spec.rb

# Run specific test with line number
bundle exec rspec spec/models/stuff_spec.rb:10
```

### Database
```bash
# Run migrations
rails db:migrate

# Reset database
rails db:reset

# Create and run migrations
rails db:create db:migrate
```

### Code Quality
```bash
# Run RuboCop
bundle exec rubocop

# Auto-fix RuboCop issues
bundle exec rubocop -a

# Run security analysis
bundle exec brakeman
```

## API Structure

現在実装されている API:
- `GET/POST/PUT/DELETE /api/v1/stuffs` - 物品管理エンドポイント

## Testing Strategy

- Model specs: `spec/models/`
- Request specs: `spec/requests/api/v1/`
- FactoryBot設定: `spec/support/factory_bot.rb`
- shoulda-matchers使用でActiveRecord検証のテスト簡素化