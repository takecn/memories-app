Rails.application.routes.draw do
  get 'bookmarks/create'
  get 'bookmarks/destroy'
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
  end
end
