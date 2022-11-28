Rails.application.routes.draw do
  root to: "posts#home"
  get "/login", to: "sessions#new"
  post "/login", to: "sessions#create"
  post "/guest_login", to: "sessions#guest_login"
  delete "/logout", to: "sessions#destroy"
  namespace :admin do
    resources :users
  end
  resources :posts
  get "/home", to: "posts#home"
end
