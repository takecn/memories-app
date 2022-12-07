Rails.application.routes.draw do
  root to: "posts#home"

  get "/login", to: "sessions#new"
  post "/login", to: "sessions#create"
  post "/guest_login", to: "sessions#guest_login"
  delete "/logout", to: "sessions#destroy"

  namespace :admin do
    resources :users
  end

  get "/home", to: "posts#home"

  resources :posts do
    resource :favorites, only: [:create, :destroy]
    resource :bookmarks, only: [:create, :destroy]
    resources :replies, only: [:create, :destroy]
  end

  resources :groups, except: :destroy do
    resources :group_users, only: [:create, :update, :destroy]
  end

  resources :notices, only: :index
end
