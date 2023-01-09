require 'rails_helper'

RSpec.describe Favorite, type: :model do
  describe "validations" do
    let(:post) { create(:post) }
    let(:user) { create(:user) }
    let(:favorite1) { build(:favorite, post: post, user: user) }
    let(:favorite2) { build(:favorite, post: post, user: user) }

    it "検証項目が条件を満たしていれば有効であること" do
      expect(favorite1).to be_valid
    end

    it "同一post_idに紐つくuser_idに重複があれば無効であること" do
      favorite1.save
      expect(favorite2).to be_invalid
    end
  end

  describe "#create_favorite_notice" do
    let(:sender) { create(:user) }
    let(:receiver) { create(:user) }
    let(:post) { create(:post, user: receiver) }
    let(:favorite) { create(:favorite, user: receiver, post: post) }
    let(:notice) { create(:notice, sender: sender, receiver: receiver, post: post) }

    it "生成したactive_noticesのsender_id, receiver_id, post_idが，noticeのそれと同一であること" do
      favorite.create_favorite_notice(sender)
      sender.active_notices.each do |favorite_notice|
        expect(favorite_notice.sender_id).to eq(notice.sender_id)
        expect(favorite_notice.receiver_id).to eq(notice.receiver_id)
        expect(favorite_notice.post_id).to eq(notice.post_id)
      end
    end
  end
end
