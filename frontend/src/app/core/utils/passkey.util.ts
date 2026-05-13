import {
  PasskeyAuthenticationFinishPayload,
  PasskeyAuthenticationOptionsResponse,
  PasskeyRegistrationFinishPayload,
  PasskeyRegistrationOptionsResponse
} from '../models/auth.models';

export async function isPlatformPasskeySupported() {
  if (typeof window === 'undefined' || typeof PublicKeyCredential === 'undefined') {
    return false;
  }

  if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== 'function') {
    return false;
  }

  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export async function createPlatformPasskey(
  options: PasskeyRegistrationOptionsResponse
): Promise<PasskeyRegistrationFinishPayload> {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: base64UrlToUint8Array(options.challenge),
      rp: {
        id: options.rpId,
        name: options.rpName
      },
      user: {
        id: base64UrlToUint8Array(options.userHandle),
        name: options.userName,
        displayName: options.userDisplayName
      },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
      timeout: options.timeoutMs,
      attestation: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred'
      }
    }
  });

  if (!(credential instanceof PublicKeyCredential)) {
    throw new Error("La creation de la cle biometrie a echoue.");
  }

  const response = credential.response;
  if (!('attestationObject' in response) || !('clientDataJSON' in response)) {
    throw new Error("La reponse biometrie recue est incomplete.");
  }

  const attestationResponse = response as AuthenticatorAttestationResponse;

  return {
    credentialId: bufferToBase64Url(credential.rawId),
    clientDataJSON: bufferToBase64Url(attestationResponse.clientDataJSON),
    attestationObject: bufferToBase64Url(attestationResponse.attestationObject)
  };
}

export async function getPlatformPasskeyAssertion(
  email: string,
  options: PasskeyAuthenticationOptionsResponse
): Promise<PasskeyAuthenticationFinishPayload> {
  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: base64UrlToUint8Array(options.challenge),
      timeout: options.timeoutMs,
      rpId: options.rpId,
      allowCredentials: [
        {
          id: base64UrlToUint8Array(options.credentialId),
          type: 'public-key'
        }
      ],
      userVerification: 'required'
    }
  });

  if (!(credential instanceof PublicKeyCredential)) {
    throw new Error("La verification Face ID / biometrie a echoue.");
  }

  const response = credential.response;
  if (!('authenticatorData' in response) || !('signature' in response) || !('clientDataJSON' in response)) {
    throw new Error("La signature biometrie recue est incomplete.");
  }

  const assertionResponse = response as AuthenticatorAssertionResponse;

  return {
    email,
    credentialId: bufferToBase64Url(credential.rawId),
    clientDataJSON: bufferToBase64Url(assertionResponse.clientDataJSON),
    authenticatorData: bufferToBase64Url(assertionResponse.authenticatorData),
    signature: bufferToBase64Url(assertionResponse.signature),
    userHandle: assertionResponse.userHandle ? bufferToBase64Url(assertionResponse.userHandle) : null
  };
}

function base64UrlToUint8Array(value: string) {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalizedValue.length % 4 === 0 ? '' : '='.repeat(4 - (normalizedValue.length % 4));
  const base64Value = normalizedValue + padding;
  const rawValue = atob(base64Value);
  const bytes = new Uint8Array(rawValue.length);

  for (let index = 0; index < rawValue.length; index++) {
    bytes[index] = rawValue.charCodeAt(index);
  }

  return bytes;
}

function bufferToBase64Url(value: ArrayBufferLike | ArrayBufferView) {
  const bytes = ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : new Uint8Array(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
