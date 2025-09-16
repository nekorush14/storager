# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Use environment variables for flexible origin configuration
    # Production: Should set CORS_ORIGINS to specific production domain
    # Development: Defaults to common development server ports
    if Rails.env.production?
      origins ENV.fetch('CORS_ORIGINS', '').split(',').map(&:strip)
    else
      # Default development origins including Next.js (3000) and Vite (5173, 5174)
      development_origins = ENV.fetch('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://localhost:5174').split(',').map(&:strip)
      origins development_origins
    end

    # Restrict to API endpoints only instead of wildcard
    resource "/api/*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false  # Explicitly disable credentials for security
  end
end
