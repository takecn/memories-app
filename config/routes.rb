Rails.application.routes.draw do
  get 'group_users/create'
  get 'group_users/destroy'
  get 'group_users/join'
  get 'groups/index'
  get 'groups/new'
  get 'groups/show'
  get 'groups/edit'
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
end
