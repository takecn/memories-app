require 'rails_helper'

RSpec.describe Group, type: :model do
  describe "validations" do
    let(:group) { build(:group) }
    let(:another_group) { build(:group) }

    it "検証項目が条件を満たしていれば有効であること" do
      expect(group).to be_valid
    end

    context "content_type, size" do
      it "画像のファイル形式がJPEG・GIF・PNG以外，または画像サイズが5MB以上であれば無効であること" do
        group.group_avatar = Rack::Test::UploadedFile.new(Rails.root.join("spec/fixtures/5MB_dummy.txt"), "text/plain")
        expect(group).to be_invalid
        expect(group.errors.full_messages).to include("Group avatarのファイル形式は，JPEG, GIF, PNGのみ添付可能です．", "Group avatarのデータ容量は5MB以下として下さい．")
      end
    end

    context "presence" do
      it "グループ名が空であれば無効であること" do
        group.group_name = ""
        group.valid?
        expect(group.errors[:group_name]).to include("を入力してください")
      end
    end

    context "uniqueness" do
      it "グループ名に重複があれば無効であること" do
        group.save
        another_group.valid?
        expect(another_group.errors[:group_name]).to include("はすでに存在します")
      end
    end
  end

  describe "#create_group_invitation_notice" do
    let(:sender) { create(:user, groups: [group]) }
    let(:receiver) { create(:user, groups: [group]) }
    let(:group) { create(:group) }
    let(:group_user) { create(:group_user, group: group, user: receiver) }
    let(:notice) { create(:notice, sender: sender, receiver: receiver, group_user: group_user, group: group) }

    it "生成したactive_noticesのsender_id, receiver_id, group_user_id, group_idが，noticeのそれと同一であること" do
      group.create_group_invitation_notice([group_user], sender)
      sender.active_notices.each do |group_invitation_notice|
        expect(group_invitation_notice.sender_id).to eq(notice.sender_id)
        expect(group_invitation_notice.receiver_id).to eq(notice.receiver_id)
        expect(group_invitation_notice.group_user_id).to eq(notice.group_user_id)
        expect(group_invitation_notice.group_id).to eq(notice.group_id)
      end
    end
  end
end
