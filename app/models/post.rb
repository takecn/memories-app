class Post < ApplicationRecord
  has_many_attached :post_images
  belongs_to :user
  belongs_to :map
  has_many :favorites, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :post_tags, dependent: :destroy
  has_many :tags, through: :post_tags
  has_many :replies, dependent: :destroy
  has_many :notices, dependent: :destroy
  has_many :disclosures, dependent: :destroy
  has_many :groups, through: :disclosures

  validates :post_images, content_type: { in: %w(image/jpeg image/gif image/png), message: "のファイル形式は，JPEG, GIF, PNGのみ添付可能です．" },
                          size: { less_than: 5.megabytes, message: "のデータ容量は5MB以下として下さい．" }

  def favorited_by?(user)
    favorites.where(user_id: user.id).present?
  end

  def bookmarked_by?(user)
    bookmarks.where(user_id: user.id).present?
  end

  def create_tags(entered_tags)
    existing_tags = tags.pluck(:tag_name) unless tags.nil?

    old_tags = existing_tags - entered_tags
    old_tags.each do |old_tag|
      tags.delete Tag.find_by(tag_name: old_tag)
    end

    new_tags = entered_tags - existing_tags
    new_tags.each do |new_tag|
      tags << Tag.find_or_create_by(tag_name: new_tag)
    end
  end

  # 投稿に紐つくグループを編集するメソッド
  def set_groups(post, newly_set_group_ids)
    # 設定から外されたグループは投稿との紐付きを解消する．
    existing_group_ids = post.groups.ids
    excluded_group_ids = existing_group_ids - newly_set_group_ids
    excluded_group_ids.each do |excluded_group_id|
      Disclosure.find_by(post_id: post.id, group_id: excluded_group_id).delete
    end

    # 新たに設定されたグループを投稿に紐つける．
    newly_set_group_ids.each do |newly_set_group_id|
      Disclosure.find_or_create_by(post_id: post.id, group_id: newly_set_group_id)
    end
  end

  # ログインユーザーが閲覧可能な投稿を抽出するメソッド
  def self.extract_posts(user, posts)
    Post.all.each do |post|
      if post.user_id == user.id
        # current_userの投稿であれば閲覧できる．
        posts << post
      else
        post.groups.preload(:group_users).each do |group|
          group.group_users.each do |group_user|
            if group_user.accepted? && (group_user.user_id == user.id)
              # 他ユーザーの投稿のうち，公開先グループにcurrent_userが所属している投稿であれば閲覧できる．
              posts << post
            end
          end
        end
      end
    end
  end

  # 検索条件を編成するメソッド
  def self.search(search_params, user)
    return all if search_params.blank?
    return all if search_params[:search_method] == "all_posts"
    if search_params[:search_method].blank? && search_params[:searched]
      return all
    end

    # whereメソッドにセットする条件と値を格納する配列．
    conditions = []
    values = []

    # キーワード検索．フォームへの入力値をconditionsとvaluesにセット．検索条件毎に同様の処理を以下で実行．
    if search_params[:keyword].present?
      keywords = search_params[:keyword].split(/[,| |，|、|　]/)
      conditions << keywords.map { |keyword| "(comment LIKE ? OR description LIKE ? OR reply LIKE ?)" }.join(" OR ")
      values.concat(keywords.flat_map { |keyword| ["%#{keyword}%", "%#{keyword}%", "%#{keyword}%"] })
    end

    # 日付検索．
    if search_params[:start_date].present? && search_params[:end_date].present?
      conditions << "(memorized_on >= ? AND memorized_on <= ?)"
      values.concat([search_params[:start_date], search_params[:end_date]])
    elsif search_params[:start_date].present?
      conditions << "memorized_on >= ?"
      values << search_params[:start_date]
    elsif search_params[:end_date].present?
      conditions << "memorized_on <= ?"
      values << search_params[:end_date]
    end

    # ロケーション検索
    if search_params[:locations].compact_blank.present?
      conditions << "maps.location IN (?)"
      values << search_params[:locations].compact_blank
    end

    # タグ検索
    if search_params[:tag_names].compact_blank.present?
      conditions << "tags.tag_name IN (?)"
      values << search_params[:tag_names].compact_blank
    end

    # 公開範囲検索
    if search_params[:group_names].compact_blank.present?
      if search_params[:group_names].include?("非公開")
        # "非公開"が選択された場合は，グループに紐つかない投稿を取得．
        conditions << "(groups.id IS NULL OR groups.group_name IN (?))"
      else
        conditions << "groups.group_name IN (?)"
      end
      values << search_params[:group_names].compact_blank
    end

    # 投稿者検索
    if search_params[:user_names].compact_blank.present?
      conditions << "users.user_name IN (?)"
      values << search_params[:user_names].compact_blank
    end

    # お気に入り登録有無検索
    if search_params[:favorites] == "favorited_posts"
      conditions << "favorites.user_id = ?"
      values << user.id
    end

    # ブックマーク有無検索
    if search_params[:bookmarks] == "bookmarked_posts"
      conditions << "bookmarks.user_id = ?"
      values << user.id
    end

    # 検索方式(and, or)別にwhereメソッドを設定．
    if search_params[:search_method] == "and"
      left_outer_joins(:replies, :map, :tags, :groups, :favorites, :bookmarks).where(conditions.join(" AND "), *values)
    elsif search_params[:search_method] == "or"
      left_outer_joins(:replies, :map, :tags, :groups, :favorites, :bookmarks).where(conditions.join(" OR "), *values)
    end
  end

  # 投稿に紐つくmapを抽出するメソッド
  def self.extract_maps(posts, maps)
    posts.eager_load(:map).each do |post|
      maps << post.map if post.map&.location.present?
    end
  end
end
