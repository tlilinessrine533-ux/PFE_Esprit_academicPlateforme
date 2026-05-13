import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export interface UiToast {
  id: number;
  title: string;
  message: string;
  tone: ToastTone;
}

@Injectable({ providedIn: 'root' })
export class UiToastService {
  private readonly toastsSignal = signal<UiToast[]>([]);
  private readonly timeoutRegistry = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 1;

  readonly toasts = this.toastsSignal.asReadonly();

  show(toast: Omit<UiToast, 'id'>, durationMs = 4000) {
    const nextToast: UiToast = {
      ...toast,
      id: this.nextId++
    };

    this.toastsSignal.update((current) => [...current, nextToast]);

    const timeoutId = setTimeout(() => {
      this.dismiss(nextToast.id);
    }, durationMs);

    this.timeoutRegistry.set(nextToast.id, timeoutId);
  }

  success(title: string, message: string, durationMs?: number) {
    this.show({ title, message, tone: 'success' }, durationMs);
  }

  error(title: string, message: string, durationMs = 5000) {
    this.show({ title, message, tone: 'error' }, durationMs);
  }

  info(title: string, message: string, durationMs?: number) {
    this.show({ title, message, tone: 'info' }, durationMs);
  }

  warning(title: string, message: string, durationMs?: number) {
    this.show({ title, message, tone: 'warning' }, durationMs);
  }

  dismiss(id: number) {
    const timeoutId = this.timeoutRegistry.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutRegistry.delete(id);
    }

    this.toastsSignal.update((current) => current.filter((toast) => toast.id !== id));
  }
}
