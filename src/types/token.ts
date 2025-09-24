export interface IToken {
  token: string;
  refresh_token: string;
  expires_in: number;
  refersh_token_expiry: number;
  token_type: string;
}