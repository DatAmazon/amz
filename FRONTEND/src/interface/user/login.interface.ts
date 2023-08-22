/** user's role */
export type Role = 'guest' | 'admin';
export type Data = {
  tokens: {
    accessToken: string,
    expiresIn: string,
    refreshToken: string,
    tokenType: string,
  },
  user: {
    id: string,
    name: string,
    username: string,
    email: string
  }
}
export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  /** auth token */
  code: string;
  data: Data;
  message: string;
}

export interface LogoutParams {
  token: string;
}

export interface LogoutResult { }
