export function extractErrorMessage(error: unknown, fallback = 'Une erreur est survenue.') {
  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  if (error && typeof error === 'object') {
    const value = error as {
      message?: string;
      error?: { message?: string; error?: string; details?: string[] | string };
    };

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
      return value.error.error;
    }

    if (typeof value.message === 'string' && value.message.trim()) {
      return value.message;
    }
  }

  return fallback;
}
