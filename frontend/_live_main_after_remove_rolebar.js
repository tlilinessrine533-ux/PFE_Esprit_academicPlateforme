import { injectQuery as __vite__injectQuery } from "/@vite/client";import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/main.js");import {
  AuthService
} from "/chunk-JQ6FWRX5.js";

// src/main.ts
import { bootstrapApplication } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_platform-browser.js?v=9353569b";

// src/app/app.config.ts
import { provideHttpClient, withInterceptors } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_common_http.js?v=9353569b";
import { provideBrowserGlobalErrorListeners } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
import { provideRouter } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_router.js?v=9353569b";

// src/app/core/interceptors/auth.interceptor.ts
import { HttpErrorResponse } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_common_http.js?v=9353569b";
import { inject } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
import { catchError, throwError } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/rxjs.js?v=9353569b";
var isLoginFlowRequest = (url) => url.includes("/api/auth/login") || url.includes("/api/auth/password-reset") || url.includes("/api/auth/passkeys/login") || url.includes("/api/auth/face-recognition/login");
var authInterceptor = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.token();
  const requestWithAuth = token ? request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }) : request;
  return next(requestWithAuth).pipe(catchError((error) => {
    if (error instanceof HttpErrorResponse && error.status === 401 && authService.isAuthenticated() && !isLoginFlowRequest(request.url)) {
      authService.logout();
    }
    return throwError(() => error);
  }));
};

// src/app/core/guards/auth.guard.ts
import { inject as inject2 } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
import { Router } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_router.js?v=9353569b";
var authGuard = () => {
  const authService = inject2(AuthService);
  const router = inject2(Router);
  return authService.isAuthenticated() ? true : router.createUrlTree(["/login"]);
};
var roleGuard = (route) => {
  const authService = inject2(AuthService);
  const router = inject2(Router);
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(["/login"]);
  }
  const allowedRoles = route.data["roles"];
  if (!allowedRoles?.length || authService.hasAnyRole(...allowedRoles)) {
    return true;
  }
  return router.parseUrl(authService.defaultRoute());
};
var guestGuard = () => {
  const authService = inject2(AuthService);
  const router = inject2(Router);
  return authService.isAuthenticated() ? router.parseUrl(authService.defaultRoute()) : true;
};

// src/app/app.routes.ts
var activityRoles = ["ENSEIGNANT", "CHEF_DEPARTEMENT"];
var activityCreateRoles = ["ENSEIGNANT"];
var responsibilityRoles = ["ENSEIGNANT", "CHEF_DEPARTEMENT"];
var responsibilityCreateRoles = ["ENSEIGNANT", "CHEF_DEPARTEMENT"];
var teacherOnlyRoles = ["ENSEIGNANT"];
var dashboardRoles = ["ENSEIGNANT", "CHEF_DEPARTEMENT", "ADMINISTRATION"];
var managementRoles = ["SUPER_ADMIN"];
var profileRoles = ["ENSEIGNANT", "CHEF_DEPARTEMENT", "ADMINISTRATION", "SUPER_ADMIN"];
var reportsRoles = ["ENSEIGNANT", "CHEF_DEPARTEMENT", "ADMINISTRATION"];
var workflowRoles = ["CHEF_DEPARTEMENT", "ADMINISTRATION"];
var routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "login"
  },
  {
    path: "login",
    canActivate: [guestGuard],
    loadComponent: () => import("/chunk-6C3LEBQM.js").then((m) => m.LoginPageComponent)
  },
  {
    path: "signup",
    pathMatch: "full",
    redirectTo: "login"
  },
  {
    path: "forgot-password",
    canActivate: [guestGuard],
    loadComponent: () => import("/chunk-5C6JIWBM.js").then((m) => m.ForgotPasswordPageComponent)
  },
  {
    path: "",
    canActivate: [authGuard],
    loadComponent: () => import("/chunk-7BIUZUPX.js").then((m) => m.AppShellComponent),
    children: [
      {
        path: "dashboard",
        canActivate: [roleGuard],
        data: { roles: dashboardRoles },
        loadComponent: () => import("/chunk-ZIC7LHG7.js").then((m) => m.DashboardPageComponent)
      },
      {
        path: "profile",
        canActivate: [roleGuard],
        data: { roles: profileRoles },
        loadComponent: () => import("/chunk-BIDLWP32.js").then((m) => m.ProfilePageComponent)
      },
      {
        path: "availability/leave",
        canActivate: [roleGuard],
        data: { roles: teacherOnlyRoles, requestType: "CONGE" },
        loadComponent: () => import("/chunk-N3ZPAI5F.js").then((m) => m.AvailabilityRequestPageComponent)
      },
      {
        path: "availability/mission",
        canActivate: [roleGuard],
        data: { roles: teacherOnlyRoles, requestType: "MISSION" },
        loadComponent: () => import("/chunk-N3ZPAI5F.js").then((m) => m.AvailabilityRequestPageComponent)
      },
      {
        path: "users",
        canActivate: [roleGuard],
        data: { roles: managementRoles },
        loadComponent: () => import("/chunk-4V7D6SZJ.js").then((m) => m.UsersPageComponent)
      },
      {
        path: "teaching/new",
        canActivate: [roleGuard],
        data: { roles: activityCreateRoles, mode: "create" },
        loadComponent: () => import("/chunk-FGK6SBPO.js").then((m) => m.TeachingPageComponent)
      },
      {
        path: "partnerships/new",
        canActivate: [roleGuard],
        data: {
          roles: activityCreateRoles,
          mode: "create",
          forcedActivityType: "PARTENARIAT",
          createPath: "/partnerships/new",
          listPath: "/partnerships"
        },
        loadComponent: () => import("/chunk-FGK6SBPO.js").then((m) => m.TeachingPageComponent)
      },
      {
        path: "partnerships",
        canActivate: [roleGuard],
        data: {
          roles: activityRoles,
          mode: "list",
          forcedActivityType: "PARTENARIAT",
          activityListFilterType: "PARTENARIAT",
          createPath: "/partnerships/new",
          listPath: "/partnerships"
        },
        loadComponent: () => import("/chunk-FGK6SBPO.js").then((m) => m.TeachingPageComponent)
      },
      {
        path: "teaching",
        canActivate: [roleGuard],
        data: { roles: activityRoles, mode: "list" },
        loadComponent: () => import("/chunk-FGK6SBPO.js").then((m) => m.TeachingPageComponent)
      },
      {
        path: "supervision/new",
        canActivate: [roleGuard],
        data: { roles: activityCreateRoles, mode: "create" },
        loadComponent: () => import("/chunk-MYMVTC4F.js").then((m) => m.SupervisionPageComponent)
      },
      {
        path: "supervision",
        canActivate: [roleGuard],
        data: { roles: activityRoles, mode: "list" },
        loadComponent: () => import("/chunk-MYMVTC4F.js").then((m) => m.SupervisionPageComponent)
      },
      {
        path: "research/new",
        canActivate: [roleGuard],
        data: { roles: activityCreateRoles, mode: "create" },
        loadComponent: () => import("/chunk-GRFCO5Z7.js").then((m) => m.ResearchPageComponent)
      },
      {
        path: "research",
        canActivate: [roleGuard],
        data: { roles: activityRoles, mode: "list" },
        loadComponent: () => import("/chunk-GRFCO5Z7.js").then((m) => m.ResearchPageComponent)
      },
      {
        path: "events/new",
        canActivate: [roleGuard],
        data: { roles: activityCreateRoles, mode: "create" },
        loadComponent: () => import("/chunk-P27YA2EX.js").then((m) => m.EventsPageComponent)
      },
      {
        path: "events",
        canActivate: [roleGuard],
        data: { roles: activityRoles, mode: "list" },
        loadComponent: () => import("/chunk-P27YA2EX.js").then((m) => m.EventsPageComponent)
      },
      {
        path: "exam-surveillance/new",
        canActivate: [roleGuard],
        data: { roles: activityCreateRoles, mode: "create" },
        loadComponent: () => import("/chunk-N2PCXZHB.js").then((m) => m.ExamSurveillancePageComponent)
      },
      {
        path: "exam-surveillance",
        canActivate: [roleGuard],
        data: { roles: activityRoles, mode: "list" },
        loadComponent: () => import("/chunk-N2PCXZHB.js").then((m) => m.ExamSurveillancePageComponent)
      },
      {
        path: "responsibilities/new",
        canActivate: [roleGuard],
        data: { roles: responsibilityCreateRoles, mode: "create" },
        loadComponent: () => import("/chunk-2KVF4KXB.js").then((m) => m.ResponsibilitiesPageComponent)
      },
      {
        path: "responsibilities",
        canActivate: [roleGuard],
        data: { roles: responsibilityRoles, mode: "list" },
        loadComponent: () => import("/chunk-2KVF4KXB.js").then((m) => m.ResponsibilitiesPageComponent)
      },
      {
        path: "reports",
        canActivate: [roleGuard],
        data: { roles: reportsRoles },
        loadComponent: () => import("/chunk-4IVYLMQV.js").then((m) => m.ReportsPageComponent)
      },
      {
        path: "workflow",
        canActivate: [roleGuard],
        data: { roles: workflowRoles },
        loadComponent: () => import("/chunk-MGO7PYQY.js").then((m) => m.WorkflowPageComponent)
      },
      {
        path: "",
        pathMatch: "full",
        redirectTo: "dashboard"
      }
    ]
  },
  {
    path: "**",
    redirectTo: "login"
  }
];

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};

// src/app/app.ts
import { ChangeDetectionStrategy as ChangeDetectionStrategy2, Component as Component2 } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
import { RouterOutlet } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_router.js?v=9353569b";

// src/app/shared/theme-toggle.component.ts
import { ChangeDetectionStrategy, Component, inject as inject4 } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";

// src/app/core/services/theme.service.ts
import { DOCUMENT } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_common.js?v=9353569b";
import { Injectable, computed, inject as inject3, signal } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
import * as i0 from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
var STORAGE_KEY = "academic-platform-theme";
var ThemeService = class _ThemeService {
  document = inject3(DOCUMENT);
  themeSignal = signal(this.resolveInitialTheme(), ...ngDevMode ? [{ debugName: "themeSignal" }] : (
    /* istanbul ignore next */
    []
  ));
  theme = this.themeSignal.asReadonly();
  isDark = computed(() => this.themeSignal() === "dark", ...ngDevMode ? [{ debugName: "isDark" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    this.applyTheme(this.themeSignal());
  }
  toggleTheme() {
    this.setTheme(this.themeSignal() === "dark" ? "light" : "dark");
  }
  setTheme(theme) {
    this.themeSignal.set(theme);
    this.applyTheme(theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }
  applyTheme(theme) {
    this.document.documentElement.setAttribute("data-theme", theme);
  }
  resolveInitialTheme() {
    if (typeof window === "undefined") {
      return "light";
    }
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  static \u0275fac = function ThemeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeService)();
  };
  static \u0275prov = /* @__PURE__ */ i0.\u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// src/app/shared/theme-toggle.component.ts
import * as i02 from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
var ThemeToggleComponent = class _ThemeToggleComponent {
  themeService = inject4(ThemeService);
  isDark = this.themeService.isDark;
  toggleTheme() {
    this.themeService.toggleTheme();
  }
  static \u0275fac = function ThemeToggleComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeToggleComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i02.\u0275\u0275defineComponent({ type: _ThemeToggleComponent, selectors: [["app-theme-toggle"]], decls: 9, vars: 4, consts: [["type", "button", 1, "theme-toggle", 3, "click"], ["aria-hidden", "true", 1, "theme-toggle__track"], ["viewBox", "0 0 24 24", "fill", "none", 1, "theme-toggle__icon", "theme-toggle__icon--sun"], ["cx", "12", "cy", "12", "r", "4.2", "stroke", "currentColor", "stroke-width", "1.8"], ["d", "M12 2.8V5.1M12 18.9v2.3M21.2 12h-2.3M5.1 12H2.8M18.5 5.5l-1.6 1.6M7.1 16.9l-1.6 1.6M18.5 18.5l-1.6-1.6M7.1 7.1L5.5 5.5", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round"], ["viewBox", "0 0 24 24", "fill", "none", 1, "theme-toggle__icon", "theme-toggle__icon--moon"], ["d", "M19.2 14.6A7.6 7.6 0 0 1 9.4 4.8a8.1 8.1 0 1 0 9.8 9.8Z", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linejoin", "round"], [1, "theme-toggle__thumb"], [1, "theme-toggle__glint"]], template: function ThemeToggleComponent_Template(rf, ctx) {
    if (rf & 1) {
      i02.\u0275\u0275domElementStart(0, "button", 0);
      i02.\u0275\u0275domListener("click", function ThemeToggleComponent_Template_button_click_0_listener() {
        return ctx.toggleTheme();
      });
      i02.\u0275\u0275domElementStart(1, "span", 1);
      i02.\u0275\u0275namespaceSVG();
      i02.\u0275\u0275domElementStart(2, "svg", 2);
      i02.\u0275\u0275domElement(3, "circle", 3)(4, "path", 4);
      i02.\u0275\u0275domElementEnd();
      i02.\u0275\u0275domElementStart(5, "svg", 5);
      i02.\u0275\u0275domElement(6, "path", 6);
      i02.\u0275\u0275domElementEnd();
      i02.\u0275\u0275namespaceHTML();
      i02.\u0275\u0275domElementStart(7, "span", 7);
      i02.\u0275\u0275domElement(8, "span", 8);
      i02.\u0275\u0275domElementEnd()()();
    }
    if (rf & 2) {
      i02.\u0275\u0275classProp("dark", ctx.isDark());
      i02.\u0275\u0275attribute("aria-label", ctx.isDark() ? "Activer le theme clair" : "Activer le theme fonce")("title", ctx.isDark() ? "Passer en theme clair" : "Passer en theme fonce");
    }
  }, styles: ['\n[_nghost-%COMP%] {\n  position: fixed;\n  top: 1rem;\n  right: 1rem;\n  z-index: 1000;\n}\n.theme-toggle[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  padding: 0.32rem;\n  border: 1px solid var(--theme-toggle-border);\n  border-radius: 999px;\n  background: var(--theme-toggle-bg);\n  color: var(--theme-toggle-ink);\n  font-size: 0;\n  line-height: 0;\n  appearance: none;\n  -webkit-appearance: none;\n  box-shadow: 0 16px 30px rgba(8, 15, 28, 0.14);\n  -webkit-backdrop-filter: blur(18px);\n  backdrop-filter: blur(18px);\n}\n.theme-toggle[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.28),\n      transparent 65%);\n  pointer-events: none;\n}\n.theme-toggle__track[_ngcontent-%COMP%] {\n  position: relative;\n  width: 4.9rem;\n  height: 2.72rem;\n  display: block;\n  border-radius: 999px;\n  overflow: hidden;\n  border: 1px solid var(--theme-toggle-border);\n  background:\n    radial-gradient(\n      circle at 28% 50%,\n      rgba(255, 213, 79, 0.35),\n      transparent 36%),\n    linear-gradient(\n      135deg,\n      #f4f7fc 0%,\n      #dce6f6 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 -10px 20px rgba(121, 145, 182, 0.08);\n}\n.theme-toggle__track[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  inset: 0.24rem;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.38),\n      transparent 55%),\n    transparent;\n  pointer-events: none;\n}\n.theme-toggle__icon[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  z-index: 1;\n  width: 0.98rem;\n  height: 0.98rem;\n  pointer-events: none;\n  transform: translate(-50%, -50%) scale(0.88);\n  transition:\n    opacity 0.2s ease,\n    color 0.2s ease,\n    transform 0.2s ease;\n}\n.theme-toggle__icon--sun[_ngcontent-%COMP%] {\n  left: 1.14rem;\n  color: #d79b14;\n  opacity: 0;\n}\n.theme-toggle__icon--moon[_ngcontent-%COMP%] {\n  left: calc(100% - 1.14rem);\n  color: #7283a5;\n  opacity: 0.82;\n  transform: translate(-50%, -50%) scale(1);\n}\n.theme-toggle__thumb[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.24rem;\n  left: 0.24rem;\n  z-index: 2;\n  width: 2.08rem;\n  height: 2.08rem;\n  border-radius: 50%;\n  background:\n    radial-gradient(\n      circle at 35% 32%,\n      rgba(255, 255, 255, 0.98),\n      rgba(248, 250, 255, 0.94) 48%,\n      rgba(223, 231, 245, 0.95) 100%);\n  box-shadow: 0 10px 22px rgba(88, 107, 140, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.82);\n  transition:\n    transform 0.24s ease,\n    background 0.24s ease,\n    box-shadow 0.24s ease;\n}\n.theme-toggle__glint[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.34rem;\n  left: 0.42rem;\n  width: 0.62rem;\n  height: 0.26rem;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  transform: rotate(-18deg);\n}\n.theme-toggle.dark[_ngcontent-%COMP%]   .theme-toggle__track[_ngcontent-%COMP%] {\n  background:\n    radial-gradient(\n      circle at 72% 46%,\n      rgba(123, 160, 255, 0.18),\n      transparent 34%),\n    linear-gradient(\n      135deg,\n      #121a2c 0%,\n      #24324b 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -10px 20px rgba(3, 7, 16, 0.3);\n}\n.theme-toggle.dark[_ngcontent-%COMP%]   .theme-toggle__track[_ngcontent-%COMP%]::before {\n  background:\n    radial-gradient(\n      circle at 78% 34%,\n      rgba(255, 255, 255, 0.18) 0 1px,\n      transparent 2px),\n    radial-gradient(\n      circle at 66% 62%,\n      rgba(255, 255, 255, 0.12) 0 1px,\n      transparent 2px),\n    radial-gradient(\n      circle at 84% 72%,\n      rgba(255, 255, 255, 0.14) 0 1px,\n      transparent 2px);\n}\n.theme-toggle.dark[_ngcontent-%COMP%]   .theme-toggle__icon--sun[_ngcontent-%COMP%] {\n  color: #f2c66e;\n  opacity: 0.96;\n  transform: translate(-50%, -50%) scale(1);\n}\n.theme-toggle.dark[_ngcontent-%COMP%]   .theme-toggle__icon--moon[_ngcontent-%COMP%] {\n  color: #cfd8f6;\n  opacity: 0;\n  transform: translate(-50%, -50%) scale(0.84);\n}\n.theme-toggle.dark[_ngcontent-%COMP%]   .theme-toggle__thumb[_ngcontent-%COMP%] {\n  transform: translateX(2.18rem);\n  background:\n    radial-gradient(\n      circle at 34% 30%,\n      rgba(249, 251, 255, 0.98),\n      rgba(220, 228, 244, 0.95) 54%,\n      rgba(176, 189, 220, 0.94) 100%);\n  box-shadow:\n    0 10px 24px rgba(4, 8, 18, 0.35),\n    inset -8px -10px 18px rgba(126, 142, 179, 0.16),\n    inset 0 1px 0 rgba(255, 255, 255, 0.7);\n}\n.theme-toggle[_ngcontent-%COMP%]:focus-visible {\n  outline: none;\n  box-shadow: 0 0 0 4px rgba(215, 25, 32, 0.14), 0 16px 30px rgba(8, 15, 28, 0.16);\n}\n@media (max-width: 640px) {\n  [_nghost-%COMP%] {\n    top: 0.75rem;\n    right: 0.75rem;\n  }\n  .theme-toggle__track[_ngcontent-%COMP%] {\n    width: 4.4rem;\n    height: 2.42rem;\n  }\n  .theme-toggle__thumb[_ngcontent-%COMP%] {\n    width: 1.82rem;\n    height: 1.82rem;\n  }\n  .theme-toggle.dark[_ngcontent-%COMP%]   .theme-toggle__thumb[_ngcontent-%COMP%] {\n    transform: translateX(1.9rem);\n  }\n}\n/*# sourceMappingURL=theme-toggle.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassMetadata(ThemeToggleComponent, [{
    type: Component,
    args: [{ selector: "app-theme-toggle", changeDetection: ChangeDetectionStrategy.OnPush, template: `<button
  class="theme-toggle"
  type="button"
  [class.dark]="isDark()"
  (click)="toggleTheme()"
  [attr.aria-label]="isDark() ? 'Activer le theme clair' : 'Activer le theme fonce'"
  [attr.title]="isDark() ? 'Passer en theme clair' : 'Passer en theme fonce'"
>
  <span class="theme-toggle__track" aria-hidden="true">
    <svg class="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8" />
      <path
        d="M12 2.8V5.1M12 18.9v2.3M21.2 12h-2.3M5.1 12H2.8M18.5 5.5l-1.6 1.6M7.1 16.9l-1.6 1.6M18.5 18.5l-1.6-1.6M7.1 7.1L5.5 5.5"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </svg>

    <svg class="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" fill="none">
      <path
        d="M19.2 14.6A7.6 7.6 0 0 1 9.4 4.8a8.1 8.1 0 1 0 9.8 9.8Z"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
      />
    </svg>

    <span class="theme-toggle__thumb">
      <span class="theme-toggle__glint"></span>
    </span>
  </span>
</button>
`, styles: ['/* src/app/shared/theme-toggle.component.css */\n:host {\n  position: fixed;\n  top: 1rem;\n  right: 1rem;\n  z-index: 1000;\n}\n.theme-toggle {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  padding: 0.32rem;\n  border: 1px solid var(--theme-toggle-border);\n  border-radius: 999px;\n  background: var(--theme-toggle-bg);\n  color: var(--theme-toggle-ink);\n  font-size: 0;\n  line-height: 0;\n  appearance: none;\n  -webkit-appearance: none;\n  box-shadow: 0 16px 30px rgba(8, 15, 28, 0.14);\n  -webkit-backdrop-filter: blur(18px);\n  backdrop-filter: blur(18px);\n}\n.theme-toggle::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.28),\n      transparent 65%);\n  pointer-events: none;\n}\n.theme-toggle__track {\n  position: relative;\n  width: 4.9rem;\n  height: 2.72rem;\n  display: block;\n  border-radius: 999px;\n  overflow: hidden;\n  border: 1px solid var(--theme-toggle-border);\n  background:\n    radial-gradient(\n      circle at 28% 50%,\n      rgba(255, 213, 79, 0.35),\n      transparent 36%),\n    linear-gradient(\n      135deg,\n      #f4f7fc 0%,\n      #dce6f6 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 -10px 20px rgba(121, 145, 182, 0.08);\n}\n.theme-toggle__track::before {\n  content: "";\n  position: absolute;\n  inset: 0.24rem;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.38),\n      transparent 55%),\n    transparent;\n  pointer-events: none;\n}\n.theme-toggle__icon {\n  position: absolute;\n  top: 50%;\n  z-index: 1;\n  width: 0.98rem;\n  height: 0.98rem;\n  pointer-events: none;\n  transform: translate(-50%, -50%) scale(0.88);\n  transition:\n    opacity 0.2s ease,\n    color 0.2s ease,\n    transform 0.2s ease;\n}\n.theme-toggle__icon--sun {\n  left: 1.14rem;\n  color: #d79b14;\n  opacity: 0;\n}\n.theme-toggle__icon--moon {\n  left: calc(100% - 1.14rem);\n  color: #7283a5;\n  opacity: 0.82;\n  transform: translate(-50%, -50%) scale(1);\n}\n.theme-toggle__thumb {\n  position: absolute;\n  top: 0.24rem;\n  left: 0.24rem;\n  z-index: 2;\n  width: 2.08rem;\n  height: 2.08rem;\n  border-radius: 50%;\n  background:\n    radial-gradient(\n      circle at 35% 32%,\n      rgba(255, 255, 255, 0.98),\n      rgba(248, 250, 255, 0.94) 48%,\n      rgba(223, 231, 245, 0.95) 100%);\n  box-shadow: 0 10px 22px rgba(88, 107, 140, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.82);\n  transition:\n    transform 0.24s ease,\n    background 0.24s ease,\n    box-shadow 0.24s ease;\n}\n.theme-toggle__glint {\n  position: absolute;\n  top: 0.34rem;\n  left: 0.42rem;\n  width: 0.62rem;\n  height: 0.26rem;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.82);\n  transform: rotate(-18deg);\n}\n.theme-toggle.dark .theme-toggle__track {\n  background:\n    radial-gradient(\n      circle at 72% 46%,\n      rgba(123, 160, 255, 0.18),\n      transparent 34%),\n    linear-gradient(\n      135deg,\n      #121a2c 0%,\n      #24324b 100%);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -10px 20px rgba(3, 7, 16, 0.3);\n}\n.theme-toggle.dark .theme-toggle__track::before {\n  background:\n    radial-gradient(\n      circle at 78% 34%,\n      rgba(255, 255, 255, 0.18) 0 1px,\n      transparent 2px),\n    radial-gradient(\n      circle at 66% 62%,\n      rgba(255, 255, 255, 0.12) 0 1px,\n      transparent 2px),\n    radial-gradient(\n      circle at 84% 72%,\n      rgba(255, 255, 255, 0.14) 0 1px,\n      transparent 2px);\n}\n.theme-toggle.dark .theme-toggle__icon--sun {\n  color: #f2c66e;\n  opacity: 0.96;\n  transform: translate(-50%, -50%) scale(1);\n}\n.theme-toggle.dark .theme-toggle__icon--moon {\n  color: #cfd8f6;\n  opacity: 0;\n  transform: translate(-50%, -50%) scale(0.84);\n}\n.theme-toggle.dark .theme-toggle__thumb {\n  transform: translateX(2.18rem);\n  background:\n    radial-gradient(\n      circle at 34% 30%,\n      rgba(249, 251, 255, 0.98),\n      rgba(220, 228, 244, 0.95) 54%,\n      rgba(176, 189, 220, 0.94) 100%);\n  box-shadow:\n    0 10px 24px rgba(4, 8, 18, 0.35),\n    inset -8px -10px 18px rgba(126, 142, 179, 0.16),\n    inset 0 1px 0 rgba(255, 255, 255, 0.7);\n}\n.theme-toggle:focus-visible {\n  outline: none;\n  box-shadow: 0 0 0 4px rgba(215, 25, 32, 0.14), 0 16px 30px rgba(8, 15, 28, 0.16);\n}\n@media (max-width: 640px) {\n  :host {\n    top: 0.75rem;\n    right: 0.75rem;\n  }\n  .theme-toggle__track {\n    width: 4.4rem;\n    height: 2.42rem;\n  }\n  .theme-toggle__thumb {\n    width: 1.82rem;\n    height: 1.82rem;\n  }\n  .theme-toggle.dark .theme-toggle__thumb {\n    transform: translateX(1.9rem);\n  }\n}\n/*# sourceMappingURL=theme-toggle.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassDebugInfo(ThemeToggleComponent, { className: "ThemeToggleComponent", filePath: "src/app/shared/theme-toggle.component.ts", lineNumber: 10 });
})();
(() => {
  const id = "src%2Fapp%2Fshared%2Ftheme-toggle.component.ts%40ThemeToggleComponent";
  function ThemeToggleComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i02.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i02.\u0275\u0275replaceMetadata(ThemeToggleComponent, m.default, [i02], [Component, ChangeDetectionStrategy], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && ThemeToggleComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && ThemeToggleComponent_HmrLoad(d.timestamp)));
})();

// src/app/app.ts
import * as i03 from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
var App = class _App {
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ i03.\u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 2, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      i03.\u0275\u0275element(0, "app-theme-toggle")(1, "router-outlet");
    }
  }, dependencies: [RouterOutlet, ThemeToggleComponent], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n}\n/*# sourceMappingURL=app.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassMetadata(App, [{
    type: Component2,
    args: [{ selector: "app-root", imports: [RouterOutlet, ThemeToggleComponent], changeDetection: ChangeDetectionStrategy2.OnPush, template: "<app-theme-toggle></app-theme-toggle>\n<router-outlet></router-outlet>\n", styles: ["/* src/app/app.css */\n:host {\n  display: block;\n  min-height: 100vh;\n}\n/*# sourceMappingURL=app.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 12 });
})();
(() => {
  const id = "src%2Fapp%2Fapp.ts%40App";
  function App_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i03.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i03.\u0275\u0275replaceMetadata(App, m.default, [i03], [RouterOutlet, ThemeToggleComponent, Component2, ChangeDetectionStrategy2], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && App_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && App_HmrLoad(d.timestamp)));
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tYWluLnRzIiwic3JjL2FwcC9hcHAuY29uZmlnLnRzIiwic3JjL2FwcC9jb3JlL2ludGVyY2VwdG9ycy9hdXRoLmludGVyY2VwdG9yLnRzIiwic3JjL2FwcC9jb3JlL2d1YXJkcy9hdXRoLmd1YXJkLnRzIiwic3JjL2FwcC9hcHAucm91dGVzLnRzIiwic3JjL2FwcC9hcHAudHMiLCJzcmMvYXBwL2FwcC5odG1sIiwic3JjL2FwcC9zaGFyZWQvdGhlbWUtdG9nZ2xlLmNvbXBvbmVudC50cyIsInNyYy9hcHAvc2hhcmVkL3RoZW1lLXRvZ2dsZS5jb21wb25lbnQuaHRtbCIsInNyYy9hcHAvY29yZS9zZXJ2aWNlcy90aGVtZS5zZXJ2aWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJvb3RzdHJhcEFwcGxpY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IGFwcENvbmZpZyB9IGZyb20gJy4vYXBwL2FwcC5jb25maWcnO1xyXG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuL2FwcC9hcHAnO1xyXG5cclxuYm9vdHN0cmFwQXBwbGljYXRpb24oQXBwLCBhcHBDb25maWcpXHJcbiAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XHJcbiIsImltcG9ydCB7IHByb3ZpZGVIdHRwQ2xpZW50LCB3aXRoSW50ZXJjZXB0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db25maWcsIHByb3ZpZGVCcm93c2VyR2xvYmFsRXJyb3JMaXN0ZW5lcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHByb3ZpZGVSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBhdXRoSW50ZXJjZXB0b3IgfSBmcm9tICcuL2NvcmUvaW50ZXJjZXB0b3JzL2F1dGguaW50ZXJjZXB0b3InO1xuaW1wb3J0IHsgcm91dGVzIH0gZnJvbSAnLi9hcHAucm91dGVzJztcblxuZXhwb3J0IGNvbnN0IGFwcENvbmZpZzogQXBwbGljYXRpb25Db25maWcgPSB7XG4gIHByb3ZpZGVyczogW1xuICAgIHByb3ZpZGVCcm93c2VyR2xvYmFsRXJyb3JMaXN0ZW5lcnMoKSxcbiAgICBwcm92aWRlUm91dGVyKHJvdXRlcyksXG4gICAgcHJvdmlkZUh0dHBDbGllbnQod2l0aEludGVyY2VwdG9ycyhbYXV0aEludGVyY2VwdG9yXSkpXG4gIF1cbn07XG4iLCJpbXBvcnQgeyBIdHRwRXJyb3JSZXNwb25zZSwgSHR0cEludGVyY2VwdG9yRm4gfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvYXV0aC5zZXJ2aWNlJztcblxuY29uc3QgaXNMb2dpbkZsb3dSZXF1ZXN0ID0gKHVybDogc3RyaW5nKSA9PlxuICB1cmwuaW5jbHVkZXMoJy9hcGkvYXV0aC9sb2dpbicpIHx8XG4gIHVybC5pbmNsdWRlcygnL2FwaS9hdXRoL3Bhc3N3b3JkLXJlc2V0JykgfHxcbiAgdXJsLmluY2x1ZGVzKCcvYXBpL2F1dGgvcGFzc2tleXMvbG9naW4nKSB8fFxuICB1cmwuaW5jbHVkZXMoJy9hcGkvYXV0aC9mYWNlLXJlY29nbml0aW9uL2xvZ2luJyk7XG5cbmV4cG9ydCBjb25zdCBhdXRoSW50ZXJjZXB0b3I6IEh0dHBJbnRlcmNlcHRvckZuID0gKHJlcXVlc3QsIG5leHQpID0+IHtcbiAgY29uc3QgYXV0aFNlcnZpY2UgPSBpbmplY3QoQXV0aFNlcnZpY2UpO1xuICBjb25zdCB0b2tlbiA9IGF1dGhTZXJ2aWNlLnRva2VuKCk7XG4gIGNvbnN0IHJlcXVlc3RXaXRoQXV0aCA9IHRva2VuXG4gICAgPyByZXF1ZXN0LmNsb25lKHtcbiAgICAgICAgc2V0SGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgOiByZXF1ZXN0O1xuXG4gIHJldHVybiBuZXh0KHJlcXVlc3RXaXRoQXV0aCkucGlwZShcbiAgICBjYXRjaEVycm9yKChlcnJvcjogdW5rbm93bikgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBlcnJvciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlICYmXG4gICAgICAgIGVycm9yLnN0YXR1cyA9PT0gNDAxICYmXG4gICAgICAgIGF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpICYmXG4gICAgICAgICFpc0xvZ2luRmxvd1JlcXVlc3QocmVxdWVzdC51cmwpXG4gICAgICApIHtcbiAgICAgICAgYXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKCgpID0+IGVycm9yKTtcbiAgICB9KVxuICApO1xufTtcbiIsImltcG9ydCB7IGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FuQWN0aXZhdGVGbiwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFJvbGVUeXBlIH0gZnJvbSAnLi4vbW9kZWxzL3NoYXJlZC5tb2RlbHMnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgYXV0aEd1YXJkOiBDYW5BY3RpdmF0ZUZuID0gKCkgPT4ge1xuICBjb25zdCBhdXRoU2VydmljZSA9IGluamVjdChBdXRoU2VydmljZSk7XG4gIGNvbnN0IHJvdXRlciA9IGluamVjdChSb3V0ZXIpO1xuICByZXR1cm4gYXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkgPyB0cnVlIDogcm91dGVyLmNyZWF0ZVVybFRyZWUoWycvbG9naW4nXSk7XG59O1xuXG5leHBvcnQgY29uc3Qgcm9sZUd1YXJkOiBDYW5BY3RpdmF0ZUZuID0gKHJvdXRlKSA9PiB7XG4gIGNvbnN0IGF1dGhTZXJ2aWNlID0gaW5qZWN0KEF1dGhTZXJ2aWNlKTtcbiAgY29uc3Qgcm91dGVyID0gaW5qZWN0KFJvdXRlcik7XG5cbiAgaWYgKCFhdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgIHJldHVybiByb3V0ZXIuY3JlYXRlVXJsVHJlZShbJy9sb2dpbiddKTtcbiAgfVxuXG4gIGNvbnN0IGFsbG93ZWRSb2xlcyA9IHJvdXRlLmRhdGFbJ3JvbGVzJ10gYXMgUm9sZVR5cGVbXSB8IHVuZGVmaW5lZDtcbiAgaWYgKCFhbGxvd2VkUm9sZXM/Lmxlbmd0aCB8fCBhdXRoU2VydmljZS5oYXNBbnlSb2xlKC4uLmFsbG93ZWRSb2xlcykpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiByb3V0ZXIucGFyc2VVcmwoYXV0aFNlcnZpY2UuZGVmYXVsdFJvdXRlKCkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGd1ZXN0R3VhcmQ6IENhbkFjdGl2YXRlRm4gPSAoKSA9PiB7XG4gIGNvbnN0IGF1dGhTZXJ2aWNlID0gaW5qZWN0KEF1dGhTZXJ2aWNlKTtcbiAgY29uc3Qgcm91dGVyID0gaW5qZWN0KFJvdXRlcik7XG4gIHJldHVybiBhdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSA/IHJvdXRlci5wYXJzZVVybChhdXRoU2VydmljZS5kZWZhdWx0Um91dGUoKSkgOiB0cnVlO1xufTtcbiIsImltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBhdXRoR3VhcmQsIGd1ZXN0R3VhcmQsIHJvbGVHdWFyZCB9IGZyb20gJy4vY29yZS9ndWFyZHMvYXV0aC5ndWFyZCc7XG5pbXBvcnQgeyBSb2xlVHlwZSB9IGZyb20gJy4vY29yZS9tb2RlbHMvc2hhcmVkLm1vZGVscyc7XG5cbmNvbnN0IGFjdGl2aXR5Um9sZXM6IFJvbGVUeXBlW10gPSBbJ0VOU0VJR05BTlQnLCAnQ0hFRl9ERVBBUlRFTUVOVCddO1xuY29uc3QgYWN0aXZpdHlDcmVhdGVSb2xlczogUm9sZVR5cGVbXSA9IFsnRU5TRUlHTkFOVCddO1xuY29uc3QgcmVzcG9uc2liaWxpdHlSb2xlczogUm9sZVR5cGVbXSA9IFsnRU5TRUlHTkFOVCcsICdDSEVGX0RFUEFSVEVNRU5UJ107XG5jb25zdCByZXNwb25zaWJpbGl0eUNyZWF0ZVJvbGVzOiBSb2xlVHlwZVtdID0gWydFTlNFSUdOQU5UJywgJ0NIRUZfREVQQVJURU1FTlQnXTtcbmNvbnN0IHRlYWNoZXJPbmx5Um9sZXM6IFJvbGVUeXBlW10gPSBbJ0VOU0VJR05BTlQnXTtcbmNvbnN0IGRhc2hib2FyZFJvbGVzOiBSb2xlVHlwZVtdID0gWydFTlNFSUdOQU5UJywgJ0NIRUZfREVQQVJURU1FTlQnLCAnQURNSU5JU1RSQVRJT04nXTtcbmNvbnN0IG1hbmFnZW1lbnRSb2xlczogUm9sZVR5cGVbXSA9IFsnU1VQRVJfQURNSU4nXTtcbmNvbnN0IHByb2ZpbGVSb2xlczogUm9sZVR5cGVbXSA9IFsnRU5TRUlHTkFOVCcsICdDSEVGX0RFUEFSVEVNRU5UJywgJ0FETUlOSVNUUkFUSU9OJywgJ1NVUEVSX0FETUlOJ107XG5jb25zdCByZXBvcnRzUm9sZXM6IFJvbGVUeXBlW10gPSBbJ0VOU0VJR05BTlQnLCAnQ0hFRl9ERVBBUlRFTUVOVCcsICdBRE1JTklTVFJBVElPTiddO1xuY29uc3Qgd29ya2Zsb3dSb2xlczogUm9sZVR5cGVbXSA9IFsnQ0hFRl9ERVBBUlRFTUVOVCcsICdBRE1JTklTVFJBVElPTiddO1xuXG5leHBvcnQgY29uc3Qgcm91dGVzOiBSb3V0ZXMgPSBbXG4gIHtcbiAgICBwYXRoOiAnJyxcbiAgICBwYXRoTWF0Y2g6ICdmdWxsJyxcbiAgICByZWRpcmVjdFRvOiAnbG9naW4nXG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnbG9naW4nLFxuICAgIGNhbkFjdGl2YXRlOiBbZ3Vlc3RHdWFyZF0sXG4gICAgbG9hZENvbXBvbmVudDogKCkgPT4gaW1wb3J0KCcuL2ZlYXR1cmVzL2F1dGgvbG9naW4tcGFnZS5jb21wb25lbnQnKS50aGVuKChtKSA9PiBtLkxvZ2luUGFnZUNvbXBvbmVudClcbiAgfSxcbiAge1xuICAgIHBhdGg6ICdzaWdudXAnLFxuICAgIHBhdGhNYXRjaDogJ2Z1bGwnLFxuICAgIHJlZGlyZWN0VG86ICdsb2dpbidcbiAgfSxcbiAge1xuICAgIHBhdGg6ICdmb3Jnb3QtcGFzc3dvcmQnLFxuICAgIGNhbkFjdGl2YXRlOiBbZ3Vlc3RHdWFyZF0sXG4gICAgbG9hZENvbXBvbmVudDogKCkgPT5cbiAgICAgIGltcG9ydCgnLi9mZWF0dXJlcy9hdXRoL2ZvcmdvdC1wYXNzd29yZC1wYWdlLmNvbXBvbmVudCcpLnRoZW4oKG0pID0+IG0uRm9yZ290UGFzc3dvcmRQYWdlQ29tcG9uZW50KVxuICB9LFxuICB7XG4gICAgcGF0aDogJycsXG4gICAgY2FuQWN0aXZhdGU6IFthdXRoR3VhcmRdLFxuICAgIGxvYWRDb21wb25lbnQ6ICgpID0+IGltcG9ydCgnLi9sYXlvdXQvYXBwLXNoZWxsLmNvbXBvbmVudCcpLnRoZW4oKG0pID0+IG0uQXBwU2hlbGxDb21wb25lbnQpLFxuICAgIGNoaWxkcmVuOiBbXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdkYXNoYm9hcmQnLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW3JvbGVHdWFyZF0sXG4gICAgICAgIGRhdGE6IHsgcm9sZXM6IGRhc2hib2FyZFJvbGVzIH0sXG4gICAgICAgIGxvYWRDb21wb25lbnQ6ICgpID0+IGltcG9ydCgnLi9mZWF0dXJlcy9kYXNoYm9hcmQvZGFzaGJvYXJkLXBhZ2UuY29tcG9uZW50JykudGhlbigobSkgPT4gbS5EYXNoYm9hcmRQYWdlQ29tcG9uZW50KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3Byb2ZpbGUnLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW3JvbGVHdWFyZF0sXG4gICAgICAgIGRhdGE6IHsgcm9sZXM6IHByb2ZpbGVSb2xlcyB9LFxuICAgICAgICBsb2FkQ29tcG9uZW50OiAoKSA9PiBpbXBvcnQoJy4vZmVhdHVyZXMvcHJvZmlsZS9wcm9maWxlLXBhZ2UuY29tcG9uZW50JykudGhlbigobSkgPT4gbS5Qcm9maWxlUGFnZUNvbXBvbmVudClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdhdmFpbGFiaWxpdHkvbGVhdmUnLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW3JvbGVHdWFyZF0sXG4gICAgICAgIGRhdGE6IHsgcm9sZXM6IHRlYWNoZXJPbmx5Um9sZXMsIHJlcXVlc3RUeXBlOiAnQ09OR0UnIH0sXG4gICAgICAgIGxvYWRDb21wb25lbnQ6ICgpID0+XG4gICAgICAgICAgaW1wb3J0KCcuL2ZlYXR1cmVzL2F2YWlsYWJpbGl0eS9hdmFpbGFiaWxpdHktcmVxdWVzdC1wYWdlLmNvbXBvbmVudCcpLnRoZW4oKG0pID0+IG0uQXZhaWxhYmlsaXR5UmVxdWVzdFBhZ2VDb21wb25lbnQpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAnYXZhaWxhYmlsaXR5L21pc3Npb24nLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW3JvbGVHdWFyZF0sXG4gICAgICAgIGRhdGE6IHsgcm9sZXM6IHRlYWNoZXJPbmx5Um9sZXMsIHJlcXVlc3RUeXBlOiAnTUlTU0lPTicgfSxcbiAgICAgICAgbG9hZENvbXBvbmVudDogKCkgPT5cbiAgICAgICAgICBpbXBvcnQoJy4vZmVhdHVyZXMvYXZhaWxhYmlsaXR5L2F2YWlsYWJpbGl0eS1yZXF1ZXN0LXBhZ2UuY29tcG9uZW50JykudGhlbigobSkgPT4gbS5BdmFpbGFiaWxpdHlSZXF1ZXN0UGFnZUNvbXBvbmVudClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICd1c2VycycsXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbcm9sZUd1YXJkXSxcbiAgICAgICAgZGF0YTogeyByb2xlczogbWFuYWdlbWVudFJvbGVzIH0sXG4gICAgICAgIGxvYWRDb21wb25lbnQ6ICgpID0+IGltcG9ydCgnLi9mZWF0dXJlcy91c2Vycy91c2Vycy1wYWdlLmNvbXBvbmVudCcpLnRoZW4oKG0pID0+IG0uVXNlcnNQYWdlQ29tcG9uZW50KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3RlYWNoaW5nL25ldycsXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbcm9sZUd1YXJkXSxcbiAgICAgICAgZGF0YTogeyByb2xlczogYWN0aXZpdHlDcmVhdGVSb2xlcywgbW9kZTogJ2NyZWF0ZScgfSxcbiAgICAgICAgbG9hZENvbXBvbmVudDogKCkgPT4gaW1wb3J0KCcuL2ZlYXR1cmVzL3RlYWNoaW5nL3RlYWNoaW5nLXBhZ2UuY29tcG9uZW50JykudGhlbigobSkgPT4gbS5UZWFjaGluZ1BhZ2VDb21wb25lbnQpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAncGFydG5lcnNoaXBzL25ldycsXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbcm9sZUd1YXJkXSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJvbGVzOiBhY3Rpdml0eUNyZWF0ZVJvbGVzLFxuICAgICAgICAgIG1vZGU6ICdjcmVhdGUnLFxuICAgICAgICAgIGZvcmNlZEFjdGl2aXR5VHlwZTogJ1BBUlRFTkFSSUFUJyxcbiAgICAgICAgICBjcmVhdGVQYXRoOiAnL3BhcnRuZXJzaGlwcy9uZXcnLFxuICAgICAgICAgIGxpc3RQYXRoOiAnL3BhcnRuZXJzaGlwcydcbiAgICAgICAgfSxcbiAgICAgICAgbG9hZENvbXBvbmVudDogKCkgPT4gaW1wb3J0KCcuL2ZlYXR1cmVzL3RlYWNoaW5nL3RlYWNoaW5nLXBhZ2UuY29tcG9uZW50JykudGhlbigobSkgPT4gbS5UZWFjaGluZ1BhZ2VDb21wb25lbnQpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAncGFydG5lcnNoaXBzJyxcbiAgICAgICAgY2FuQWN0aXZhdGU6IFtyb2xlR3VhcmRdLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcm9sZXM6IGFjdGl2aXR5Um9sZXMsXG4gICAgICAgICAgbW9kZTogJ2xpc3QnLFxuICAgICAgICAgIGZvcmNlZEFjdGl2aXR5VHlwZTogJ1BBUlRFTkFSSUFUJyxcbiAgICAgICAgICBhY3Rpdml0eUxpc3RGaWx0ZXJUeXBlOiAnUEFSVEVOQVJJQVQnLFxuICAgICAgICAgIGNyZWF0ZVBhdGg6ICcvcGFydG5lcnNoaXBzL25ldycsXG4gICAgICAgICAgbGlzdFBhdGg6ICcvcGFydG5lcnNoaXBzJ1xuICAgICAgICB9LFxuICAgICAgICBsb2FkQ29tcG9uZW50OiAoKSA9PiBpbXBvcnQoJy4vZmVhdHVyZXMvdGVhY2hpbmcvdGVhY2hpbmctcGFnZS5jb21wb25lbnQnKS50aGVuKChtKSA9PiBtLlRlYWNoaW5nUGFnZUNvbXBvbmVudClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICd0ZWFjaGluZycsXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbcm9sZUd1YXJkXSxcbiAgICAgICAgZGF0YTogeyByb2xlczogYWN0aXZpdHlSb2xlcywgbW9kZTogJ2xpc3QnIH0sXG4gICAgICAgIGxvYWRDb21wb25lbnQ6ICgpID0+IGltcG9ydCgnLi9mZWF0dXJlcy90ZWFjaGluZy90ZWFjaGluZy1wYWdlLmNvbXBvbmVudCcpLnRoZW4oKG0pID0+IG0uVGVhY2hpbmdQYWdlQ29tcG9uZW50KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3N1cGVydmlzaW9uL25ldycsXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbcm9sZUd1YXJkXSxcbiAgICAgICAgZGF0YTogeyByb2xlczogYWN0aXZpdHlDcmVhdGVSb2xlcywgbW9kZTogJ2NyZWF0ZScgfSxcbiAgICAgICAgbG9hZENvbXBvbmVudDogKCkgPT5cbiAgICAgICAgICBpbXBvcnQoJy4vZmVhdHVyZXMvc3VwZXJ2aXNpb24vc3VwZXJ2aXNpb24tcGFnZS5jb21wb25lbnQnKS50aGVuKChtKSA9PiBtLlN1cGVydmlzaW9uUGFnZUNvbXBvbmVudClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdzdXBlcnZpc2lvbicsXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbcm9sZUd1YXJkXSxcbiAgICAgICAgZGF0YTogeyByb2xlczogYWN0aXZpdHlSb2xlcywgbW9kZTogJ2xpc3QnIH0sXG4gICAgICAgIGxvYWRDb21wb25lbnQ6ICgpID0+XG4gICAgICAgICAgaW1wb3J0KCcuL2ZlYXR1cmVzL3N1cGVydmlzaW9uL3N1cGVydmlzaW9uLXBhZ2UuY29tcG9uZW50JykudGhlbigobSkgPT4gbS5TdXBlcnZpc2lvblBhZ2VDb21wb25lbnQpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAncmVzZWFyY2gvbmV3JyxcbiAgICAgICAgY2FuQWN0aXZhdGU6IFtyb2xlR3VhcmRdLFxuICAgICAgICBkYXRhOiB7IHJvbGVzOiBhY3Rpdml0eUNyZWF0ZVJvbGVzLCBtb2RlOiAnY3JlYXRlJyB9LFxuICAgICAgICBsb2FkQ29tcG9uZW50OiAoKSA9PlxuICAgICAgICAgIGltcG9ydCgnLi9mZWF0dXJlcy9yZXNlYXJjaC9yZXNlYXJjaC1wYWdlLmNvbXBvbmVudCcpLnRoZW4oKG0pID0+IG0uUmVzZWFyY2hQYWdlQ29tcG9uZW50KVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3Jlc2VhcmNoJyxcbiAgICAgICAgY2FuQWN0aXZhdGU6IFtyb2xlR3VhcmRdLFxuICAgICAgICBkYXRhOiB7IHJvbGVzOiBhY3Rpdml0eVJvbGVzLCBtb2RlOiAnbGlzdCcgfSxcbiAgICAgICAgbG9hZENvbXBvbmVudDogKCkgPT5cbiAgICAgICAgICBpbXBvcnQoJy4vZmVhdHVyZXMvcmVzZWFyY2gvcmVzZWFyY2gtcGFnZS5jb21wb25lbnQnKS50aGVuKChtKSA9PiBtLlJlc2VhcmNoUGFnZUNvbXBvbmVudClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdldmVudHMvbmV3JyxcbiAgICAgICAgY2FuQWN0aXZhdGU6IFtyb2xlR3VhcmRdLFxuICAgICAgICBkYXRhOiB7IHJvbGVzOiBhY3Rpdml0eUNyZWF0ZVJvbGVzLCBtb2RlOiAnY3JlYXRlJyB9LFxuICAgICAgICBsb2FkQ29tcG9uZW50OiAoKSA9PiBpbXBvcnQoJy4vZmVhdHVyZXMvZXZlbnRzL2V2ZW50cy1wYWdlLmNvbXBvbmVudCcpLnRoZW4oKG0pID0+IG0uRXZlbnRzUGFnZUNvbXBvbmVudClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdldmVudHMnLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW3JvbGVHdWFyZF0sXG4gICAgICAgIGRhdGE6IHsgcm9sZXM6IGFjdGl2aXR5Um9sZXMsIG1vZGU6ICdsaXN0JyB9LFxuICAgICAgICBsb2FkQ29tcG9uZW50OiAoKSA9PiBpbXBvcnQoJy4vZmVhdHVyZXMvZXZlbnRzL2V2ZW50cy1wYWdlLmNvbXBvbmVudCcpLnRoZW4oKG0pID0+IG0uRXZlbnRzUGFnZUNvbXBvbmVudClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdleGFtLXN1cnZlaWxsYW5jZS9uZXcnLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW3JvbGVHdWFyZF0sXG4gICAgICAgIGRhdGE6IHsgcm9sZXM6IGFjdGl2aXR5Q3JlYXRlUm9sZXMsIG1vZGU6ICdjcmVhdGUnIH0sXG4gICAgICAgIGxvYWRDb21wb25lbnQ6ICgpID0+XG4gICAgICAgICAgaW1wb3J0KCcuL2ZlYXR1cmVzL2V4YW0tc3VydmVpbGxhbmNlL2V4YW0tc3VydmVpbGxhbmNlLXBhZ2UuY29tcG9uZW50JykudGhlbihcbiAgICAgICAgICAgIChtKSA9PiBtLkV4YW1TdXJ2ZWlsbGFuY2VQYWdlQ29tcG9uZW50XG4gICAgICAgICAgKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ2V4YW0tc3VydmVpbGxhbmNlJyxcbiAgICAgICAgY2FuQWN0aXZhdGU6IFtyb2xlR3VhcmRdLFxuICAgICAgICBkYXRhOiB7IHJvbGVzOiBhY3Rpdml0eVJvbGVzLCBtb2RlOiAnbGlzdCcgfSxcbiAgICAgICAgbG9hZENvbXBvbmVudDogKCkgPT5cbiAgICAgICAgICBpbXBvcnQoJy4vZmVhdHVyZXMvZXhhbS1zdXJ2ZWlsbGFuY2UvZXhhbS1zdXJ2ZWlsbGFuY2UtcGFnZS5jb21wb25lbnQnKS50aGVuKFxuICAgICAgICAgICAgKG0pID0+IG0uRXhhbVN1cnZlaWxsYW5jZVBhZ2VDb21wb25lbnRcbiAgICAgICAgICApXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwYXRoOiAncmVzcG9uc2liaWxpdGllcy9uZXcnLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW3JvbGVHdWFyZF0sXG4gICAgICAgIGRhdGE6IHsgcm9sZXM6IHJlc3BvbnNpYmlsaXR5Q3JlYXRlUm9sZXMsIG1vZGU6ICdjcmVhdGUnIH0sXG4gICAgICAgIGxvYWRDb21wb25lbnQ6ICgpID0+XG4gICAgICAgICAgaW1wb3J0KCcuL2ZlYXR1cmVzL3Jlc3BvbnNpYmlsaXRpZXMvcmVzcG9uc2liaWxpdGllcy1wYWdlLmNvbXBvbmVudCcpLnRoZW4oXG4gICAgICAgICAgICAobSkgPT4gbS5SZXNwb25zaWJpbGl0aWVzUGFnZUNvbXBvbmVudFxuICAgICAgICAgIClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICdyZXNwb25zaWJpbGl0aWVzJyxcbiAgICAgICAgY2FuQWN0aXZhdGU6IFtyb2xlR3VhcmRdLFxuICAgICAgICBkYXRhOiB7IHJvbGVzOiByZXNwb25zaWJpbGl0eVJvbGVzLCBtb2RlOiAnbGlzdCcgfSxcbiAgICAgICAgbG9hZENvbXBvbmVudDogKCkgPT5cbiAgICAgICAgICBpbXBvcnQoJy4vZmVhdHVyZXMvcmVzcG9uc2liaWxpdGllcy9yZXNwb25zaWJpbGl0aWVzLXBhZ2UuY29tcG9uZW50JykudGhlbihcbiAgICAgICAgICAgIChtKSA9PiBtLlJlc3BvbnNpYmlsaXRpZXNQYWdlQ29tcG9uZW50XG4gICAgICAgICAgKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJ3JlcG9ydHMnLFxuICAgICAgICBjYW5BY3RpdmF0ZTogW3JvbGVHdWFyZF0sXG4gICAgICAgIGRhdGE6IHsgcm9sZXM6IHJlcG9ydHNSb2xlcyB9LFxuICAgICAgICBsb2FkQ29tcG9uZW50OiAoKSA9PiBpbXBvcnQoJy4vZmVhdHVyZXMvcmVwb3J0cy9yZXBvcnRzLXBhZ2UuY29tcG9uZW50JykudGhlbigobSkgPT4gbS5SZXBvcnRzUGFnZUNvbXBvbmVudClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICd3b3JrZmxvdycsXG4gICAgICAgIGNhbkFjdGl2YXRlOiBbcm9sZUd1YXJkXSxcbiAgICAgICAgZGF0YTogeyByb2xlczogd29ya2Zsb3dSb2xlcyB9LFxuICAgICAgICBsb2FkQ29tcG9uZW50OiAoKSA9PiBpbXBvcnQoJy4vZmVhdHVyZXMvd29ya2Zsb3cvd29ya2Zsb3ctcGFnZS5jb21wb25lbnQnKS50aGVuKChtKSA9PiBtLldvcmtmbG93UGFnZUNvbXBvbmVudClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICcnLFxuICAgICAgICBwYXRoTWF0Y2g6ICdmdWxsJyxcbiAgICAgICAgcmVkaXJlY3RUbzogJ2Rhc2hib2FyZCdcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBwYXRoOiAnKionLFxuICAgIHJlZGlyZWN0VG86ICdsb2dpbidcbiAgfVxuXTtcbiIsImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlck91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBUaGVtZVRvZ2dsZUNvbXBvbmVudCB9IGZyb20gJy4vc2hhcmVkL3RoZW1lLXRvZ2dsZS5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtcm9vdCcsXG4gIGltcG9ydHM6IFtSb3V0ZXJPdXRsZXQsIFRoZW1lVG9nZ2xlQ29tcG9uZW50XSxcbiAgdGVtcGxhdGVVcmw6ICcuL2FwcC5odG1sJyxcbiAgc3R5bGVVcmw6ICcuL2FwcC5jc3MnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBBcHAge31cbiIsIjxhcHAtdGhlbWUtdG9nZ2xlPjwvYXBwLXRoZW1lLXRvZ2dsZT5cbjxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5cbiIsImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGhlbWVTZXJ2aWNlIH0gZnJvbSAnLi4vY29yZS9zZXJ2aWNlcy90aGVtZS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXRoZW1lLXRvZ2dsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi90aGVtZS10b2dnbGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybDogJy4vdGhlbWUtdG9nZ2xlLmNvbXBvbmVudC5jc3MnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBUaGVtZVRvZ2dsZUNvbXBvbmVudCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgdGhlbWVTZXJ2aWNlID0gaW5qZWN0KFRoZW1lU2VydmljZSk7XG5cbiAgcmVhZG9ubHkgaXNEYXJrID0gdGhpcy50aGVtZVNlcnZpY2UuaXNEYXJrO1xuXG4gIHRvZ2dsZVRoZW1lKCkge1xuICAgIHRoaXMudGhlbWVTZXJ2aWNlLnRvZ2dsZVRoZW1lKCk7XG4gIH1cbn1cbiIsIjxidXR0b25cbiAgY2xhc3M9XCJ0aGVtZS10b2dnbGVcIlxuICB0eXBlPVwiYnV0dG9uXCJcbiAgW2NsYXNzLmRhcmtdPVwiaXNEYXJrKClcIlxuICAoY2xpY2spPVwidG9nZ2xlVGhlbWUoKVwiXG4gIFthdHRyLmFyaWEtbGFiZWxdPVwiaXNEYXJrKCkgPyAnQWN0aXZlciBsZSB0aGVtZSBjbGFpcicgOiAnQWN0aXZlciBsZSB0aGVtZSBmb25jZSdcIlxuICBbYXR0ci50aXRsZV09XCJpc0RhcmsoKSA/ICdQYXNzZXIgZW4gdGhlbWUgY2xhaXInIDogJ1Bhc3NlciBlbiB0aGVtZSBmb25jZSdcIlxuPlxuICA8c3BhbiBjbGFzcz1cInRoZW1lLXRvZ2dsZV9fdHJhY2tcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICA8c3ZnIGNsYXNzPVwidGhlbWUtdG9nZ2xlX19pY29uIHRoZW1lLXRvZ2dsZV9faWNvbi0tc3VuXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCI+XG4gICAgICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjQuMlwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjEuOFwiIC8+XG4gICAgICA8cGF0aFxuICAgICAgICBkPVwiTTEyIDIuOFY1LjFNMTIgMTguOXYyLjNNMjEuMiAxMmgtMi4zTTUuMSAxMkgyLjhNMTguNSA1LjVsLTEuNiAxLjZNNy4xIDE2LjlsLTEuNiAxLjZNMTguNSAxOC41bC0xLjYtMS42TTcuMSA3LjFMNS41IDUuNVwiXG4gICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgIHN0cm9rZS13aWR0aD1cIjEuOFwiXG4gICAgICAgIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIlxuICAgICAgLz5cbiAgICA8L3N2Zz5cblxuICAgIDxzdmcgY2xhc3M9XCJ0aGVtZS10b2dnbGVfX2ljb24gdGhlbWUtdG9nZ2xlX19pY29uLS1tb29uXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCI+XG4gICAgICA8cGF0aFxuICAgICAgICBkPVwiTTE5LjIgMTQuNkE3LjYgNy42IDAgMCAxIDkuNCA0LjhhOC4xIDguMSAwIDEgMCA5LjggOS44WlwiXG4gICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgIHN0cm9rZS13aWR0aD1cIjEuOFwiXG4gICAgICAgIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCJcbiAgICAgIC8+XG4gICAgPC9zdmc+XG5cbiAgICA8c3BhbiBjbGFzcz1cInRoZW1lLXRvZ2dsZV9fdGh1bWJcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwidGhlbWUtdG9nZ2xlX19nbGludFwiPjwvc3Bhbj5cbiAgICA8L3NwYW4+XG4gIDwvc3Bhbj5cbjwvYnV0dG9uPlxuIiwiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgY29tcHV0ZWQsIGluamVjdCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbnR5cGUgVGhlbWVNb2RlID0gJ2xpZ2h0JyB8ICdkYXJrJztcblxuY29uc3QgU1RPUkFHRV9LRVkgPSAnYWNhZGVtaWMtcGxhdGZvcm0tdGhlbWUnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFRoZW1lU2VydmljZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuICBwcml2YXRlIHJlYWRvbmx5IHRoZW1lU2lnbmFsID0gc2lnbmFsPFRoZW1lTW9kZT4odGhpcy5yZXNvbHZlSW5pdGlhbFRoZW1lKCkpO1xuXG4gIHJlYWRvbmx5IHRoZW1lID0gdGhpcy50aGVtZVNpZ25hbC5hc1JlYWRvbmx5KCk7XG4gIHJlYWRvbmx5IGlzRGFyayA9IGNvbXB1dGVkKCgpID0+IHRoaXMudGhlbWVTaWduYWwoKSA9PT0gJ2RhcmsnKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFwcGx5VGhlbWUodGhpcy50aGVtZVNpZ25hbCgpKTtcbiAgfVxuXG4gIHRvZ2dsZVRoZW1lKCkge1xuICAgIHRoaXMuc2V0VGhlbWUodGhpcy50aGVtZVNpZ25hbCgpID09PSAnZGFyaycgPyAnbGlnaHQnIDogJ2RhcmsnKTtcbiAgfVxuXG4gIHNldFRoZW1lKHRoZW1lOiBUaGVtZU1vZGUpIHtcbiAgICB0aGlzLnRoZW1lU2lnbmFsLnNldCh0aGVtZSk7XG4gICAgdGhpcy5hcHBseVRoZW1lKHRoZW1lKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZLCB0aGVtZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhcHBseVRoZW1lKHRoZW1lOiBUaGVtZU1vZGUpIHtcbiAgICB0aGlzLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCB0aGVtZSk7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVJbml0aWFsVGhlbWUoKTogVGhlbWVNb2RlIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiAnbGlnaHQnO1xuICAgIH1cblxuICAgIGNvbnN0IHN0b3JlZFRoZW1lID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfS0VZKTtcbiAgICBpZiAoc3RvcmVkVGhlbWUgPT09ICdsaWdodCcgfHwgc3RvcmVkVGhlbWUgPT09ICdkYXJrJykge1xuICAgICAgcmV0dXJuIHN0b3JlZFRoZW1lO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXMgPyAnZGFyaycgOiAnbGlnaHQnO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsU0FBUyw0QkFBNEI7OztBQ0FyQyxTQUFTLG1CQUFtQix3QkFBd0I7QUFDcEQsU0FBNEIsMENBQTBDO0FBQ3RFLFNBQVMscUJBQXFCOzs7QUNGOUIsU0FBUyx5QkFBNEM7QUFDckQsU0FBUyxjQUFjO0FBQ3ZCLFNB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QSxFQUFBLENBQUE7RUFBQTtBQUFBLEdBQUEsT0FBQSxjQUFBLGVBQUEsY0FBQSw2QkFBQSxLQUFBLElBQUEsQ0FBQTtBQUFBLEdBQUEsT0FBQSxjQUFBLGVBQUEsZUFBQSxZQUFBLE9BQUEsWUFBQSxJQUFBLEdBQUEsNEJBQUEsT0FBQSxFQUFBLE9BQUEsTUFBQSw2QkFBQSxFQUFBLFNBQUEsQ0FBQTtBQUFBLEdBQUE7Ozs7QUZFM0IsSUFBTyxNQUFQLE1BQU8sS0FBRzs7cUNBQUgsTUFBRztFQUFBOzZFQUFILE1BQUcsV0FBQSxDQUFBLENBQUEsVUFBQSxDQUFBLEdBQUEsT0FBQSxHQUFBLE1BQUEsR0FBQSxVQUFBLFNBQUEsYUFBQSxJQUFBLEtBQUE7QUFBQSxRQUFBLEtBQUEsR0FBQTtBQ1hoQixNQUFBLHdCQUFBLEdBQUEsa0JBQUEsRUFBcUMsR0FBQSxlQUFBOztvQkRNekIsY0FBYyxvQkFBb0IsR0FBQSxRQUFBLENBQUEsdUdBQUEsR0FBQSxpQkFBQSxFQUFBLENBQUE7OztnRkFLakMsS0FBRyxDQUFBO1VBUGZDO3VCQUNXLFlBQVUsU0FDWCxDQUFDLGNBQWMsb0JBQW9CLEdBQUMsaUJBRzVCQyx5QkFBd0IsUUFBTSxVQUFBLDRFQUFBLFFBQUEsQ0FBQSxtSEFBQSxFQUFBLENBQUE7Ozs7aUZBRXBDLEtBQUcsRUFBQSxXQUFBLE9BQUEsVUFBQSxrQkFBQSxZQUFBLEdBQUEsQ0FBQTtBQUFBLEdBQUE7Ozs7Ozs7K0RBQUgsS0FBRyxFQUFBLFNBQUEsQ0FBQUMsR0FBQSxHQUFBLENBQUEsY0FBQSxzQkFBQUYsWUFBQUMsd0JBQUEsR0FBQSxhQUFBLEVBQUEsQ0FBQTtFQUFBO0FBQUEsR0FBQSxPQUFBLGNBQUEsZUFBQSxjQUFBLFlBQUEsS0FBQSxJQUFBLENBQUE7QUFBQSxHQUFBLE9BQUEsY0FBQSxlQUFBLGVBQUEsWUFBQSxPQUFBLFlBQUEsSUFBQSxHQUFBLDRCQUFBLE9BQUEsRUFBQSxPQUFBLE1BQUEsWUFBQSxFQUFBLFNBQUEsQ0FBQTtBQUFBLEdBQUE7OztBTFBoQixxQkFBcUIsS0FBSyxTQUFTLEVBQ2hDLE1BQU0sQ0FBQyxRQUFRLFFBQVEsTUFBTSxHQUFHLENBQUM7IiwibmFtZXMiOlsiaW5qZWN0IiwiaW5qZWN0IiwiQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kiLCJDb21wb25lbnQiLCJpbmplY3QiLCJpbmplY3QiLCJpbmplY3QiLCJpMCIsIkNvbXBvbmVudCIsIkNoYW5nZURldGVjdGlvblN0cmF0ZWd5IiwiaTAiXX0=
