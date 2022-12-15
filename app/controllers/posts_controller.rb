class PostsController < ApplicationController
  before_action :show_permission_required, only: :show
  before_action :edit_permission_required, only: :edit
  before_action :delete_permission_required, only: :destroy

  def home
    @posts = Post.eager_load(:user, :map).preload(:groups, :disclosures, post_images_attachments: :blob).order(id: :DESC)

    # mapに表示するロケーションを絞り込む．
    gon.places = [].compact
    @posts.each do |post|
      if post.user_id == current_user.id
        # current_userの投稿の場合，投稿に紐つくロケーションをmapにピン表示．
        gon.places << post.map
      else
        post.groups.preload(:group_users).each do |group|
          group.group_users.each do |group_user|
            if group_user.accepted? && (group_user.user_id == current_user.id)
              # 「current_userの所属するグループのメンバーによる投稿，かつ，開示対象としてそのグループが指定された投稿」に紐つくロケーションをピン表示．
              gon.places << post.map
            end
          end
        end
      end
    end
  end

  def index
    @posts = Post.eager_load(:user, :map).preload(:groups, :disclosures, post_images_attachments: :blob).order(id: :DESC)
  end

  def new
    @post = Post.new
    # current_userが所属するグループの配列．
    @groups = current_user.group_users.where(accepted: true).eager_load(:group).map(&:group)
  end

  def create
    @map = Map.create(location: params[:post][:location])
    @post = current_user.posts.new(post_params.merge(map_id: @map.id))

    if @post.save # post保存時に，collection_check_boxesメソッドによりdisclosuresテーブルのレコードが生成．

      # 投稿にタグを付ける．
      entered_tags = params[:post][:tag_name].split(/[,| |，|、|　]/)
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
    @groups = current_user.group_users.where(accepted: true).eager_load(:group).map { |group_user| group_user.group }
  end

  def update
    @post = Post.find(params[:id])
    # 投稿の開示先グループを編集する．
    newly_set_group_ids = post_params[:group_ids].map(&:to.i)
    @post.set_groups(@post, newly_set_group_ids)

    # 投稿のタグを編集する．
    entered_tags = params[:post][:tag_name].split(/[,| |、|　]/)
    @post.create_tags(entered_tags)

    # mapテーブルを編集する．
    if @post.map.present?
      @post.map.update(location: params[:post][:location])
    else
      @map = Map.create(location: params[:post][:location])
      @post.update(map_id: @map.id)
    end

    if @post.update(post_params)
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
    params.require(:post).permit(:comment, :memorized_on, :description, post_images: [], group_ids: [])
  end

  def show_permission_required
    @post = Post.find(params[:id])

    # 投稿に紐つくグループにcurrent_userが所属しているかどうか，論理値で配列に格納．
    group_affilication_status_of_current_user = []
    @post.groups.each do |group|
      group.group_users.each do |group_user|
        group_affilication_status_of_current_user << (group_user.accepted? && (group_user.user_id == current_user.id))
      end
    end

    if @post.user_id == current_user.id
      # current_userの投稿であれば投稿詳細を閲覧可能．
    elsif group_affilication_status_of_current_user.any?
      # 「current_userの所属するグループのメンバーによる投稿，かつ，開示対象としてそのグループが指定された投稿」であれば投稿詳細を閲覧可能．
    else
      # 上記に該当しない場合は投稿詳細の閲覧不可．
      redirect_to home_path
    end
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
