Rails.application.routes.draw do
  get 'sessions/new'
  namespace :admin do
    resources :users
  end
end
