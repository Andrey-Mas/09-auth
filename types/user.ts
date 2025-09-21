export interface User {
  id: string;
  email: string;
  username?: string | null;
  avatar?: string | null;
}

export interface UpdateUserDto {
  username?: string;
}
