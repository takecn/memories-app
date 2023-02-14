module Api
  module V1
    class Admin::UsersController < ApplicationController
      #! skip_before_action :login_required, only: [:new, :create] # 一時的にコメントアウト
      #! before_action :edit_or_delete_permission_required, only: [:edit, :destroy]

      def index
        users = User.all
        #! users_with_avatarの取得はモデルメソッドに切り出す．
        users_with_avatar = users.map do |user|
          if user.user_avatar.attached?
            user.attributes.merge(user_avatar: url_for(user.user_avatar))
          else
            user.attributes.merge(user_avatar: nil)
          end
        end
        render json: { users: users_with_avatar }, status: :ok
      end

      def create
        user = User.new(user_params)
        if user.save
          # if user_params[:user_avatar]
          #   user.user_avatar.attach(user_params[:user_avatar])
          # end
          #! user_with_avatarの取得はモデルメソッドに切り出す．
          if user.user_avatar.attached?
            user_with_avatar = user.attributes.merge(user_avatar: url_for(user.user_avatar))
          else
            user_with_avatar = user.attributes.merge(user_avatar: nil)
          end
          render json: { user: user_with_avatar, message: "ユーザーを登録しました." }, status: :created
        else
          render json: { error_messages: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        user = User.find(params[:id])
        if user.update(user_params)
          # if user_params[:user_avatar]
          #   user.user_avatar.purge
          #   user.user_avatar.attach(user_params[:user_avatar])
          # end
          #! user_with_avatarの取得はモデルメソッドに切り出す．
          if user.user_avatar.attached?
            user_with_avatar = user.attributes.merge(user_avatar: url_for(user.user_avatar))
          else
            user_with_avatar = user.attributes.merge(user_avatar: nil)
          end
          render json: { user: user_with_avatar, message: "ユーザー情報を更新しました." }, status: :created
        else
          render json: { error_messages: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        user = User.find(params[:id])
        user.destroy
        render json: { message: "「#{user.user_name}」を削除しました." }, status: :ok
      end

      private

      def user_params
        params.permit(:user_name, :email, :password, :password_confirmation, :user_profile, :admin, :guest, :user_avatar)
      end

      def edit_or_delete_permission_required
        @user = User.find(params[:id])
        if current_user.admin?
        elsif current_user.guest?
          redirect_to admin_user_path(@user.id)
        else
          redirect_to admin_user_path(@user.id) unless @user.id == current_user.id
        end
      end
    end
  end
end
