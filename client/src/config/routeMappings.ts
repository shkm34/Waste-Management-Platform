import { ROUTES, USER_ROLES } from '@/utils';

export const ROLE_REDIRECT_MAP: Record<string, string> = {
  [USER_ROLES.CUSTOMER]: ROUTES.CUSTOMER_DASHBOARD,
  [USER_ROLES.DRIVER]: ROUTES.DRIVER_DASHBOARD,
  [USER_ROLES.DEALER]: ROUTES.DEALER_DASHBOARD,

};

export const getRedirectRoute = (role: string): string => {
    return ROLE_REDIRECT_MAP[role] || ROUTES.LOGIN;
};