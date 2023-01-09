require 'rails_helper'

RSpec.describe Notice, type: :model do
  describe "validations" do
    let(:user) { build(:user) }

    it "検証項目が条件を満たしていれば有効であること" do
      expect(user).to be_valid
    end

    context "presence" do
      it "user_nameが空であれば無効であること" do
        user.user_name = ""
        user.valid?
        expect(user.errors[:user_name]).to include("を入力してください")
      end

      it "emailが空であれば無効であること" do
        user.email = ""
        user.valid?
        expect(user.errors[:email]).to include("を入力してください")
      end

      it "パスワードが空であれば無効であること" do
        user.password_digest = ""
        user.valid?
        expect(user.errors[:password]).to include("を入力してください")
      end
    end
  end
end
