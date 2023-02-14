require 'rails_helper'

RSpec.describe User, type: :model do
  describe "validations" do
    let(:user) { build(:user) }
    let(:another_user) { build(:user, user_name: "user_name", email: "user_name@example.com") }

    it "検証項目が条件を満たしていれば有効であること" do
      expect(user).to be_valid
    end

    context "content_type, size" do
      it "画像のファイル形式がJPEG・GIF・PNG以外，または画像サイズが5MB以上であれば無効であること" do
        user.user_avatar = Rack::Test::UploadedFile.new(Rails.root.join("spec/fixtures/5MB_dummy.txt"), "text/plain")
        expect(user).to be_invalid
        expect(user.errors.full_messages).to include("User avatarのファイル形式は，JPEG, GIF, PNGのみ添付可能です．", "User avatarのデータ容量は5MB以下として下さい．")
      end
    end

    context "presence" do
      it "パスワード（確認）が空であれば無効であること" do
        user.password_confirmation = ""
        user.valid?
        expect(user.errors[:password_confirmation]).to include("を入力してください")
      end

      it "ユーザー名が空であれば無効であること" do
        user.user_name = ""
        user.valid?
        expect(user.errors[:user_name]).to include("を入力してください")
      end

      it "emailが空であれば無効であること" do
        user.email = ""
        user.valid?
        expect(user.errors[:email]).to include("を入力してください")
      end
    end

    context "uniqueness" do
      before do
        create(:user, user_name: "user_name", email: "user_name@example.com")
        another_user.valid?
      end

      it "ユーザー名に重複があれば無効であること" do
        expect(another_user.errors[:user_name]).to include("はすでに存在します")
      end

      it "emailに重複があれば無効であること" do
        expect(another_user.errors[:email]).to include("はすでに存在します")
      end
    end
  end
end
