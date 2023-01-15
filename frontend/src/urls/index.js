const DEFAULT_API_LOCALHOST = "http://localhost:3000/api/v1";

export const users = `${DEFAULT_API_LOCALHOST}/admin/users`;
export const user = (userId) =>
  `${DEFAULT_API_LOCALHOST}/admin/users/${userId}`;

export const posts = `${DEFAULT_API_LOCALHOST}/home`;
