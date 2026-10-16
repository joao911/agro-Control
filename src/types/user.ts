export interface IUser {
  access_token: string;

  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
  };
}
