require 'rails_helper'

RSpec.describe "GroupUsers", type: :request do
  describe "GET /create" do
    it "returns http success" do
      get "/group_users/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/group_users/destroy"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /join" do
    it "returns http success" do
      get "/group_users/join"
      expect(response).to have_http_status(:success)
    end
  end
end
