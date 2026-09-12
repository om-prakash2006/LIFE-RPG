/**
 * Admin Security Configuration
 * 
 * In accordance with application security best practices, administrative access is 
 * governed by verified authentication identity (Role-Based Access Control) rather than 
 * insecure hardcoded plaintext passwords in client bundles.
 */

export const ADMIN_CONFIG = {
  authorizedEmails: [
    'ommbehera46@gmail.com',
  ],

  isAuthorizedAdmin: (email?: string | null): boolean => {
    if (!email) return false;
    return ADMIN_CONFIG.authorizedEmails.some(
      (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase().trim()
    );
  },
};
