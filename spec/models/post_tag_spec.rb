require 'rails_helper'

RSpec.describe PostTag, type: :model do
  describe "validations" do
    let(:post) { create(:post) }
    let(:tag) { create(:tag) }
    let(:post_tag) { build(:post_tag, post: post, tag: tag) }

    it "検証項目が条件を満たしていれば有効であること" do
      expect(post_tag).to be_valid
    end

    context "presence" do
      it "post_idが空であれば無効であること" do
        post_tag.post_id = ""
        post_tag.valid?
        expect(post_tag.errors[:post_id]).to include("を入力してください")
      end

      it "tag_idが空であれば無効であること" do
        post_tag.tag_id = ""
        post_tag.valid?
        expect(post_tag.errors[:tag_id]).to include("を入力してください")
      end
    end
  end
end
