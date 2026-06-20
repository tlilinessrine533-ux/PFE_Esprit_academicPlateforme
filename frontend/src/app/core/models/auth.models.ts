import { RoleType, TeacherType } from './shared.models';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleType;
  teacherType: TeacherType | null;
  departmentId: number | null;
  departmentName: string | null;
}

export interface AuthResponse {
  token: string | null;
  tokenType: string | null;
  expiresIn: number;
  user: AuthUser | null;
  requiresTwoFactor: boolean;
  requiresTwoFactorEnrollment: boolean;
  twoFactorChallengeToken: string | null;
  twoFactorChallengeExpiresIn: number;
  trustedDeviceToken: string | null;
  trustedDeviceExpiresIn: number;
}

export interface LoginPayload {
  email: string;
  password: string;
  trustedDeviceToken?: string | null;
}

export interface TwoFactorLoginPayload {
  email: string;
  challengeToken: string;
  code: string;
  rememberDevice: boolean;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  email: string;
  code: string;
  newPassword: string;
}

export interface PhonePasswordResetRequestPayload {
  phoneNumber: string;
}

export interface PhonePasswordResetConfirmPayload {
  phoneNumber: string;
  code: string;
  newPassword: string;
}

export interface AuthInfoResponse {
  message: string;
  verificationCode?: string | null;
}

export interface AuthSession extends AuthResponse {
  token: string;
  tokenType: string;
  user: AuthUser;
  requiresTwoFactor: false;
}

export interface TwoFactorStatusResponse {
  enabled: boolean;
  pendingEnrollment: boolean;
  issuer: string;
  accountName: string;
  manualEntryKey: string | null;
  otpAuthUri: string | null;
  setupExpiresAt: string | null;
  backupCodesRemaining: number;
}

export interface PasskeyStatusResponse {
  enrolled: boolean;
  registeredAt: string | null;
  lastUsedAt: string | null;
}

export interface FaceRecognitionStatusResponse {
  enrolled: boolean;
  enrolledAt: string | null;
  lastUsedAt: string | null;
}

export interface PasskeyRegistrationOptionsResponse {
  challenge: string;
  rpId: string;
  rpName: string;
  userHandle: string;
  userName: string;
  userDisplayName: string;
  timeoutMs: number;
}

export interface PasskeyAuthenticationOptionsResponse {
  challenge: string;
  rpId: string;
  credentialId: string;
  timeoutMs: number;
}

export interface PasskeyRegistrationFinishPayload {
  credentialId: string;
  clientDataJSON: string;
  attestationObject: string;
}

export interface PasskeyAuthenticationFinishPayload {
  email: string;
  credentialId: string;
  clientDataJSON: string;
  authenticatorData: string;
  signature: string;
  userHandle?: string | null;
}

export interface FaceRecognitionPayload {
  descriptor: number[];
}

export interface FaceRecognitionLoginPayload extends FaceRecognitionPayload {
  email: string;
}

export interface TwoFactorEnablePayload {
  currentPassword: string;
  code: string;
}

export interface TwoFactorDisablePayload {
  currentPassword: string;
  code: string;
}

export interface TwoFactorEnableResponse {
  message: string;
  backupCodes: string[];
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: RoleType;
  teacherType: TeacherType | null;
  departmentId: number | null;
  departmentName?: string | null;
  isActive: boolean;
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: RoleType;
  teacherType: TeacherType | null;
  departmentId: number | null;
  isActive: boolean;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleType;
  teacherType: TeacherType | null;
  departmentId: number | null;
  departmentName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
