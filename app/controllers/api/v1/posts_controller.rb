module Api
  module V1
    class PostsController < ApplicationController
      #! before_action :show_permission_required, only: :show
      #! before_action :edit_permission_required, only: :edit
      #! before_action :delete_permission_required, only: :destroy

      def home
        # ユーザーの閲覧可能な投稿を配列で取得し，配列からActiveRecordを取得する．
        posts_viewed_by_current_user = []
        #! Post.extract_posts(current_user, posts_viewed_by_current_user, Post.all)
        @posts_viewed_by_current_user = Post.where(id: posts_viewed_by_current_user.map(&:id))

        # 上記で取得した投稿に紐つく情報を抽出し，検索フォームを生成する．
        @users = @posts_viewed_by_current_user.eager_load(:user).map(&:user).uniq
        @tags = @posts_viewed_by_current_user.preload(:tags).map(&:tags).flatten.compact_blank.uniq
        @groups = @posts_viewed_by_current_user.preload(:groups).map(&:groups).flatten.compact_blank.uniq
        @groups << Group.find_or_create_by(group_name: "非公開") # 検索フォームに"非公開"を表示させる．
        posts_maps = []
        Post.extract_maps(@posts_viewed_by_current_user.eager_load(:map), posts_maps)
        @maps = posts_maps.compact_blank.uniq

        # 検索後の投稿一覧を取得する．
        @search_params = post_search_params
        @posts = @posts_viewed_by_current_user.
          eager_load(:user, :map).
          preload(:disclosures, :groups, :post_tags, :tags, post_images_attachments: :blob).
          search(@search_params, current_user).
          order(created_at: :desc)

        # 検索後の投稿に紐つくマップ情報を取得する．
        posts_maps = []
        Post.extract_maps(@posts.eager_load(:map), posts_maps)
        maps = posts_maps.compact_blank.uniq
        #! gon.places = Map.where(id: maps.map(&:id))

        postss = Post.all.order(created_at: :desc)
        userss = User.all
        mapss = Map.all
        post_tagss = PostTag.all
        tagss = Tag.all
        favoritess = current_user.favorites
        favoritess_all = Favorite.all #! 閲覧可能なpostに対応するfavoriteレコードだけ抽出すること．
        bookmarkss = current_user.bookmarks
        #! users_with_avatarの取得はモデルメソッドに切り出す．
        users_with_avatar = userss.map do |user|
          if user.user_avatar.attached?
            user.attributes.merge(user_avatar: url_for(user.user_avatar))
          else
            user.attributes.merge(user_avatar: nil)
          end
        end
        #! post_with_imagesの取得はモデルメソッドに切り出す．
        post_with_images = postss.map do |post|
          if post.post_images.attached?
            images_urls = post.post_images.map { |image| url_for(image) }
            post.attributes.merge(post_images: images_urls, blobs: post.post_images.blobs)
          else
            post.attributes.merge(post_images: nil, blobs: nil)
          end
        end
        render json: {
          posts: post_with_images,
          users: users_with_avatar,
          maps: mapss,
          post_tags: post_tagss,
          tags: tagss,
          favorites: favoritess,
          favorites_all: favoritess_all,
          bookmarks: bookmarkss,
        }, status: :ok
      end

      def index
        # ユーザーの閲覧可能な投稿を配列で取得し，配列からActiveRecordを取得する．
        posts_viewed_by_current_user = []
        Post.extract_posts(current_user, posts_viewed_by_current_user, Post.all)
        @posts = Post.
          eager_load(:user, :map).
          preload(:disclosures, :groups, post_images_attachments: :blob).
          where(id: posts_viewed_by_current_user.map(&:id)).
          order(created_at: :desc)
      end

      def new
        @post = Post.new
        @groups = current_user.group_users.where(accepted: true).eager_load(:group).map(&:group)
      end

      def create
        map = Map.find_or_create_by(location: post_location_params[:location])
        post = current_user.posts.new(post_params.merge(map_id: map.id))

        if post.save # post保存時に，collection_check_boxesメソッドによりdisclosuresテーブルのレコードを生成している．
          # 投稿にタグを付ける．
          if post_tag_params[:tag_name].present?
            entered_tags = post_tag_params[:tag_name].split(/[,| |，|、|　]/)
            tags = post.create_tags(entered_tags)
          end

          # 投稿に画像を紐つける．
          if post_images_params[:post_images]
            # post.post_images.purge
            post.post_images.attach(post_images_params[:post_images])
          end

          #! post_with_imagesの取得はモデルメソッドに切り出す．
          if post.post_images.attached?
            images_urls = post.post_images.map { |image| url_for(image) }
            post_with_images = post.attributes.merge(post_images: images_urls)
          else
            post_with_images = post.attributes.merge(post_images: nil)
          end

          render json: {
            post: post_with_images,
            map: map,
            tag: tags,
            message: "思い出を投稿しました．",
          }, status: :created
        else
          render json: { error_messages: post.errors.full_messages }, status: :unprocessable_entity
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
        @groups = current_user.group_users.where(accepted: true).eager_load(:group).map(&:group)
      end

      def update
        post = Post.find(params[:id])
        # 投稿の開示先グループを編集する．
        # newly_set_group_ids = post_params[:group_ids]
        # post.set_groups(post, newly_set_group_ids)

        # 投稿のタグを編集する．
        if post_tag_params[:tag_name].present?
          entered_tags = post_tag_params[:tag_name].split(/[,| |、|　]/)
          tags = post.create_tags(entered_tags)
        end

        # 投稿のロケーションを編集する．
        if post_location_params[:location].present?
          map = post.map.update(location: post_location_params[:location])
        end

        if post.update(post_params)

          # binding.pry

          if post_images_params[:images_blob_ids]
            # binding.pry
            # token = post_images_params[:images_blob_ids][0].split("/")[-2]
            # blob = ActiveStorage::Blob.find_by(key: token)
            blob_ids = post_images_params[:images_blob_ids]
            post_images = post.post_images.attachments.where(blob_id: blob_ids)
            post_images.purge
            post.post_images.attach
          end

          if post_images_params[:post_images]
            post.post_images.attach(post_images_params[:post_images])
          end

          #! post_with_imagesの取得はモデルメソッドに切り出す．
          if post.post_images.attached?
            images_urls = post.post_images.map { |image| url_for(image) }
            post_with_images = post.attributes.merge(post_images: images_urls, blobs: post.post_images.blobs)
          else
            post_with_images = post.attributes.merge(post_images: nil, blobs: nil)
          end
          render json: {
            post: post_with_images,
            map: map,
            tag: tags,
            message: "投稿を更新しました.",
          }, status: :created
        else
          render json: { error_messages: post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        post = Post.find(params[:id])
        post.destroy
        render json: { message: "投稿を削除しました." }, status: :ok
      end

      private

      def post_params
        params.permit(:comment, :memorized_on, :description, group_ids: [])
        # params.permit(:comment, :memorized_on, :description, post_images: [], group_ids: [])
        # params.require(post).permit(:comment, :memorized_on, :description, post_images: [], group_ids: [])
      end

      def post_images_params
        params.permit(post_images: [], images_blob_ids: [])
      end

      def post_location_params
        params.permit(:location)
      end

      def post_tag_params
        params.permit(:tag_name)
      end

      def post_search_params
        params.fetch(:search, {}).permit(:keyword, :start_date, :end_date, :favorites, :bookmarks, :search_method, :searched, locations: [], tag_names: [], group_names: [], user_names: [])
      end

      def show_permission_required
        @post = Post.find(params[:id])

        # 投稿の公開先グループにcurrent_userが所属しているかどうかを判定する．判定結果としての論理値を配列に格納．
        group_affilication_status_of_current_user = []
        @post.groups.each do |group|
          group.group_users.each do |group_user|
            group_affilication_status_of_current_user << (group_user.accepted? && (group_user.user_id == current_user.id))
          end
        end

        # current_userの投稿であれば投稿詳細を閲覧できる．
        # 他ユーザーの投稿のうち，公開先グループにcurrent_userが所属している投稿であれば詳細を閲覧できる．
        # 上記に該当しない場合は投稿詳細の閲覧できない．
        if @post.user_id == current_user.id
        elsif group_affilication_status_of_current_user.any?
        else
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
  end
end
