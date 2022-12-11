class PostsController < ApplicationController
  before_action :edit_permission_required, only: :edit
  before_action :delete_permission_required, only: :destroy

  def home
    @posts = Post.eager_load(:user, :map).preload(post_images_attachments: :blob).order(id: :DESC)
    gon.places = Map.where.not(latitude: nil, longitude: nil)
  end

  def index
    @posts = Post.eager_load(:user).preload(post_images_attachments: :blob).order(id: :DESC)
  end

  def new
    @post = Post.new
  end

  def create
    @map = Map.create(location: params[:post][:location])
    @post = current_user.posts.new(post_params.merge(map_id: @map.id)) # mapレコードがnilでもpostにマージする．
    if @post.save
      entered_tags = params[:post][:tag_name].split(/[,| |、|　]/)
      @post.create_tags(entered_tags)
      flash[:success] = "思い出を投稿しました．"
      redirect_to home_path
    else
      flash.now[:danger] = "投稿に失敗しました．"
      render :new
    end
  end

  def show
    @post = Post.preload(post_images_attachments: :blob).find(params[:id])
    @reply = Reply.new
    @replies = @post.replies.eager_load(:user)
    gon.place = @post.map
  end

  def edit
    @post = Post.find(params[:id])
    @location = @post.map.location if @post.map.present?
    @tag_list = @post.tags.distinct.pluck(:tag_name).join(",")
  end

  def update
    @post = Post.find(params[:id])

    if @post.map.present?
      @post.map.update(location: params[:post][:location])
    else
      # mapsテーブル作成前の投稿にmapレコードを紐つける．
      @map = Map.create(location: params[:post][:location])
      @post.update(map_id: @map.id)
    end

    if @post.update(post_params)
      entered_tags = params[:post][:tag_name].split(/[,| |、|　]/)
      @post.create_tags(entered_tags)
      flash[:success] = "投稿を更新しました．"
      redirect_to post_path(@post.id)
    else
      flash.now[:danger] = "投稿を更新できませんでした．"
      render :edit
    end
  end

  def destroy
    @post = Post.find(params[:id])
    @post.destroy
    flash[:success] = "投稿を削除しました．"
    redirect_to home_path
  end

  private

  def post_params
    params.require(:post).permit(:comment, :memorized_on, :disclosure_range, :description, post_images: [])
  end

  def edit_permission_required
    @post = Post.find(params[:id])
    redirect_to post_path(@post.id) unless @post.user_id == current_user.id
  end

  def delete_permission_required
    @post = Post.find(params[:id])
    if @post.user_id == current_user.id || current_user.admin?
    else
      redirect_to post_path(@post.id)
    end
  end
end
