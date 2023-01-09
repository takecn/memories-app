require 'rails_helper'

RSpec.describe Post, type: :model do
  describe "validations" do
    let(:post) { build(:post) }

    it "検証項目が条件を満たしていれば有効であること" do
      expect(post).to be_valid
    end

    it "画像のファイル形式がJPEG・GIF・PNG以外であれば無効であること" do
      post.post_images.attach(io: File.open("spec/fixtures/5MB_dummy.txt"), filename: "5MB_dummy.txt", content_type: "text/plain")
      expect(post.post_images.first.content_type).to eq("text/plain")
      expect(post).to be_invalid
    end

    it "画像サイズが5MB以上であれば無効であること" do
      post.post_images.attach(io: File.open("spec/fixtures/5MB_dummy.txt"), filename: "5MB_dummy.txt", content_type: "text/plain")
      expect(post.post_images.first.byte_size).to be >= 5.megabytes
      expect(post).to be_invalid
    end
  end

  describe "#create_tags" do
    let(:post) { create(:post) }
    let(:tag) { create(:tag, tag_name: "タグ1") }

    before do
      post.tags << tag
    end

    context "既存の[タグ1]が削除された場合" do
      it "処理後に[タグ1]が含まれないこと" do
        entered_tags = []
        post.create_tags(entered_tags)
        expect(post.tags.map(&:tag_name)).not_to include(["タグ1"])
      end
    end

    context "新たに[タグ2]が入力された場合" do
      it "処理後に[タグ2]が含まれること" do
        entered_tags = ["タグ1", "タグ2"]
        post.create_tags(entered_tags)
        expect(post.tags.map(&:tag_name)).to include("タグ2")
      end
    end
  end

  describe "#set_groups" do
    let(:post) { create(:post, id: 1) }
    let(:group1) { create(:group, id: 1, group_name: "グループ1") }
    let(:group2) { create(:group, id: 2, group_name: "グループ2") }

    before do
      post.groups << group1
    end

    context "既存の[グループ1_id]が削除された場合" do
      it "処理後に[グループ1_id]が含まれないこと" do
        newly_set_group_ids = []
        expect(post.set_groups(post, newly_set_group_ids)).not_to include([1])
      end
    end

    context "新たに[グループ2_id]が入力された場合" do
      it "処理後に[グループ2_id]が含まれること" do
        newly_set_group_ids = [1, 2]
        expect(post.set_groups(post, newly_set_group_ids)).to include(2)
      end
    end
  end

  describe ".extract_posts" do
    let(:posts) { [] }
    let(:current_user) { create(:user) }
    let(:current_user_post) { create(:post, user: current_user) }

    context "current_userが投稿した場合" do
      it "current_userの投稿(current_user_post)がpostsに含まれる" do
        Post.extract_posts(current_user, posts, [current_user_post])
        expect(posts).to include(current_user_post)
      end
    end

    context "current_user以外が投稿した場合" do
      let(:another_user) { create(:user) }

      context "投稿の公開先グループにcurrent_userが所属している(accepted: true)場合" do
        let(:another_user_post1) { create(:post, user: another_user, groups: [post_group1]) }
        let(:post_group1) { build(:group, group_users: [group_user1]) }
        let(:group_user1) { build(:group_user, user: current_user, accepted: true) }

        it "another_userの投稿(another_user_post)がpostsに含まれる" do
          Post.extract_posts(current_user, posts, [another_user_post1])
          expect(posts).to include(another_user_post1)
        end
      end

      context "投稿の公開先グループにcurrent_userが所属していない(accepted: false)場合" do
        let(:another_user_post2) { create(:post, user: another_user, groups: [post_group2]) }
        let(:post_group2) { build(:group, group_users: [group_user2]) }
        let(:group_user2) { build(:group_user, user: current_user, accepted: false) }

        it "another_userの投稿(another_user_post)がpostsに含まれない" do
          Post.extract_posts(current_user, posts, [another_user_post2])
          expect(posts).not_to include(another_user_post2)
        end
      end
    end
  end

  describe ".extract_maps" do
    let(:post) { create(:post, map: map) }
    let(:map) { create(:map) }
    let(:maps) { [] }

    context "mapにlocationが紐ついている場合" do
      it "mapsにmapが含まれること" do
        Post.extract_maps([post], maps)
        expect(maps).to include(map)
      end
    end

    context "mapにlocationが紐ついていない場合" do
      it "mapsにmapが含まれないこと" do
        post.map.location = nil
        Post.extract_maps([post], maps)
        expect(maps).not_to include(map)
      end
    end
  end
end
