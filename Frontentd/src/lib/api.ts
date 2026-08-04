const API_URL = "http://localhost:5018";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = (body as any)?.error || (body as any)?.title || "Ошибка запроса";
    if (response.status === 401 && !path.startsWith("/api/auth/")) {
      window.location.href = "/login";
    }
    throw new Error(message);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as T);
}

export const api = {
  me: () => request<any>("/api/auth/me"),
  login: (email: string, password: string, rememberMe: boolean) =>
    request<any>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, rememberMe }),
    }),
  register: (email: string, displayName: string, password: string, confirmPassword: string) =>
    request<any>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, displayName, password, confirmPassword }),
    }),
  logout: () => request<any>("/api/auth/logout", { method: "POST" }),

  games: (search = "", page = 1, pageSize = 12) =>
    request<any>(`/api/games?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`),
  createGame: (data: any) =>
    request<any>("/api/games", { method: "POST", body: JSON.stringify(data) }),

  users: (search = "", page = 1, pageSize = 12) =>
    request<any>(`/api/users?search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`),
  user: (id: string) => request<any>(`/api/users/${id}`),

  subscribe: (id: string) => request<any>(`/api/users/${id}/subscribe`, { method: "POST" }),
  unsubscribe: (id: string) => request<any>(`/api/users/${id}/unsubscribe`, { method: "POST" }),
  subscribers: (id: string) => request<any[]>(`/api/users/${id}/subscribers`),
  following: (id: string) => request<any[]>(`/api/users/${id}/following`),
  friends: (id: string) => request<any[]>(`/api/users/${id}/friends`),

  collections: () => request<any[]>("/api/collections"),
  createCollection: (name: string) =>
    request<any>("/api/collections", { method: "POST", body: JSON.stringify({ name }) }),
  addGameToCollection: (collectionId: string, gameId: string) =>
    request<any>(`/api/collections/${collectionId}/games/${gameId}`, { method: "POST" }),
  removeGameFromCollection: (collectionId: string, gameId: string) =>
    request<any>(`/api/collections/${collectionId}/games/${gameId}`, { method: "DELETE" }),

  sessions: (page = 1, pageSize = 10) =>
    request<any>(`/api/sessions?page=${page}&pageSize=${pageSize}`),
  createSession: (data: any) =>
    request<any>("/api/sessions", { method: "POST", body: JSON.stringify(data) }),
  updateSession: (id: string, data: any) =>
    request<any>(`/api/sessions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSession: (id: string) => request<any>(`/api/sessions/${id}`, { method: "DELETE" }),
};
