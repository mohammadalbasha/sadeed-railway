export interface JwtDto {
  userId: string;
  isAdminGoogleTwoFactorsAuthenticated: boolean,
  isAdminEmailOtpTwoFactorsAuthenticated: boolean;
  isValidPasswordToken: string;
  /**
   * Issued at
   */
  iat: number;
  /**
   * Expiration time
   */
  exp: number;
}
