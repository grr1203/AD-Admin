import { SERVER_URL } from '@/constants/constants';

// custom fetch (post, put, delete)
export const fetchServer = async (path: string, method: string = 'POST', body: { [key: string]: unknown }) => {
  const res = await fetch(`${SERVER_URL}/api/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res
};
