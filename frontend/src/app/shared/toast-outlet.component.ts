import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiToastService } from '../core/services/ui-toast.service';

@Component({
  selector: 'app-toast-outlet',
  template: `
    <section class="toast-stack" aria-live="polite" aria-atomic="true">
      @for (toast of toasts(); track toast.id) {
        <article class="toast-card toast-{{ toast.tone }}">
          <div class="toast-copy">
            <strong>{{ toast.title }}</strong>
            <p>{{ toast.message }}</p>
          </div>
          <button type="button" class="toast-close" (click)="dismiss(toast.id)" aria-label="Fermer la notification">
            ×
          </button>
        </article>
      }
    </section>
  `,
  styles: [
    `
      .toast-stack {
        position: fixed;
        top: 1.4rem;
        right: 1.4rem;
        z-index: 40;
        display: grid;
        gap: 0.8rem;
        width: min(360px, calc(100vw - 2rem));
        pointer-events: none;
      }

      .toast-card {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 0.75rem;
        align-items: start;
        padding: 1rem 1.05rem;
        border-radius: 20px;
        box-shadow: 0 28px 55px rgba(17, 42, 63, 0.18);
        border: 1px solid rgba(20, 50, 74, 0.08);
        backdrop-filter: blur(14px);
        pointer-events: auto;
      }

      .toast-copy strong {
        display: block;
        margin-bottom: 0.25rem;
        font-size: 0.95rem;
      }

      .toast-copy p {
        margin: 0;
        color: rgba(20, 50, 74, 0.8);
        line-height: 1.55;
        font-size: 0.9rem;
      }

      .toast-close {
        cursor: pointer;
        border: 0;
        background: transparent;
        color: inherit;
        font-size: 1.2rem;
        line-height: 1;
        opacity: 0.7;
      }

      .toast-success {
        background: rgba(226, 247, 232, 0.94);
        color: #155c37;
      }

      .toast-error {
        background: rgba(255, 233, 233, 0.96);
        color: #8e2c2c;
      }

      .toast-info {
        background: rgba(231, 243, 244, 0.96);
        color: #1b5c60;
      }

      .toast-warning {
        background: rgba(255, 243, 224, 0.96);
        color: #8b560e;
      }

      @media (max-width: 768px) {
        .toast-stack {
          top: auto;
          right: 1rem;
          bottom: 1rem;
          left: 1rem;
          width: auto;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastOutletComponent {
  private readonly toastService = inject(UiToastService);

  readonly toasts = this.toastService.toasts;

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
}
