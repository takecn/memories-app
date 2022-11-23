Rails.application.routes.draw do
  root to: "admin/users#index"
  get "/login", to: "sessions#new"
  post "/login", to: "sessions#create"
  post "/guest_login", to: "sessions#guest_login"
  delete "/logout", to: "sessions#destroy"
  namespace :admin do
    resources :users
  end
end
