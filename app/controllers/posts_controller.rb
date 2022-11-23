class PostsController < ApplicationController
  def index
  end

  def new
    @post = Post.new
    @posts = Post.all
  end

  def create
    @post = Post.new(post_params.merge(user_id: current_user.id))
    if @post.save
      flash[:success] = "思い出を投稿しました．"
      redirect_to posts_path
    else
      flash.now[:danger] = "投稿に失敗しました．"
      render :new
    end
  end

  def show
    @post = Post.find(params[:id])
    @user = @post.user
  end

  def edit
  end

  private

  def post_params
    params.require(:post).permit(:comment, :memorized_on, :disclosure_range, :description, :tags, :location, :post_images)
  end
end
