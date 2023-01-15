5.times do |n|
  user = User.create!(
    user_name: "testユーザー_#{n}",
    email: "test#{n}@example.com",
    password_digest: "testパスワード_#{n}",
    user_profile: "testプロフィール_#{n}",
    admin: true,
    guest: true,
    # created_at: "2023-01-06 21:18:57",
    # updated_at: "2023-01-06 21:18:57",
  )

  map = Map.create!(
    location: "東京"
  )

  2.times do |m|
    user.posts.create!(
      user_id: user.id,
      map_id: map.id,
      comment: "コメント_#{2 * n + m}です．",
      memorized_on: "2023-01-06",
      description: "詳細説明_#{2 * n + m}です．",
    )
  end
end
