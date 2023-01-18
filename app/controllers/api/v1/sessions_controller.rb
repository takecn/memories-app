module Api
  module V1
    class SessionsController < ApplicationController
      #! skip_before_action :login_required

      def new
        session = Session.new
        render json: { session: session }, status: :ok
      end

      def create
        session_data = Session.new(session_params)
        session_data.valid?
        user = User.find_by(email: session_params[:email])
        if user&.authenticate(session_params[:password])
          session[:user_id] = user.id
          render json: { user: user, message: "「#{user.user_name}」でログインしました．" }, status: :ok
        else
          if session_data.errors.present?
            render json: { error_messages: session_data.errors.full_messages }, status: :unprocessable_entity
          else
            render json: { error_messages: ["マッチするユーザーが存在しません．"] }, status: :unprocessable_entity
          end
        end
      end

      def guest_login
        user = User.find_by(id: 25, user_name: "guest1", email: "guest1@guest.com", guest: true)
        if user.present?
          session[:user_id] = user.id
          render json: { message: "「#{user.user_name}」でログインしました．" }, status: :ok
        else
          password = SecureRandom.urlsafe_base64
          user = User.new(id: 25, user_name: "guest1", email: "guest1@guest.com", guest: true, password: password, password_confirmation: password)
          if user.save
            session[:user_id] = user.id
            render json: { message: "「#{user.user_name}」を作成しログインしました．" }, status: :ok
          else
            render json: { error_messages: ["ゲストユーザーを作成できませんでした．id, user_name, emailが既存アカウントと重複している可能性があります．"] }, status: :unprocessable_entity
          end
        end
      end

      def destroy
        reset_session
        render json: { message: "ログアウトしました．" }, status: :ok
      end

      private

      def session_params
        params.permit(:user_name, :email, :password, :password_confirmation)
      end
    end
  end
end
