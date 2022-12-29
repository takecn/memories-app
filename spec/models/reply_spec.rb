require 'rails_helper'

RSpec.describe Reply, type: :model do
  describe "#create_reply_notice" do
    let(:sender) { create(:user) }
    let(:receiver) { create(:user) }

    context "投稿者へ通知する場合" do
      let(:post) { create(:post, user: receiver) }
      let(:reply) { create(:reply, post: post, user: sender) }
      let(:notice) { create(:notice, sender: sender, receiver: receiver, post: post, reply: reply) }

      it "生成したactive_noticesのsender_id, receiver_id, post_id, reply_idが，noticeのそれと同一であること" do
        reply.create_reply_notice([reply], sender)
        sender.active_notices.each do |reply_notice|
          expect(reply_notice.sender_id).to eq(notice.sender_id)
          expect(reply_notice.receiver_id).to eq(notice.receiver_id)
          expect(reply_notice.post_id).to eq(notice.post_id)
          expect(reply_notice.reply_id).to eq(notice.reply_id)
        end
      end
    end

    context "投稿に既にリプライしていた他のユーザーに通知する場合" do
      let(:replier) { create(:user) }
      let(:post) { create(:post, user: sender) }
      let(:reply1) { create(:reply, post: post, user: sender) }
      let(:reply2) { create(:reply, post: post, user: replier) }
      let(:notice) { create(:notice, sender: sender, receiver: replier, post: post, reply: reply2) }

      it "生成したactive_noticesのsender_id, receiver_id, post_id, reply_idが，noticeのそれと同一であること" do
        reply1.create_reply_notice([reply2], sender)
        sender.active_notices.each do |reply_notice|
          expect(reply_notice.sender_id).to eq(notice.sender_id)
          expect(reply_notice.receiver_id).to eq(notice.receiver_id)
          expect(reply_notice.post_id).to eq(notice.post_id)
          expect(reply_notice.reply_id).to eq(notice.reply_id)
        end
      end
    end
  end
end
