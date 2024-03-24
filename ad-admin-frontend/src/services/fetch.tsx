import { SERVER_URL } from '@/constants/constants';

// custom fetch (post, put, delete)
export const fetchServer = async (path: string, method: string = 'POST', body: { [key: string]: unknown }) => {
  const res = await fetch(`${SERVER_URL}/api/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res;
};

// get & timeout fetch
export async function fetchTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const promise = fetch(url, { signal: controller.signal });
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return promise.finally(() => clearTimeout(timeoutId));
}
