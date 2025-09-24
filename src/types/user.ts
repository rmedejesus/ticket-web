export interface IUser {
  id?: number,
  first_name?: string,
  last_name?: string,
  email?: string,
  password?: string
}

export interface ILoggedUser {
  id?: number;
  first_name?: string;
  last_name?: string
}