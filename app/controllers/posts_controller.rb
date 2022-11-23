class PostsController < ApplicationController
  def new
    @post = Post.new
    @posts = Post.all
  end

  def create
    @post = Post.new(post_params)
    if @post.save
      flash[:success] = "思い出を投稿しました．"
      redirect_to posts_path
    else
      flash.now[:danger] = "投稿に失敗しました．"
      render :new
    end
  end

  def edit
  end

  def show
  end

  def index
  end

  private

  def post_params
    params.require(:post).permit(:comment, :memorized_on, :disclosure_range, :description, :tags, :location, :post_images)
  end
end
