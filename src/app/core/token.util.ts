export const TOKEN_KEY = 'access_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getJwtPayload<T = any>(): T | null {
  const t = getToken();
  if (!t) return null;
  const parts = t.split('.');
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(atob(parts[1])) as T;
  } catch {
    return null;
  }
}
