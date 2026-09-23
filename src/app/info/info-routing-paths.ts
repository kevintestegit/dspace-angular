import { getInfoModulePath } from '../app-routing-paths';

export const END_USER_AGREEMENT_PATH = 'end-user-agreement';
export const PRIVACY_PATH = 'privacy';
export const FEEDBACK_PATH = 'feedback';
export const FALE_CONOSCO_PATH = 'fale-conosco';
export const ABOUT_PATH = 'about';
export const COAR_NOTIFY_SUPPORT = 'coar-notify-support';
export const ACCESSIBILITY_SETTINGS_PATH = 'accessibility';
export const ACCESS_POLICY_PATH = 'politica-acesso';
export const AJUDA_PATH = 'ajuda';

export function getEndUserAgreementPath() {
  return getSubPath(END_USER_AGREEMENT_PATH);
}

export function getPrivacyPath() {
  return getSubPath(PRIVACY_PATH);
}

export function getFeedbackPath() {
  return getSubPath(FEEDBACK_PATH);
}

export function getFaleConoscoPath() {
  return getSubPath(FALE_CONOSCO_PATH);
}

export function getAboutPath() {
  return getSubPath(ABOUT_PATH);
}

export function getCOARNotifySupportPath(): string {
  return getSubPath(COAR_NOTIFY_SUPPORT);
}

export function getAccessibilitySettingsPath() {
  return getSubPath(ACCESSIBILITY_SETTINGS_PATH);
}

export function getAccessPolicyPath() {
  return getSubPath(ACCESS_POLICY_PATH);
}

export function getAjudaPath() {
  return getSubPath(AJUDA_PATH);
}

function getSubPath(path: string) {
  return `${getInfoModulePath()}/${path}`;
}
