import { AuthService } from "./auth.service";

export function authAppInitializerFactory(
  authService: AuthService
): () => Promise<void> {
  // return () => Promise.resolve();
  return () => authService.runInitialLoginSequence();
}
