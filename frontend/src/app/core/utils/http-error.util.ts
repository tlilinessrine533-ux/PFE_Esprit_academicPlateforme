export function extractErrorMessage(error: unknown, fallback = 'Une erreur est survenue.') {
  const backendUnavailableMessage =
    "Backend indisponible (port 8081). Demarrez le backend puis actualisez la page.";

  if (typeof error === 'string' && error.trim()) {
    if (isBackendUnavailableProxyError(error)) {
      return backendUnavailableMessage;
    }
    return error;
  }

  if (error && typeof error === 'object') {
    const value = error as {
      message?: string;
      status?: number;
      url?: string;
      error?: { message?: string; error?: string; details?: string[] | string; path?: string };
    };

    const backendPath = typeof value.error?.path === 'string' && value.error.path.trim()
      ? value.error.path.trim()
      : typeof value.url === 'string' && value.url.trim()
        ? value.url.trim()
        : null;

    if (typeof value.error?.message === 'string' && value.error.message.trim()) {
      return value.error.message;
    }

    if (Array.isArray(value.error?.details) && value.error.details.length > 0) {
      return value.error.details.join(', ');
    }

    if (typeof value.error?.details === 'string' && value.error.details.trim()) {
      return value.error.details;
    }

    if (typeof value.error?.error === 'string' && value.error.error.trim()) {
      if (value.error.error.trim().toLowerCase() === 'bad request' && backendPath) {
        return `Requete invalide (${backendPath}).`;
      }
      return value.error.error;
    }

    if (typeof value.message === 'string' && value.message.trim()) {
      if (isBackendUnavailableProxyError(value.message)) {
        return backendUnavailableMessage;
      }
      if (value.message.trim().toLowerCase() === 'bad request' && backendPath) {
        return `Requete invalide (${backendPath}).`;
      }
      return value.message;
    }

    if (value.status === 400 && backendPath) {
      return `Requete invalide (${backendPath}).`;
    }
  }

  return fallback;
}

function isBackendUnavailableProxyError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('http failure response') &&
    normalized.includes('/api/') &&
    (normalized.includes('500') || normalized.includes('internal server error'))
  );
}
