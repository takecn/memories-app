require 'rails_helper'

RSpec.describe Bookmark, type: :model do
  describe "validations" do
    let(:post) { create(:post) }
    let(:user) { create(:user) }
    let(:bookmark1) { build(:bookmark, post: post, user: user) }
    let(:bookmark2) { build(:bookmark, post: post, user: user) }

    it "検証項目が条件を満たしていれば有効であること" do
      expect(bookmark1).to be_valid
    end

    it "同一post_idに紐つくuser_idに重複があれば無効であること" do
      bookmark1.save
      expect(bookmark2).to be_invalid
    end
  end
end
