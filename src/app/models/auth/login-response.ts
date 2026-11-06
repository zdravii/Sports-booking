export interface LoginResponseDTO {
  token: string;
  userId: number;
  firstName: string;
  lastName: string;
  role: string;
  refreshToken: string;
}
