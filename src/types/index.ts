
export interface IState {
  clientId: string;
  clientSecret: string;
  accessTokenUrl: string;
  scope: string;
};

export interface IOptions {
  // refreshTokenUrl: string;
  cookieName: string;
  expiresIn: number; // in seconds
  autoRefresh: boolean;
};

export type TStatus = 'idle' | 'loading' | 'success' | 'error';

export interface IAppState {
  request?: IState;
  token?: string;
  options: IOptions;
  status: TStatus;
  isValid: boolean;
}
