export const authErrors = {
  invalidCredentials: "Invalid email or password.",
  emailAlreadyExists: "Customer email already exists.",
  invalidAccessToken: "Invalid or expired access token.",
  invalidRefreshToken: "Invalid or expired refresh token.",
  missingAccessToken: "Access token is required.",
  customerNotFound: "Authenticated customer not found."
} as const;
