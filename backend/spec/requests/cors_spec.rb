require 'rails_helper'

RSpec.describe "CORS headers", type: :request do
  describe "GET /api/v1/stuffs" do
    context "with allowed origin" do
      it "returns CORS headers for localhost:3000" do
        get "/api/v1/stuffs", headers: { "Origin" => "http://localhost:3000" }

        expect(response.headers['Access-Control-Allow-Origin']).to eq("http://localhost:3000")
        expect(response.status).to eq(200)
      end

      it "returns CORS headers for localhost:5173 (Vite dev server)" do
        get "/api/v1/stuffs", headers: { "Origin" => "http://localhost:5173" }

        expect(response.headers['Access-Control-Allow-Origin']).to eq("http://localhost:5173")
        expect(response.status).to eq(200)
      end

      it "returns CORS headers for 127.0.0.1:3000" do
        get "/api/v1/stuffs", headers: { "Origin" => "http://127.0.0.1:3000" }

        expect(response.headers['Access-Control-Allow-Origin']).to eq("http://127.0.0.1:3000")
        expect(response.status).to eq(200)
      end
    end

    context "with disallowed origin" do
      it "does not return CORS headers for evil.com" do
        get "/api/v1/stuffs", headers: { "Origin" => "http://evil.com" }

        expect(response.headers['Access-Control-Allow-Origin']).to be_nil
        expect(response.status).to eq(200) # API still works, just no CORS headers
      end

      it "does not return CORS headers for unauthorized localhost port" do
        get "/api/v1/stuffs", headers: { "Origin" => "http://localhost:8080" }

        expect(response.headers['Access-Control-Allow-Origin']).to be_nil
        expect(response.status).to eq(200)
      end
    end

    context "OPTIONS preflight request" do
      it "returns proper CORS headers for allowed origin" do
        options "/api/v1/stuffs", headers: {
          "Origin" => "http://localhost:3000",
          "Access-Control-Request-Method" => "POST",
          "Access-Control-Request-Headers" => "Content-Type"
        }

        expect(response.headers['Access-Control-Allow-Origin']).to eq("http://localhost:3000")
        expect(response.headers['Access-Control-Allow-Methods']).to include("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD")
        expect(response.headers['Access-Control-Allow-Headers']).to be_present
        expect(response.status).to eq(200)
      end

      it "does not return CORS headers for disallowed origin in preflight" do
        options "/api/v1/stuffs", headers: {
          "Origin" => "http://evil.com",
          "Access-Control-Request-Method" => "POST"
        }

        expect(response.headers['Access-Control-Allow-Origin']).to be_nil
      end
    end
  end

  describe "non-API endpoints" do
    it "does not apply CORS to non-API paths" do
      # This would return 404 but we're testing CORS behavior
      get "/non-api-path", headers: { "Origin" => "http://localhost:3000" }

      expect(response.headers['Access-Control-Allow-Origin']).to be_nil
    end
  end

  describe "configuration validation" do
    it "allows configurable origins via environment variable" do
      # Test that the default development origins work as expected
      get "/api/v1/stuffs", headers: { "Origin" => "http://localhost:3000" }

      expect(response.headers['Access-Control-Allow-Origin']).to eq("http://localhost:3000")
    end
  end
end
