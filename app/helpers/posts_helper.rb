module PostsHelper
  # 検索時にフラッシュメッセージを発行するメソッド
  def flash_message(search_params)
    if search_params.blank?
    elsif search_params[:search_method] == "all_posts"
      flash.now[:info] = "全ての投稿を表示しました．"
    elsif search_params[:search_method].blank? && search_params[:searched]
      flash.now[:danger] = "検索方式「AND, OR検索」を選択してください．"
    elsif search_params[:start_date].present? && search_params[:end_date].present?
      if search_params[:start_date] >= search_params[:end_date]
        flash.now[:danger] = "期間の終了日を開始日より遅く設定してください．"
      end
    else
      flash.now[:success] = "指定の条件で投稿を絞り込みました．"
    end
  end
end
