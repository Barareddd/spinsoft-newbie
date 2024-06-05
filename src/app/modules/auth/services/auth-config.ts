import { AuthConfig } from "angular-oauth2-oidc";

export const authConfig: AuthConfig = {
  issuer: "https://accounts-cis.fm-sp.com/auth/realms/EMS",
  // issuer: "https://iaam.ddc.moph.go.th",
  clientId: "iDEMS", // dev
  dummyClientSecret: "2cdbf4f1-90f5-416c-9bd5-b6b60c03e679",
  // clientId: 'ad10a304-1973-4530-9f72-f077b5b6cde2', // prod
  responseType: "code",
  redirectUri: window.location.origin,
  // silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  scope: "openid profile email", // Ask offline_access to support refresh token refreshes
  // useSilentRefresh: true, // Needed for Code Flow to suggest using iframe-based refreshes
  silentRefreshTimeout: 1000, // For faster testing
  // timeoutFactor: 0.25, // For faster testing
  sessionChecksEnabled: true,
  sessionCheckIntervall: 20000,
  sessionCheckIFrameUrl: "https://iaam.ddc.moph.go.th/oxauth/opiframe.htm",
  // sessionCheckIFrameUrl: 'https://iaamserver.iaam.cloud/oxauth/opiframe.htm',
  // disableAtHashCheck: true,
  showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
  clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
  nonceStateSeparator: "semicolon", // Real semicolon gets mangled by IdentityServer's URI encoding
  // strictDiscoveryDocumentValidation: false
};
