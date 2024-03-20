import Axios from 'axios';

export const BASE_URL =
  process.env.LEADERBOARD_BASE_URL ||
  'https://discuss.khulnasoft.com';
export const client = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Cache-Control': 'private',
  },
});
