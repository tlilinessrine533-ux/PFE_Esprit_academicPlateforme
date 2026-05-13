import { injectQuery as __vite__injectQuery } from "/@vite/client";import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/chunk-V6WF2H3K.js");import {
  UiToastService
} from "/chunk-WJ2EEKTG.js";
import {
  extractErrorMessage
} from "/chunk-UNP43JFE.js";
import {
  AuthService,
  __spreadProps,
  __spreadValues
} from "/chunk-JQ6FWRX5.js";

// src/app/layout/app-shell.component.ts
import { DatePipe } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_common.js?v=9353569b";
import { ChangeDetectionStrategy as ChangeDetectionStrategy3, Component as Component3, DestroyRef as DestroyRef2, computed as computed2, inject as inject5, signal as signal2 } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
import { takeUntilDestroyed as takeUntilDestroyed2 } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core_rxjs-interop.js?v=9353569b";
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_router.js?v=9353569b";
import { filter, timer } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/rxjs.js?v=9353569b";

// src/app/core/services/notification.service.ts
import { HttpClient } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_common_http.js?v=9353569b";
import { Injectable, inject } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
import * as i0 from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
var NotificationService = class _NotificationService {
  http = inject(HttpClient);
  getOverview() {
    return this.http.get("/api/notifications");
  }
  markAsRead(id) {
    return this.http.post(`/api/notifications/${id}/read`, {});
  }
  markAllAsRead() {
    return this.http.post("/api/notifications/read-all", {});
  }
  static \u0275fac = function NotificationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationService)();
  };
  static \u0275prov = /* @__PURE__ */ i0.\u0275\u0275defineInjectable({ token: _NotificationService, factory: _NotificationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassMetadata(NotificationService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/shared/assistant-widget.component.ts
import { ChangeDetectionStrategy, Component, DestroyRef, ViewChild, computed, inject as inject3, signal } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
import { takeUntilDestroyed } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core_rxjs-interop.js?v=9353569b";

// src/app/core/services/assistant.service.ts
import { HttpClient as HttpClient2 } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_common_http.js?v=9353569b";
import { Injectable as Injectable2, inject as inject2 } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
import * as i02 from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
var AssistantService = class _AssistantService {
  http = inject2(HttpClient2);
  chat(payload) {
    return this.http.post("/api/assistant/chat", payload);
  }
  static \u0275fac = function AssistantService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AssistantService)();
  };
  static \u0275prov = /* @__PURE__ */ i02.\u0275\u0275defineInjectable({ token: _AssistantService, factory: _AssistantService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassMetadata(AssistantService, [{
    type: Injectable2,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/shared/assistant-widget.component.ts
import * as i03 from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
var _c0 = ["composerEl"];
var _c1 = ["messagesEl"];
var _forTrack0 = ($index, $item) => $item.role;
var _forTrack1 = ($index, $item) => $item.label;
var _forTrack2 = ($index, $item) => $item.key;
function AssistantWidgetComponent_Conditional_2_For_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = i03.\u0275\u0275getCurrentView();
    i03.\u0275\u0275domElementStart(0, "button", 45);
    i03.\u0275\u0275domListener("click", function AssistantWidgetComponent_Conditional_2_For_33_Template_button_click_0_listener() {
      const chip_r4 = i03.\u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = i03.\u0275\u0275nextContext(2);
      return i03.\u0275\u0275resetView(ctx_r1.selectRole(chip_r4.role));
    });
    i03.\u0275\u0275domElementStart(1, "span");
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275text(3);
    i03.\u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const chip_r4 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(2);
    i03.\u0275\u0275classProp("active", ctx_r1.selectedRole() === chip_r4.role)("locked", !ctx_r1.isRoleAllowed(chip_r4.role));
    i03.\u0275\u0275domProperty("disabled", !ctx_r1.isRoleAllowed(chip_r4.role))("title", ctx_r1.isRoleAllowed(chip_r4.role) ? "R\xF4le actif pour ce compte" : "Acc\xE8s r\xE9serv\xE9 \xE0 un autre profil");
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(chip_r4.icon);
    i03.\u0275\u0275advance();
    i03.\u0275\u0275textInterpolate1(" ", chip_r4.label, " ");
  }
}
function AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_4_Conditional_4_For_2_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElement(0, "li", 57);
  }
  if (rf & 2) {
    const line_r5 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(6);
    i03.\u0275\u0275domProperty("innerHTML", ctx_r1.formatLine(line_r5), i03.\u0275\u0275sanitizeHtml);
  }
}
function AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "ul");
    i03.\u0275\u0275repeaterCreate(1, AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_4_Conditional_4_For_2_Template, 1, 1, "li", 57, i03.\u0275\u0275repeaterTrackByIdentity);
    i03.\u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const section_r6 = i03.\u0275\u0275nextContext().$implicit;
    i03.\u0275\u0275advance();
    i03.\u0275\u0275repeater(section_r6.lines);
  }
}
function AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_4_Conditional_5_For_1_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElement(0, "p", 57);
  }
  if (rf & 2) {
    const line_r7 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(6);
    i03.\u0275\u0275domProperty("innerHTML", ctx_r1.formatLine(line_r7), i03.\u0275\u0275sanitizeHtml);
  }
}
function AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275repeaterCreate(0, AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_4_Conditional_5_For_1_Template, 1, 1, "p", 57, i03.\u0275\u0275repeaterTrackByIdentity);
  }
  if (rf & 2) {
    const section_r6 = i03.\u0275\u0275nextContext().$implicit;
    i03.\u0275\u0275repeater(section_r6.lines);
  }
}
function AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_4_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "section", 49)(1, "span", 55);
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(3, "div", 56);
    i03.\u0275\u0275conditionalCreate(4, AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_4_Conditional_4_Template, 3, 0, "ul")(5, AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_4_Conditional_5_Template, 2, 0);
    i03.\u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const section_r6 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(4);
    i03.\u0275\u0275advance();
    i03.\u0275\u0275classMap(ctx_r1.sectionClass(section_r6.kind));
    i03.\u0275\u0275advance();
    i03.\u0275\u0275textInterpolate(section_r6.label);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275conditional(section_r6.list ? 4 : 5);
  }
}
function AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_7_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "article", 51)(1, "div", 58);
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(3, "div", 59);
    i03.\u0275\u0275text(4);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(5, "div", 60);
    i03.\u0275\u0275text(6);
    i03.\u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const stat_r8 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(4);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(stat_r8.label);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(ctx_r1.formatValue(stat_r8.value));
    i03.\u0275\u0275advance();
    i03.\u0275\u0275classMap(ctx_r1.trendClass(stat_r8.trend));
    i03.\u0275\u0275advance();
    i03.\u0275\u0275textInterpolate2(" ", ctx_r1.trendArrow(stat_r8.trend), " ", ctx_r1.formatTrend(stat_r8.trend), " ");
  }
}
function AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_10_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "div", 53)(1, "label");
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(3, "div", 61);
    i03.\u0275\u0275domElement(4, "div", 62);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(5, "span");
    i03.\u0275\u0275text(6);
    i03.\u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const metric_r9 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(4);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(metric_r9.label);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275classMap(ctx_r1.progressFillClass(metric_r9.tone));
    i03.\u0275\u0275styleProp("width", metric_r9.value, "%");
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate1("", ctx_r1.formatValue(metric_r9.value), "%");
  }
}
function AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "div", 47);
    i03.\u0275\u0275text(1, "\u2726");
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(2, "div", 48);
    i03.\u0275\u0275repeaterCreate(3, AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_4_Template, 6, 4, "section", 49, _forTrack2);
    i03.\u0275\u0275domElementStart(5, "div", 50);
    i03.\u0275\u0275repeaterCreate(6, AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_7_Template, 7, 6, "article", 51, _forTrack1);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(8, "div", 52);
    i03.\u0275\u0275repeaterCreate(9, AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_For_10_Template, 7, 6, "div", 53, _forTrack1);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(11, "div", 54);
    i03.\u0275\u0275text(12, "Session \xB7 Analyse de performance");
    i03.\u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const message_r10 = i03.\u0275\u0275nextContext().$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(2);
    i03.\u0275\u0275advance(3);
    i03.\u0275\u0275repeater(ctx_r1.getSections(message_r10));
    i03.\u0275\u0275advance(3);
    i03.\u0275\u0275repeater(ctx_r1.getStats(message_r10));
    i03.\u0275\u0275advance(3);
    i03.\u0275\u0275repeater(ctx_r1.getProgress(ctx_r1.getStats(message_r10)));
  }
}
function AssistantWidgetComponent_Conditional_2_For_37_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "div", 48)(1, "p");
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275domElementEnd()();
    i03.\u0275\u0275domElementStart(3, "div", 63);
    i03.\u0275\u0275text(4);
    i03.\u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const message_r10 = i03.\u0275\u0275nextContext().$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(2);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(message_r10.question);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(ctx_r1.selectedRole() === "CHEF_DEPARTEMENT" ? "CD" : ctx_r1.selectedRole() === "ADMINISTRATION" ? "AD" : ctx_r1.selectedRole() === "SUPER_ADMIN" ? "SA" : "EN");
  }
}
function AssistantWidgetComponent_Conditional_2_For_37_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "article", 46);
    i03.\u0275\u0275conditionalCreate(1, AssistantWidgetComponent_Conditional_2_For_37_Conditional_1_Template, 13, 0)(2, AssistantWidgetComponent_Conditional_2_For_37_Conditional_2_Template, 5, 2);
    i03.\u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const message_r10 = ctx.$implicit;
    i03.\u0275\u0275classProp("user", message_r10.sender === "user")("ai", message_r10.sender === "assistant");
    i03.\u0275\u0275advance();
    i03.\u0275\u0275conditional(message_r10.sender === "assistant" ? 1 : 2);
  }
}
function AssistantWidgetComponent_Conditional_2_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "article", 31)(1, "div", 47);
    i03.\u0275\u0275text(2, "\u2726");
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(3, "div", 48)(4, "span", 64);
    i03.\u0275\u0275domElement(5, "span", 65)(6, "span", 65)(7, "span", 65);
    i03.\u0275\u0275domElementEnd()()();
  }
}
function AssistantWidgetComponent_Conditional_2_For_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = i03.\u0275\u0275getCurrentView();
    i03.\u0275\u0275domElementStart(0, "button", 66);
    i03.\u0275\u0275domListener("click", function AssistantWidgetComponent_Conditional_2_For_41_Template_button_click_0_listener() {
      const chip_r12 = i03.\u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = i03.\u0275\u0275nextContext(2);
      return i03.\u0275\u0275resetView(ctx_r1.applyQuickChip(chip_r12));
    });
    i03.\u0275\u0275text(1);
    i03.\u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const chip_r12 = ctx.$implicit;
    i03.\u0275\u0275advance();
    i03.\u0275\u0275textInterpolate2("", chip_r12.icon, " ", chip_r12.label);
  }
}
function AssistantWidgetComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = i03.\u0275\u0275getCurrentView();
    i03.\u0275\u0275domElementStart(0, "section", 3);
    i03.\u0275\u0275domElement(1, "div", 4)(2, "div", 5);
    i03.\u0275\u0275domElementStart(3, "header", 6)(4, "div", 7)(5, "div", 8);
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275domElementStart(6, "svg", 9);
    i03.\u0275\u0275domElement(7, "path", 10);
    i03.\u0275\u0275domElementEnd()();
    i03.\u0275\u0275namespaceHTML();
    i03.\u0275\u0275domElementStart(8, "div", 11)(9, "div", 12)(10, "strong");
    i03.\u0275\u0275text(11, "PerfIA Assistant");
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(12, "span", 13);
    i03.\u0275\u0275text(13, "AI");
    i03.\u0275\u0275domElementEnd()();
    i03.\u0275\u0275domElementStart(14, "span", 14);
    i03.\u0275\u0275domElement(15, "span", 15);
    i03.\u0275\u0275text(16, "Actif \xB7 Analyse en temps r\xE9el");
    i03.\u0275\u0275domElementEnd()()();
    i03.\u0275\u0275domElementStart(17, "div", 16)(18, "button", 17);
    i03.\u0275\u0275domListener("click", function AssistantWidgetComponent_Conditional_2_Template_button_click_18_listener() {
      i03.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i03.\u0275\u0275nextContext();
      return i03.\u0275\u0275resetView(ctx_r1.runTopbarAction("history"));
    });
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275domElementStart(19, "svg", 9);
    i03.\u0275\u0275domElement(20, "path", 18)(21, "path", 19);
    i03.\u0275\u0275domElementEnd()();
    i03.\u0275\u0275namespaceHTML();
    i03.\u0275\u0275domElementStart(22, "button", 20);
    i03.\u0275\u0275domListener("click", function AssistantWidgetComponent_Conditional_2_Template_button_click_22_listener() {
      i03.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i03.\u0275\u0275nextContext();
      return i03.\u0275\u0275resetView(ctx_r1.runTopbarAction("export"));
    });
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275domElementStart(23, "svg", 9);
    i03.\u0275\u0275domElement(24, "path", 21)(25, "path", 22);
    i03.\u0275\u0275domElementEnd()();
    i03.\u0275\u0275namespaceHTML();
    i03.\u0275\u0275domElementStart(26, "button", 23);
    i03.\u0275\u0275domListener("click", function AssistantWidgetComponent_Conditional_2_Template_button_click_26_listener() {
      i03.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i03.\u0275\u0275nextContext();
      return i03.\u0275\u0275resetView(ctx_r1.runTopbarAction("settings"));
    });
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275domElementStart(27, "svg", 9);
    i03.\u0275\u0275domElement(28, "path", 24)(29, "path", 25);
    i03.\u0275\u0275domElementEnd()()()();
    i03.\u0275\u0275namespaceHTML();
    i03.\u0275\u0275domElementStart(30, "div", 26)(31, "div", 27);
    i03.\u0275\u0275repeaterCreate(32, AssistantWidgetComponent_Conditional_2_For_33_Template, 4, 8, "button", 28, _forTrack0);
    i03.\u0275\u0275domElementEnd()();
    i03.\u0275\u0275domElementStart(34, "div", 29, 0);
    i03.\u0275\u0275repeaterCreate(36, AssistantWidgetComponent_Conditional_2_For_37_Template, 3, 5, "article", 30, i03.\u0275\u0275componentInstance().trackByMessageId, true);
    i03.\u0275\u0275conditionalCreate(38, AssistantWidgetComponent_Conditional_2_Conditional_38_Template, 8, 0, "article", 31);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(39, "div", 32);
    i03.\u0275\u0275repeaterCreate(40, AssistantWidgetComponent_Conditional_2_For_41_Template, 2, 2, "button", 33, _forTrack1);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(42, "div", 34)(43, "div", 35)(44, "textarea", 36, 1);
    i03.\u0275\u0275domListener("input", function AssistantWidgetComponent_Conditional_2_Template_textarea_input_44_listener($event) {
      i03.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i03.\u0275\u0275nextContext();
      return i03.\u0275\u0275resetView(ctx_r1.onComposerInput($event));
    })("keydown", function AssistantWidgetComponent_Conditional_2_Template_textarea_keydown_44_listener($event) {
      i03.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i03.\u0275\u0275nextContext();
      return i03.\u0275\u0275resetView(ctx_r1.onComposerKeydown($event));
    });
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(46, "button", 37);
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275domElementStart(47, "svg", 38);
    i03.\u0275\u0275domElement(48, "path", 39);
    i03.\u0275\u0275domElementEnd()();
    i03.\u0275\u0275namespaceHTML();
    i03.\u0275\u0275domElementStart(49, "button", 40);
    i03.\u0275\u0275domListener("click", function AssistantWidgetComponent_Conditional_2_Template_button_click_49_listener() {
      i03.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i03.\u0275\u0275nextContext();
      return i03.\u0275\u0275resetView(ctx_r1.sendMessage());
    });
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275domElementStart(50, "svg", 38);
    i03.\u0275\u0275domElement(51, "path", 41);
    i03.\u0275\u0275domElementEnd()()()();
    i03.\u0275\u0275namespaceHTML();
    i03.\u0275\u0275domElementStart(52, "footer", 42)(53, "span");
    i03.\u0275\u0275text(54, "Donn\xE9es prot\xE9g\xE9es \xB7 Facult\xE9");
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(55, "span", 43);
    i03.\u0275\u0275domElement(56, "span", 44);
    i03.\u0275\u0275text(57, "claude-sonnet-4 \xB7 PerfIA v2.0");
    i03.\u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = i03.\u0275\u0275nextContext();
    i03.\u0275\u0275advance(32);
    i03.\u0275\u0275repeater(ctx_r1.roleChips);
    i03.\u0275\u0275advance(4);
    i03.\u0275\u0275repeater(ctx_r1.messages());
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275conditional(ctx_r1.pending() ? 38 : -1);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275repeater(ctx_r1.activeQuickChips());
    i03.\u0275\u0275advance(4);
    i03.\u0275\u0275domProperty("value", ctx_r1.draftQuestion());
    i03.\u0275\u0275advance(5);
    i03.\u0275\u0275domProperty("disabled", !ctx_r1.canSend());
  }
}
var AssistantWidgetComponent = class _AssistantWidgetComponent {
  destroyRef = inject3(DestroyRef);
  authService = inject3(AuthService);
  assistantService = inject3(AssistantService);
  toastService = inject3(UiToastService);
  composerEl;
  messagesEl;
  role = this.authService.role;
  isOpen = signal(false, ...ngDevMode ? [{ debugName: "isOpen" }] : (
    /* istanbul ignore next */
    []
  ));
  pending = signal(false, ...ngDevMode ? [{ debugName: "pending" }] : (
    /* istanbul ignore next */
    []
  ));
  draftQuestion = signal("", ...ngDevMode ? [{ debugName: "draftQuestion" }] : (
    /* istanbul ignore next */
    []
  ));
  periodLabel = signal(this.defaultPeriodLabel(), ...ngDevMode ? [{ debugName: "periodLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedRole = signal(this.resolveAllowedRole(this.role()), ...ngDevMode ? [{ debugName: "selectedRole" }] : (
    /* istanbul ignore next */
    []
  ));
  accountRole = computed(() => this.resolveAllowedRole(this.role()), ...ngDevMode ? [{ debugName: "accountRole" }] : (
    /* istanbul ignore next */
    []
  ));
  roleChips = [
    { role: "ENSEIGNANT", icon: "\u{1F468}\u200D\u{1F3EB}", label: "ENSEIGNANT" },
    { role: "CHEF_DEPARTEMENT", icon: "\u{1F9D1}\u200D\u{1F4BC}", label: "CHEF D\xC9P." },
    { role: "ADMINISTRATION", icon: "\u{1F6E1}\uFE0F", label: "ADMIN" },
    { role: "SUPER_ADMIN", icon: "\u{1F451}", label: "SUPER ADMIN" }
  ];
  messages = signal([
    {
      id: Date.now(),
      sender: "assistant",
      text: "R\xE9sum\xE9: Assistant PerfIA initialis\xE9.\nAnalyse: Je suis pr\xEAt \xE0 analyser vos performances acad\xE9miques en temps r\xE9el.\nRecommandations: Posez une question pr\xE9cise pour obtenir une r\xE9ponse actionnable."
    }
  ], ...ngDevMode ? [{ debugName: "messages" }] : (
    /* istanbul ignore next */
    []
  ));
  canSend = computed(() => this.draftQuestion().trim().length > 0 && !this.pending(), ...ngDevMode ? [{ debugName: "canSend" }] : (
    /* istanbul ignore next */
    []
  ));
  activeQuickChips = computed(() => {
    const map = {
      ENSEIGNANT: [
        { icon: "\u26A1", label: "D\xE9tail du score", prompt: "Explique pourquoi mon score est faible." },
        {
          icon: "\u{1F9E0}",
          label: "Simulation what-if",
          prompt: "Que se passe-t-il si j'ajoute 1 publication et 1 encadrement ?"
        },
        { icon: "\u{1F4CB}", label: "Plan d'action", prompt: "Donne-moi un plan de promotion sur 3 mois." },
        { icon: "\u26A0\uFE0F", label: "Anomalies", prompt: "Y a-t-il des anomalies dans mes activit\xE9s ?" }
      ],
      CHEF_DEPARTEMENT: [
        { icon: "\u{1F4CA}", label: "Comparer \xE9quipe", prompt: "Quels enseignants sont en difficult\xE9 dans mon d\xE9partement ?" },
        { icon: "\u{1F9EA}", label: "Simulation charge", prompt: "Quel impact si on augmente la recherche de l'\xE9quipe de 20% ?" },
        {
          icon: "\u{1F5C2}\uFE0F",
          label: "Actions concr\xE8tes",
          prompt: "Donne-moi des recommandations concr\xE8tes de r\xE9partition pour \xE9quilibrer l'\xE9quipe."
        },
        { icon: "\u26A0\uFE0F", label: "Risques", prompt: "Quels sont les risques de sous-performance de l'\xE9quipe ?" }
      ],
      ADMINISTRATION: [
        { icon: "\u{1F6E1}\uFE0F", label: "V\xE9rifier anomalies", prompt: "Y a-t-il des anomalies dans les activit\xE9s soumises ?" },
        { icon: "\u2705", label: "Aide validation", prompt: "Quelle d\xE9cision recommandes-tu pour valider ces dossiers ?" },
        { icon: "\u{1F4C1}", label: "Contr\xF4le workflow", prompt: "Quels dossiers doivent \xEAtre trait\xE9s en priorit\xE9 aujourd'hui ?" },
        { icon: "\u26A0\uFE0F", label: "Cas suspects", prompt: "D\xE9tecte les cas suspects de surcharge ou doublon." }
      ],
      SUPER_ADMIN: [
        { icon: "\u{1F30D}", label: "\xC9tat global", prompt: "Quel est l'\xE9tat global de la facult\xE9 ?" },
        { icon: "\u{1F52E}", label: "Projection 20%", prompt: "Que se passe-t-il si on augmente la recherche de 20% ?" },
        { icon: "\u{1F4CC}", label: "Priorit\xE9s", prompt: "Donne-moi les priorit\xE9s strat\xE9giques imm\xE9diates." },
        { icon: "\u26A0\uFE0F", label: "Alertes critiques", prompt: "Quels sont les points faibles critiques au niveau facult\xE9 ?" }
      ]
    };
    return map[this.selectedRole()];
  }, ...ngDevMode ? [{ debugName: "activeQuickChips" }] : (
    /* istanbul ignore next */
    []
  ));
  toggle() {
    this.isOpen.update((value) => !value);
    if (this.isOpen()) {
      this.selectedRole.set(this.accountRole());
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }
  selectRole(role) {
    if (!this.isRoleAllowed(role)) {
      this.toastService.warning("Acc\xE8s restreint", `Ce compte est limit\xE9 au r\xF4le ${this.accountRole().replace("_", " ")}.`);
      return;
    }
    this.selectedRole.set(role);
  }
  updatePeriodLabel(value) {
    this.periodLabel.set(value);
  }
  onComposerInput(event) {
    const target = event.target;
    this.draftQuestion.set(target.value);
    this.autoResize(target);
  }
  onComposerKeydown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
  applyQuickChip(chip) {
    this.draftQuestion.set(chip.prompt);
    const composer = this.composerEl?.nativeElement;
    if (composer) {
      composer.value = chip.prompt;
      this.autoResize(composer);
    }
    this.sendMessage();
  }
  sendMessage() {
    const question = this.draftQuestion().trim();
    if (!question || this.pending()) {
      return;
    }
    this.messages.update((items) => [
      ...items,
      {
        id: Date.now(),
        sender: "user",
        question
      }
    ]);
    this.draftQuestion.set("");
    this.pending.set(true);
    this.resetComposer();
    this.scrollToBottomSoon();
    this.assistantService.chat({
      question,
      periodLabel: this.periodLabel().trim() || null
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.pending.set(false);
        this.messages.update((items) => [
          ...items,
          {
            id: Date.now() + 1,
            sender: "assistant",
            response
          }
        ]);
        this.scrollToBottomSoon();
      },
      error: (error) => {
        this.pending.set(false);
        const message = extractErrorMessage(error, "L'assistant n'a pas pu r\xE9pondre.");
        this.toastService.warning("Assistant indisponible", message);
        this.messages.update((items) => [
          ...items,
          {
            id: Date.now() + 2,
            sender: "assistant",
            text: `R\xE9sum\xE9: Appel API indisponible.
Analyse: ${message}
Recommandations: V\xE9rifiez la disponibilit\xE9 du backend puis r\xE9essayez.`
          }
        ]);
        this.scrollToBottomSoon();
      }
    });
  }
  runTopbarAction(action) {
    switch (action) {
      case "history":
        this.messagesEl?.nativeElement.scrollTo({ top: 0, behavior: "smooth" });
        this.toastService.info("Historique", "D\xE9filement vers le d\xE9but de l'historique.");
        break;
      case "export":
        this.exportConversation();
        this.toastService.success("Export", "Conversation export\xE9e en fichier texte.");
        break;
      case "settings":
        this.toastService.info("Param\xE8tres", "Les param\xE8tres avanc\xE9s arrivent dans la prochaine it\xE9ration.");
        break;
    }
  }
  trackByMessageId(_, message) {
    return message.id;
  }
  isRoleAllowed(role) {
    return role === this.accountRole();
  }
  getSections(message) {
    if (message.response) {
      const sections2 = [
        {
          key: `${message.id}-summary`,
          kind: "summary",
          label: "R\xE9sum\xE9",
          lines: [message.response.summary],
          list: false
        },
        {
          key: `${message.id}-analysis`,
          kind: "analysis",
          label: "Analyse",
          lines: [message.response.analysis],
          list: false
        },
        {
          key: `${message.id}-reco`,
          kind: "recommendation",
          label: "Recommandation",
          lines: message.response.recommendations,
          list: true
        }
      ];
      if (message.response.risks.length > 0) {
        sections2.push({
          key: `${message.id}-risk`,
          kind: "risk",
          label: "Risques",
          lines: message.response.risks,
          list: true
        });
      }
      return sections2;
    }
    const source = message.text?.trim() ?? "";
    if (!source) {
      return [];
    }
    const lines = source.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const sections = [];
    let current = {
      key: `${message.id}-default`,
      kind: "analysis",
      label: "Analyse",
      lines: [],
      list: false
    };
    const pushCurrent = () => {
      if (!current.lines.length) {
        return;
      }
      current.list = current.lines.every((line) => /^[-â¢]/.test(line));
      current.lines = current.lines.map((line) => line.replace(/^[-â¢]\s*/, ""));
      sections.push(__spreadValues({}, current));
    };
    for (const line of lines) {
      const detected = this.detectSection(line);
      if (detected) {
        pushCurrent();
        current = {
          key: `${message.id}-${detected.kind}-${sections.length}`,
          kind: detected.kind,
          label: detected.label,
          lines: [line.replace(/^(\d+\.)?\s*(RÃ©sumÃ©|Resume|Analyse|Recommandations?|Risques?)\s*:?/i, "").trim()].filter(Boolean),
          list: false
        };
      } else {
        current.lines.push(line);
      }
    }
    pushCurrent();
    return sections.length ? sections : [__spreadValues({}, current)];
  }
  sectionClass(kind) {
    switch (kind) {
      case "summary":
        return "tag-summary";
      case "analysis":
        return "tag-analysis";
      case "recommendation":
        return "tag-recommendation";
      case "risk":
      default:
        return "tag-risk";
    }
  }
  getStats(message) {
    const text = this.messageText(message);
    const detected = Array.from(text.matchAll(/\b\d{1,3}(?:[.,]\d+)?\b/g)).map((match) => Number.parseFloat(match[0].replace(",", "."))).filter((value) => Number.isFinite(value));
    const defaults = {
      ENSEIGNANT: [74, 49, 63],
      CHEF_DEPARTEMENT: [71, 56, 59],
      ADMINISTRATION: [77, 61, 54],
      SUPER_ADMIN: [76, 58, 57]
    };
    const fallback = defaults[this.selectedRole()];
    const perf = this.clampScore(detected[0] ?? fallback[0]);
    const research = this.clampScore(detected[1] ?? fallback[1]);
    const risk = this.clampScore(detected[2] ?? fallback[2]);
    return [
      { label: "PERF SCORE", value: perf, trend: perf >= 55 ? 3.6 : -4.2 },
      { label: "RECHERCHE", value: research, trend: research >= 50 ? 2.4 : -3.7 },
      { label: "RISQUE", value: risk, trend: risk <= 55 ? 2.1 : -2.9 }
    ];
  }
  getProgress(stats) {
    const perf = stats[0]?.value ?? 60;
    const research = stats[1]?.value ?? 50;
    const risk = stats[2]?.value ?? 50;
    const supervision = this.clampScore(100 - Math.abs(50 - risk) * 1.45);
    return [
      { label: "Enseignement", value: perf, tone: "teaching" },
      { label: "Recherche", value: research, tone: "research" },
      { label: "Encadrement", value: supervision, tone: "supervision" }
    ];
  }
  progressFillClass(tone) {
    switch (tone) {
      case "teaching":
        return "fill-teaching";
      case "research":
        return "fill-research";
      case "supervision":
      default:
        return "fill-supervision";
    }
  }
  trendClass(value) {
    return value >= 0 ? "trend-up" : "trend-down";
  }
  trendArrow(value) {
    return value >= 0 ? "\u25B2" : "\u25BC";
  }
  formatTrend(value) {
    return `${Math.abs(value).toFixed(1)}%`;
  }
  formatValue(value) {
    return value.toFixed(1);
  }
  formatLine(value) {
    return this.escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }
  detectSection(line) {
    const normalized = line.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (/^(1\.)?\s*resume\b/.test(normalized)) {
      return { kind: "summary", label: "R\xE9sum\xE9" };
    }
    if (/^(2\.)?\s*analyse\b/.test(normalized)) {
      return { kind: "analysis", label: "Analyse" };
    }
    if (/^(3\.)?\s*recommand/.test(normalized)) {
      return { kind: "recommendation", label: "Recommandation" };
    }
    if (/^(4\.)?\s*risque/.test(normalized)) {
      return { kind: "risk", label: "Risques" };
    }
    return null;
  }
  messageText(message) {
    if (message.response) {
      const body = [
        message.response.summary,
        message.response.analysis,
        ...message.response.recommendations,
        ...message.response.risks
      ];
      return body.join(" ");
    }
    return message.text ?? message.question ?? "";
  }
  autoResize(element) {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 140)}px`;
  }
  resetComposer() {
    const composer = this.composerEl?.nativeElement;
    if (!composer) {
      return;
    }
    composer.value = "";
    composer.style.height = "40px";
  }
  scrollToBottomSoon() {
    setTimeout(() => this.scrollToBottom(), 0);
  }
  scrollToBottom() {
    const container = this.messagesEl?.nativeElement;
    if (!container) {
      return;
    }
    container.scrollTop = container.scrollHeight;
  }
  exportConversation() {
    const lines = this.messages().map((message) => {
      if (message.sender === "user") {
        return `[USER] ${message.question ?? ""}`;
      }
      return `[AI] ${this.messageText(message)}`;
    }).join("\n\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "perfia-chat-history.txt";
    link.click();
    URL.revokeObjectURL(url);
  }
  resolveAllowedRole(current) {
    if (current === "ENSEIGNANT" || current === "CHEF_DEPARTEMENT" || current === "ADMINISTRATION" || current === "SUPER_ADMIN") {
      return current;
    }
    return "ENSEIGNANT";
  }
  defaultPeriodLabel() {
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    if (now.getMonth() >= 7) {
      return `${year}-${year + 1}`;
    }
    return `${year - 1}-${year}`;
  }
  clampScore(value) {
    return Math.max(0, Math.min(100, value));
  }
  escapeHtml(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  static \u0275fac = function AssistantWidgetComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AssistantWidgetComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i03.\u0275\u0275defineComponent({ type: _AssistantWidgetComponent, selectors: [["app-assistant-widget"]], viewQuery: function AssistantWidgetComponent_Query(rf, ctx) {
    if (rf & 1) {
      i03.\u0275\u0275viewQuery(_c0, 5)(_c1, 5);
    }
    if (rf & 2) {
      let _t;
      i03.\u0275\u0275queryRefresh(_t = i03.\u0275\u0275loadQuery()) && (ctx.composerEl = _t.first);
      i03.\u0275\u0275queryRefresh(_t = i03.\u0275\u0275loadQuery()) && (ctx.messagesEl = _t.first);
    }
  }, decls: 3, vars: 2, consts: [["messagesEl", ""], ["composerEl", ""], ["type", "button", "aria-label", "Ouvrir PerfIA Assistant", 1, "assistant-fab", 3, "click"], [1, "perfia-shell"], ["aria-hidden", "true", 1, "orb", "orb-blue"], ["aria-hidden", "true", 1, "orb", "orb-violet"], [1, "topbar"], [1, "topbar-left"], ["aria-hidden", "true", 1, "ai-avatar"], ["viewBox", "0 0 24 24", "fill", "none"], ["d", "M12 2.2l1.8 4.7 4.8 1.8-4.8 1.8L12 15.2l-1.8-4.7-4.8-1.8 4.8-1.8L12 2.2zM18.3 14.9l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8.8-2.1zM6.1 14.3l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6z", "fill", "#fff"], [1, "identity"], [1, "identity-top"], [1, "badge-ai"], [1, "status-line"], [1, "status-dot"], [1, "topbar-actions"], ["type", "button", "title", "Historique", "aria-label", "Historique", 1, "icon-btn", 3, "click"], ["d", "M12 5v7l4.2 2.6", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round"], ["d", "M4 12a8 8 0 108-8 7.9 7.9 0 00-5.8 2.5M4 4v4h4", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round"], ["type", "button", "title", "Exporter", "aria-label", "Exporter", 1, "icon-btn", 3, "click"], ["d", "M12 4v10m0 0l-3.2-3.2M12 14l3.2-3.2", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round"], ["d", "M5 16.7V20h14v-3.3", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round"], ["type", "button", "title", "Param\xE8tres", "aria-label", "Param\xE8tres", 1, "icon-btn", 3, "click"], ["d", "M12 8.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4z", "stroke", "currentColor", "stroke-width", "1.8"], ["d", "M19.4 10.6l1.1 1.4-1.2 2-1.8.1a6 6 0 01-.6 1.4l1.1 1.4-1.8 1.8-1.4-1.1a6 6 0 01-1.4.6l-.1 1.8h-2l-.1-1.8a6 6 0 01-1.4-.6l-1.4 1.1-1.8-1.8 1.1-1.4a6 6 0 01-.6-1.4L3.5 14 2.3 12l1.1-1.4 1.8-.1a6 6 0 01.6-1.4L4.7 7.7l1.8-1.8 1.4 1.1a6 6 0 011.4-.6l.1-1.8h2l.1 1.8a6 6 0 011.4.6l1.4-1.1 1.8 1.8-1.1 1.4c.3.4.5.9.6 1.4l1.8.1z", "stroke", "currentColor", "stroke-width", "1.2"], [1, "rolebar"], [1, "rolechips"], ["type", "button", 1, "role-chip", 3, "active", "locked", "disabled", "title"], [1, "messages-wrap"], [1, "message-row", 3, "user", "ai"], [1, "message-row", "ai"], [1, "quickbar"], ["type", "button", 1, "quick-chip"], [1, "inputbar"], [1, "input-wrap"], ["rows", "1", "placeholder", "Posez votre question \xE0 PerfIA...", 1, "composer", 3, "input", "keydown", "value"], ["type", "button", "aria-label", "Joindre", 1, "attach-btn"], ["viewBox", "0 0 24 24", "fill", "none", "width", "17", "height", "17"], ["d", "M8.5 12.5l6.3-6.3a3 3 0 114.2 4.2l-8.1 8.1a5 5 0 01-7.1-7.1l8-8", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round"], ["type", "button", "aria-label", "Envoyer", 1, "send-btn", 3, "click", "disabled"], ["d", "M4 12l15-7-3.8 14-4.1-5.4L4 12z", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linejoin", "round"], [1, "footer"], [1, "footer-right"], [1, "small-green"], ["type", "button", 1, "role-chip", 3, "click", "disabled", "title"], [1, "message-row"], [1, "msg-avatar", "ai"], [1, "msg-bubble"], [1, "section-block"], [1, "stats-grid"], [1, "stat-card"], [1, "progress-pack"], [1, "progress-line"], [1, "divider"], [1, "section-tag"], [1, "section-text"], [3, "innerHTML"], [1, "stat-label"], [1, "stat-value"], [1, "stat-trend"], [1, "track"], [1, "fill"], [1, "msg-avatar", "user"], [1, "typing-wrap"], [1, "typing-dot"], ["type", "button", 1, "quick-chip", 3, "click"]], template: function AssistantWidgetComponent_Template(rf, ctx) {
    if (rf & 1) {
      i03.\u0275\u0275domElementStart(0, "button", 2);
      i03.\u0275\u0275domListener("click", function AssistantWidgetComponent_Template_button_click_0_listener() {
        return ctx.toggle();
      });
      i03.\u0275\u0275text(1, " IA\n");
      i03.\u0275\u0275domElementEnd();
      i03.\u0275\u0275conditionalCreate(2, AssistantWidgetComponent_Conditional_2_Template, 58, 3, "section", 3);
    }
    if (rf & 2) {
      i03.\u0275\u0275attribute("aria-expanded", ctx.isOpen());
      i03.\u0275\u0275advance(2);
      i03.\u0275\u0275conditional(ctx.isOpen() ? 2 : -1);
    }
  }, styles: ['\n[_nghost-%COMP%] {\n  --accent: #4f6ef7;\n  --accent2: #7c3aed;\n  --accent3: #06b6d4;\n  --surface: rgba(15, 18, 32, 0.97);\n  --surface2: rgba(22, 28, 48, 0.95);\n  --surface3: rgba(30, 38, 65, 0.9);\n  --text1: #f0f4ff;\n  --text2: #a8b4d4;\n  --text3: #5a6a99;\n  --border: rgba(79, 110, 247, 0.2);\n  position: fixed;\n  right: 1rem;\n  bottom: 1rem;\n  z-index: 80;\n  font-family: "Outfit", sans-serif;\n}\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.assistant-fab[_ngcontent-%COMP%] {\n  width: 4rem;\n  height: 4rem;\n  border-radius: 999px;\n  border: 1px solid rgba(156, 184, 255, 0.5);\n  font-family: inherit;\n  font-size: 1.26rem;\n  font-weight: 800;\n  letter-spacing: 0.06em;\n  color: #fff;\n  cursor: pointer;\n  background:\n    radial-gradient(\n      90% 90% at 28% 22%,\n      rgba(255, 126, 174, 0.75),\n      transparent 62%),\n    linear-gradient(\n      140deg,\n      rgba(255, 74, 130, 0.96),\n      rgba(122, 58, 237, 0.95));\n  box-shadow:\n    0 18px 36px rgba(8, 13, 38, 0.6),\n    0 0 18px rgba(79, 110, 247, 0.52),\n    inset 0 1px 0 rgba(255, 255, 255, 0.36);\n}\n.perfia-shell[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0;\n  bottom: 4.8rem;\n  width: min(100vw - 1rem, 780px);\n  max-height: calc(100vh - 6rem);\n  display: grid;\n  grid-template-rows: auto auto minmax(0, 1fr) auto auto auto;\n  border-radius: 24px;\n  border: 1px solid var(--border);\n  background: var(--surface);\n  box-shadow:\n    0 32px 80px rgba(0, 0, 0, 0.6),\n    0 0 0 1px rgba(79, 110, 247, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.05);\n  transform-origin: right bottom;\n  transform: perspective(1200px) rotateX(1.5deg);\n  transition: transform 0.28s ease;\n  overflow: hidden;\n  isolation: isolate;\n}\n.perfia-shell[_ngcontent-%COMP%]:hover {\n  transform: perspective(1200px) rotateX(0deg);\n}\n.perfia-shell[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background-image:\n    linear-gradient(rgba(79, 110, 247, 0.08) 1px, transparent 1px),\n    linear-gradient(\n      90deg,\n      rgba(79, 110, 247, 0.08) 1px,\n      transparent 1px);\n  background-size: 40px 40px;\n  opacity: 0.42;\n  pointer-events: none;\n  z-index: 0;\n}\n.orb[_ngcontent-%COMP%] {\n  position: absolute;\n  border-radius: 999px;\n  filter: blur(24px);\n  pointer-events: none;\n  z-index: 1;\n}\n.orb-blue[_ngcontent-%COMP%] {\n  top: -95px;\n  right: -95px;\n  width: 260px;\n  height: 260px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(6, 182, 212, 0.52),\n      transparent 64%);\n  animation: _ngcontent-%COMP%_pulse1 6s ease-in-out infinite;\n}\n.orb-violet[_ngcontent-%COMP%] {\n  left: -98px;\n  bottom: -114px;\n  width: 290px;\n  height: 290px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(124, 58, 237, 0.45),\n      transparent 68%);\n  animation: _ngcontent-%COMP%_pulse2 8s ease-in-out infinite;\n}\n.topbar[_ngcontent-%COMP%], \n.rolebar[_ngcontent-%COMP%], \n.messages-wrap[_ngcontent-%COMP%], \n.quickbar[_ngcontent-%COMP%], \n.inputbar[_ngcontent-%COMP%], \n.footer[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n}\n.topbar[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  padding: 0.88rem 1rem;\n  background: var(--surface2);\n  border-bottom: 1px solid rgba(79, 110, 247, 0.16);\n}\n.topbar-left[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.78rem;\n}\n.ai-avatar[_ngcontent-%COMP%] {\n  position: relative;\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  display: grid;\n  place-items: center;\n  color: #fff;\n  flex: none;\n  background:\n    linear-gradient(\n      135deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 16px rgba(79, 110, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.32);\n  animation: _ngcontent-%COMP%_avatarGlow 3s infinite;\n}\n.ai-avatar[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  inset: -3px;\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      120deg,\n      #7fa8ff,\n      #a066ff,\n      #35d2ff);\n  opacity: 0.85;\n  z-index: -1;\n  animation: _ngcontent-%COMP%_ringRotate 4s linear infinite;\n}\n.ai-avatar[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 22px;\n  height: 22px;\n}\n.identity[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.13rem;\n}\n.identity-top[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.identity-top[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.04rem;\n  color: var(--text1);\n  white-space: nowrap;\n}\n.badge-ai[_ngcontent-%COMP%] {\n  padding: 0.15rem 0.54rem;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  letter-spacing: 0.05em;\n  color: #fff;\n  background:\n    linear-gradient(\n      135deg,\n      var(--accent),\n      var(--accent2));\n}\n.status-line[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  font-size: 0.78rem;\n  color: var(--text2);\n}\n.status-dot[_ngcontent-%COMP%] {\n  width: 0.53rem;\n  height: 0.53rem;\n  border-radius: 999px;\n  background: #22c55e;\n  box-shadow: 0 0 10px rgba(34, 197, 94, 0.78);\n  animation: _ngcontent-%COMP%_blink 2s infinite;\n}\n.topbar-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n}\n.icon-btn[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 11px;\n  border: 1px solid rgba(156, 184, 255, 0.3);\n  background: rgba(255, 255, 255, 0.02);\n  color: var(--text2);\n  cursor: pointer;\n  display: grid;\n  place-items: center;\n  transition: all 0.18s ease;\n}\n.icon-btn[_ngcontent-%COMP%]:hover {\n  border-color: rgba(122, 176, 255, 0.82);\n  color: #deebff;\n  box-shadow: 0 0 14px rgba(79, 110, 247, 0.34);\n}\n.icon-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n}\n.rolebar[_ngcontent-%COMP%] {\n  padding: 0.7rem 0.86rem;\n  border-bottom: 1px solid rgba(79, 110, 247, 0.16);\n  background: rgba(22, 28, 48, 0.72);\n}\n.rolechips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.45rem;\n}\n.role-chip[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(114, 133, 190, 0.32);\n  background: transparent;\n  color: var(--text2);\n  padding: 0.44rem 0.84rem;\n  font-family: inherit;\n  font-weight: 700;\n  letter-spacing: 0.03em;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.role-chip.active[_ngcontent-%COMP%] {\n  color: #fff;\n  background:\n    linear-gradient(\n      130deg,\n      rgba(79, 110, 247, 0.92),\n      rgba(124, 58, 237, 0.86));\n  border-color: rgba(122, 176, 255, 0.86);\n  box-shadow: 0 0 18px rgba(79, 110, 247, 0.35);\n}\n.role-chip.locked[_ngcontent-%COMP%], \n.role-chip[_ngcontent-%COMP%]:disabled {\n  opacity: 0.46;\n  cursor: not-allowed;\n  filter: grayscale(0.2);\n}\n.messages-wrap[_ngcontent-%COMP%] {\n  min-height: 220px;\n  overflow: auto;\n  padding: 0.96rem 0.82rem;\n  overscroll-behavior: contain;\n}\n.messages-wrap[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 0.45rem;\n}\n.messages-wrap[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(79, 110, 247, 0.88),\n      rgba(124, 58, 237, 0.76));\n}\n.message-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.55rem;\n  margin-bottom: 0.68rem;\n  animation: _ngcontent-%COMP%_msgIn 0.35s cubic-bezier(0.23, 1, 0.32, 1);\n}\n.message-row.user[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.msg-avatar[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border-radius: 9px;\n  flex: none;\n  font-size: 0.75rem;\n  font-weight: 800;\n  display: grid;\n  place-items: center;\n}\n.msg-avatar.ai[_ngcontent-%COMP%] {\n  color: #fff;\n  background:\n    linear-gradient(\n      140deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 14px rgba(79, 110, 247, 0.4);\n}\n.msg-avatar.user[_ngcontent-%COMP%] {\n  color: #d8e0ff;\n  background: rgba(22, 28, 48, 0.96);\n  border: 1px solid rgba(154, 178, 239, 0.22);\n}\n.msg-bubble[_ngcontent-%COMP%] {\n  max-width: min(86%, 640px);\n  border: 1px solid rgba(129, 154, 225, 0.24);\n  padding: 0.66rem 0.78rem;\n}\n.message-row.ai[_ngcontent-%COMP%]   .msg-bubble[_ngcontent-%COMP%] {\n  background: var(--surface3);\n  border-radius: 4px 16px 16px 16px;\n}\n.message-row.user[_ngcontent-%COMP%]   .msg-bubble[_ngcontent-%COMP%] {\n  color: #eef2ff;\n  background:\n    linear-gradient(\n      135deg,\n      #4f6ef7,\n      #5b50f0);\n  border-color: rgba(156, 180, 255, 0.34);\n  border-radius: 16px 4px 16px 16px;\n  box-shadow: 0 4px 20px rgba(79, 110, 247, 0.35);\n}\n.msg-bubble[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.1rem 0 0;\n  color: var(--text1);\n  line-height: 1.5;\n}\n.section-block[_ngcontent-%COMP%]    + .section-block[_ngcontent-%COMP%] {\n  margin-top: 0.5rem;\n}\n.section-tag[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 0.15rem 0.52rem;\n  font-size: 0.69rem;\n  letter-spacing: 0.05em;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.tag-summary[_ngcontent-%COMP%] {\n  color: #34d399;\n  background: rgba(52, 211, 153, 0.13);\n}\n.tag-analysis[_ngcontent-%COMP%] {\n  color: #818cf8;\n  background: rgba(129, 140, 248, 0.14);\n}\n.tag-recommendation[_ngcontent-%COMP%] {\n  color: #fcd34d;\n  background: rgba(252, 211, 77, 0.14);\n}\n.tag-risk[_ngcontent-%COMP%] {\n  color: #fca5a5;\n  background: rgba(248, 113, 113, 0.12);\n}\n.section-text[_ngcontent-%COMP%] {\n  margin-top: 0.34rem;\n  font-size: 0.92rem;\n}\n.section-text[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 0;\n  padding-left: 1rem;\n  display: grid;\n  gap: 0.16rem;\n}\n.stats-grid[_ngcontent-%COMP%] {\n  margin-top: 0.62rem;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.35rem;\n}\n.stat-card[_ngcontent-%COMP%] {\n  border-radius: 10px;\n  border: 1px solid rgba(129, 154, 225, 0.18);\n  background: rgba(15, 18, 32, 0.8);\n  padding: 0.42rem 0.5rem;\n}\n.stat-label[_ngcontent-%COMP%] {\n  font-family: "JetBrains Mono", monospace;\n  text-transform: uppercase;\n  font-size: 0.58rem;\n  color: var(--text3);\n}\n.stat-value[_ngcontent-%COMP%] {\n  font-family: "JetBrains Mono", monospace;\n  font-size: 18px;\n  font-weight: 800;\n  margin-top: 0.18rem;\n}\n.stat-trend[_ngcontent-%COMP%] {\n  margin-top: 0.08rem;\n  font-size: 0.69rem;\n  font-family: "JetBrains Mono", monospace;\n}\n.trend-up[_ngcontent-%COMP%] {\n  color: #34d399;\n}\n.trend-down[_ngcontent-%COMP%] {\n  color: #f87171;\n}\n.progress-pack[_ngcontent-%COMP%] {\n  margin-top: 0.56rem;\n  display: grid;\n  gap: 0.3rem;\n}\n.progress-line[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 7rem 1fr auto;\n  align-items: center;\n  gap: 0.45rem;\n}\n.progress-line[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.progress-line[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.66rem;\n  color: var(--text2);\n  font-family: "JetBrains Mono", monospace;\n}\n.track[_ngcontent-%COMP%] {\n  height: 6px;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.06);\n  overflow: hidden;\n}\n.fill[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: inherit;\n  box-shadow: 0 0 12px currentColor;\n}\n.fill-teaching[_ngcontent-%COMP%] {\n  color: #6fa3ff;\n  background:\n    linear-gradient(\n      90deg,\n      #4f6ef7,\n      #7c3aed);\n}\n.fill-research[_ngcontent-%COMP%] {\n  color: #67d9ff;\n  background:\n    linear-gradient(\n      90deg,\n      #7c3aed,\n      #06b6d4);\n}\n.fill-supervision[_ngcontent-%COMP%] {\n  color: #ffb95a;\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b,\n      #fb7185);\n}\n.divider[_ngcontent-%COMP%] {\n  margin: 0.7rem 0 0.15rem;\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--text3);\n  font-family: "JetBrains Mono", monospace;\n  font-size: 0.74rem;\n}\n.divider[_ngcontent-%COMP%]::before, \n.divider[_ngcontent-%COMP%]::after {\n  content: "";\n  height: 1px;\n  background: rgba(112, 131, 191, 0.3);\n}\n.typing-wrap[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.typing-dot[_ngcontent-%COMP%] {\n  width: 0.4rem;\n  height: 0.4rem;\n  border-radius: 999px;\n  animation: _ngcontent-%COMP%_typingBounce 0.9s ease-in-out infinite;\n}\n.typing-dot[_ngcontent-%COMP%]:nth-child(1) {\n  background: #4f6ef7;\n  animation-delay: 0s;\n}\n.typing-dot[_ngcontent-%COMP%]:nth-child(2) {\n  background: #6366f1;\n  animation-delay: 0.2s;\n}\n.typing-dot[_ngcontent-%COMP%]:nth-child(3) {\n  background: #7c3aed;\n  animation-delay: 0.4s;\n}\n.quickbar[_ngcontent-%COMP%] {\n  padding: 0.55rem 0.76rem 0.72rem;\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.quick-chip[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(117, 143, 214, 0.34);\n  padding: 0.42rem 0.78rem;\n  color: var(--text2);\n  background: rgba(255, 255, 255, 0.02);\n  font-family: inherit;\n  cursor: pointer;\n  transition: all 0.18s ease;\n}\n.quick-chip[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  border-color: rgba(122, 176, 255, 0.85);\n  background: rgba(79, 110, 247, 0.14);\n  color: #deebff;\n}\n.inputbar[_ngcontent-%COMP%] {\n  padding: 0.72rem 0.82rem 0.78rem;\n  background: var(--surface2);\n  border-top: 1px solid rgba(79, 110, 247, 0.16);\n}\n.input-wrap[_ngcontent-%COMP%] {\n  border-radius: 16px;\n  border: 1px solid rgba(122, 146, 207, 0.34);\n  background: rgba(15, 18, 32, 0.58);\n  padding: 0.44rem;\n  display: grid;\n  grid-template-columns: 1fr auto auto;\n  gap: 0.35rem;\n  align-items: end;\n}\n.composer[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 40px;\n  max-height: 140px;\n  resize: none;\n  border: 0;\n  outline: none;\n  border-radius: 12px;\n  background: transparent;\n  color: var(--text1);\n  font: inherit;\n  font-size: 0.98rem;\n  line-height: 1.4;\n  padding: 0.48rem 0.58rem;\n}\n.composer[_ngcontent-%COMP%]::placeholder {\n  color: #7f8cb0;\n}\n.input-wrap[_ngcontent-%COMP%]:focus-within {\n  border-color: rgba(109, 160, 255, 0.92);\n  box-shadow: 0 0 0 1px rgba(109, 160, 255, 0.24), 0 0 20px rgba(79, 110, 247, 0.32);\n}\n.attach-btn[_ngcontent-%COMP%], \n.send-btn[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  border: 1px solid rgba(122, 146, 207, 0.36);\n  display: grid;\n  place-items: center;\n  cursor: pointer;\n}\n.attach-btn[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.03);\n  color: var(--text2);\n}\n.send-btn[_ngcontent-%COMP%] {\n  border-color: rgba(156, 185, 255, 0.55);\n  color: #fff;\n  background:\n    linear-gradient(\n      140deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 18px rgba(79, 110, 247, 0.45);\n  transition: transform 0.18s ease;\n}\n.send-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: scale(1.06);\n}\n.send-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.58;\n  cursor: not-allowed;\n}\n.footer[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(79, 110, 247, 0.18);\n  background: rgba(11, 15, 29, 0.9);\n  padding: 0.5rem 0.82rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.7rem;\n  color: var(--text3);\n  font-family: "JetBrains Mono", monospace;\n  font-size: 0.73rem;\n}\n.footer-right[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.small-green[_ngcontent-%COMP%] {\n  width: 0.45rem;\n  height: 0.45rem;\n  border-radius: 999px;\n  background: #2fd684;\n  animation: _ngcontent-%COMP%_blink 2s infinite;\n}\n@media (max-width: 780px) {\n  [_nghost-%COMP%] {\n    right: 0.45rem;\n    bottom: 0.45rem;\n  }\n  .assistant-fab[_ngcontent-%COMP%] {\n    width: 3.6rem;\n    height: 3.6rem;\n  }\n  .perfia-shell[_ngcontent-%COMP%] {\n    width: calc(100vw - 0.7rem);\n    bottom: 4.3rem;\n    max-height: calc(100vh - 5.4rem);\n  }\n  .messages-wrap[_ngcontent-%COMP%] {\n    min-height: 180px;\n    padding: 0.68rem;\n  }\n  .msg-bubble[_ngcontent-%COMP%] {\n    max-width: 92%;\n  }\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .progress-line[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 0.2rem;\n  }\n  .input-wrap[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .attach-btn[_ngcontent-%COMP%], \n   .send-btn[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .footer[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n}\n@keyframes _ngcontent-%COMP%_avatarGlow {\n  0%, 100% {\n    box-shadow: 0 0 12px rgba(79, 110, 247, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.22);\n  }\n  50% {\n    box-shadow:\n      0 0 24px rgba(79, 110, 247, 0.75),\n      0 0 18px rgba(124, 58, 237, 0.45),\n      inset 0 1px 0 rgba(255, 255, 255, 0.28);\n  }\n}\n@keyframes _ngcontent-%COMP%_ringRotate {\n  0% {\n    filter: hue-rotate(0deg);\n  }\n  100% {\n    filter: hue-rotate(360deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse1 {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 0.78;\n  }\n  50% {\n    transform: scale(1.16);\n    opacity: 0.45;\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse2 {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 0.82;\n  }\n  50% {\n    transform: scale(1.2);\n    opacity: 0.36;\n  }\n}\n@keyframes _ngcontent-%COMP%_blink {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.3;\n  }\n}\n@keyframes _ngcontent-%COMP%_msgIn {\n  from {\n    transform: translateY(7px) scale(0.985);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0) scale(1);\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_typingBounce {\n  0%, 80%, 100% {\n    transform: translateY(0);\n    opacity: 0.6;\n  }\n  40% {\n    transform: translateY(-4px);\n    opacity: 1;\n  }\n}\n/*# sourceMappingURL=assistant-widget.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassMetadata(AssistantWidgetComponent, [{
    type: Component,
    args: [{ selector: "app-assistant-widget", changeDetection: ChangeDetectionStrategy.OnPush, template: `<button
  class="assistant-fab"
  type="button"
  [attr.aria-expanded]="isOpen()"
  aria-label="Ouvrir PerfIA Assistant"
  (click)="toggle()"
>
  IA
</button>

@if (isOpen()) {
  <section class="perfia-shell">
    <div class="orb orb-blue" aria-hidden="true"></div>
    <div class="orb orb-violet" aria-hidden="true"></div>

    <header class="topbar">
      <div class="topbar-left">
        <div class="ai-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2.2l1.8 4.7 4.8 1.8-4.8 1.8L12 15.2l-1.8-4.7-4.8-1.8 4.8-1.8L12 2.2zM18.3 14.9l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8.8-2.1zM6.1 14.3l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6z"
              fill="#fff"
            />
          </svg>
        </div>
        <div class="identity">
          <div class="identity-top">
            <strong>PerfIA Assistant</strong>
            <span class="badge-ai">AI</span>
          </div>
          <span class="status-line"><span class="status-dot"></span>Actif \xB7 Analyse en temps r\xE9el</span>
        </div>
      </div>

      <div class="topbar-actions">
        <button class="icon-btn" type="button" title="Historique" aria-label="Historique" (click)="runTopbarAction('history')">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5v7l4.2 2.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path
              d="M4 12a8 8 0 108-8 7.9 7.9 0 00-5.8 2.5M4 4v4h4"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <button class="icon-btn" type="button" title="Exporter" aria-label="Exporter" (click)="runTopbarAction('export')">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 4v10m0 0l-3.2-3.2M12 14l3.2-3.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M5 16.7V20h14v-3.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
        <button class="icon-btn" type="button" title="Param\xE8tres" aria-label="Param\xE8tres" (click)="runTopbarAction('settings')">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 8.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4z" stroke="currentColor" stroke-width="1.8" />
            <path
              d="M19.4 10.6l1.1 1.4-1.2 2-1.8.1a6 6 0 01-.6 1.4l1.1 1.4-1.8 1.8-1.4-1.1a6 6 0 01-1.4.6l-.1 1.8h-2l-.1-1.8a6 6 0 01-1.4-.6l-1.4 1.1-1.8-1.8 1.1-1.4a6 6 0 01-.6-1.4L3.5 14 2.3 12l1.1-1.4 1.8-.1a6 6 0 01.6-1.4L4.7 7.7l1.8-1.8 1.4 1.1a6 6 0 011.4-.6l.1-1.8h2l.1 1.8a6 6 0 011.4.6l1.4-1.1 1.8 1.8-1.1 1.4c.3.4.5.9.6 1.4l1.8.1z"
              stroke="currentColor"
              stroke-width="1.2"
            />
          </svg>
        </button>
      </div>
    </header>

    <div class="rolebar">
      <div class="rolechips">
        @for (chip of roleChips; track chip.role) {
          <button
            class="role-chip"
            type="button"
            [class.active]="selectedRole() === chip.role"
            [class.locked]="!isRoleAllowed(chip.role)"
            [disabled]="!isRoleAllowed(chip.role)"
            [title]="isRoleAllowed(chip.role) ? 'R\xF4le actif pour ce compte' : 'Acc\xE8s r\xE9serv\xE9 \xE0 un autre profil'"
            (click)="selectRole(chip.role)"
          >
            <span>{{ chip.icon }}</span>
            {{ chip.label }}
          </button>
        }
      </div>
    </div>

    <div #messagesEl class="messages-wrap">
      @for (message of messages(); track trackByMessageId($index, message)) {
        <article class="message-row" [class.user]="message.sender === 'user'" [class.ai]="message.sender === 'assistant'">
          @if (message.sender === 'assistant') {
            <div class="msg-avatar ai">\u2726</div>
            <div class="msg-bubble">
              @for (section of getSections(message); track section.key) {
                <section class="section-block">
                  <span class="section-tag" [class]="sectionClass(section.kind)">{{ section.label }}</span>
                  <div class="section-text">
                    @if (section.list) {
                      <ul>
                        @for (line of section.lines; track line) {
                          <li [innerHTML]="formatLine(line)"></li>
                        }
                      </ul>
                    } @else {
                      @for (line of section.lines; track line) {
                        <p [innerHTML]="formatLine(line)"></p>
                      }
                    }
                  </div>
                </section>
              }

              <div class="stats-grid">
                @for (stat of getStats(message); track stat.label) {
                  <article class="stat-card">
                    <div class="stat-label">{{ stat.label }}</div>
                    <div class="stat-value">{{ formatValue(stat.value) }}</div>
                    <div class="stat-trend" [class]="trendClass(stat.trend)">
                      {{ trendArrow(stat.trend) }} {{ formatTrend(stat.trend) }}
                    </div>
                  </article>
                }
              </div>

              <div class="progress-pack">
                @for (metric of getProgress(getStats(message)); track metric.label) {
                  <div class="progress-line">
                    <label>{{ metric.label }}</label>
                    <div class="track">
                      <div class="fill" [class]="progressFillClass(metric.tone)" [style.width.%]="metric.value"></div>
                    </div>
                    <span>{{ formatValue(metric.value) }}%</span>
                  </div>
                }
              </div>

              <div class="divider">Session \xB7 Analyse de performance</div>
            </div>
          } @else {
            <div class="msg-bubble">
              <p>{{ message.question }}</p>
            </div>
            <div class="msg-avatar user">{{ selectedRole() === 'CHEF_DEPARTEMENT' ? 'CD' : selectedRole() === 'ADMINISTRATION' ? 'AD' : selectedRole() === 'SUPER_ADMIN' ? 'SA' : 'EN' }}</div>
          }
        </article>
      }

      @if (pending()) {
        <article class="message-row ai">
          <div class="msg-avatar ai">\u2726</div>
          <div class="msg-bubble">
            <span class="typing-wrap">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </span>
          </div>
        </article>
      }
    </div>

    <div class="quickbar">
      @for (chip of activeQuickChips(); track chip.label) {
        <button class="quick-chip" type="button" (click)="applyQuickChip(chip)">{{ chip.icon }} {{ chip.label }}</button>
      }
    </div>

    <div class="inputbar">
      <div class="input-wrap">
        <textarea
          #composerEl
          class="composer"
          rows="1"
          [value]="draftQuestion()"
          placeholder="Posez votre question \xE0 PerfIA..."
          (input)="onComposerInput($event)"
          (keydown)="onComposerKeydown($event)"
        ></textarea>

        <button class="attach-btn" type="button" aria-label="Joindre">
          <svg viewBox="0 0 24 24" fill="none" width="17" height="17">
            <path d="M8.5 12.5l6.3-6.3a3 3 0 114.2 4.2l-8.1 8.1a5 5 0 01-7.1-7.1l8-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>

        <button class="send-btn" type="button" aria-label="Envoyer" [disabled]="!canSend()" (click)="sendMessage()">
          <svg viewBox="0 0 24 24" fill="none" width="17" height="17">
            <path d="M4 12l15-7-3.8 14-4.1-5.4L4 12z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>

    <footer class="footer">
      <span>Donn\xE9es prot\xE9g\xE9es \xB7 Facult\xE9</span>
      <span class="footer-right"><span class="small-green"></span>claude-sonnet-4 \xB7 PerfIA v2.0</span>
    </footer>
  </section>
}
`, styles: ['/* src/app/shared/assistant-widget.component.css */\n:host {\n  --accent: #4f6ef7;\n  --accent2: #7c3aed;\n  --accent3: #06b6d4;\n  --surface: rgba(15, 18, 32, 0.97);\n  --surface2: rgba(22, 28, 48, 0.95);\n  --surface3: rgba(30, 38, 65, 0.9);\n  --text1: #f0f4ff;\n  --text2: #a8b4d4;\n  --text3: #5a6a99;\n  --border: rgba(79, 110, 247, 0.2);\n  position: fixed;\n  right: 1rem;\n  bottom: 1rem;\n  z-index: 80;\n  font-family: "Outfit", sans-serif;\n}\n* {\n  box-sizing: border-box;\n}\n.assistant-fab {\n  width: 4rem;\n  height: 4rem;\n  border-radius: 999px;\n  border: 1px solid rgba(156, 184, 255, 0.5);\n  font-family: inherit;\n  font-size: 1.26rem;\n  font-weight: 800;\n  letter-spacing: 0.06em;\n  color: #fff;\n  cursor: pointer;\n  background:\n    radial-gradient(\n      90% 90% at 28% 22%,\n      rgba(255, 126, 174, 0.75),\n      transparent 62%),\n    linear-gradient(\n      140deg,\n      rgba(255, 74, 130, 0.96),\n      rgba(122, 58, 237, 0.95));\n  box-shadow:\n    0 18px 36px rgba(8, 13, 38, 0.6),\n    0 0 18px rgba(79, 110, 247, 0.52),\n    inset 0 1px 0 rgba(255, 255, 255, 0.36);\n}\n.perfia-shell {\n  position: absolute;\n  right: 0;\n  bottom: 4.8rem;\n  width: min(100vw - 1rem, 780px);\n  max-height: calc(100vh - 6rem);\n  display: grid;\n  grid-template-rows: auto auto minmax(0, 1fr) auto auto auto;\n  border-radius: 24px;\n  border: 1px solid var(--border);\n  background: var(--surface);\n  box-shadow:\n    0 32px 80px rgba(0, 0, 0, 0.6),\n    0 0 0 1px rgba(79, 110, 247, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.05);\n  transform-origin: right bottom;\n  transform: perspective(1200px) rotateX(1.5deg);\n  transition: transform 0.28s ease;\n  overflow: hidden;\n  isolation: isolate;\n}\n.perfia-shell:hover {\n  transform: perspective(1200px) rotateX(0deg);\n}\n.perfia-shell::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background-image:\n    linear-gradient(rgba(79, 110, 247, 0.08) 1px, transparent 1px),\n    linear-gradient(\n      90deg,\n      rgba(79, 110, 247, 0.08) 1px,\n      transparent 1px);\n  background-size: 40px 40px;\n  opacity: 0.42;\n  pointer-events: none;\n  z-index: 0;\n}\n.orb {\n  position: absolute;\n  border-radius: 999px;\n  filter: blur(24px);\n  pointer-events: none;\n  z-index: 1;\n}\n.orb-blue {\n  top: -95px;\n  right: -95px;\n  width: 260px;\n  height: 260px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(6, 182, 212, 0.52),\n      transparent 64%);\n  animation: pulse1 6s ease-in-out infinite;\n}\n.orb-violet {\n  left: -98px;\n  bottom: -114px;\n  width: 290px;\n  height: 290px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(124, 58, 237, 0.45),\n      transparent 68%);\n  animation: pulse2 8s ease-in-out infinite;\n}\n.topbar,\n.rolebar,\n.messages-wrap,\n.quickbar,\n.inputbar,\n.footer {\n  position: relative;\n  z-index: 2;\n}\n.topbar {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  padding: 0.88rem 1rem;\n  background: var(--surface2);\n  border-bottom: 1px solid rgba(79, 110, 247, 0.16);\n}\n.topbar-left {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.78rem;\n}\n.ai-avatar {\n  position: relative;\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  display: grid;\n  place-items: center;\n  color: #fff;\n  flex: none;\n  background:\n    linear-gradient(\n      135deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 16px rgba(79, 110, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.32);\n  animation: avatarGlow 3s infinite;\n}\n.ai-avatar::before {\n  content: "";\n  position: absolute;\n  inset: -3px;\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      120deg,\n      #7fa8ff,\n      #a066ff,\n      #35d2ff);\n  opacity: 0.85;\n  z-index: -1;\n  animation: ringRotate 4s linear infinite;\n}\n.ai-avatar svg {\n  width: 22px;\n  height: 22px;\n}\n.identity {\n  min-width: 0;\n  display: grid;\n  gap: 0.13rem;\n}\n.identity-top {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.identity-top strong {\n  font-size: 1.04rem;\n  color: var(--text1);\n  white-space: nowrap;\n}\n.badge-ai {\n  padding: 0.15rem 0.54rem;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  letter-spacing: 0.05em;\n  color: #fff;\n  background:\n    linear-gradient(\n      135deg,\n      var(--accent),\n      var(--accent2));\n}\n.status-line {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  font-size: 0.78rem;\n  color: var(--text2);\n}\n.status-dot {\n  width: 0.53rem;\n  height: 0.53rem;\n  border-radius: 999px;\n  background: #22c55e;\n  box-shadow: 0 0 10px rgba(34, 197, 94, 0.78);\n  animation: blink 2s infinite;\n}\n.topbar-actions {\n  display: flex;\n  gap: 0.45rem;\n}\n.icon-btn {\n  width: 36px;\n  height: 36px;\n  border-radius: 11px;\n  border: 1px solid rgba(156, 184, 255, 0.3);\n  background: rgba(255, 255, 255, 0.02);\n  color: var(--text2);\n  cursor: pointer;\n  display: grid;\n  place-items: center;\n  transition: all 0.18s ease;\n}\n.icon-btn:hover {\n  border-color: rgba(122, 176, 255, 0.82);\n  color: #deebff;\n  box-shadow: 0 0 14px rgba(79, 110, 247, 0.34);\n}\n.icon-btn svg {\n  width: 17px;\n  height: 17px;\n}\n.rolebar {\n  padding: 0.7rem 0.86rem;\n  border-bottom: 1px solid rgba(79, 110, 247, 0.16);\n  background: rgba(22, 28, 48, 0.72);\n}\n.rolechips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.45rem;\n}\n.role-chip {\n  border-radius: 999px;\n  border: 1px solid rgba(114, 133, 190, 0.32);\n  background: transparent;\n  color: var(--text2);\n  padding: 0.44rem 0.84rem;\n  font-family: inherit;\n  font-weight: 700;\n  letter-spacing: 0.03em;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.role-chip.active {\n  color: #fff;\n  background:\n    linear-gradient(\n      130deg,\n      rgba(79, 110, 247, 0.92),\n      rgba(124, 58, 237, 0.86));\n  border-color: rgba(122, 176, 255, 0.86);\n  box-shadow: 0 0 18px rgba(79, 110, 247, 0.35);\n}\n.role-chip.locked,\n.role-chip:disabled {\n  opacity: 0.46;\n  cursor: not-allowed;\n  filter: grayscale(0.2);\n}\n.messages-wrap {\n  min-height: 220px;\n  overflow: auto;\n  padding: 0.96rem 0.82rem;\n  overscroll-behavior: contain;\n}\n.messages-wrap::-webkit-scrollbar {\n  width: 0.45rem;\n}\n.messages-wrap::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(79, 110, 247, 0.88),\n      rgba(124, 58, 237, 0.76));\n}\n.message-row {\n  display: flex;\n  gap: 0.55rem;\n  margin-bottom: 0.68rem;\n  animation: msgIn 0.35s cubic-bezier(0.23, 1, 0.32, 1);\n}\n.message-row.user {\n  justify-content: flex-end;\n}\n.msg-avatar {\n  width: 30px;\n  height: 30px;\n  border-radius: 9px;\n  flex: none;\n  font-size: 0.75rem;\n  font-weight: 800;\n  display: grid;\n  place-items: center;\n}\n.msg-avatar.ai {\n  color: #fff;\n  background:\n    linear-gradient(\n      140deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 14px rgba(79, 110, 247, 0.4);\n}\n.msg-avatar.user {\n  color: #d8e0ff;\n  background: rgba(22, 28, 48, 0.96);\n  border: 1px solid rgba(154, 178, 239, 0.22);\n}\n.msg-bubble {\n  max-width: min(86%, 640px);\n  border: 1px solid rgba(129, 154, 225, 0.24);\n  padding: 0.66rem 0.78rem;\n}\n.message-row.ai .msg-bubble {\n  background: var(--surface3);\n  border-radius: 4px 16px 16px 16px;\n}\n.message-row.user .msg-bubble {\n  color: #eef2ff;\n  background:\n    linear-gradient(\n      135deg,\n      #4f6ef7,\n      #5b50f0);\n  border-color: rgba(156, 180, 255, 0.34);\n  border-radius: 16px 4px 16px 16px;\n  box-shadow: 0 4px 20px rgba(79, 110, 247, 0.35);\n}\n.msg-bubble p {\n  margin: 0.1rem 0 0;\n  color: var(--text1);\n  line-height: 1.5;\n}\n.section-block + .section-block {\n  margin-top: 0.5rem;\n}\n.section-tag {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 0.15rem 0.52rem;\n  font-size: 0.69rem;\n  letter-spacing: 0.05em;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.tag-summary {\n  color: #34d399;\n  background: rgba(52, 211, 153, 0.13);\n}\n.tag-analysis {\n  color: #818cf8;\n  background: rgba(129, 140, 248, 0.14);\n}\n.tag-recommendation {\n  color: #fcd34d;\n  background: rgba(252, 211, 77, 0.14);\n}\n.tag-risk {\n  color: #fca5a5;\n  background: rgba(248, 113, 113, 0.12);\n}\n.section-text {\n  margin-top: 0.34rem;\n  font-size: 0.92rem;\n}\n.section-text ul {\n  margin: 0;\n  padding-left: 1rem;\n  display: grid;\n  gap: 0.16rem;\n}\n.stats-grid {\n  margin-top: 0.62rem;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.35rem;\n}\n.stat-card {\n  border-radius: 10px;\n  border: 1px solid rgba(129, 154, 225, 0.18);\n  background: rgba(15, 18, 32, 0.8);\n  padding: 0.42rem 0.5rem;\n}\n.stat-label {\n  font-family: "JetBrains Mono", monospace;\n  text-transform: uppercase;\n  font-size: 0.58rem;\n  color: var(--text3);\n}\n.stat-value {\n  font-family: "JetBrains Mono", monospace;\n  font-size: 18px;\n  font-weight: 800;\n  margin-top: 0.18rem;\n}\n.stat-trend {\n  margin-top: 0.08rem;\n  font-size: 0.69rem;\n  font-family: "JetBrains Mono", monospace;\n}\n.trend-up {\n  color: #34d399;\n}\n.trend-down {\n  color: #f87171;\n}\n.progress-pack {\n  margin-top: 0.56rem;\n  display: grid;\n  gap: 0.3rem;\n}\n.progress-line {\n  display: grid;\n  grid-template-columns: 7rem 1fr auto;\n  align-items: center;\n  gap: 0.45rem;\n}\n.progress-line label,\n.progress-line span {\n  font-size: 0.66rem;\n  color: var(--text2);\n  font-family: "JetBrains Mono", monospace;\n}\n.track {\n  height: 6px;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.06);\n  overflow: hidden;\n}\n.fill {\n  height: 100%;\n  border-radius: inherit;\n  box-shadow: 0 0 12px currentColor;\n}\n.fill-teaching {\n  color: #6fa3ff;\n  background:\n    linear-gradient(\n      90deg,\n      #4f6ef7,\n      #7c3aed);\n}\n.fill-research {\n  color: #67d9ff;\n  background:\n    linear-gradient(\n      90deg,\n      #7c3aed,\n      #06b6d4);\n}\n.fill-supervision {\n  color: #ffb95a;\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b,\n      #fb7185);\n}\n.divider {\n  margin: 0.7rem 0 0.15rem;\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--text3);\n  font-family: "JetBrains Mono", monospace;\n  font-size: 0.74rem;\n}\n.divider::before,\n.divider::after {\n  content: "";\n  height: 1px;\n  background: rgba(112, 131, 191, 0.3);\n}\n.typing-wrap {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.typing-dot {\n  width: 0.4rem;\n  height: 0.4rem;\n  border-radius: 999px;\n  animation: typingBounce 0.9s ease-in-out infinite;\n}\n.typing-dot:nth-child(1) {\n  background: #4f6ef7;\n  animation-delay: 0s;\n}\n.typing-dot:nth-child(2) {\n  background: #6366f1;\n  animation-delay: 0.2s;\n}\n.typing-dot:nth-child(3) {\n  background: #7c3aed;\n  animation-delay: 0.4s;\n}\n.quickbar {\n  padding: 0.55rem 0.76rem 0.72rem;\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.quick-chip {\n  border-radius: 999px;\n  border: 1px solid rgba(117, 143, 214, 0.34);\n  padding: 0.42rem 0.78rem;\n  color: var(--text2);\n  background: rgba(255, 255, 255, 0.02);\n  font-family: inherit;\n  cursor: pointer;\n  transition: all 0.18s ease;\n}\n.quick-chip:hover {\n  transform: translateY(-1px);\n  border-color: rgba(122, 176, 255, 0.85);\n  background: rgba(79, 110, 247, 0.14);\n  color: #deebff;\n}\n.inputbar {\n  padding: 0.72rem 0.82rem 0.78rem;\n  background: var(--surface2);\n  border-top: 1px solid rgba(79, 110, 247, 0.16);\n}\n.input-wrap {\n  border-radius: 16px;\n  border: 1px solid rgba(122, 146, 207, 0.34);\n  background: rgba(15, 18, 32, 0.58);\n  padding: 0.44rem;\n  display: grid;\n  grid-template-columns: 1fr auto auto;\n  gap: 0.35rem;\n  align-items: end;\n}\n.composer {\n  width: 100%;\n  min-height: 40px;\n  max-height: 140px;\n  resize: none;\n  border: 0;\n  outline: none;\n  border-radius: 12px;\n  background: transparent;\n  color: var(--text1);\n  font: inherit;\n  font-size: 0.98rem;\n  line-height: 1.4;\n  padding: 0.48rem 0.58rem;\n}\n.composer::placeholder {\n  color: #7f8cb0;\n}\n.input-wrap:focus-within {\n  border-color: rgba(109, 160, 255, 0.92);\n  box-shadow: 0 0 0 1px rgba(109, 160, 255, 0.24), 0 0 20px rgba(79, 110, 247, 0.32);\n}\n.attach-btn,\n.send-btn {\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  border: 1px solid rgba(122, 146, 207, 0.36);\n  display: grid;\n  place-items: center;\n  cursor: pointer;\n}\n.attach-btn {\n  background: rgba(255, 255, 255, 0.03);\n  color: var(--text2);\n}\n.send-btn {\n  border-color: rgba(156, 185, 255, 0.55);\n  color: #fff;\n  background:\n    linear-gradient(\n      140deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 18px rgba(79, 110, 247, 0.45);\n  transition: transform 0.18s ease;\n}\n.send-btn:hover:not(:disabled) {\n  transform: scale(1.06);\n}\n.send-btn:disabled {\n  opacity: 0.58;\n  cursor: not-allowed;\n}\n.footer {\n  border-top: 1px solid rgba(79, 110, 247, 0.18);\n  background: rgba(11, 15, 29, 0.9);\n  padding: 0.5rem 0.82rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.7rem;\n  color: var(--text3);\n  font-family: "JetBrains Mono", monospace;\n  font-size: 0.73rem;\n}\n.footer-right {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.small-green {\n  width: 0.45rem;\n  height: 0.45rem;\n  border-radius: 999px;\n  background: #2fd684;\n  animation: blink 2s infinite;\n}\n@media (max-width: 780px) {\n  :host {\n    right: 0.45rem;\n    bottom: 0.45rem;\n  }\n  .assistant-fab {\n    width: 3.6rem;\n    height: 3.6rem;\n  }\n  .perfia-shell {\n    width: calc(100vw - 0.7rem);\n    bottom: 4.3rem;\n    max-height: calc(100vh - 5.4rem);\n  }\n  .messages-wrap {\n    min-height: 180px;\n    padding: 0.68rem;\n  }\n  .msg-bubble {\n    max-width: 92%;\n  }\n  .stats-grid {\n    grid-template-columns: 1fr;\n  }\n  .progress-line {\n    grid-template-columns: 1fr;\n    gap: 0.2rem;\n  }\n  .input-wrap {\n    grid-template-columns: 1fr;\n  }\n  .attach-btn,\n  .send-btn {\n    width: 100%;\n  }\n  .footer {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n}\n@keyframes avatarGlow {\n  0%, 100% {\n    box-shadow: 0 0 12px rgba(79, 110, 247, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.22);\n  }\n  50% {\n    box-shadow:\n      0 0 24px rgba(79, 110, 247, 0.75),\n      0 0 18px rgba(124, 58, 237, 0.45),\n      inset 0 1px 0 rgba(255, 255, 255, 0.28);\n  }\n}\n@keyframes ringRotate {\n  0% {\n    filter: hue-rotate(0deg);\n  }\n  100% {\n    filter: hue-rotate(360deg);\n  }\n}\n@keyframes pulse1 {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 0.78;\n  }\n  50% {\n    transform: scale(1.16);\n    opacity: 0.45;\n  }\n}\n@keyframes pulse2 {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 0.82;\n  }\n  50% {\n    transform: scale(1.2);\n    opacity: 0.36;\n  }\n}\n@keyframes blink {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.3;\n  }\n}\n@keyframes msgIn {\n  from {\n    transform: translateY(7px) scale(0.985);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0) scale(1);\n    opacity: 1;\n  }\n}\n@keyframes typingBounce {\n  0%, 80%, 100% {\n    transform: translateY(0);\n    opacity: 0.6;\n  }\n  40% {\n    transform: translateY(-4px);\n    opacity: 1;\n  }\n}\n/*# sourceMappingURL=assistant-widget.component.css.map */\n'] }]
  }], null, { composerEl: [{
    type: ViewChild,
    args: ["composerEl"]
  }], messagesEl: [{
    type: ViewChild,
    args: ["messagesEl"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassDebugInfo(AssistantWidgetComponent, { className: "AssistantWidgetComponent", filePath: "src/app/shared/assistant-widget.component.ts", lineNumber: 58 });
})();
(() => {
  const id = "src%2Fapp%2Fshared%2Fassistant-widget.component.ts%40AssistantWidgetComponent";
  function AssistantWidgetComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i03.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i03.\u0275\u0275replaceMetadata(AssistantWidgetComponent, m.default, [i03], [Component, ChangeDetectionStrategy, ViewChild], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && AssistantWidgetComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && AssistantWidgetComponent_HmrLoad(d.timestamp)));
})();

// src/app/shared/toast-outlet.component.ts
import { ChangeDetectionStrategy as ChangeDetectionStrategy2, Component as Component2, inject as inject4 } from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
import * as i04 from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
var _forTrack02 = ($index, $item) => $item.id;
function ToastOutletComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = i04.\u0275\u0275getCurrentView();
    i04.\u0275\u0275domElementStart(0, "article")(1, "div", 2)(2, "strong");
    i04.\u0275\u0275text(3);
    i04.\u0275\u0275domElementEnd();
    i04.\u0275\u0275domElementStart(4, "p");
    i04.\u0275\u0275text(5);
    i04.\u0275\u0275domElementEnd()();
    i04.\u0275\u0275domElementStart(6, "button", 3);
    i04.\u0275\u0275domListener("click", function ToastOutletComponent_For_2_Template_button_click_6_listener() {
      const toast_r2 = i04.\u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = i04.\u0275\u0275nextContext();
      return i04.\u0275\u0275resetView(ctx_r2.dismiss(toast_r2.id));
    });
    i04.\u0275\u0275text(7, " \xD7 ");
    i04.\u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const toast_r2 = ctx.$implicit;
    i04.\u0275\u0275classMap(i04.\u0275\u0275interpolate1("toast-card toast-", toast_r2.tone));
    i04.\u0275\u0275advance(3);
    i04.\u0275\u0275textInterpolate(toast_r2.title);
    i04.\u0275\u0275advance(2);
    i04.\u0275\u0275textInterpolate(toast_r2.message);
  }
}
var ToastOutletComponent = class _ToastOutletComponent {
  toastService = inject4(UiToastService);
  toasts = this.toastService.toasts;
  dismiss(id) {
    this.toastService.dismiss(id);
  }
  static \u0275fac = function ToastOutletComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastOutletComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i04.\u0275\u0275defineComponent({ type: _ToastOutletComponent, selectors: [["app-toast-outlet"]], decls: 3, vars: 0, consts: [["aria-live", "polite", "aria-atomic", "true", 1, "toast-stack"], [3, "class"], [1, "toast-copy"], ["type", "button", "aria-label", "Fermer la notification", 1, "toast-close", 3, "click"]], template: function ToastOutletComponent_Template(rf, ctx) {
    if (rf & 1) {
      i04.\u0275\u0275domElementStart(0, "section", 0);
      i04.\u0275\u0275repeaterCreate(1, ToastOutletComponent_For_2_Template, 8, 5, "article", 1, _forTrack02);
      i04.\u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      i04.\u0275\u0275advance();
      i04.\u0275\u0275repeater(ctx.toasts());
    }
  }, styles: ["\n.toast-stack[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 1.4rem;\n  right: 1.4rem;\n  z-index: 40;\n  display: grid;\n  gap: 0.8rem;\n  width: min(360px, calc(100vw - 2rem));\n  pointer-events: none;\n}\n.toast-card[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 0.75rem;\n  align-items: start;\n  padding: 1rem 1.05rem;\n  border-radius: 20px;\n  box-shadow: 0 28px 55px rgba(17, 42, 63, 0.18);\n  border: 1px solid rgba(20, 50, 74, 0.08);\n  -webkit-backdrop-filter: blur(14px);\n  backdrop-filter: blur(14px);\n  pointer-events: auto;\n}\n.toast-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  margin-bottom: 0.25rem;\n  font-size: 0.95rem;\n}\n.toast-copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: rgba(20, 50, 74, 0.8);\n  line-height: 1.55;\n  font-size: 0.9rem;\n}\n.toast-close[_ngcontent-%COMP%] {\n  cursor: pointer;\n  border: 0;\n  background: transparent;\n  color: inherit;\n  font-size: 1.2rem;\n  line-height: 1;\n  opacity: 0.7;\n}\n.toast-success[_ngcontent-%COMP%] {\n  background: rgba(226, 247, 232, 0.94);\n  color: #155c37;\n}\n.toast-error[_ngcontent-%COMP%] {\n  background: rgba(255, 233, 233, 0.96);\n  color: #8e2c2c;\n}\n.toast-info[_ngcontent-%COMP%] {\n  background: rgba(231, 243, 244, 0.96);\n  color: #1b5c60;\n}\n.toast-warning[_ngcontent-%COMP%] {\n  background: rgba(255, 243, 224, 0.96);\n  color: #8b560e;\n}\n@media (max-width: 768px) {\n  .toast-stack[_ngcontent-%COMP%] {\n    top: auto;\n    right: 1rem;\n    bottom: 1rem;\n    left: 1rem;\n    width: auto;\n  }\n}\n/*# sourceMappingURL=toast-outlet.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassMetadata(ToastOutletComponent, [{
    type: Component2,
    args: [{ selector: "app-toast-outlet", template: `
    <section class="toast-stack" aria-live="polite" aria-atomic="true">
      @for (toast of toasts(); track toast.id) {
        <article class="toast-card toast-{{ toast.tone }}">
          <div class="toast-copy">
            <strong>{{ toast.title }}</strong>
            <p>{{ toast.message }}</p>
          </div>
          <button type="button" class="toast-close" (click)="dismiss(toast.id)" aria-label="Fermer la notification">
            \xD7
          </button>
        </article>
      }
    </section>
  `, changeDetection: ChangeDetectionStrategy2.OnPush, styles: ["/* angular:styles/component:css;12651ac8befd2b558b969290d98ea6dc6d79c7b1f1daad964b14cc2ef7c9833a;C:/Users/Asus/Desktop/NV PFE/frontend/src/app/shared/toast-outlet.component.ts */\n.toast-stack {\n  position: fixed;\n  top: 1.4rem;\n  right: 1.4rem;\n  z-index: 40;\n  display: grid;\n  gap: 0.8rem;\n  width: min(360px, calc(100vw - 2rem));\n  pointer-events: none;\n}\n.toast-card {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 0.75rem;\n  align-items: start;\n  padding: 1rem 1.05rem;\n  border-radius: 20px;\n  box-shadow: 0 28px 55px rgba(17, 42, 63, 0.18);\n  border: 1px solid rgba(20, 50, 74, 0.08);\n  -webkit-backdrop-filter: blur(14px);\n  backdrop-filter: blur(14px);\n  pointer-events: auto;\n}\n.toast-copy strong {\n  display: block;\n  margin-bottom: 0.25rem;\n  font-size: 0.95rem;\n}\n.toast-copy p {\n  margin: 0;\n  color: rgba(20, 50, 74, 0.8);\n  line-height: 1.55;\n  font-size: 0.9rem;\n}\n.toast-close {\n  cursor: pointer;\n  border: 0;\n  background: transparent;\n  color: inherit;\n  font-size: 1.2rem;\n  line-height: 1;\n  opacity: 0.7;\n}\n.toast-success {\n  background: rgba(226, 247, 232, 0.94);\n  color: #155c37;\n}\n.toast-error {\n  background: rgba(255, 233, 233, 0.96);\n  color: #8e2c2c;\n}\n.toast-info {\n  background: rgba(231, 243, 244, 0.96);\n  color: #1b5c60;\n}\n.toast-warning {\n  background: rgba(255, 243, 224, 0.96);\n  color: #8b560e;\n}\n@media (max-width: 768px) {\n  .toast-stack {\n    top: auto;\n    right: 1rem;\n    bottom: 1rem;\n    left: 1rem;\n    width: auto;\n  }\n}\n/*# sourceMappingURL=toast-outlet.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i04.\u0275setClassDebugInfo(ToastOutletComponent, { className: "ToastOutletComponent", filePath: "src/app/shared/toast-outlet.component.ts", lineNumber: 103 });
})();
(() => {
  const id = "src%2Fapp%2Fshared%2Ftoast-outlet.component.ts%40ToastOutletComponent";
  function ToastOutletComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i04.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i04.\u0275\u0275replaceMetadata(ToastOutletComponent, m.default, [i04], [Component2, ChangeDetectionStrategy2], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && ToastOutletComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && ToastOutletComponent_HmrLoad(d.timestamp)));
})();

// src/app/layout/app-shell.component.ts
import * as i05 from "/@fs/C:/Users/Asus/Desktop/NV PFE/frontend/.angular/cache/21.2.5/frontend/vite/deps/@angular_core.js?v=9353569b";
var _c02 = () => ({ exact: true });
var _forTrack03 = ($index, $item) => $item.path;
var _forTrack12 = ($index, $item) => $item.id;
function AppShellComponent_For_12_Conditional_0_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "small");
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = i05.\u0275\u0275nextContext(3).$implicit;
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate(item_r2.hint);
  }
}
function AppShellComponent_For_12_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = i05.\u0275\u0275getCurrentView();
    i05.\u0275\u0275elementStart(0, "button", 32);
    i05.\u0275\u0275listener("click", function AppShellComponent_For_12_Conditional_0_Conditional_1_Template_button_click_0_listener() {
      i05.\u0275\u0275restoreView(_r1);
      const item_r2 = i05.\u0275\u0275nextContext(2).$implicit;
      const ctx_r2 = i05.\u0275\u0275nextContext();
      return i05.\u0275\u0275resetView(ctx_r2.toggleNavGroup(item_r2));
    });
    i05.\u0275\u0275elementStart(1, "span", 33);
    i05.\u0275\u0275text(2);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(3, "span", 34)(4, "strong");
    i05.\u0275\u0275text(5);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275conditionalCreate(6, AppShellComponent_For_12_Conditional_0_Conditional_1_Conditional_6_Template, 2, 1, "small");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275element(7, "span", 35);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = i05.\u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = i05.\u0275\u0275nextContext();
    i05.\u0275\u0275classProp("active-link", ctx_r2.isNavGroupActive(item_r2));
    i05.\u0275\u0275attribute("aria-expanded", ctx_r2.isNavGroupExpanded(item_r2));
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275textInterpolate(item_r2.icon);
    i05.\u0275\u0275advance(3);
    i05.\u0275\u0275textInterpolate(item_r2.label);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275conditional(item_r2.hint ? 6 : -1);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275classProp("expanded", ctx_r2.isNavGroupExpanded(item_r2));
  }
}
function AppShellComponent_For_12_Conditional_0_Conditional_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "small");
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = i05.\u0275\u0275nextContext(3).$implicit;
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate(item_r2.hint);
  }
}
function AppShellComponent_For_12_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 36)(1, "span", 33);
    i05.\u0275\u0275text(2);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(3, "span", 34)(4, "strong");
    i05.\u0275\u0275text(5);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275conditionalCreate(6, AppShellComponent_For_12_Conditional_0_Conditional_2_Conditional_6_Template, 2, 1, "small");
    i05.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = i05.\u0275\u0275nextContext(2).$implicit;
    const ctx_r2 = i05.\u0275\u0275nextContext();
    i05.\u0275\u0275classProp("active-link", ctx_r2.isNavGroupActive(item_r2));
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275textInterpolate(item_r2.icon);
    i05.\u0275\u0275advance(3);
    i05.\u0275\u0275textInterpolate(item_r2.label);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275conditional(item_r2.hint ? 6 : -1);
  }
}
function AppShellComponent_For_12_Conditional_0_For_5_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "a", 31);
    i05.\u0275\u0275element(1, "span", 37);
    i05.\u0275\u0275elementStart(2, "span", 38)(3, "strong");
    i05.\u0275\u0275text(4);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(5, "small");
    i05.\u0275\u0275text(6);
    i05.\u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const child_r4 = ctx.$implicit;
    i05.\u0275\u0275property("routerLink", child_r4.path)("routerLinkActiveOptions", i05.\u0275\u0275pureFunction0(4, _c02));
    i05.\u0275\u0275advance(4);
    i05.\u0275\u0275textInterpolate(child_r4.label);
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275textInterpolate(child_r4.hint);
  }
}
function AppShellComponent_For_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 27);
    i05.\u0275\u0275conditionalCreate(1, AppShellComponent_For_12_Conditional_0_Conditional_1_Template, 8, 8, "button", 28)(2, AppShellComponent_For_12_Conditional_0_Conditional_2_Template, 7, 5, "div", 29);
    i05.\u0275\u0275elementStart(3, "div", 30);
    i05.\u0275\u0275repeaterCreate(4, AppShellComponent_For_12_Conditional_0_For_5_Template, 7, 5, "a", 31, _forTrack03);
    i05.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = i05.\u0275\u0275nextContext().$implicit;
    const ctx_r2 = i05.\u0275\u0275nextContext();
    i05.\u0275\u0275classProp("active-group", ctx_r2.isNavGroupActive(item_r2));
    i05.\u0275\u0275advance();
    i05.\u0275\u0275conditional(item_r2.collapsible ? 1 : 2);
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275classProp("nav-submenu-collapsed", !ctx_r2.isNavGroupExpanded(item_r2));
    i05.\u0275\u0275advance();
    i05.\u0275\u0275repeater(item_r2.children);
  }
}
function AppShellComponent_For_12_Conditional_1_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "small");
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = i05.\u0275\u0275nextContext(2).$implicit;
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate(item_r2.hint);
  }
}
function AppShellComponent_For_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "a", 26)(1, "span", 33);
    i05.\u0275\u0275text(2);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(3, "span", 34)(4, "strong");
    i05.\u0275\u0275text(5);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275conditionalCreate(6, AppShellComponent_For_12_Conditional_1_Conditional_6_Template, 2, 1, "small");
    i05.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = i05.\u0275\u0275nextContext().$implicit;
    i05.\u0275\u0275property("routerLink", item_r2.path)("routerLinkActiveOptions", i05.\u0275\u0275pureFunction0(5, _c02));
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275textInterpolate(item_r2.icon);
    i05.\u0275\u0275advance(3);
    i05.\u0275\u0275textInterpolate(item_r2.label);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275conditional(item_r2.hint ? 6 : -1);
  }
}
function AppShellComponent_For_12_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275conditionalCreate(0, AppShellComponent_For_12_Conditional_0_Template, 6, 5, "div", 25)(1, AppShellComponent_For_12_Conditional_1_Template, 7, 6, "a", 26);
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    i05.\u0275\u0275conditional((item_r2.children == null ? null : item_r2.children.length) ? 0 : 1);
  }
}
function AppShellComponent_Conditional_13_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "span", 41);
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate(ctx_r2.unreadNotificationsCount());
  }
}
function AppShellComponent_Conditional_13_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "p", 42);
    i05.\u0275\u0275text(1, "Chargement...");
    i05.\u0275\u0275elementEnd();
  }
}
function AppShellComponent_Conditional_13_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "p", 42);
    i05.\u0275\u0275text(1, "Aucune notification recente.");
    i05.\u0275\u0275elementEnd();
  }
}
function AppShellComponent_Conditional_13_Conditional_10_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = i05.\u0275\u0275getCurrentView();
    i05.\u0275\u0275elementStart(0, "button", 46);
    i05.\u0275\u0275listener("click", function AppShellComponent_Conditional_13_Conditional_10_For_2_Template_button_click_0_listener() {
      const notification_r6 = i05.\u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = i05.\u0275\u0275nextContext(3);
      return i05.\u0275\u0275resetView(ctx_r2.markNotificationAsRead(notification_r6.id));
    });
    i05.\u0275\u0275elementStart(1, "strong");
    i05.\u0275\u0275text(2);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(3, "small");
    i05.\u0275\u0275text(4);
    i05.\u0275\u0275pipe(5, "date");
    i05.\u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const notification_r6 = ctx.$implicit;
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275textInterpolate(notification_r6.title);
    i05.\u0275\u0275advance(2);
    i05.\u0275\u0275textInterpolate(i05.\u0275\u0275pipeBind2(5, 2, notification_r6.createdAt, "dd/MM HH:mm"));
  }
}
function AppShellComponent_Conditional_13_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "div", 43);
    i05.\u0275\u0275repeaterCreate(1, AppShellComponent_Conditional_13_Conditional_10_For_2_Template, 6, 5, "button", 45, _forTrack12);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = i05.\u0275\u0275nextContext(2);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275repeater(ctx_r2.recentNotifications());
  }
}
function AppShellComponent_Conditional_13_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = i05.\u0275\u0275getCurrentView();
    i05.\u0275\u0275elementStart(0, "button", 47);
    i05.\u0275\u0275listener("click", function AppShellComponent_Conditional_13_Conditional_11_Template_button_click_0_listener() {
      i05.\u0275\u0275restoreView(_r7);
      const ctx_r2 = i05.\u0275\u0275nextContext(2);
      return i05.\u0275\u0275resetView(ctx_r2.markAllNotificationsAsRead());
    });
    i05.\u0275\u0275text(1, "Tout lire");
    i05.\u0275\u0275elementEnd();
  }
}
function AppShellComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "section", 7)(1, "div", 39)(2, "div")(3, "p", 40);
    i05.\u0275\u0275text(4, "Centre");
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275elementStart(5, "strong");
    i05.\u0275\u0275text(6, "Notifications");
    i05.\u0275\u0275elementEnd()();
    i05.\u0275\u0275conditionalCreate(7, AppShellComponent_Conditional_13_Conditional_7_Template, 2, 1, "span", 41);
    i05.\u0275\u0275elementEnd();
    i05.\u0275\u0275conditionalCreate(8, AppShellComponent_Conditional_13_Conditional_8_Template, 2, 0, "p", 42)(9, AppShellComponent_Conditional_13_Conditional_9_Template, 2, 0, "p", 42)(10, AppShellComponent_Conditional_13_Conditional_10_Template, 3, 0, "div", 43);
    i05.\u0275\u0275conditionalCreate(11, AppShellComponent_Conditional_13_Conditional_11_Template, 2, 0, "button", 44);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = i05.\u0275\u0275nextContext();
    i05.\u0275\u0275advance(7);
    i05.\u0275\u0275conditional(ctx_r2.unreadNotificationsCount() > 0 ? 7 : -1);
    i05.\u0275\u0275advance();
    i05.\u0275\u0275conditional(ctx_r2.notificationsLoading() ? 8 : ctx_r2.recentNotifications().length === 0 ? 9 : 10);
    i05.\u0275\u0275advance(3);
    i05.\u0275\u0275conditional(ctx_r2.unreadNotificationsCount() > 0 ? 11 : -1);
  }
}
function AppShellComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    i05.\u0275\u0275elementStart(0, "small");
    i05.\u0275\u0275text(1);
    i05.\u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r2 = i05.\u0275\u0275nextContext();
    i05.\u0275\u0275advance();
    i05.\u0275\u0275textInterpolate((tmp_1_0 = ctx_r2.user()) == null ? null : tmp_1_0.departmentName);
  }
}
var AppShellComponent = class _AppShellComponent {
  authService = inject5(AuthService);
  notificationService = inject5(NotificationService);
  toastService = inject5(UiToastService);
  destroyRef = inject5(DestroyRef2);
  router = inject5(Router);
  user = this.authService.user;
  isAdministration = computed2(() => this.authService.hasAnyRole("ADMINISTRATION"), ...ngDevMode ? [{ debugName: "isAdministration" }] : (
    /* istanbul ignore next */
    []
  ));
  isDepartmentHead = computed2(() => this.authService.hasAnyRole("CHEF_DEPARTEMENT"), ...ngDevMode ? [{ debugName: "isDepartmentHead" }] : (
    /* istanbul ignore next */
    []
  ));
  isSuperAdmin = computed2(() => this.authService.hasAnyRole("SUPER_ADMIN"), ...ngDevMode ? [{ debugName: "isSuperAdmin" }] : (
    /* istanbul ignore next */
    []
  ));
  showNotificationCenter = computed2(() => false, ...ngDevMode ? [{ debugName: "showNotificationCenter" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationsLoading = signal2(false, ...ngDevMode ? [{ debugName: "notificationsLoading" }] : (
    /* istanbul ignore next */
    []
  ));
  notificationOverview = signal2(null, ...ngDevMode ? [{ debugName: "notificationOverview" }] : (
    /* istanbul ignore next */
    []
  ));
  currentUrl = signal2(this.router.url, ...ngDevMode ? [{ debugName: "currentUrl" }] : (
    /* istanbul ignore next */
    []
  ));
  currentDateTime = signal2(/* @__PURE__ */ new Date(), ...ngDevMode ? [{ debugName: "currentDateTime" }] : (
    /* istanbul ignore next */
    []
  ));
  expandedNavGroups = signal2({}, ...ngDevMode ? [{ debugName: "expandedNavGroups" }] : (
    /* istanbul ignore next */
    []
  ));
  navItems = computed2(() => {
    const items = [
      {
        label: this.isAdministration() || this.isDepartmentHead() ? "Tableau de bord de performance" : "Tableau de bord",
        path: "/dashboard",
        icon: "TB",
        hint: this.isAdministration() || this.isDepartmentHead() ? "Indicateurs et suivi" : "",
        visible: !this.isSuperAdmin()
      },
      {
        label: this.isDepartmentHead() ? "Activites enseignants" : "Mes activites",
        path: "/teaching",
        icon: "AC",
        hint: this.isDepartmentHead() ? "Consultation du departement" : "Toutes vos declarations",
        visible: this.authService.hasAnyRole("ENSEIGNANT", "CHEF_DEPARTEMENT"),
        children: [
          { label: "Cours", path: "/teaching", hint: "Formation et modules" },
          { label: "Encadrements", path: "/supervision", hint: "PFE et jurys" },
          { label: "Recherche", path: "/research", hint: "Articles et conferences" },
          { label: "Evenements", path: "/events", hint: "Organisation scientifique" },
          { label: "Surveillances", path: "/exam-surveillance", hint: "Examens" },
          {
            label: "Responsabilites",
            path: "/responsibilities",
            hint: "Roles institutionnels"
          },
          {
            label: "Partenariat",
            path: "/partnerships",
            hint: "Declaration academique / professionnelle",
            visible: this.authService.hasAnyRole("ENSEIGNANT", "CHEF_DEPARTEMENT")
          }
        ]
      },
      {
        label: "Disponibilite",
        path: "/availability/leave",
        icon: "DP",
        hint: "Conges et missions",
        visible: this.authService.hasAnyRole("ENSEIGNANT"),
        collapsible: true,
        children: [
          { label: "Demander un conge", path: "/availability/leave", hint: "Declaration de conge" },
          { label: "Demander une mission", path: "/availability/mission", hint: "Declaration de mission" }
        ]
      },
      {
        label: this.isSuperAdmin() ? "Utilisateurs et roles" : "Utilisateurs",
        path: "/users",
        icon: "US",
        hint: this.isSuperAdmin() ? "Gestion des utilisateurs et des roles" : "Comptes et roles",
        visible: this.authService.hasAnyRole("SUPER_ADMIN")
      },
      {
        label: this.isDepartmentHead() ? "Validation departementale" : "Workflow",
        path: "/workflow",
        icon: "WF",
        hint: this.isDepartmentHead() ? "Valider ou rejeter les dossiers" : "Validation des dossiers",
        visible: this.authService.hasAnyRole("CHEF_DEPARTEMENT", "ADMINISTRATION")
      },
      {
        label: this.isAdministration() ? "Rapports institutionnels" : this.isDepartmentHead() ? "Rapports departementaux" : "Rapport individuel",
        path: "/reports",
        icon: "RP",
        hint: this.isAdministration() ? "Rapports et primes de performance" : this.isDepartmentHead() ? "Exports consolides du departement" : "Generation et historique individuel",
        visible: !this.isSuperAdmin()
      },
      {
        label: "Profil et securite",
        path: "/profile",
        icon: "PR",
        hint: "Compte, profil et 2FA",
        visible: this.authService.hasAnyRole("ENSEIGNANT", "CHEF_DEPARTEMENT", "ADMINISTRATION", "SUPER_ADMIN")
      }
    ];
    return items.map((item) => __spreadProps(__spreadValues({}, item), {
      children: item.children?.filter((child) => child.visible !== false)
    })).filter((item) => item.visible);
  }, ...ngDevMode ? [{ debugName: "navItems" }] : (
    /* istanbul ignore next */
    []
  ));
  recentNotifications = computed2(() => (this.notificationOverview()?.notifications ?? []).slice(0, 3), ...ngDevMode ? [{ debugName: "recentNotifications" }] : (
    /* istanbul ignore next */
    []
  ));
  unreadNotificationsCount = computed2(() => this.notificationOverview()?.unreadCount ?? 0, ...ngDevMode ? [{ debugName: "unreadNotificationsCount" }] : (
    /* istanbul ignore next */
    []
  ));
  currentDateLabel = computed2(() => new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  }).format(this.currentDateTime()), ...ngDevMode ? [{ debugName: "currentDateLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  currentTimeLabel = computed2(() => new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(this.currentDateTime()), ...ngDevMode ? [{ debugName: "currentTimeLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  workspaceGreeting = computed2(() => {
    const hour = this.currentDateTime().getHours();
    if (hour < 12) {
      return "Bonjour";
    }
    if (hour < 18) {
      return "Bon apres-midi";
    }
    return "Bonsoir";
  }, ...ngDevMode ? [{ debugName: "workspaceGreeting" }] : (
    /* istanbul ignore next */
    []
  ));
  activeWorkspaceLabel = computed2(() => {
    const currentUrl = this.currentUrl();
    for (const item of this.navItems()) {
      const activeChild = item.children?.find((child) => currentUrl === child.path || currentUrl.startsWith(`${child.path}/`));
      if (activeChild) {
        return activeChild.label;
      }
      if (currentUrl === item.path || currentUrl.startsWith(`${item.path}/`)) {
        return item.label;
      }
    }
    return "Espace de travail";
  }, ...ngDevMode ? [{ debugName: "activeWorkspaceLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  activeWorkspaceHint = computed2(() => {
    const currentUrl = this.currentUrl();
    for (const item of this.navItems()) {
      const activeChild = item.children?.find((child) => currentUrl === child.path || currentUrl.startsWith(`${child.path}/`));
      if (activeChild) {
        return activeChild.hint;
      }
      if (currentUrl === item.path || currentUrl.startsWith(`${item.path}/`)) {
        return item.hint;
      }
    }
    return "Plateforme academique ESPRIT";
  }, ...ngDevMode ? [{ debugName: "activeWorkspaceHint" }] : (
    /* istanbul ignore next */
    []
  ));
  userInitials = computed2(() => {
    const currentUser = this.user();
    if (!currentUser) {
      return "U";
    }
    return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
  }, ...ngDevMode ? [{ debugName: "userInitials" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd), takeUntilDestroyed2(this.destroyRef)).subscribe((event) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
    timer(0, 2e4).pipe(takeUntilDestroyed2(this.destroyRef)).subscribe(() => {
      this.currentDateTime.set(/* @__PURE__ */ new Date());
      if (!this.showNotificationCenter()) {
        return;
      }
      this.loadNotifications();
    });
  }
  logout() {
    this.authService.logout();
  }
  roleLabel(role) {
    switch (role) {
      case "ENSEIGNANT":
        return "Enseignant";
      case "CHEF_DEPARTEMENT":
        return "Chef de departement";
      case "ADMINISTRATION":
        return "Administration";
      case "SUPER_ADMIN":
        return "Super administrateur";
      default:
        return "Utilisateur";
    }
  }
  loadNotifications(showErrorToast = false) {
    if (!this.showNotificationCenter()) {
      this.notificationOverview.set(null);
      this.notificationsLoading.set(false);
      return;
    }
    this.notificationsLoading.set(true);
    this.notificationService.getOverview().pipe(takeUntilDestroyed2(this.destroyRef)).subscribe({
      next: (overview) => {
        this.notificationOverview.set(overview);
        this.notificationsLoading.set(false);
      },
      error: () => {
        this.notificationsLoading.set(false);
        if (showErrorToast) {
          this.toastService.warning("Notifications indisponibles", "Le centre de notifications n'a pas pu etre charge.");
        }
      }
    });
  }
  markNotificationAsRead(notificationId) {
    if (!this.showNotificationCenter()) {
      return;
    }
    this.notificationService.markAsRead(notificationId).pipe(takeUntilDestroyed2(this.destroyRef)).subscribe({
      next: (overview) => {
        this.notificationOverview.set(overview);
      },
      error: () => {
        this.toastService.warning("Action impossible", "La notification n'a pas pu etre mise a jour.");
      }
    });
  }
  markAllNotificationsAsRead() {
    if (!this.showNotificationCenter()) {
      return;
    }
    this.notificationService.markAllAsRead().pipe(takeUntilDestroyed2(this.destroyRef)).subscribe({
      next: (overview) => {
        this.notificationOverview.set(overview);
        this.toastService.success("Notifications lues", "Toutes les notifications visibles ont ete marquees comme lues.");
      },
      error: () => {
        this.toastService.warning("Action impossible", "Les notifications n'ont pas pu etre mises a jour.");
      }
    });
  }
  isRouteActive(path) {
    const currentUrl = this.currentUrl();
    return currentUrl === path || currentUrl.startsWith(`${path}/`);
  }
  isNavItemActive(item) {
    return this.isRouteActive(item.path);
  }
  isNavGroupActive(item) {
    if (item.children?.some((child) => this.isRouteActive(child.path))) {
      return true;
    }
    return this.isNavItemActive(item);
  }
  isNavGroupExpanded(item) {
    if (!item.collapsible) {
      return true;
    }
    return this.expandedNavGroups()[item.path] === true;
  }
  toggleNavGroup(item) {
    if (!item.collapsible) {
      return;
    }
    this.expandedNavGroups.update((groups) => __spreadProps(__spreadValues({}, groups), {
      [item.path]: !groups[item.path]
    }));
  }
  static \u0275fac = function AppShellComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppShellComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i05.\u0275\u0275defineComponent({ type: _AppShellComponent, selectors: [["app-shell"]], decls: 59, vars: 14, consts: [[1, "shell-layout"], [1, "shell-sidebar"], [1, "sidebar-brand"], [1, "logo-card"], ["src", "/logo-esprit-ariana.jpg", "alt", "ESPRIT"], [1, "brand-copy"], [1, "shell-nav"], [1, "sidebar-center"], [1, "shell-user-card"], [1, "user-avatar"], [1, "user-copy"], ["type", "button", 1, "sidebar-ghost-button", "logout-button", 3, "click"], [1, "shell-main"], [1, "shell-header"], [1, "header-brand"], [1, "header-copy"], [1, "header-presence"], [1, "presence-card"], [1, "presence-dot"], [1, "presence-copy"], [1, "clock-card"], [1, "header-meta"], [1, "header-role"], [1, "shell-content"], [1, "content-stage"], [1, "nav-group", 3, "active-group"], ["routerLinkActive", "active-link", 1, "nav-link", 3, "routerLink", "routerLinkActiveOptions"], [1, "nav-group"], ["type", "button", 1, "nav-link", "nav-group-link", "nav-group-toggle", 3, "active-link"], [1, "nav-link", "nav-group-link", "nav-group-label", 3, "active-link"], [1, "nav-submenu"], ["routerLinkActive", "active-sublink", 1, "nav-sublink", 3, "routerLink", "routerLinkActiveOptions"], ["type", "button", 1, "nav-link", "nav-group-link", "nav-group-toggle", 3, "click"], [1, "nav-icon"], [1, "nav-copy"], ["aria-hidden", "true", 1, "nav-group-chevron"], [1, "nav-link", "nav-group-link", "nav-group-label"], [1, "nav-sublink-dot"], [1, "nav-sublink-copy"], [1, "center-header"], [1, "eyebrow"], [1, "notification-badge"], [1, "sidebar-empty"], [1, "mini-notification-list"], ["type", "button", 1, "sidebar-ghost-button"], ["type", "button", 1, "mini-notification"], ["type", "button", 1, "mini-notification", 3, "click"], ["type", "button", 1, "sidebar-ghost-button", 3, "click"]], template: function AppShellComponent_Template(rf, ctx) {
    if (rf & 1) {
      i05.\u0275\u0275elementStart(0, "div", 0)(1, "aside", 1)(2, "div", 2)(3, "div", 3);
      i05.\u0275\u0275element(4, "img", 4);
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275elementStart(5, "div", 5)(6, "strong");
      i05.\u0275\u0275text(7, "Plateforme academique");
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275elementStart(8, "span");
      i05.\u0275\u0275text(9, "Suivi academique ESPRIT");
      i05.\u0275\u0275elementEnd()()();
      i05.\u0275\u0275elementStart(10, "nav", 6);
      i05.\u0275\u0275repeaterCreate(11, AppShellComponent_For_12_Template, 2, 1, null, null, _forTrack03);
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275conditionalCreate(13, AppShellComponent_Conditional_13_Template, 12, 3, "section", 7);
      i05.\u0275\u0275elementStart(14, "div", 8)(15, "div", 9);
      i05.\u0275\u0275text(16);
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275elementStart(17, "div", 10)(18, "strong");
      i05.\u0275\u0275text(19);
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275elementStart(20, "span");
      i05.\u0275\u0275text(21);
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275conditionalCreate(22, AppShellComponent_Conditional_22_Template, 2, 1, "small");
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275elementStart(23, "button", 11);
      i05.\u0275\u0275listener("click", function AppShellComponent_Template_button_click_23_listener() {
        return ctx.logout();
      });
      i05.\u0275\u0275text(24, "Deconnexion");
      i05.\u0275\u0275elementEnd()()();
      i05.\u0275\u0275elementStart(25, "section", 12)(26, "header", 13)(27, "div", 14);
      i05.\u0275\u0275element(28, "img", 4);
      i05.\u0275\u0275elementStart(29, "div", 15)(30, "strong");
      i05.\u0275\u0275text(31, "HONORIS UNITED UNIVERSITIES");
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275elementStart(32, "span");
      i05.\u0275\u0275text(33, "Plateforme academique ESPRIT");
      i05.\u0275\u0275elementEnd()()();
      i05.\u0275\u0275elementStart(34, "div", 16)(35, "article", 17);
      i05.\u0275\u0275element(36, "span", 18);
      i05.\u0275\u0275elementStart(37, "div", 19)(38, "small");
      i05.\u0275\u0275text(39);
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275elementStart(40, "strong");
      i05.\u0275\u0275text(41);
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275elementStart(42, "span");
      i05.\u0275\u0275text(43);
      i05.\u0275\u0275elementEnd()()();
      i05.\u0275\u0275elementStart(44, "article", 20)(45, "small");
      i05.\u0275\u0275text(46);
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275elementStart(47, "strong");
      i05.\u0275\u0275text(48);
      i05.\u0275\u0275elementEnd()()();
      i05.\u0275\u0275elementStart(49, "div", 21)(50, "span", 22);
      i05.\u0275\u0275text(51);
      i05.\u0275\u0275elementEnd();
      i05.\u0275\u0275elementStart(52, "strong");
      i05.\u0275\u0275text(53);
      i05.\u0275\u0275elementEnd()()();
      i05.\u0275\u0275elementStart(54, "div", 23)(55, "div", 24);
      i05.\u0275\u0275element(56, "router-outlet");
      i05.\u0275\u0275elementEnd()()()();
      i05.\u0275\u0275element(57, "app-toast-outlet")(58, "app-assistant-widget");
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_4_0;
      let tmp_5_0;
      let tmp_11_0;
      let tmp_12_0;
      i05.\u0275\u0275advance(11);
      i05.\u0275\u0275repeater(ctx.navItems());
      i05.\u0275\u0275advance(2);
      i05.\u0275\u0275conditional(ctx.showNotificationCenter() ? 13 : -1);
      i05.\u0275\u0275advance(3);
      i05.\u0275\u0275textInterpolate(ctx.userInitials());
      i05.\u0275\u0275advance(3);
      i05.\u0275\u0275textInterpolate2("", (tmp_3_0 = ctx.user()) == null ? null : tmp_3_0.firstName, " ", (tmp_3_0 = ctx.user()) == null ? null : tmp_3_0.lastName);
      i05.\u0275\u0275advance(2);
      i05.\u0275\u0275textInterpolate(ctx.roleLabel((tmp_4_0 = ctx.user()) == null ? null : tmp_4_0.role));
      i05.\u0275\u0275advance();
      i05.\u0275\u0275conditional(((tmp_5_0 = ctx.user()) == null ? null : tmp_5_0.departmentName) ? 22 : -1);
      i05.\u0275\u0275advance(17);
      i05.\u0275\u0275textInterpolate(ctx.workspaceGreeting());
      i05.\u0275\u0275advance(2);
      i05.\u0275\u0275textInterpolate(ctx.activeWorkspaceLabel());
      i05.\u0275\u0275advance(2);
      i05.\u0275\u0275textInterpolate(ctx.activeWorkspaceHint());
      i05.\u0275\u0275advance(3);
      i05.\u0275\u0275textInterpolate(ctx.currentDateLabel());
      i05.\u0275\u0275advance(2);
      i05.\u0275\u0275textInterpolate(ctx.currentTimeLabel());
      i05.\u0275\u0275advance(3);
      i05.\u0275\u0275textInterpolate(ctx.roleLabel((tmp_11_0 = ctx.user()) == null ? null : tmp_11_0.role));
      i05.\u0275\u0275advance(2);
      i05.\u0275\u0275textInterpolate2("", (tmp_12_0 = ctx.user()) == null ? null : tmp_12_0.firstName, " ", (tmp_12_0 = ctx.user()) == null ? null : tmp_12_0.lastName);
    }
  }, dependencies: [RouterLink, RouterLinkActive, RouterOutlet, ToastOutletComponent, AssistantWidgetComponent, DatePipe], styles: ['\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n}\n.shell-layout[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: grid;\n  grid-template-columns: 232px minmax(0, 1fr);\n  align-items: start;\n  position: relative;\n  overflow-x: clip;\n  overflow-y: visible;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 251, 247, 0.98),\n      rgba(246, 242, 237, 0.98)),\n    linear-gradient(\n      135deg,\n      rgba(215, 25, 32, 0.04),\n      transparent 26%);\n}\n.shell-layout[_ngcontent-%COMP%]::before, \n.shell-layout[_ngcontent-%COMP%]::after {\n  content: "";\n  position: fixed;\n  width: 24rem;\n  height: 24rem;\n  border-radius: 999px;\n  pointer-events: none;\n  z-index: 0;\n  filter: blur(10px);\n  opacity: 0.55;\n}\n.shell-layout[_ngcontent-%COMP%]::before {\n  top: -8rem;\n  right: -8rem;\n  background:\n    radial-gradient(\n      circle,\n      rgba(215, 25, 32, 0.14),\n      transparent 66%);\n  animation: _ngcontent-%COMP%_float-ambient 12s ease-in-out infinite;\n}\n.shell-layout[_ngcontent-%COMP%]::after {\n  bottom: -10rem;\n  left: 12rem;\n  background:\n    radial-gradient(\n      circle,\n      rgba(31, 42, 68, 0.1),\n      transparent 70%);\n  animation: _ngcontent-%COMP%_float-ambient 15s ease-in-out infinite reverse;\n}\n.shell-sidebar[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  align-self: start;\n  height: 100vh;\n  padding: 1rem 0.9rem 1.1rem;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(13, 13, 15, 0.99),\n      rgba(21, 21, 24, 0.99)),\n    linear-gradient(\n      180deg,\n      rgba(215, 25, 32, 0.2),\n      transparent 22%);\n  color: #f6f7fb;\n  border-right: 1px solid rgba(255, 255, 255, 0.06);\n  display: grid;\n  gap: 1rem;\n  align-content: start;\n  overflow-y: auto;\n  overflow-x: hidden;\n  scrollbar-gutter: stable;\n  scrollbar-width: thin;\n  scrollbar-color: rgba(215, 25, 32, 0.55) rgba(255, 255, 255, 0.08);\n  z-index: 2;\n}\n.shell-sidebar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 0.55rem;\n}\n.shell-sidebar[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: rgba(255, 255, 255, 0.04);\n  border-radius: 999px;\n}\n.shell-sidebar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 89, 96, 0.85),\n      rgba(181, 17, 25, 0.9));\n  border-radius: 999px;\n  border: 2px solid rgba(13, 13, 15, 0.35);\n}\n.shell-sidebar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 107, 113, 0.95),\n      rgba(204, 21, 30, 0.95));\n}\n.sidebar-brand[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.75rem;\n}\n.logo-card[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  border-radius: 18px;\n  background: rgba(255, 255, 255, 0.96);\n  min-height: 96px;\n  padding: 0.7rem 0.75rem;\n  box-shadow: 0 14px 24px rgba(0, 0, 0, 0.22);\n  overflow: hidden;\n}\n.logo-card[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  max-width: 152px;\n  max-height: 56px;\n  height: 100%;\n  margin: 0 auto;\n  object-fit: contain;\n  object-position: center;\n}\n.brand-copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.2rem;\n}\n.brand-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n}\n.brand-copy[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(246, 247, 251, 0.64);\n  font-size: 0.76rem;\n}\n.shell-nav[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.45rem;\n}\n.nav-group[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.55rem;\n  padding: 0.2rem;\n  border-radius: 18px;\n  border: 1px solid rgba(255, 255, 255, 0.04);\n  background: rgba(255, 255, 255, 0.015);\n  animation: _ngcontent-%COMP%_slide-in-nav 0.5s ease both;\n}\n.nav-group.active-group[_ngcontent-%COMP%] {\n  border-color: rgba(215, 25, 32, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(215, 25, 32, 0.08),\n      rgba(255, 255, 255, 0.02));\n}\n.nav-link[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  grid-template-columns: 36px minmax(0, 1fr);\n  gap: 0.75rem;\n  align-items: center;\n  padding: 0.72rem 0.78rem;\n  border-radius: 14px;\n  border: 1px solid rgba(255, 255, 255, 0.04);\n  color: rgba(246, 247, 251, 0.9);\n  background: rgba(255, 255, 255, 0.02);\n  transition:\n    transform 0.18s ease,\n    background 0.18s ease,\n    border-color 0.18s ease,\n    box-shadow 0.18s ease;\n}\n.nav-link[_ngcontent-%COMP%]:hover {\n  transform: translateX(3px);\n  background: rgba(255, 255, 255, 0.04);\n  border-color: rgba(255, 255, 255, 0.08);\n  box-shadow: 0 12px 22px rgba(0, 0, 0, 0.16);\n}\n.nav-group-link[_ngcontent-%COMP%]:hover {\n  transform: none;\n}\n.nav-group-label[_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n.nav-group-toggle[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: left;\n  cursor: pointer;\n}\n.nav-group-chevron[_ngcontent-%COMP%] {\n  display: inline-flex;\n  width: 1rem;\n  height: 1rem;\n  align-items: center;\n  justify-content: center;\n  align-self: center;\n  justify-self: end;\n  color: rgba(246, 247, 251, 0.68);\n  transition: transform 0.18s ease, color 0.18s ease;\n}\n.nav-group-chevron[_ngcontent-%COMP%]::before {\n  content: "";\n  width: 0.45rem;\n  height: 0.45rem;\n  border-right: 2px solid currentColor;\n  border-bottom: 2px solid currentColor;\n  transform: rotate(45deg) translateY(-1px);\n}\n.nav-group-chevron.expanded[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n  color: rgba(255, 255, 255, 0.9);\n}\n.nav-link.active-link[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(215, 25, 32, 0.94),\n      rgba(181, 17, 25, 0.94));\n  border-color: rgba(255, 255, 255, 0.12);\n  box-shadow: 0 14px 24px rgba(215, 25, 32, 0.24);\n}\n.nav-link[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  inset: 0 auto 0 0;\n  width: 3px;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.86),\n      rgba(255, 255, 255, 0.18));\n  opacity: 0;\n  transition: opacity 0.18s ease;\n}\n.nav-link.active-link[_ngcontent-%COMP%]::after, \n.nav-link[_ngcontent-%COMP%]:hover::after {\n  opacity: 1;\n}\n.nav-icon[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 11px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.08);\n  font-size: 0.73rem;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n}\n.nav-copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.15rem;\n}\n.nav-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n}\n.nav-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(246, 247, 251, 0.6);\n  font-size: 0.72rem;\n}\n.nav-link.active-link[_ngcontent-%COMP%]   .nav-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.84);\n}\n.nav-submenu[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n  padding: 0 0.35rem 0.35rem 0.35rem;\n}\n.nav-submenu.nav-submenu-collapsed[_ngcontent-%COMP%] {\n  display: none;\n}\n.nav-sublink[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 10px minmax(0, 1fr);\n  gap: 0.65rem;\n  align-items: start;\n  padding: 0.68rem 0.8rem;\n  border-radius: 12px;\n  color: rgba(246, 247, 251, 0.86);\n  border: 1px solid transparent;\n  background: rgba(255, 255, 255, 0.02);\n  transition:\n    background 0.18s ease,\n    border-color 0.18s ease,\n    transform 0.18s ease;\n}\n.nav-sublink[_ngcontent-%COMP%]:hover {\n  transform: translateX(2px);\n  background: rgba(255, 255, 255, 0.04);\n  border-color: rgba(255, 255, 255, 0.06);\n}\n.nav-sublink-dot[_ngcontent-%COMP%] {\n  width: 0.42rem;\n  height: 0.42rem;\n  border-radius: 999px;\n  margin-top: 0.42rem;\n  background: rgba(255, 255, 255, 0.32);\n}\n.nav-sublink-copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.14rem;\n}\n.nav-sublink-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.84rem;\n  font-weight: 700;\n}\n.nav-sublink-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(246, 247, 251, 0.56);\n  font-size: 0.7rem;\n}\n.nav-sublink.active-sublink[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(255, 255, 255, 0.08);\n}\n.nav-sublink.active-sublink[_ngcontent-%COMP%]   .nav-sublink-dot[_ngcontent-%COMP%] {\n  background: #ff5b61;\n  box-shadow: 0 0 0 4px rgba(215, 25, 32, 0.16);\n}\n.nav-sublink.active-sublink[_ngcontent-%COMP%]   .nav-sublink-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.nav-group.active-group[_ngcontent-%COMP%]   .nav-sublink-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(246, 247, 251, 0.72);\n}\n.sidebar-center[_ngcontent-%COMP%], \n.shell-user-card[_ngcontent-%COMP%] {\n  border-radius: 18px;\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  background: rgba(255, 255, 255, 0.04);\n  padding: 0.9rem;\n}\n.sidebar-center[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.75rem;\n}\n.center-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.75rem;\n  align-items: start;\n}\n.center-header[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 0.15rem;\n}\n.notification-badge[_ngcontent-%COMP%] {\n  min-width: 1.75rem;\n  height: 1.75rem;\n  padding: 0 0.45rem;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(215, 25, 32, 0.92);\n  color: #fff;\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.mini-notification-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.45rem;\n}\n.mini-notification[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: left;\n  padding: 0.7rem;\n  border-radius: 13px;\n  border: 1px solid rgba(255, 255, 255, 0.06);\n  background: rgba(255, 255, 255, 0.03);\n  color: inherit;\n  cursor: pointer;\n}\n.mini-notification[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.mini-notification[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n}\n.mini-notification[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.sidebar-empty[_ngcontent-%COMP%] {\n  color: rgba(246, 247, 251, 0.58);\n  margin-top: 0.25rem;\n}\n.sidebar-empty[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.shell-user-card[_ngcontent-%COMP%] {\n  margin-top: auto;\n  display: grid;\n  gap: 0.8rem;\n}\n.user-avatar[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 14px;\n  display: grid;\n  place-items: center;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(215, 25, 32, 0.96),\n      rgba(255, 109, 115, 0.78));\n  color: #fff;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n}\n.user-copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.15rem;\n}\n.user-copy[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.user-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: rgba(246, 247, 251, 0.62);\n}\n.sidebar-ghost-button[_ngcontent-%COMP%] {\n  padding: 0.72rem 0.82rem;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  background: rgba(255, 255, 255, 0.06);\n  color: #f6f7fb;\n  cursor: pointer;\n}\n.logout-button[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.shell-main[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  grid-template-rows: auto 1fr;\n  position: relative;\n  z-index: 1;\n}\n.shell-header[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  align-items: center;\n  gap: 1rem;\n  padding: 0.8rem 9.6rem 0.8rem 1.6rem;\n  background: rgba(255, 255, 255, 0.9);\n  border-bottom: 1px solid rgba(22, 32, 51, 0.08);\n  -webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);\n}\n.header-brand[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.85rem;\n}\n.header-brand[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 96px;\n  height: auto;\n  object-fit: contain;\n  object-position: center;\n}\n.header-copy[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.1rem;\n}\n.header-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.63rem;\n  letter-spacing: 0.24em;\n  color: #7a6a63;\n}\n.header-copy[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.header-role[_ngcontent-%COMP%] {\n  color: #776c67;\n  font-size: 0.77rem;\n}\n.header-presence[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  justify-self: end;\n  margin-right: 0.55rem;\n}\n.presence-card[_ngcontent-%COMP%], \n.clock-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.72rem;\n  min-height: 3.5rem;\n  padding: 0.72rem 0.9rem;\n  border-radius: 16px;\n  border: 1px solid rgba(22, 32, 51, 0.08);\n  background: rgba(255, 255, 255, 0.76);\n  box-shadow: 0 16px 28px rgba(12, 25, 45, 0.06);\n}\n.presence-dot[_ngcontent-%COMP%] {\n  width: 0.8rem;\n  height: 0.8rem;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(215, 25, 32, 0.96),\n      rgba(255, 109, 115, 0.92));\n  box-shadow: 0 0 0 0 rgba(215, 25, 32, 0.28);\n  animation: _ngcontent-%COMP%_pulse-dot 1.8s ease-out infinite;\n}\n.presence-copy[_ngcontent-%COMP%], \n.clock-card[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.1rem;\n}\n.presence-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.presence-copy[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.clock-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #776c67;\n  font-size: 0.72rem;\n}\n.presence-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.clock-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1c212b;\n  font-size: 0.92rem;\n}\n.header-meta[_ngcontent-%COMP%] {\n  display: grid;\n  justify-items: end;\n  gap: 0.12rem;\n  margin-right: 0.7rem;\n  min-width: 0;\n}\n.header-meta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.92rem;\n  color: #1c212b;\n  max-width: 18rem;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.shell-content[_ngcontent-%COMP%] {\n  padding: 1.45rem 1.55rem 2rem;\n}\n.content-stage[_ngcontent-%COMP%] {\n  position: relative;\n}\n.content-stage[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  inset: -1rem -1rem auto auto;\n  width: 12rem;\n  height: 12rem;\n  border-radius: 999px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(215, 25, 32, 0.08),\n      transparent 68%);\n  pointer-events: none;\n  opacity: 0.8;\n}\n[data-theme="dark"][_nghost-%COMP%]   .shell-layout[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .shell-layout[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(12, 17, 26, 0.98),\n      rgba(14, 20, 31, 0.98)),\n    linear-gradient(\n      135deg,\n      rgba(215, 25, 32, 0.08),\n      transparent 26%);\n}\n[data-theme="dark"][_nghost-%COMP%]   .shell-header[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .shell-header[_ngcontent-%COMP%] {\n  background: rgba(18, 25, 38, 0.88);\n  border-bottom-color: rgba(148, 163, 184, 0.12);\n}\n[data-theme="dark"][_nghost-%COMP%]   .presence-card[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .presence-card[_ngcontent-%COMP%], \n[data-theme="dark"][_nghost-%COMP%]   .clock-card[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .clock-card[_ngcontent-%COMP%] {\n  border-color: rgba(148, 163, 184, 0.14);\n  background: rgba(18, 25, 38, 0.78);\n}\n[data-theme="dark"][_nghost-%COMP%]   .header-meta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .header-meta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n[data-theme="dark"][_nghost-%COMP%]   .presence-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .presence-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n[data-theme="dark"][_nghost-%COMP%]   .clock-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .clock-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n[data-theme="dark"][_nghost-%COMP%]   .header-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .header-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n[data-theme="dark"][_nghost-%COMP%]   .header-copy[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .header-copy[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[data-theme="dark"][_nghost-%COMP%]   .header-role[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .header-role[_ngcontent-%COMP%], \n[data-theme="dark"][_nghost-%COMP%]   .presence-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .presence-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n[data-theme="dark"][_nghost-%COMP%]   .presence-copy[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .presence-copy[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n[data-theme="dark"][_nghost-%COMP%]   .clock-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], [data-theme="dark"]   [_nghost-%COMP%]   .clock-card[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #d7dfeb;\n}\n@media (max-width: 1180px) {\n  .shell-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .shell-sidebar[_ngcontent-%COMP%] {\n    position: relative;\n    top: auto;\n    align-self: stretch;\n    height: auto;\n    overflow: visible;\n  }\n  .shell-user-card[_ngcontent-%COMP%] {\n    margin-top: 0;\n  }\n}\n@media (max-width: 720px) {\n  .shell-header[_ngcontent-%COMP%] {\n    padding: 0.8rem 6.6rem 0.8rem 1rem;\n    align-items: start;\n    grid-template-columns: 1fr;\n  }\n  .header-presence[_ngcontent-%COMP%] {\n    width: 100%;\n    flex-direction: column;\n    align-items: stretch;\n    justify-self: stretch;\n    margin-right: 0;\n  }\n  .presence-card[_ngcontent-%COMP%], \n   .clock-card[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .header-meta[_ngcontent-%COMP%] {\n    justify-items: start;\n    margin-right: 0;\n  }\n  .header-meta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n    max-width: 100%;\n  }\n  .shell-content[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse-dot {\n  0% {\n    box-shadow: 0 0 0 0 rgba(215, 25, 32, 0.28);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(215, 25, 32, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(215, 25, 32, 0);\n  }\n}\n@keyframes _ngcontent-%COMP%_float-ambient {\n  0% {\n    transform: translate3d(0, 0, 0);\n  }\n  50% {\n    transform: translate3d(8px, 14px, 0);\n  }\n  100% {\n    transform: translate3d(-10px, 4px, 0);\n  }\n}\n@keyframes _ngcontent-%COMP%_slide-in-nav {\n  0% {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n/*# sourceMappingURL=app-shell.component.css.map */'], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i05.\u0275setClassMetadata(AppShellComponent, [{
    type: Component3,
    args: [{ selector: "app-shell", imports: [RouterLink, RouterLinkActive, RouterOutlet, ToastOutletComponent, AssistantWidgetComponent, DatePipe], changeDetection: ChangeDetectionStrategy3.OnPush, template: `<div class="shell-layout">
  <aside class="shell-sidebar">
    <div class="sidebar-brand">
      <div class="logo-card">
        <img src="/logo-esprit-ariana.jpg" alt="ESPRIT" />
      </div>
      <div class="brand-copy">
        <strong>Plateforme academique</strong>
        <span>Suivi academique ESPRIT</span>
      </div>
    </div>

    <nav class="shell-nav">
      @for (item of navItems(); track item.path) {
        @if (item.children?.length) {
          <div class="nav-group" [class.active-group]="isNavGroupActive(item)">
            @if (item.collapsible) {
              <button
                class="nav-link nav-group-link nav-group-toggle"
                type="button"
                [class.active-link]="isNavGroupActive(item)"
                [attr.aria-expanded]="isNavGroupExpanded(item)"
                (click)="toggleNavGroup(item)"
              >
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-copy">
                  <strong>{{ item.label }}</strong>
                  @if (item.hint) {
                    <small>{{ item.hint }}</small>
                  }
                </span>
                <span class="nav-group-chevron" [class.expanded]="isNavGroupExpanded(item)" aria-hidden="true"></span>
              </button>
            } @else {
              <div
                class="nav-link nav-group-link nav-group-label"
                [class.active-link]="isNavGroupActive(item)"
              >
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-copy">
                  <strong>{{ item.label }}</strong>
                  @if (item.hint) {
                    <small>{{ item.hint }}</small>
                  }
                </span>
              </div>
            }

            <div class="nav-submenu" [class.nav-submenu-collapsed]="!isNavGroupExpanded(item)">
              @for (child of item.children; track child.path) {
                <a
                  class="nav-sublink"
                  [routerLink]="child.path"
                  routerLinkActive="active-sublink"
                  [routerLinkActiveOptions]="{ exact: true }"
                >
                  <span class="nav-sublink-dot"></span>
                  <span class="nav-sublink-copy">
                    <strong>{{ child.label }}</strong>
                    <small>{{ child.hint }}</small>
                  </span>
                </a>
              }
            </div>
          </div>
        } @else {
          <a
            class="nav-link"
            [routerLink]="item.path"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-copy">
              <strong>{{ item.label }}</strong>
              @if (item.hint) {
                <small>{{ item.hint }}</small>
              }
            </span>
          </a>
        }
      }
    </nav>

    @if (showNotificationCenter()) {
      <section class="sidebar-center">
        <div class="center-header">
          <div>
            <p class="eyebrow">Centre</p>
            <strong>Notifications</strong>
          </div>
          @if (unreadNotificationsCount() > 0) {
            <span class="notification-badge">{{ unreadNotificationsCount() }}</span>
          }
        </div>

        @if (notificationsLoading()) {
          <p class="sidebar-empty">Chargement...</p>
        } @else if (recentNotifications().length === 0) {
          <p class="sidebar-empty">Aucune notification recente.</p>
        } @else {
          <div class="mini-notification-list">
            @for (notification of recentNotifications(); track notification.id) {
              <button class="mini-notification" type="button" (click)="markNotificationAsRead(notification.id)">
                <strong>{{ notification.title }}</strong>
                <small>{{ notification.createdAt | date: 'dd/MM HH:mm' }}</small>
              </button>
            }
          </div>
        }

        @if (unreadNotificationsCount() > 0) {
          <button class="sidebar-ghost-button" type="button" (click)="markAllNotificationsAsRead()">Tout lire</button>
        }
      </section>
    }

    <div class="shell-user-card">
      <div class="user-avatar">{{ userInitials() }}</div>
      <div class="user-copy">
        <strong>{{ user()?.firstName }} {{ user()?.lastName }}</strong>
        <span>{{ roleLabel(user()?.role) }}</span>
        @if (user()?.departmentName) {
          <small>{{ user()?.departmentName }}</small>
        }
      </div>
      <button class="sidebar-ghost-button logout-button" type="button" (click)="logout()">Deconnexion</button>
    </div>
  </aside>

  <section class="shell-main">
    <header class="shell-header">
      <div class="header-brand">
        <img src="/logo-esprit-ariana.jpg" alt="ESPRIT" />
        <div class="header-copy">
          <strong>HONORIS UNITED UNIVERSITIES</strong>
          <span>Plateforme academique ESPRIT</span>
        </div>
      </div>

      <div class="header-presence">
        <article class="presence-card">
          <span class="presence-dot"></span>
          <div class="presence-copy">
            <small>{{ workspaceGreeting() }}</small>
            <strong>{{ activeWorkspaceLabel() }}</strong>
            <span>{{ activeWorkspaceHint() }}</span>
          </div>
        </article>

        <article class="clock-card">
          <small>{{ currentDateLabel() }}</small>
          <strong>{{ currentTimeLabel() }}</strong>
        </article>
      </div>

      <div class="header-meta">
        <span class="header-role">{{ roleLabel(user()?.role) }}</span>
        <strong>{{ user()?.firstName }} {{ user()?.lastName }}</strong>
      </div>
    </header>

    <div class="shell-content">
      <div class="content-stage">
        <router-outlet></router-outlet>
      </div>
    </div>
  </section>
</div>
<app-toast-outlet></app-toast-outlet>
<app-assistant-widget></app-assistant-widget>
\r
`, styles: ['/* src/app/layout/app-shell.component.css */\n:host {\n  display: block;\n  min-height: 100vh;\n}\n.shell-layout {\n  min-height: 100vh;\n  display: grid;\n  grid-template-columns: 232px minmax(0, 1fr);\n  align-items: start;\n  position: relative;\n  overflow-x: clip;\n  overflow-y: visible;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 251, 247, 0.98),\n      rgba(246, 242, 237, 0.98)),\n    linear-gradient(\n      135deg,\n      rgba(215, 25, 32, 0.04),\n      transparent 26%);\n}\n.shell-layout::before,\n.shell-layout::after {\n  content: "";\n  position: fixed;\n  width: 24rem;\n  height: 24rem;\n  border-radius: 999px;\n  pointer-events: none;\n  z-index: 0;\n  filter: blur(10px);\n  opacity: 0.55;\n}\n.shell-layout::before {\n  top: -8rem;\n  right: -8rem;\n  background:\n    radial-gradient(\n      circle,\n      rgba(215, 25, 32, 0.14),\n      transparent 66%);\n  animation: float-ambient 12s ease-in-out infinite;\n}\n.shell-layout::after {\n  bottom: -10rem;\n  left: 12rem;\n  background:\n    radial-gradient(\n      circle,\n      rgba(31, 42, 68, 0.1),\n      transparent 70%);\n  animation: float-ambient 15s ease-in-out infinite reverse;\n}\n.shell-sidebar {\n  position: sticky;\n  top: 0;\n  align-self: start;\n  height: 100vh;\n  padding: 1rem 0.9rem 1.1rem;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(13, 13, 15, 0.99),\n      rgba(21, 21, 24, 0.99)),\n    linear-gradient(\n      180deg,\n      rgba(215, 25, 32, 0.2),\n      transparent 22%);\n  color: #f6f7fb;\n  border-right: 1px solid rgba(255, 255, 255, 0.06);\n  display: grid;\n  gap: 1rem;\n  align-content: start;\n  overflow-y: auto;\n  overflow-x: hidden;\n  scrollbar-gutter: stable;\n  scrollbar-width: thin;\n  scrollbar-color: rgba(215, 25, 32, 0.55) rgba(255, 255, 255, 0.08);\n  z-index: 2;\n}\n.shell-sidebar::-webkit-scrollbar {\n  width: 0.55rem;\n}\n.shell-sidebar::-webkit-scrollbar-track {\n  background: rgba(255, 255, 255, 0.04);\n  border-radius: 999px;\n}\n.shell-sidebar::-webkit-scrollbar-thumb {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 89, 96, 0.85),\n      rgba(181, 17, 25, 0.9));\n  border-radius: 999px;\n  border: 2px solid rgba(13, 13, 15, 0.35);\n}\n.shell-sidebar::-webkit-scrollbar-thumb:hover {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 107, 113, 0.95),\n      rgba(204, 21, 30, 0.95));\n}\n.sidebar-brand {\n  display: grid;\n  gap: 0.75rem;\n}\n.logo-card {\n  display: grid;\n  place-items: center;\n  border-radius: 18px;\n  background: rgba(255, 255, 255, 0.96);\n  min-height: 96px;\n  padding: 0.7rem 0.75rem;\n  box-shadow: 0 14px 24px rgba(0, 0, 0, 0.22);\n  overflow: hidden;\n}\n.logo-card img {\n  display: block;\n  width: 100%;\n  max-width: 152px;\n  max-height: 56px;\n  height: 100%;\n  margin: 0 auto;\n  object-fit: contain;\n  object-position: center;\n}\n.brand-copy {\n  display: grid;\n  gap: 0.2rem;\n}\n.brand-copy strong {\n  font-size: 0.95rem;\n}\n.brand-copy span {\n  color: rgba(246, 247, 251, 0.64);\n  font-size: 0.76rem;\n}\n.shell-nav {\n  display: grid;\n  gap: 0.45rem;\n}\n.nav-group {\n  display: grid;\n  gap: 0.55rem;\n  padding: 0.2rem;\n  border-radius: 18px;\n  border: 1px solid rgba(255, 255, 255, 0.04);\n  background: rgba(255, 255, 255, 0.015);\n  animation: slide-in-nav 0.5s ease both;\n}\n.nav-group.active-group {\n  border-color: rgba(215, 25, 32, 0.22);\n  background:\n    linear-gradient(\n      180deg,\n      rgba(215, 25, 32, 0.08),\n      rgba(255, 255, 255, 0.02));\n}\n.nav-link {\n  position: relative;\n  display: grid;\n  grid-template-columns: 36px minmax(0, 1fr);\n  gap: 0.75rem;\n  align-items: center;\n  padding: 0.72rem 0.78rem;\n  border-radius: 14px;\n  border: 1px solid rgba(255, 255, 255, 0.04);\n  color: rgba(246, 247, 251, 0.9);\n  background: rgba(255, 255, 255, 0.02);\n  transition:\n    transform 0.18s ease,\n    background 0.18s ease,\n    border-color 0.18s ease,\n    box-shadow 0.18s ease;\n}\n.nav-link:hover {\n  transform: translateX(3px);\n  background: rgba(255, 255, 255, 0.04);\n  border-color: rgba(255, 255, 255, 0.08);\n  box-shadow: 0 12px 22px rgba(0, 0, 0, 0.16);\n}\n.nav-group-link:hover {\n  transform: none;\n}\n.nav-group-label {\n  pointer-events: none;\n}\n.nav-group-toggle {\n  width: 100%;\n  text-align: left;\n  cursor: pointer;\n}\n.nav-group-chevron {\n  display: inline-flex;\n  width: 1rem;\n  height: 1rem;\n  align-items: center;\n  justify-content: center;\n  align-self: center;\n  justify-self: end;\n  color: rgba(246, 247, 251, 0.68);\n  transition: transform 0.18s ease, color 0.18s ease;\n}\n.nav-group-chevron::before {\n  content: "";\n  width: 0.45rem;\n  height: 0.45rem;\n  border-right: 2px solid currentColor;\n  border-bottom: 2px solid currentColor;\n  transform: rotate(45deg) translateY(-1px);\n}\n.nav-group-chevron.expanded {\n  transform: rotate(180deg);\n  color: rgba(255, 255, 255, 0.9);\n}\n.nav-link.active-link {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(215, 25, 32, 0.94),\n      rgba(181, 17, 25, 0.94));\n  border-color: rgba(255, 255, 255, 0.12);\n  box-shadow: 0 14px 24px rgba(215, 25, 32, 0.24);\n}\n.nav-link::after {\n  content: "";\n  position: absolute;\n  inset: 0 auto 0 0;\n  width: 3px;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(255, 255, 255, 0.86),\n      rgba(255, 255, 255, 0.18));\n  opacity: 0;\n  transition: opacity 0.18s ease;\n}\n.nav-link.active-link::after,\n.nav-link:hover::after {\n  opacity: 1;\n}\n.nav-icon {\n  width: 36px;\n  height: 36px;\n  border-radius: 11px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(255, 255, 255, 0.08);\n  font-size: 0.73rem;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n}\n.nav-copy {\n  display: grid;\n  gap: 0.15rem;\n}\n.nav-copy strong {\n  font-size: 0.9rem;\n}\n.nav-copy small {\n  color: rgba(246, 247, 251, 0.6);\n  font-size: 0.72rem;\n}\n.nav-link.active-link .nav-copy small {\n  color: rgba(255, 255, 255, 0.84);\n}\n.nav-submenu {\n  display: grid;\n  gap: 0.35rem;\n  padding: 0 0.35rem 0.35rem 0.35rem;\n}\n.nav-submenu.nav-submenu-collapsed {\n  display: none;\n}\n.nav-sublink {\n  display: grid;\n  grid-template-columns: 10px minmax(0, 1fr);\n  gap: 0.65rem;\n  align-items: start;\n  padding: 0.68rem 0.8rem;\n  border-radius: 12px;\n  color: rgba(246, 247, 251, 0.86);\n  border: 1px solid transparent;\n  background: rgba(255, 255, 255, 0.02);\n  transition:\n    background 0.18s ease,\n    border-color 0.18s ease,\n    transform 0.18s ease;\n}\n.nav-sublink:hover {\n  transform: translateX(2px);\n  background: rgba(255, 255, 255, 0.04);\n  border-color: rgba(255, 255, 255, 0.06);\n}\n.nav-sublink-dot {\n  width: 0.42rem;\n  height: 0.42rem;\n  border-radius: 999px;\n  margin-top: 0.42rem;\n  background: rgba(255, 255, 255, 0.32);\n}\n.nav-sublink-copy {\n  display: grid;\n  gap: 0.14rem;\n}\n.nav-sublink-copy strong {\n  font-size: 0.84rem;\n  font-weight: 700;\n}\n.nav-sublink-copy small {\n  color: rgba(246, 247, 251, 0.56);\n  font-size: 0.7rem;\n}\n.nav-sublink.active-sublink {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(255, 255, 255, 0.08);\n}\n.nav-sublink.active-sublink .nav-sublink-dot {\n  background: #ff5b61;\n  box-shadow: 0 0 0 4px rgba(215, 25, 32, 0.16);\n}\n.nav-sublink.active-sublink .nav-sublink-copy small,\n.nav-group.active-group .nav-sublink-copy small {\n  color: rgba(246, 247, 251, 0.72);\n}\n.sidebar-center,\n.shell-user-card {\n  border-radius: 18px;\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  background: rgba(255, 255, 255, 0.04);\n  padding: 0.9rem;\n}\n.sidebar-center {\n  display: grid;\n  gap: 0.75rem;\n}\n.center-header {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.75rem;\n  align-items: start;\n}\n.center-header strong {\n  display: block;\n  margin-top: 0.15rem;\n}\n.notification-badge {\n  min-width: 1.75rem;\n  height: 1.75rem;\n  padding: 0 0.45rem;\n  border-radius: 999px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: rgba(215, 25, 32, 0.92);\n  color: #fff;\n  font-size: 0.74rem;\n  font-weight: 800;\n}\n.mini-notification-list {\n  display: grid;\n  gap: 0.45rem;\n}\n.mini-notification {\n  width: 100%;\n  text-align: left;\n  padding: 0.7rem;\n  border-radius: 13px;\n  border: 1px solid rgba(255, 255, 255, 0.06);\n  background: rgba(255, 255, 255, 0.03);\n  color: inherit;\n  cursor: pointer;\n}\n.mini-notification strong,\n.mini-notification small {\n  display: block;\n}\n.mini-notification small,\n.sidebar-empty {\n  color: rgba(246, 247, 251, 0.58);\n  margin-top: 0.25rem;\n}\n.sidebar-empty {\n  margin: 0;\n}\n.shell-user-card {\n  margin-top: auto;\n  display: grid;\n  gap: 0.8rem;\n}\n.user-avatar {\n  width: 48px;\n  height: 48px;\n  border-radius: 14px;\n  display: grid;\n  place-items: center;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(215, 25, 32, 0.96),\n      rgba(255, 109, 115, 0.78));\n  color: #fff;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n}\n.user-copy {\n  display: grid;\n  gap: 0.15rem;\n}\n.user-copy span,\n.user-copy small {\n  color: rgba(246, 247, 251, 0.62);\n}\n.sidebar-ghost-button {\n  padding: 0.72rem 0.82rem;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  background: rgba(255, 255, 255, 0.06);\n  color: #f6f7fb;\n  cursor: pointer;\n}\n.logout-button {\n  width: 100%;\n}\n.shell-main {\n  min-width: 0;\n  display: grid;\n  grid-template-rows: auto 1fr;\n  position: relative;\n  z-index: 1;\n}\n.shell-header {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  align-items: center;\n  gap: 1rem;\n  padding: 0.8rem 9.6rem 0.8rem 1.6rem;\n  background: rgba(255, 255, 255, 0.9);\n  border-bottom: 1px solid rgba(22, 32, 51, 0.08);\n  -webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);\n}\n.header-brand {\n  display: flex;\n  align-items: center;\n  gap: 0.85rem;\n}\n.header-brand img {\n  width: 96px;\n  height: auto;\n  object-fit: contain;\n  object-position: center;\n}\n.header-copy {\n  display: grid;\n  gap: 0.1rem;\n}\n.header-copy strong {\n  font-size: 0.63rem;\n  letter-spacing: 0.24em;\n  color: #7a6a63;\n}\n.header-copy span,\n.header-role {\n  color: #776c67;\n  font-size: 0.77rem;\n}\n.header-presence {\n  display: flex;\n  align-items: center;\n  gap: 0.7rem;\n  justify-self: end;\n  margin-right: 0.55rem;\n}\n.presence-card,\n.clock-card {\n  display: flex;\n  align-items: center;\n  gap: 0.72rem;\n  min-height: 3.5rem;\n  padding: 0.72rem 0.9rem;\n  border-radius: 16px;\n  border: 1px solid rgba(22, 32, 51, 0.08);\n  background: rgba(255, 255, 255, 0.76);\n  box-shadow: 0 16px 28px rgba(12, 25, 45, 0.06);\n}\n.presence-dot {\n  width: 0.8rem;\n  height: 0.8rem;\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(215, 25, 32, 0.96),\n      rgba(255, 109, 115, 0.92));\n  box-shadow: 0 0 0 0 rgba(215, 25, 32, 0.28);\n  animation: pulse-dot 1.8s ease-out infinite;\n}\n.presence-copy,\n.clock-card {\n  display: grid;\n  gap: 0.1rem;\n}\n.presence-copy small,\n.presence-copy span,\n.clock-card small {\n  color: #776c67;\n  font-size: 0.72rem;\n}\n.presence-copy strong,\n.clock-card strong {\n  color: #1c212b;\n  font-size: 0.92rem;\n}\n.header-meta {\n  display: grid;\n  justify-items: end;\n  gap: 0.12rem;\n  margin-right: 0.7rem;\n  min-width: 0;\n}\n.header-meta strong {\n  font-size: 0.92rem;\n  color: #1c212b;\n  max-width: 18rem;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.shell-content {\n  padding: 1.45rem 1.55rem 2rem;\n}\n.content-stage {\n  position: relative;\n}\n.content-stage::before {\n  content: "";\n  position: absolute;\n  inset: -1rem -1rem auto auto;\n  width: 12rem;\n  height: 12rem;\n  border-radius: 999px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(215, 25, 32, 0.08),\n      transparent 68%);\n  pointer-events: none;\n  opacity: 0.8;\n}\n:host-context([data-theme="dark"]) .shell-layout {\n  background:\n    linear-gradient(\n      180deg,\n      rgba(12, 17, 26, 0.98),\n      rgba(14, 20, 31, 0.98)),\n    linear-gradient(\n      135deg,\n      rgba(215, 25, 32, 0.08),\n      transparent 26%);\n}\n:host-context([data-theme="dark"]) .shell-header {\n  background: rgba(18, 25, 38, 0.88);\n  border-bottom-color: rgba(148, 163, 184, 0.12);\n}\n:host-context([data-theme="dark"]) .presence-card,\n:host-context([data-theme="dark"]) .clock-card {\n  border-color: rgba(148, 163, 184, 0.14);\n  background: rgba(18, 25, 38, 0.78);\n}\n:host-context([data-theme="dark"]) .header-meta strong,\n:host-context([data-theme="dark"]) .presence-copy strong,\n:host-context([data-theme="dark"]) .clock-card strong,\n:host-context([data-theme="dark"]) .header-copy strong,\n:host-context([data-theme="dark"]) .header-copy span,\n:host-context([data-theme="dark"]) .header-role,\n:host-context([data-theme="dark"]) .presence-copy small,\n:host-context([data-theme="dark"]) .presence-copy span,\n:host-context([data-theme="dark"]) .clock-card small {\n  color: #d7dfeb;\n}\n@media (max-width: 1180px) {\n  .shell-layout {\n    grid-template-columns: 1fr;\n  }\n  .shell-sidebar {\n    position: relative;\n    top: auto;\n    align-self: stretch;\n    height: auto;\n    overflow: visible;\n  }\n  .shell-user-card {\n    margin-top: 0;\n  }\n}\n@media (max-width: 720px) {\n  .shell-header {\n    padding: 0.8rem 6.6rem 0.8rem 1rem;\n    align-items: start;\n    grid-template-columns: 1fr;\n  }\n  .header-presence {\n    width: 100%;\n    flex-direction: column;\n    align-items: stretch;\n    justify-self: stretch;\n    margin-right: 0;\n  }\n  .presence-card,\n  .clock-card {\n    width: 100%;\n  }\n  .header-meta {\n    justify-items: start;\n    margin-right: 0;\n  }\n  .header-meta strong {\n    max-width: 100%;\n  }\n  .shell-content {\n    padding: 1rem;\n  }\n}\n@keyframes pulse-dot {\n  0% {\n    box-shadow: 0 0 0 0 rgba(215, 25, 32, 0.28);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(215, 25, 32, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(215, 25, 32, 0);\n  }\n}\n@keyframes float-ambient {\n  0% {\n    transform: translate3d(0, 0, 0);\n  }\n  50% {\n    transform: translate3d(8px, 14px, 0);\n  }\n  100% {\n    transform: translate3d(-10px, 4px, 0);\n  }\n}\n@keyframes slide-in-nav {\n  0% {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n/*# sourceMappingURL=app-shell.component.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i05.\u0275setClassDebugInfo(AppShellComponent, { className: "AppShellComponent", filePath: "src/app/layout/app-shell.component.ts", lineNumber: 37 });
})();
(() => {
  const id = "src%2Fapp%2Flayout%2Fapp-shell.component.ts%40AppShellComponent";
  function AppShellComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i05.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i05.\u0275\u0275replaceMetadata(AppShellComponent, m.default, [i05], [RouterLink, RouterLinkActive, RouterOutlet, ToastOutletComponent, AssistantWidgetComponent, DatePipe, Component3, ChangeDetectionStrategy3], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && AppShellComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && AppShellComponent_HmrLoad(d.timestamp)));
})();
export {
  AppShellComponent
};


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbGF5b3V0L2FwcC1zaGVsbC5jb21wb25lbnQudHMiLCJzcmMvYXBwL2xheW91dC9hcHAtc2hlbGwuY29tcG9uZW50Lmh0bWwiLCJzcmMvYXBwL2NvcmUvc2VydmljZXMvbm90aWZpY2F0aW9uLnNlcnZpY2UudHMiLCJzcmMvYXBwL3NoYXJlZC9hc3Npc3RhbnQtd2lkZ2V0LmNvbXBvbmVudC50cyIsInNyYy9hcHAvc2hhcmVkL2Fzc2lzdGFudC13aWRnZXQuY29tcG9uZW50Lmh0bWwiLCJzcmMvYXBwL2NvcmUvc2VydmljZXMvYXNzaXN0YW50LnNlcnZpY2UudHMiLCJzcmMvYXBwL3NoYXJlZC90b2FzdC1vdXRsZXQuY29tcG9uZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERhdGVQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIERlc3Ryb3lSZWYsIGNvbXB1dGVkLCBpbmplY3QsIHNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgdGFrZVVudGlsRGVzdHJveWVkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS9yeGpzLWludGVyb3AnO1xuaW1wb3J0IHsgTmF2aWdhdGlvbkVuZCwgUm91dGVyLCBSb3V0ZXJMaW5rLCBSb3V0ZXJMaW5rQWN0aXZlLCBSb3V0ZXJPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgZmlsdGVyLCB0aW1lciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uT3ZlcnZpZXdSZXNwb25zZSB9IGZyb20gJy4uL2NvcmUvbW9kZWxzL25vdGlmaWNhdGlvbi5tb2RlbHMnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9jb3JlL3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vY29yZS9zZXJ2aWNlcy9ub3RpZmljYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBVaVRvYXN0U2VydmljZSB9IGZyb20gJy4uL2NvcmUvc2VydmljZXMvdWktdG9hc3Quc2VydmljZSc7XG5pbXBvcnQgeyBBc3Npc3RhbnRXaWRnZXRDb21wb25lbnQgfSBmcm9tICcuLi9zaGFyZWQvYXNzaXN0YW50LXdpZGdldC5jb21wb25lbnQnO1xuaW1wb3J0IHsgVG9hc3RPdXRsZXRDb21wb25lbnQgfSBmcm9tICcuLi9zaGFyZWQvdG9hc3Qtb3V0bGV0LmNvbXBvbmVudCc7XG5cbmludGVyZmFjZSBTaGVsbE5hdkNoaWxkSXRlbSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHBhdGg6IHN0cmluZztcbiAgaGludDogc3RyaW5nO1xuICB2aXNpYmxlPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFNoZWxsTmF2SXRlbSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHBhdGg6IHN0cmluZztcbiAgaWNvbjogc3RyaW5nO1xuICBoaW50OiBzdHJpbmc7XG4gIHZpc2libGU6IGJvb2xlYW47XG4gIGNvbGxhcHNpYmxlPzogYm9vbGVhbjtcbiAgY2hpbGRyZW4/OiBTaGVsbE5hdkNoaWxkSXRlbVtdO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtc2hlbGwnLFxuICBpbXBvcnRzOiBbUm91dGVyTGluaywgUm91dGVyTGlua0FjdGl2ZSwgUm91dGVyT3V0bGV0LCBUb2FzdE91dGxldENvbXBvbmVudCwgQXNzaXN0YW50V2lkZ2V0Q29tcG9uZW50LCBEYXRlUGlwZV0sXG4gIHRlbXBsYXRlVXJsOiAnLi9hcHAtc2hlbGwuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybDogJy4vYXBwLXNoZWxsLmNvbXBvbmVudC5jc3MnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBBcHBTaGVsbENvbXBvbmVudCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXV0aFNlcnZpY2UgPSBpbmplY3QoQXV0aFNlcnZpY2UpO1xuICBwcml2YXRlIHJlYWRvbmx5IG5vdGlmaWNhdGlvblNlcnZpY2UgPSBpbmplY3QoTm90aWZpY2F0aW9uU2VydmljZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgdG9hc3RTZXJ2aWNlID0gaW5qZWN0KFVpVG9hc3RTZXJ2aWNlKTtcbiAgcHJpdmF0ZSByZWFkb25seSBkZXN0cm95UmVmID0gaW5qZWN0KERlc3Ryb3lSZWYpO1xuICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlciA9IGluamVjdChSb3V0ZXIpO1xuXG4gIHJlYWRvbmx5IHVzZXIgPSB0aGlzLmF1dGhTZXJ2aWNlLnVzZXI7XG4gIHJlYWRvbmx5IGlzQWRtaW5pc3RyYXRpb24gPSBjb21wdXRlZCgoKSA9PiB0aGlzLmF1dGhTZXJ2aWNlLmhhc0FueVJvbGUoJ0FETUlOSVNUUkFUSU9OJykpO1xuICByZWFkb25seSBpc0RlcGFydG1lbnRIZWFkID0gY29tcHV0ZWQoKCkgPT4gdGhpcy5hdXRoU2VydmljZS5oYXNBbnlSb2xlKCdDSEVGX0RFUEFSVEVNRU5UJykpO1xuICByZWFkb25seSBpc1N1cGVyQWRtaW4gPSBjb21wdXRlZCgoKSA9PiB0aGlzLmF1dGhTZXJ2aWNlLmhhc0FueVJvbGUoJ1NVUEVSX0FETUlOJykpO1xuICByZWFkb25seSBzaG93Tm90aWZpY2F0aW9uQ2VudGVyID0gY29tcHV0ZWQoKCkgPT4gZmFsc2UpO1xuICByZWFkb25seSBub3RpZmljYXRpb25zTG9hZGluZyA9IHNpZ25hbChmYWxzZSk7XG4gIHJlYWRvbmx5IG5vdGlmaWNhdGlvbk92ZXJ2aWV3ID0gc2lnbmFsPE5vdGlmaWNhdGlvbk92ZXJ2aWV3UmVzcG9uc2UgfCBudWxsPihudWxsKTtcbiAgcmVhZG9ubHkgY3VycmVudFVybCA9IHNpZ25hbCh0aGlzLnJvdXRlci51cmwpO1xuICByZWFkb25seSBjdXJyZW50RGF0ZVRpbWUgPSBzaWduYWwobmV3IERhdGUoKSk7XG4gIHJlYWRvbmx5IGV4cGFuZGVkTmF2R3JvdXBzID0gc2lnbmFsPFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+Pih7fSk7XG4gIHJlYWRvbmx5IG5hdkl0ZW1zID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGNvbnN0IGl0ZW1zOiBTaGVsbE5hdkl0ZW1bXSA9IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6IHRoaXMuaXNBZG1pbmlzdHJhdGlvbigpIHx8IHRoaXMuaXNEZXBhcnRtZW50SGVhZCgpID8gJ1RhYmxlYXUgZGUgYm9yZCBkZSBwZXJmb3JtYW5jZScgOiAnVGFibGVhdSBkZSBib3JkJyxcbiAgICAgICAgcGF0aDogJy9kYXNoYm9hcmQnLFxuICAgICAgICBpY29uOiAnVEInLFxuICAgICAgICBoaW50OiB0aGlzLmlzQWRtaW5pc3RyYXRpb24oKSB8fCB0aGlzLmlzRGVwYXJ0bWVudEhlYWQoKSA/ICdJbmRpY2F0ZXVycyBldCBzdWl2aScgOiAnJyxcbiAgICAgICAgdmlzaWJsZTogIXRoaXMuaXNTdXBlckFkbWluKClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiB0aGlzLmlzRGVwYXJ0bWVudEhlYWQoKSA/ICdBY3Rpdml0ZXMgZW5zZWlnbmFudHMnIDogJ01lcyBhY3Rpdml0ZXMnLFxuICAgICAgICBwYXRoOiAnL3RlYWNoaW5nJyxcbiAgICAgICAgaWNvbjogJ0FDJyxcbiAgICAgICAgaGludDogdGhpcy5pc0RlcGFydG1lbnRIZWFkKCkgPyAnQ29uc3VsdGF0aW9uIGR1IGRlcGFydGVtZW50JyA6ICdUb3V0ZXMgdm9zIGRlY2xhcmF0aW9ucycsXG4gICAgICAgIHZpc2libGU6IHRoaXMuYXV0aFNlcnZpY2UuaGFzQW55Um9sZSgnRU5TRUlHTkFOVCcsICdDSEVGX0RFUEFSVEVNRU5UJyksXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgeyBsYWJlbDogJ0NvdXJzJywgcGF0aDogJy90ZWFjaGluZycsIGhpbnQ6ICdGb3JtYXRpb24gZXQgbW9kdWxlcycgfSxcbiAgICAgICAgICB7IGxhYmVsOiAnRW5jYWRyZW1lbnRzJywgcGF0aDogJy9zdXBlcnZpc2lvbicsIGhpbnQ6ICdQRkUgZXQganVyeXMnIH0sXG4gICAgICAgICAgeyBsYWJlbDogJ1JlY2hlcmNoZScsIHBhdGg6ICcvcmVzZWFyY2gnLCBoaW50OiAnQXJ0aWNsZXMgZXQgY29uZmVyZW5jZXMnIH0sXG4gICAgICAgICAgeyBsYWJlbDogJ0V2ZW5lbWVudHMnLCBwYXRoOiAnL2V2ZW50cycsIGhpbnQ6ICdPcmdhbmlzYXRpb24gc2NpZW50aWZpcXVlJyB9LFxuICAgICAgICAgIHsgbGFiZWw6ICdTdXJ2ZWlsbGFuY2VzJywgcGF0aDogJy9leGFtLXN1cnZlaWxsYW5jZScsIGhpbnQ6ICdFeGFtZW5zJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUmVzcG9uc2FiaWxpdGVzJyxcbiAgICAgICAgICAgIHBhdGg6ICcvcmVzcG9uc2liaWxpdGllcycsXG4gICAgICAgICAgICBoaW50OiAnUm9sZXMgaW5zdGl0dXRpb25uZWxzJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdQYXJ0ZW5hcmlhdCcsXG4gICAgICAgICAgICBwYXRoOiAnL3BhcnRuZXJzaGlwcycsXG4gICAgICAgICAgICBoaW50OiAnRGVjbGFyYXRpb24gYWNhZGVtaXF1ZSAvIHByb2Zlc3Npb25uZWxsZScsXG4gICAgICAgICAgICB2aXNpYmxlOiB0aGlzLmF1dGhTZXJ2aWNlLmhhc0FueVJvbGUoJ0VOU0VJR05BTlQnLCAnQ0hFRl9ERVBBUlRFTUVOVCcpXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0Rpc3BvbmliaWxpdGUnLFxuICAgICAgICBwYXRoOiAnL2F2YWlsYWJpbGl0eS9sZWF2ZScsXG4gICAgICAgIGljb246ICdEUCcsXG4gICAgICAgIGhpbnQ6ICdDb25nZXMgZXQgbWlzc2lvbnMnLFxuICAgICAgICB2aXNpYmxlOiB0aGlzLmF1dGhTZXJ2aWNlLmhhc0FueVJvbGUoJ0VOU0VJR05BTlQnKSxcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgeyBsYWJlbDogJ0RlbWFuZGVyIHVuIGNvbmdlJywgcGF0aDogJy9hdmFpbGFiaWxpdHkvbGVhdmUnLCBoaW50OiAnRGVjbGFyYXRpb24gZGUgY29uZ2UnIH0sXG4gICAgICAgICAgeyBsYWJlbDogJ0RlbWFuZGVyIHVuZSBtaXNzaW9uJywgcGF0aDogJy9hdmFpbGFiaWxpdHkvbWlzc2lvbicsIGhpbnQ6ICdEZWNsYXJhdGlvbiBkZSBtaXNzaW9uJyB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiB0aGlzLmlzU3VwZXJBZG1pbigpID8gJ1V0aWxpc2F0ZXVycyBldCByb2xlcycgOiAnVXRpbGlzYXRldXJzJyxcbiAgICAgICAgcGF0aDogJy91c2VycycsXG4gICAgICAgIGljb246ICdVUycsXG4gICAgICAgIGhpbnQ6IHRoaXMuaXNTdXBlckFkbWluKCkgPyAnR2VzdGlvbiBkZXMgdXRpbGlzYXRldXJzIGV0IGRlcyByb2xlcycgOiAnQ29tcHRlcyBldCByb2xlcycsXG4gICAgICAgIHZpc2libGU6IHRoaXMuYXV0aFNlcnZpY2UuaGFzQW55Um9sZSgnU1VQRVJfQURNSU4nKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6IHRoaXMuaXNEZXBhcnRtZW50SGVhZCgpXG4gICAgICAgICAgPyAnVmFsaWRhdGlvbiBkZXBhcnRlbWVudGFsZSdcbiAgICAgICAgICA6ICdXb3JrZmxvdycsXG4gICAgICAgIHBhdGg6ICcvd29ya2Zsb3cnLFxuICAgICAgICBpY29uOiAnV0YnLFxuICAgICAgICBoaW50OiB0aGlzLmlzRGVwYXJ0bWVudEhlYWQoKSA/ICdWYWxpZGVyIG91IHJlamV0ZXIgbGVzIGRvc3NpZXJzJyA6ICdWYWxpZGF0aW9uIGRlcyBkb3NzaWVycycsXG4gICAgICAgIHZpc2libGU6IHRoaXMuYXV0aFNlcnZpY2UuaGFzQW55Um9sZSgnQ0hFRl9ERVBBUlRFTUVOVCcsICdBRE1JTklTVFJBVElPTicpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogdGhpcy5pc0FkbWluaXN0cmF0aW9uKClcbiAgICAgICAgICA/ICdSYXBwb3J0cyBpbnN0aXR1dGlvbm5lbHMnXG4gICAgICAgICAgOiB0aGlzLmlzRGVwYXJ0bWVudEhlYWQoKVxuICAgICAgICAgICAgPyAnUmFwcG9ydHMgZGVwYXJ0ZW1lbnRhdXgnXG4gICAgICAgICAgICA6ICdSYXBwb3J0IGluZGl2aWR1ZWwnLFxuICAgICAgICBwYXRoOiAnL3JlcG9ydHMnLFxuICAgICAgICBpY29uOiAnUlAnLFxuICAgICAgICBoaW50OiB0aGlzLmlzQWRtaW5pc3RyYXRpb24oKVxuICAgICAgICAgID8gJ1JhcHBvcnRzIGV0IHByaW1lcyBkZSBwZXJmb3JtYW5jZSdcbiAgICAgICAgICA6IHRoaXMuaXNEZXBhcnRtZW50SGVhZCgpXG4gICAgICAgICAgICA/ICdFeHBvcnRzIGNvbnNvbGlkZXMgZHUgZGVwYXJ0ZW1lbnQnXG4gICAgICAgICAgICA6ICdHZW5lcmF0aW9uIGV0IGhpc3RvcmlxdWUgaW5kaXZpZHVlbCcsXG4gICAgICAgIHZpc2libGU6ICF0aGlzLmlzU3VwZXJBZG1pbigpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ1Byb2ZpbCBldCBzZWN1cml0ZScsXG4gICAgICAgIHBhdGg6ICcvcHJvZmlsZScsXG4gICAgICAgIGljb246ICdQUicsXG4gICAgICAgIGhpbnQ6ICdDb21wdGUsIHByb2ZpbCBldCAyRkEnLFxuICAgICAgICB2aXNpYmxlOiB0aGlzLmF1dGhTZXJ2aWNlLmhhc0FueVJvbGUoJ0VOU0VJR05BTlQnLCAnQ0hFRl9ERVBBUlRFTUVOVCcsICdBRE1JTklTVFJBVElPTicsICdTVVBFUl9BRE1JTicpXG4gICAgICB9XG4gICAgXTtcblxuICAgIHJldHVybiBpdGVtc1xuICAgICAgLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgY2hpbGRyZW46IGl0ZW0uY2hpbGRyZW4/LmZpbHRlcigoY2hpbGQpID0+IGNoaWxkLnZpc2libGUgIT09IGZhbHNlKVxuICAgICAgfSkpXG4gICAgICAuZmlsdGVyKChpdGVtKSA9PiBpdGVtLnZpc2libGUpO1xuICB9KTtcbiAgcmVhZG9ubHkgcmVjZW50Tm90aWZpY2F0aW9ucyA9IGNvbXB1dGVkKCgpID0+ICh0aGlzLm5vdGlmaWNhdGlvbk92ZXJ2aWV3KCk/Lm5vdGlmaWNhdGlvbnMgPz8gW10pLnNsaWNlKDAsIDMpKTtcbiAgcmVhZG9ubHkgdW5yZWFkTm90aWZpY2F0aW9uc0NvdW50ID0gY29tcHV0ZWQoKCkgPT4gdGhpcy5ub3RpZmljYXRpb25PdmVydmlldygpPy51bnJlYWRDb3VudCA/PyAwKTtcbiAgcmVhZG9ubHkgY3VycmVudERhdGVMYWJlbCA9IGNvbXB1dGVkKCgpID0+XG4gICAgbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2ZyLUZSJywge1xuICAgICAgd2Vla2RheTogJ2xvbmcnLFxuICAgICAgZGF5OiAnMi1kaWdpdCcsXG4gICAgICBtb250aDogJ2xvbmcnXG4gICAgfSkuZm9ybWF0KHRoaXMuY3VycmVudERhdGVUaW1lKCkpXG4gICk7XG4gIHJlYWRvbmx5IGN1cnJlbnRUaW1lTGFiZWwgPSBjb21wdXRlZCgoKSA9PlxuICAgIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdmci1GUicsIHtcbiAgICAgIGhvdXI6ICcyLWRpZ2l0JyxcbiAgICAgIG1pbnV0ZTogJzItZGlnaXQnXG4gICAgfSkuZm9ybWF0KHRoaXMuY3VycmVudERhdGVUaW1lKCkpXG4gICk7XG4gIHJlYWRvbmx5IHdvcmtzcGFjZUdyZWV0aW5nID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGNvbnN0IGhvdXIgPSB0aGlzLmN1cnJlbnREYXRlVGltZSgpLmdldEhvdXJzKCk7XG5cbiAgICBpZiAoaG91ciA8IDEyKSB7XG4gICAgICByZXR1cm4gJ0JvbmpvdXInO1xuICAgIH1cblxuICAgIGlmIChob3VyIDwgMTgpIHtcbiAgICAgIHJldHVybiAnQm9uIGFwcmVzLW1pZGknO1xuICAgIH1cblxuICAgIHJldHVybiAnQm9uc29pcic7XG4gIH0pO1xuICByZWFkb25seSBhY3RpdmVXb3Jrc3BhY2VMYWJlbCA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50VXJsID0gdGhpcy5jdXJyZW50VXJsKCk7XG5cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5uYXZJdGVtcygpKSB7XG4gICAgICBjb25zdCBhY3RpdmVDaGlsZCA9IGl0ZW0uY2hpbGRyZW4/LmZpbmQoKGNoaWxkKSA9PiBjdXJyZW50VXJsID09PSBjaGlsZC5wYXRoIHx8IGN1cnJlbnRVcmwuc3RhcnRzV2l0aChgJHtjaGlsZC5wYXRofS9gKSk7XG4gICAgICBpZiAoYWN0aXZlQ2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIGFjdGl2ZUNoaWxkLmxhYmVsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudFVybCA9PT0gaXRlbS5wYXRoIHx8IGN1cnJlbnRVcmwuc3RhcnRzV2l0aChgJHtpdGVtLnBhdGh9L2ApKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmxhYmVsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAnRXNwYWNlIGRlIHRyYXZhaWwnO1xuICB9KTtcbiAgcmVhZG9ubHkgYWN0aXZlV29ya3NwYWNlSGludCA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50VXJsID0gdGhpcy5jdXJyZW50VXJsKCk7XG5cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5uYXZJdGVtcygpKSB7XG4gICAgICBjb25zdCBhY3RpdmVDaGlsZCA9IGl0ZW0uY2hpbGRyZW4/LmZpbmQoKGNoaWxkKSA9PiBjdXJyZW50VXJsID09PSBjaGlsZC5wYXRoIHx8IGN1cnJlbnRVcmwuc3RhcnRzV2l0aChgJHtjaGlsZC5wYXRofS9gKSk7XG4gICAgICBpZiAoYWN0aXZlQ2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIGFjdGl2ZUNoaWxkLmhpbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50VXJsID09PSBpdGVtLnBhdGggfHwgY3VycmVudFVybC5zdGFydHNXaXRoKGAke2l0ZW0ucGF0aH0vYCkpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaGludDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gJ1BsYXRlZm9ybWUgYWNhZGVtaXF1ZSBFU1BSSVQnO1xuICB9KTtcbiAgcmVhZG9ubHkgdXNlckluaXRpYWxzID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRVc2VyID0gdGhpcy51c2VyKCk7XG4gICAgaWYgKCFjdXJyZW50VXNlcikge1xuICAgICAgcmV0dXJuICdVJztcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7Y3VycmVudFVzZXIuZmlyc3ROYW1lLmNoYXJBdCgwKX0ke2N1cnJlbnRVc2VyLmxhc3ROYW1lLmNoYXJBdCgwKX1gLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoZXZlbnQpOiBldmVudCBpcyBOYXZpZ2F0aW9uRW5kID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCksXG4gICAgICAgIHRha2VVbnRpbERlc3Ryb3llZCh0aGlzLmRlc3Ryb3lSZWYpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnRVcmwuc2V0KGV2ZW50LnVybEFmdGVyUmVkaXJlY3RzKTtcbiAgICAgIH0pO1xuXG4gICAgdGltZXIoMCwgMjAwMDApXG4gICAgICAucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQodGhpcy5kZXN0cm95UmVmKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnREYXRlVGltZS5zZXQobmV3IERhdGUoKSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnNob3dOb3RpZmljYXRpb25DZW50ZXIoKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9hZE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbG9nb3V0KCkge1xuICAgIHRoaXMuYXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gIH1cblxuICByb2xlTGFiZWwocm9sZTogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gICAgc3dpdGNoIChyb2xlKSB7XG4gICAgICBjYXNlICdFTlNFSUdOQU5UJzpcbiAgICAgICAgcmV0dXJuICdFbnNlaWduYW50JztcbiAgICAgIGNhc2UgJ0NIRUZfREVQQVJURU1FTlQnOlxuICAgICAgICByZXR1cm4gJ0NoZWYgZGUgZGVwYXJ0ZW1lbnQnO1xuICAgICAgY2FzZSAnQURNSU5JU1RSQVRJT04nOlxuICAgICAgICByZXR1cm4gJ0FkbWluaXN0cmF0aW9uJztcbiAgICAgIGNhc2UgJ1NVUEVSX0FETUlOJzpcbiAgICAgICAgcmV0dXJuICdTdXBlciBhZG1pbmlzdHJhdGV1cic7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ1V0aWxpc2F0ZXVyJztcbiAgICB9XG4gIH1cblxuICBsb2FkTm90aWZpY2F0aW9ucyhzaG93RXJyb3JUb2FzdCA9IGZhbHNlKSB7XG4gICAgaWYgKCF0aGlzLnNob3dOb3RpZmljYXRpb25DZW50ZXIoKSkge1xuICAgICAgdGhpcy5ub3RpZmljYXRpb25PdmVydmlldy5zZXQobnVsbCk7XG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbnNMb2FkaW5nLnNldChmYWxzZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ub3RpZmljYXRpb25zTG9hZGluZy5zZXQodHJ1ZSk7XG5cbiAgICB0aGlzLm5vdGlmaWNhdGlvblNlcnZpY2VcbiAgICAgIC5nZXRPdmVydmlldygpXG4gICAgICAucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQodGhpcy5kZXN0cm95UmVmKSlcbiAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICBuZXh0OiAob3ZlcnZpZXcpID0+IHtcbiAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbk92ZXJ2aWV3LnNldChvdmVydmlldyk7XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zTG9hZGluZy5zZXQoZmFsc2UpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKCkgPT4ge1xuICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9uc0xvYWRpbmcuc2V0KGZhbHNlKTtcbiAgICAgICAgICBpZiAoc2hvd0Vycm9yVG9hc3QpIHtcbiAgICAgICAgICAgIHRoaXMudG9hc3RTZXJ2aWNlLndhcm5pbmcoXG4gICAgICAgICAgICAgICdOb3RpZmljYXRpb25zIGluZGlzcG9uaWJsZXMnLFxuICAgICAgICAgICAgICBcIkxlIGNlbnRyZSBkZSBub3RpZmljYXRpb25zIG4nYSBwYXMgcHUgZXRyZSBjaGFyZ2UuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG1hcmtOb3RpZmljYXRpb25Bc1JlYWQobm90aWZpY2F0aW9uSWQ6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5zaG93Tm90aWZpY2F0aW9uQ2VudGVyKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm5vdGlmaWNhdGlvblNlcnZpY2VcbiAgICAgIC5tYXJrQXNSZWFkKG5vdGlmaWNhdGlvbklkKVxuICAgICAgLnBpcGUodGFrZVVudGlsRGVzdHJveWVkKHRoaXMuZGVzdHJveVJlZikpXG4gICAgICAuc3Vic2NyaWJlKHtcbiAgICAgICAgbmV4dDogKG92ZXJ2aWV3KSA9PiB7XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25PdmVydmlldy5zZXQob3ZlcnZpZXcpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKCkgPT4ge1xuICAgICAgICAgIHRoaXMudG9hc3RTZXJ2aWNlLndhcm5pbmcoJ0FjdGlvbiBpbXBvc3NpYmxlJywgXCJMYSBub3RpZmljYXRpb24gbidhIHBhcyBwdSBldHJlIG1pc2UgYSBqb3VyLlwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBtYXJrQWxsTm90aWZpY2F0aW9uc0FzUmVhZCgpIHtcbiAgICBpZiAoIXRoaXMuc2hvd05vdGlmaWNhdGlvbkNlbnRlcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ub3RpZmljYXRpb25TZXJ2aWNlXG4gICAgICAubWFya0FsbEFzUmVhZCgpXG4gICAgICAucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQodGhpcy5kZXN0cm95UmVmKSlcbiAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICBuZXh0OiAob3ZlcnZpZXcpID0+IHtcbiAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbk92ZXJ2aWV3LnNldChvdmVydmlldyk7XG4gICAgICAgICAgdGhpcy50b2FzdFNlcnZpY2Uuc3VjY2VzcygnTm90aWZpY2F0aW9ucyBsdWVzJywgJ1RvdXRlcyBsZXMgbm90aWZpY2F0aW9ucyB2aXNpYmxlcyBvbnQgZXRlIG1hcnF1ZWVzIGNvbW1lIGx1ZXMuJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy50b2FzdFNlcnZpY2Uud2FybmluZygnQWN0aW9uIGltcG9zc2libGUnLCBcIkxlcyBub3RpZmljYXRpb25zIG4nb250IHBhcyBwdSBldHJlIG1pc2VzIGEgam91ci5cIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgaXNSb3V0ZUFjdGl2ZShwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjdXJyZW50VXJsID0gdGhpcy5jdXJyZW50VXJsKCk7XG4gICAgcmV0dXJuIGN1cnJlbnRVcmwgPT09IHBhdGggfHwgY3VycmVudFVybC5zdGFydHNXaXRoKGAke3BhdGh9L2ApO1xuICB9XG5cbiAgaXNOYXZJdGVtQWN0aXZlKGl0ZW06IFNoZWxsTmF2SXRlbSkge1xuICAgIHJldHVybiB0aGlzLmlzUm91dGVBY3RpdmUoaXRlbS5wYXRoKTtcbiAgfVxuXG4gIGlzTmF2R3JvdXBBY3RpdmUoaXRlbTogU2hlbGxOYXZJdGVtKSB7XG4gICAgaWYgKGl0ZW0uY2hpbGRyZW4/LnNvbWUoKGNoaWxkKSA9PiB0aGlzLmlzUm91dGVBY3RpdmUoY2hpbGQucGF0aCkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pc05hdkl0ZW1BY3RpdmUoaXRlbSk7XG4gIH1cblxuICBpc05hdkdyb3VwRXhwYW5kZWQoaXRlbTogU2hlbGxOYXZJdGVtKSB7XG4gICAgaWYgKCFpdGVtLmNvbGxhcHNpYmxlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5leHBhbmRlZE5hdkdyb3VwcygpW2l0ZW0ucGF0aF0gPT09IHRydWU7XG4gIH1cblxuICB0b2dnbGVOYXZHcm91cChpdGVtOiBTaGVsbE5hdkl0ZW0pIHtcbiAgICBpZiAoIWl0ZW0uY29sbGFwc2libGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmV4cGFuZGVkTmF2R3JvdXBzLnVwZGF0ZSgoZ3JvdXBzKSA9PiAoe1xuICAgICAgLi4uZ3JvdXBzLFxuICAgICAgW2l0ZW0ucGF0aF06ICFncm91cHNbaXRlbS5wYXRoXVxuICAgIH0pKTtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cInNoZWxsLWxheW91dFwiPlxuICA8YXNpZGUgY2xhc3M9XCJzaGVsbC1zaWRlYmFyXCI+XG4gICAgPGRpdiBjbGFzcz1cInNpZGViYXItYnJhbmRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJsb2dvLWNhcmRcIj5cbiAgICAgICAgPGltZyBzcmM9XCIvbG9nby1lc3ByaXQtYXJpYW5hLmpwZ1wiIGFsdD1cIkVTUFJJVFwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJicmFuZC1jb3B5XCI+XG4gICAgICAgIDxzdHJvbmc+UGxhdGVmb3JtZSBhY2FkZW1pcXVlPC9zdHJvbmc+XG4gICAgICAgIDxzcGFuPlN1aXZpIGFjYWRlbWlxdWUgRVNQUklUPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8bmF2IGNsYXNzPVwic2hlbGwtbmF2XCI+XG4gICAgICBAZm9yIChpdGVtIG9mIG5hdkl0ZW1zKCk7IHRyYWNrIGl0ZW0ucGF0aCkge1xuICAgICAgICBAaWYgKGl0ZW0uY2hpbGRyZW4/Lmxlbmd0aCkge1xuICAgICAgICAgIDxkaXYgY2xhc3M9XCJuYXYtZ3JvdXBcIiBbY2xhc3MuYWN0aXZlLWdyb3VwXT1cImlzTmF2R3JvdXBBY3RpdmUoaXRlbSlcIj5cbiAgICAgICAgICAgIEBpZiAoaXRlbS5jb2xsYXBzaWJsZSkge1xuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJuYXYtbGluayBuYXYtZ3JvdXAtbGluayBuYXYtZ3JvdXAtdG9nZ2xlXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBbY2xhc3MuYWN0aXZlLWxpbmtdPVwiaXNOYXZHcm91cEFjdGl2ZShpdGVtKVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJpc05hdkdyb3VwRXhwYW5kZWQoaXRlbSlcIlxuICAgICAgICAgICAgICAgIChjbGljayk9XCJ0b2dnbGVOYXZHcm91cChpdGVtKVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5hdi1pY29uXCI+e3sgaXRlbS5pY29uIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LWNvcHlcIj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e3sgaXRlbS5sYWJlbCB9fTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgQGlmIChpdGVtLmhpbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgPHNtYWxsPnt7IGl0ZW0uaGludCB9fTwvc21hbGw+XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LWdyb3VwLWNoZXZyb25cIiBbY2xhc3MuZXhwYW5kZWRdPVwiaXNOYXZHcm91cEV4cGFuZGVkKGl0ZW0pXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIH0gQGVsc2Uge1xuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3M9XCJuYXYtbGluayBuYXYtZ3JvdXAtbGluayBuYXYtZ3JvdXAtbGFiZWxcIlxuICAgICAgICAgICAgICAgIFtjbGFzcy5hY3RpdmUtbGlua109XCJpc05hdkdyb3VwQWN0aXZlKGl0ZW0pXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LWljb25cIj57eyBpdGVtLmljb24gfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtY29weVwiPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz57eyBpdGVtLmxhYmVsIH19PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICBAaWYgKGl0ZW0uaGludCkge1xuICAgICAgICAgICAgICAgICAgICA8c21hbGw+e3sgaXRlbS5oaW50IH19PC9zbWFsbD5cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmF2LXN1Ym1lbnVcIiBbY2xhc3MubmF2LXN1Ym1lbnUtY29sbGFwc2VkXT1cIiFpc05hdkdyb3VwRXhwYW5kZWQoaXRlbSlcIj5cbiAgICAgICAgICAgICAgQGZvciAoY2hpbGQgb2YgaXRlbS5jaGlsZHJlbjsgdHJhY2sgY2hpbGQucGF0aCkge1xuICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cIm5hdi1zdWJsaW5rXCJcbiAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rXT1cImNoaWxkLnBhdGhcIlxuICAgICAgICAgICAgICAgICAgcm91dGVyTGlua0FjdGl2ZT1cImFjdGl2ZS1zdWJsaW5rXCJcbiAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc109XCJ7IGV4YWN0OiB0cnVlIH1cIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LXN1YmxpbmstZG90XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtc3VibGluay1jb3B5XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e3sgY2hpbGQubGFiZWwgfX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgPHNtYWxsPnt7IGNoaWxkLmhpbnQgfX08L3NtYWxsPlxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIH0gQGVsc2Uge1xuICAgICAgICAgIDxhXG4gICAgICAgICAgICBjbGFzcz1cIm5hdi1saW5rXCJcbiAgICAgICAgICAgIFtyb3V0ZXJMaW5rXT1cIml0ZW0ucGF0aFwiXG4gICAgICAgICAgICByb3V0ZXJMaW5rQWN0aXZlPVwiYWN0aXZlLWxpbmtcIlxuICAgICAgICAgICAgW3JvdXRlckxpbmtBY3RpdmVPcHRpb25zXT1cInsgZXhhY3Q6IHRydWUgfVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtaWNvblwiPnt7IGl0ZW0uaWNvbiB9fTwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LWNvcHlcIj5cbiAgICAgICAgICAgICAgPHN0cm9uZz57eyBpdGVtLmxhYmVsIH19PC9zdHJvbmc+XG4gICAgICAgICAgICAgIEBpZiAoaXRlbS5oaW50KSB7XG4gICAgICAgICAgICAgICAgPHNtYWxsPnt7IGl0ZW0uaGludCB9fTwvc21hbGw+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2E+XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICA8L25hdj5cblxuICAgIEBpZiAoc2hvd05vdGlmaWNhdGlvbkNlbnRlcigpKSB7XG4gICAgICA8c2VjdGlvbiBjbGFzcz1cInNpZGViYXItY2VudGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGVyXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwiZXllYnJvd1wiPkNlbnRyZTwvcD5cbiAgICAgICAgICAgIDxzdHJvbmc+Tm90aWZpY2F0aW9uczwvc3Ryb25nPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIEBpZiAodW5yZWFkTm90aWZpY2F0aW9uc0NvdW50KCkgPiAwKSB7XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5vdGlmaWNhdGlvbi1iYWRnZVwiPnt7IHVucmVhZE5vdGlmaWNhdGlvbnNDb3VudCgpIH19PC9zcGFuPlxuICAgICAgICAgIH1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgQGlmIChub3RpZmljYXRpb25zTG9hZGluZygpKSB7XG4gICAgICAgICAgPHAgY2xhc3M9XCJzaWRlYmFyLWVtcHR5XCI+Q2hhcmdlbWVudC4uLjwvcD5cbiAgICAgICAgfSBAZWxzZSBpZiAocmVjZW50Tm90aWZpY2F0aW9ucygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIDxwIGNsYXNzPVwic2lkZWJhci1lbXB0eVwiPkF1Y3VuZSBub3RpZmljYXRpb24gcmVjZW50ZS48L3A+XG4gICAgICAgIH0gQGVsc2Uge1xuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5pLW5vdGlmaWNhdGlvbi1saXN0XCI+XG4gICAgICAgICAgICBAZm9yIChub3RpZmljYXRpb24gb2YgcmVjZW50Tm90aWZpY2F0aW9ucygpOyB0cmFjayBub3RpZmljYXRpb24uaWQpIHtcbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1pbmktbm90aWZpY2F0aW9uXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJtYXJrTm90aWZpY2F0aW9uQXNSZWFkKG5vdGlmaWNhdGlvbi5pZClcIj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPnt7IG5vdGlmaWNhdGlvbi50aXRsZSB9fTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgIDxzbWFsbD57eyBub3RpZmljYXRpb24uY3JlYXRlZEF0IHwgZGF0ZTogJ2RkL01NIEhIOm1tJyB9fTwvc21hbGw+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICB9XG5cbiAgICAgICAgQGlmICh1bnJlYWROb3RpZmljYXRpb25zQ291bnQoKSA+IDApIHtcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic2lkZWJhci1naG9zdC1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cIm1hcmtBbGxOb3RpZmljYXRpb25zQXNSZWFkKClcIj5Ub3V0IGxpcmU8L2J1dHRvbj5cbiAgICAgICAgfVxuICAgICAgPC9zZWN0aW9uPlxuICAgIH1cblxuICAgIDxkaXYgY2xhc3M9XCJzaGVsbC11c2VyLWNhcmRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyLWF2YXRhclwiPnt7IHVzZXJJbml0aWFscygpIH19PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwidXNlci1jb3B5XCI+XG4gICAgICAgIDxzdHJvbmc+e3sgdXNlcigpPy5maXJzdE5hbWUgfX0ge3sgdXNlcigpPy5sYXN0TmFtZSB9fTwvc3Ryb25nPlxuICAgICAgICA8c3Bhbj57eyByb2xlTGFiZWwodXNlcigpPy5yb2xlKSB9fTwvc3Bhbj5cbiAgICAgICAgQGlmICh1c2VyKCk/LmRlcGFydG1lbnROYW1lKSB7XG4gICAgICAgICAgPHNtYWxsPnt7IHVzZXIoKT8uZGVwYXJ0bWVudE5hbWUgfX08L3NtYWxsPlxuICAgICAgICB9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJzaWRlYmFyLWdob3N0LWJ1dHRvbiBsb2dvdXQtYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJsb2dvdXQoKVwiPkRlY29ubmV4aW9uPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvYXNpZGU+XG5cbiAgPHNlY3Rpb24gY2xhc3M9XCJzaGVsbC1tYWluXCI+XG4gICAgPGhlYWRlciBjbGFzcz1cInNoZWxsLWhlYWRlclwiPlxuICAgICAgPGRpdiBjbGFzcz1cImhlYWRlci1icmFuZFwiPlxuICAgICAgICA8aW1nIHNyYz1cIi9sb2dvLWVzcHJpdC1hcmlhbmEuanBnXCIgYWx0PVwiRVNQUklUXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRlci1jb3B5XCI+XG4gICAgICAgICAgPHN0cm9uZz5IT05PUklTIFVOSVRFRCBVTklWRVJTSVRJRVM8L3N0cm9uZz5cbiAgICAgICAgICA8c3Bhbj5QbGF0ZWZvcm1lIGFjYWRlbWlxdWUgRVNQUklUPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyLXByZXNlbmNlXCI+XG4gICAgICAgIDxhcnRpY2xlIGNsYXNzPVwicHJlc2VuY2UtY2FyZFwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJlc2VuY2UtZG90XCI+PC9zcGFuPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcmVzZW5jZS1jb3B5XCI+XG4gICAgICAgICAgICA8c21hbGw+e3sgd29ya3NwYWNlR3JlZXRpbmcoKSB9fTwvc21hbGw+XG4gICAgICAgICAgICA8c3Ryb25nPnt7IGFjdGl2ZVdvcmtzcGFjZUxhYmVsKCkgfX08L3N0cm9uZz5cbiAgICAgICAgICAgIDxzcGFuPnt7IGFjdGl2ZVdvcmtzcGFjZUhpbnQoKSB9fTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9hcnRpY2xlPlxuXG4gICAgICAgIDxhcnRpY2xlIGNsYXNzPVwiY2xvY2stY2FyZFwiPlxuICAgICAgICAgIDxzbWFsbD57eyBjdXJyZW50RGF0ZUxhYmVsKCkgfX08L3NtYWxsPlxuICAgICAgICAgIDxzdHJvbmc+e3sgY3VycmVudFRpbWVMYWJlbCgpIH19PC9zdHJvbmc+XG4gICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyLW1ldGFcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJoZWFkZXItcm9sZVwiPnt7IHJvbGVMYWJlbCh1c2VyKCk/LnJvbGUpIH19PC9zcGFuPlxuICAgICAgICA8c3Ryb25nPnt7IHVzZXIoKT8uZmlyc3ROYW1lIH19IHt7IHVzZXIoKT8ubGFzdE5hbWUgfX08L3N0cm9uZz5cbiAgICAgIDwvZGl2PlxuICAgIDwvaGVhZGVyPlxuXG4gICAgPGRpdiBjbGFzcz1cInNoZWxsLWNvbnRlbnRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LXN0YWdlXCI+XG4gICAgICAgIDxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L3NlY3Rpb24+XG48L2Rpdj5cbjxhcHAtdG9hc3Qtb3V0bGV0PjwvYXBwLXRvYXN0LW91dGxldD5cbjxhcHAtYXNzaXN0YW50LXdpZGdldD48L2FwcC1hc3Npc3RhbnQtd2lkZ2V0PlxuXHJcbiIsImltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbk92ZXJ2aWV3UmVzcG9uc2UgfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpY2F0aW9uLm1vZGVscyc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uU2VydmljZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgaHR0cCA9IGluamVjdChIdHRwQ2xpZW50KTtcblxuICBnZXRPdmVydmlldygpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxOb3RpZmljYXRpb25PdmVydmlld1Jlc3BvbnNlPignL2FwaS9ub3RpZmljYXRpb25zJyk7XG4gIH1cblxuICBtYXJrQXNSZWFkKGlkOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8Tm90aWZpY2F0aW9uT3ZlcnZpZXdSZXNwb25zZT4oYC9hcGkvbm90aWZpY2F0aW9ucy8ke2lkfS9yZWFkYCwge30pO1xuICB9XG5cbiAgbWFya0FsbEFzUmVhZCgpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8Tm90aWZpY2F0aW9uT3ZlcnZpZXdSZXNwb25zZT4oJy9hcGkvbm90aWZpY2F0aW9ucy9yZWFkLWFsbCcsIHt9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRGVzdHJveVJlZiwgRWxlbWVudFJlZiwgVmlld0NoaWxkLCBjb21wdXRlZCwgaW5qZWN0LCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHRha2VVbnRpbERlc3Ryb3llZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvcnhqcy1pbnRlcm9wJztcbmltcG9ydCB7IEFzc2lzdGFudENoYXRSZXNwb25zZSB9IGZyb20gJy4uL2NvcmUvbW9kZWxzL2Fzc2lzdGFudC5tb2RlbHMnO1xuaW1wb3J0IHsgUm9sZVR5cGUgfSBmcm9tICcuLi9jb3JlL21vZGVscy9zaGFyZWQubW9kZWxzJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vY29yZS9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXNzaXN0YW50U2VydmljZSB9IGZyb20gJy4uL2NvcmUvc2VydmljZXMvYXNzaXN0YW50LnNlcnZpY2UnO1xuaW1wb3J0IHsgVWlUb2FzdFNlcnZpY2UgfSBmcm9tICcuLi9jb3JlL3NlcnZpY2VzL3VpLXRvYXN0LnNlcnZpY2UnO1xuaW1wb3J0IHsgZXh0cmFjdEVycm9yTWVzc2FnZSB9IGZyb20gJy4uL2NvcmUvdXRpbHMvaHR0cC1lcnJvci51dGlsJztcblxudHlwZSBBc3Npc3RhbnRSb2xlID0gJ0VOU0VJR05BTlQnIHwgJ0NIRUZfREVQQVJURU1FTlQnIHwgJ0FETUlOSVNUUkFUSU9OJyB8ICdTVVBFUl9BRE1JTic7XG5cbmludGVyZmFjZSBSb2xlQ2hpcCB7XG4gIHJvbGU6IEFzc2lzdGFudFJvbGU7XG4gIGljb246IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFF1aWNrQ2hpcCB7XG4gIGljb246IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgcHJvbXB0OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBBc3Npc3RhbnRDaGF0TWVzc2FnZSB7XG4gIGlkOiBudW1iZXI7XG4gIHNlbmRlcjogJ3VzZXInIHwgJ2Fzc2lzdGFudCc7XG4gIHF1ZXN0aW9uPzogc3RyaW5nO1xuICByZXNwb25zZT86IEFzc2lzdGFudENoYXRSZXNwb25zZTtcbiAgdGV4dD86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFBhcnNlZFNlY3Rpb24ge1xuICBrZXk6IHN0cmluZztcbiAga2luZDogJ3N1bW1hcnknIHwgJ2FuYWx5c2lzJyB8ICdyZWNvbW1lbmRhdGlvbicgfCAncmlzayc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIGxpbmVzOiBzdHJpbmdbXTtcbiAgbGlzdDogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFN0YXRDYXJkIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdHJlbmQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIFByb2dyZXNzTWV0cmljIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbiAgdG9uZTogJ3RlYWNoaW5nJyB8ICdyZXNlYXJjaCcgfCAnc3VwZXJ2aXNpb24nO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtYXNzaXN0YW50LXdpZGdldCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9hc3Npc3RhbnQtd2lkZ2V0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmw6ICcuL2Fzc2lzdGFudC13aWRnZXQuY29tcG9uZW50LmNzcycsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIEFzc2lzdGFudFdpZGdldENvbXBvbmVudCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZGVzdHJveVJlZiA9IGluamVjdChEZXN0cm95UmVmKTtcbiAgcHJpdmF0ZSByZWFkb25seSBhdXRoU2VydmljZSA9IGluamVjdChBdXRoU2VydmljZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXNzaXN0YW50U2VydmljZSA9IGluamVjdChBc3Npc3RhbnRTZXJ2aWNlKTtcbiAgcHJpdmF0ZSByZWFkb25seSB0b2FzdFNlcnZpY2UgPSBpbmplY3QoVWlUb2FzdFNlcnZpY2UpO1xuXG4gIEBWaWV3Q2hpbGQoJ2NvbXBvc2VyRWwnKSBwcml2YXRlIGNvbXBvc2VyRWw/OiBFbGVtZW50UmVmPEhUTUxUZXh0QXJlYUVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdtZXNzYWdlc0VsJykgcHJpdmF0ZSBtZXNzYWdlc0VsPzogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG5cbiAgcmVhZG9ubHkgcm9sZSA9IHRoaXMuYXV0aFNlcnZpY2Uucm9sZTtcbiAgcmVhZG9ubHkgaXNPcGVuID0gc2lnbmFsKGZhbHNlKTtcbiAgcmVhZG9ubHkgcGVuZGluZyA9IHNpZ25hbChmYWxzZSk7XG4gIHJlYWRvbmx5IGRyYWZ0UXVlc3Rpb24gPSBzaWduYWwoJycpO1xuICByZWFkb25seSBwZXJpb2RMYWJlbCA9IHNpZ25hbCh0aGlzLmRlZmF1bHRQZXJpb2RMYWJlbCgpKTtcbiAgcmVhZG9ubHkgc2VsZWN0ZWRSb2xlID0gc2lnbmFsPEFzc2lzdGFudFJvbGU+KHRoaXMucmVzb2x2ZUFsbG93ZWRSb2xlKHRoaXMucm9sZSgpKSk7XG4gIHJlYWRvbmx5IGFjY291bnRSb2xlID0gY29tcHV0ZWQ8QXNzaXN0YW50Um9sZT4oKCkgPT4gdGhpcy5yZXNvbHZlQWxsb3dlZFJvbGUodGhpcy5yb2xlKCkpKTtcbiAgcmVhZG9ubHkgcm9sZUNoaXBzOiBSb2xlQ2hpcFtdID0gW1xuICAgIHsgcm9sZTogJ0VOU0VJR05BTlQnLCBpY29uOiAn8J+RqOKAjfCfj6snLCBsYWJlbDogJ0VOU0VJR05BTlQnIH0sXG4gICAgeyByb2xlOiAnQ0hFRl9ERVBBUlRFTUVOVCcsIGljb246ICfwn6eR4oCN8J+SvCcsIGxhYmVsOiAnQ0hFRiBEw4lQLicgfSxcbiAgICB7IHJvbGU6ICdBRE1JTklTVFJBVElPTicsIGljb246ICfwn5uh77iPJywgbGFiZWw6ICdBRE1JTicgfSxcbiAgICB7IHJvbGU6ICdTVVBFUl9BRE1JTicsIGljb246ICfwn5GRJywgbGFiZWw6ICdTVVBFUiBBRE1JTicgfVxuICBdO1xuICByZWFkb25seSBtZXNzYWdlcyA9IHNpZ25hbDxBc3Npc3RhbnRDaGF0TWVzc2FnZVtdPihbXG4gICAge1xuICAgICAgaWQ6IERhdGUubm93KCksXG4gICAgICBzZW5kZXI6ICdhc3Npc3RhbnQnLFxuICAgICAgdGV4dDpcbiAgICAgICAgXCJSw6lzdW3DqTogQXNzaXN0YW50IFBlcmZJQSBpbml0aWFsaXPDqS5cXG5BbmFseXNlOiBKZSBzdWlzIHByw6p0IMOgIGFuYWx5c2VyIHZvcyBwZXJmb3JtYW5jZXMgYWNhZMOpbWlxdWVzIGVuIHRlbXBzIHLDqWVsLlxcblJlY29tbWFuZGF0aW9uczogUG9zZXogdW5lIHF1ZXN0aW9uIHByw6ljaXNlIHBvdXIgb2J0ZW5pciB1bmUgcsOpcG9uc2UgYWN0aW9ubmFibGUuXCJcbiAgICB9XG4gIF0pO1xuICByZWFkb25seSBjYW5TZW5kID0gY29tcHV0ZWQoKCkgPT4gdGhpcy5kcmFmdFF1ZXN0aW9uKCkudHJpbSgpLmxlbmd0aCA+IDAgJiYgIXRoaXMucGVuZGluZygpKTtcbiAgcmVhZG9ubHkgYWN0aXZlUXVpY2tDaGlwcyA9IGNvbXB1dGVkPFF1aWNrQ2hpcFtdPigoKSA9PiB7XG4gICAgY29uc3QgbWFwOiBSZWNvcmQ8QXNzaXN0YW50Um9sZSwgUXVpY2tDaGlwW10+ID0ge1xuICAgICAgRU5TRUlHTkFOVDogW1xuICAgICAgICB7IGljb246ICfimqEnLCBsYWJlbDogJ0TDqXRhaWwgZHUgc2NvcmUnLCBwcm9tcHQ6ICdFeHBsaXF1ZSBwb3VycXVvaSBtb24gc2NvcmUgZXN0IGZhaWJsZS4nIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpY29uOiAn8J+noCcsXG4gICAgICAgICAgbGFiZWw6ICdTaW11bGF0aW9uIHdoYXQtaWYnLFxuICAgICAgICAgIHByb21wdDogXCJRdWUgc2UgcGFzc2UtdC1pbCBzaSBqJ2Fqb3V0ZSAxIHB1YmxpY2F0aW9uIGV0IDEgZW5jYWRyZW1lbnQgP1wiXG4gICAgICAgIH0sXG4gICAgICAgIHsgaWNvbjogJ/Cfk4snLCBsYWJlbDogXCJQbGFuIGQnYWN0aW9uXCIsIHByb21wdDogJ0Rvbm5lLW1vaSB1biBwbGFuIGRlIHByb21vdGlvbiBzdXIgMyBtb2lzLicgfSxcbiAgICAgICAgeyBpY29uOiAn4pqg77iPJywgbGFiZWw6ICdBbm9tYWxpZXMnLCBwcm9tcHQ6IFwiWSBhLXQtaWwgZGVzIGFub21hbGllcyBkYW5zIG1lcyBhY3Rpdml0w6lzID9cIiB9XG4gICAgICBdLFxuICAgICAgQ0hFRl9ERVBBUlRFTUVOVDogW1xuICAgICAgICB7IGljb246ICfwn5OKJywgbGFiZWw6ICdDb21wYXJlciDDqXF1aXBlJywgcHJvbXB0OiAnUXVlbHMgZW5zZWlnbmFudHMgc29udCBlbiBkaWZmaWN1bHTDqSBkYW5zIG1vbiBkw6lwYXJ0ZW1lbnQgPycgfSxcbiAgICAgICAgeyBpY29uOiAn8J+nqicsIGxhYmVsOiAnU2ltdWxhdGlvbiBjaGFyZ2UnLCBwcm9tcHQ6IFwiUXVlbCBpbXBhY3Qgc2kgb24gYXVnbWVudGUgbGEgcmVjaGVyY2hlIGRlIGwnw6lxdWlwZSBkZSAyMCUgP1wiIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpY29uOiAn8J+Xgu+4jycsXG4gICAgICAgICAgbGFiZWw6ICdBY3Rpb25zIGNvbmNyw6h0ZXMnLFxuICAgICAgICAgIHByb21wdDogXCJEb25uZS1tb2kgZGVzIHJlY29tbWFuZGF0aW9ucyBjb25jcsOodGVzIGRlIHLDqXBhcnRpdGlvbiBwb3VyIMOpcXVpbGlicmVyIGwnw6lxdWlwZS5cIlxuICAgICAgICB9LFxuICAgICAgICB7IGljb246ICfimqDvuI8nLCBsYWJlbDogJ1Jpc3F1ZXMnLCBwcm9tcHQ6IFwiUXVlbHMgc29udCBsZXMgcmlzcXVlcyBkZSBzb3VzLXBlcmZvcm1hbmNlIGRlIGwnw6lxdWlwZSA/XCIgfVxuICAgICAgXSxcbiAgICAgIEFETUlOSVNUUkFUSU9OOiBbXG4gICAgICAgIHsgaWNvbjogJ/Cfm6HvuI8nLCBsYWJlbDogJ1bDqXJpZmllciBhbm9tYWxpZXMnLCBwcm9tcHQ6IFwiWSBhLXQtaWwgZGVzIGFub21hbGllcyBkYW5zIGxlcyBhY3Rpdml0w6lzIHNvdW1pc2VzID9cIiB9LFxuICAgICAgICB7IGljb246ICfinIUnLCBsYWJlbDogJ0FpZGUgdmFsaWRhdGlvbicsIHByb21wdDogJ1F1ZWxsZSBkw6ljaXNpb24gcmVjb21tYW5kZXMtdHUgcG91ciB2YWxpZGVyIGNlcyBkb3NzaWVycyA/JyB9LFxuICAgICAgICB7IGljb246ICfwn5OBJywgbGFiZWw6ICdDb250csO0bGUgd29ya2Zsb3cnLCBwcm9tcHQ6IFwiUXVlbHMgZG9zc2llcnMgZG9pdmVudCDDqnRyZSB0cmFpdMOpcyBlbiBwcmlvcml0w6kgYXVqb3VyZCdodWkgP1wiIH0sXG4gICAgICAgIHsgaWNvbjogJ+KaoO+4jycsIGxhYmVsOiAnQ2FzIHN1c3BlY3RzJywgcHJvbXB0OiAnRMOpdGVjdGUgbGVzIGNhcyBzdXNwZWN0cyBkZSBzdXJjaGFyZ2Ugb3UgZG91Ymxvbi4nIH1cbiAgICAgIF0sXG4gICAgICBTVVBFUl9BRE1JTjogW1xuICAgICAgICB7IGljb246ICfwn4yNJywgbGFiZWw6ICfDiXRhdCBnbG9iYWwnLCBwcm9tcHQ6IFwiUXVlbCBlc3QgbCfDqXRhdCBnbG9iYWwgZGUgbGEgZmFjdWx0w6kgP1wiIH0sXG4gICAgICAgIHsgaWNvbjogJ/CflK4nLCBsYWJlbDogJ1Byb2plY3Rpb24gMjAlJywgcHJvbXB0OiBcIlF1ZSBzZSBwYXNzZS10LWlsIHNpIG9uIGF1Z21lbnRlIGxhIHJlY2hlcmNoZSBkZSAyMCUgP1wiIH0sXG4gICAgICAgIHsgaWNvbjogJ/Cfk4wnLCBsYWJlbDogJ1ByaW9yaXTDqXMnLCBwcm9tcHQ6ICdEb25uZS1tb2kgbGVzIHByaW9yaXTDqXMgc3RyYXTDqWdpcXVlcyBpbW3DqWRpYXRlcy4nIH0sXG4gICAgICAgIHsgaWNvbjogJ+KaoO+4jycsIGxhYmVsOiAnQWxlcnRlcyBjcml0aXF1ZXMnLCBwcm9tcHQ6ICdRdWVscyBzb250IGxlcyBwb2ludHMgZmFpYmxlcyBjcml0aXF1ZXMgYXUgbml2ZWF1IGZhY3VsdMOpID8nIH1cbiAgICAgIF1cbiAgICB9O1xuICAgIHJldHVybiBtYXBbdGhpcy5zZWxlY3RlZFJvbGUoKV07XG4gIH0pO1xuXG4gIHRvZ2dsZSgpIHtcbiAgICB0aGlzLmlzT3Blbi51cGRhdGUoKHZhbHVlKSA9PiAhdmFsdWUpO1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkUm9sZS5zZXQodGhpcy5hY2NvdW50Um9sZSgpKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zY3JvbGxUb0JvdHRvbSgpLCAwKTtcbiAgICB9XG4gIH1cblxuICBzZWxlY3RSb2xlKHJvbGU6IEFzc2lzdGFudFJvbGUpIHtcbiAgICBpZiAoIXRoaXMuaXNSb2xlQWxsb3dlZChyb2xlKSkge1xuICAgICAgdGhpcy50b2FzdFNlcnZpY2Uud2FybmluZyhcbiAgICAgICAgJ0FjY8OocyByZXN0cmVpbnQnLFxuICAgICAgICBgQ2UgY29tcHRlIGVzdCBsaW1pdMOpIGF1IHLDtGxlICR7dGhpcy5hY2NvdW50Um9sZSgpLnJlcGxhY2UoJ18nLCAnICcpfS5gXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkUm9sZS5zZXQocm9sZSk7XG4gIH1cblxuICB1cGRhdGVQZXJpb2RMYWJlbCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5wZXJpb2RMYWJlbC5zZXQodmFsdWUpO1xuICB9XG5cbiAgb25Db21wb3NlcklucHV0KGV2ZW50OiBFdmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIHRoaXMuZHJhZnRRdWVzdGlvbi5zZXQodGFyZ2V0LnZhbHVlKTtcbiAgICB0aGlzLmF1dG9SZXNpemUodGFyZ2V0KTtcbiAgfVxuXG4gIG9uQ29tcG9zZXJLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJyAmJiAhZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnNlbmRNZXNzYWdlKCk7XG4gICAgfVxuICB9XG5cbiAgYXBwbHlRdWlja0NoaXAoY2hpcDogUXVpY2tDaGlwKSB7XG4gICAgdGhpcy5kcmFmdFF1ZXN0aW9uLnNldChjaGlwLnByb21wdCk7XG4gICAgY29uc3QgY29tcG9zZXIgPSB0aGlzLmNvbXBvc2VyRWw/Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKGNvbXBvc2VyKSB7XG4gICAgICBjb21wb3Nlci52YWx1ZSA9IGNoaXAucHJvbXB0O1xuICAgICAgdGhpcy5hdXRvUmVzaXplKGNvbXBvc2VyKTtcbiAgICB9XG4gICAgdGhpcy5zZW5kTWVzc2FnZSgpO1xuICB9XG5cbiAgc2VuZE1lc3NhZ2UoKSB7XG4gICAgY29uc3QgcXVlc3Rpb24gPSB0aGlzLmRyYWZ0UXVlc3Rpb24oKS50cmltKCk7XG4gICAgaWYgKCFxdWVzdGlvbiB8fCB0aGlzLnBlbmRpbmcoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubWVzc2FnZXMudXBkYXRlKChpdGVtcykgPT4gW1xuICAgICAgLi4uaXRlbXMsXG4gICAgICB7XG4gICAgICAgIGlkOiBEYXRlLm5vdygpLFxuICAgICAgICBzZW5kZXI6ICd1c2VyJyxcbiAgICAgICAgcXVlc3Rpb25cbiAgICAgIH1cbiAgICBdKTtcbiAgICB0aGlzLmRyYWZ0UXVlc3Rpb24uc2V0KCcnKTtcbiAgICB0aGlzLnBlbmRpbmcuc2V0KHRydWUpO1xuICAgIHRoaXMucmVzZXRDb21wb3NlcigpO1xuICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b21Tb29uKCk7XG5cbiAgICB0aGlzLmFzc2lzdGFudFNlcnZpY2VcbiAgICAgIC5jaGF0KHtcbiAgICAgICAgcXVlc3Rpb24sXG4gICAgICAgIHBlcmlvZExhYmVsOiB0aGlzLnBlcmlvZExhYmVsKCkudHJpbSgpIHx8IG51bGxcbiAgICAgIH0pXG4gICAgICAucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQodGhpcy5kZXN0cm95UmVmKSlcbiAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICBuZXh0OiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICB0aGlzLnBlbmRpbmcuc2V0KGZhbHNlKTtcbiAgICAgICAgICB0aGlzLm1lc3NhZ2VzLnVwZGF0ZSgoaXRlbXMpID0+IFtcbiAgICAgICAgICAgIC4uLml0ZW1zLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogRGF0ZS5ub3coKSArIDEsXG4gICAgICAgICAgICAgIHNlbmRlcjogJ2Fzc2lzdGFudCcsXG4gICAgICAgICAgICAgIHJlc3BvbnNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSk7XG4gICAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbVNvb24oKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IChlcnJvcikgPT4ge1xuICAgICAgICAgIHRoaXMucGVuZGluZy5zZXQoZmFsc2UpO1xuICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBleHRyYWN0RXJyb3JNZXNzYWdlKGVycm9yLCBcIkwnYXNzaXN0YW50IG4nYSBwYXMgcHUgcsOpcG9uZHJlLlwiKTtcbiAgICAgICAgICB0aGlzLnRvYXN0U2VydmljZS53YXJuaW5nKCdBc3Npc3RhbnQgaW5kaXNwb25pYmxlJywgbWVzc2FnZSk7XG4gICAgICAgICAgdGhpcy5tZXNzYWdlcy51cGRhdGUoKGl0ZW1zKSA9PiBbXG4gICAgICAgICAgICAuLi5pdGVtcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6IERhdGUubm93KCkgKyAyLFxuICAgICAgICAgICAgICBzZW5kZXI6ICdhc3Npc3RhbnQnLFxuICAgICAgICAgICAgICB0ZXh0OiBgUsOpc3Vtw6k6IEFwcGVsIEFQSSBpbmRpc3BvbmlibGUuXFxuQW5hbHlzZTogJHttZXNzYWdlfVxcblJlY29tbWFuZGF0aW9uczogVsOpcmlmaWV6IGxhIGRpc3BvbmliaWxpdMOpIGR1IGJhY2tlbmQgcHVpcyByw6llc3NheWV6LmBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdKTtcbiAgICAgICAgICB0aGlzLnNjcm9sbFRvQm90dG9tU29vbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHJ1blRvcGJhckFjdGlvbihhY3Rpb246ICdoaXN0b3J5JyB8ICdleHBvcnQnIHwgJ3NldHRpbmdzJykge1xuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICBjYXNlICdoaXN0b3J5JzpcbiAgICAgICAgdGhpcy5tZXNzYWdlc0VsPy5uYXRpdmVFbGVtZW50LnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgICAgIHRoaXMudG9hc3RTZXJ2aWNlLmluZm8oJ0hpc3RvcmlxdWUnLCBcIkTDqWZpbGVtZW50IHZlcnMgbGUgZMOpYnV0IGRlIGwnaGlzdG9yaXF1ZS5cIik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXhwb3J0JzpcbiAgICAgICAgdGhpcy5leHBvcnRDb252ZXJzYXRpb24oKTtcbiAgICAgICAgdGhpcy50b2FzdFNlcnZpY2Uuc3VjY2VzcygnRXhwb3J0JywgJ0NvbnZlcnNhdGlvbiBleHBvcnTDqWUgZW4gZmljaGllciB0ZXh0ZS4nKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzZXR0aW5ncyc6XG4gICAgICAgIHRoaXMudG9hc3RTZXJ2aWNlLmluZm8oJ1BhcmFtw6h0cmVzJywgXCJMZXMgcGFyYW3DqHRyZXMgYXZhbmPDqXMgYXJyaXZlbnQgZGFucyBsYSBwcm9jaGFpbmUgaXTDqXJhdGlvbi5cIik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHRyYWNrQnlNZXNzYWdlSWQoXzogbnVtYmVyLCBtZXNzYWdlOiBBc3Npc3RhbnRDaGF0TWVzc2FnZSkge1xuICAgIHJldHVybiBtZXNzYWdlLmlkO1xuICB9XG5cbiAgaXNSb2xlQWxsb3dlZChyb2xlOiBBc3Npc3RhbnRSb2xlKSB7XG4gICAgcmV0dXJuIHJvbGUgPT09IHRoaXMuYWNjb3VudFJvbGUoKTtcbiAgfVxuXG4gIGdldFNlY3Rpb25zKG1lc3NhZ2U6IEFzc2lzdGFudENoYXRNZXNzYWdlKTogUGFyc2VkU2VjdGlvbltdIHtcbiAgICBpZiAobWVzc2FnZS5yZXNwb25zZSkge1xuICAgICAgY29uc3Qgc2VjdGlvbnM6IFBhcnNlZFNlY3Rpb25bXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGtleTogYCR7bWVzc2FnZS5pZH0tc3VtbWFyeWAsXG4gICAgICAgICAga2luZDogJ3N1bW1hcnknLFxuICAgICAgICAgIGxhYmVsOiAnUsOpc3Vtw6knLFxuICAgICAgICAgIGxpbmVzOiBbbWVzc2FnZS5yZXNwb25zZS5zdW1tYXJ5XSxcbiAgICAgICAgICBsaXN0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5OiBgJHttZXNzYWdlLmlkfS1hbmFseXNpc2AsXG4gICAgICAgICAga2luZDogJ2FuYWx5c2lzJyxcbiAgICAgICAgICBsYWJlbDogJ0FuYWx5c2UnLFxuICAgICAgICAgIGxpbmVzOiBbbWVzc2FnZS5yZXNwb25zZS5hbmFseXNpc10sXG4gICAgICAgICAgbGlzdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGtleTogYCR7bWVzc2FnZS5pZH0tcmVjb2AsXG4gICAgICAgICAga2luZDogJ3JlY29tbWVuZGF0aW9uJyxcbiAgICAgICAgICBsYWJlbDogJ1JlY29tbWFuZGF0aW9uJyxcbiAgICAgICAgICBsaW5lczogbWVzc2FnZS5yZXNwb25zZS5yZWNvbW1lbmRhdGlvbnMsXG4gICAgICAgICAgbGlzdDogdHJ1ZVxuICAgICAgICB9XG4gICAgICBdO1xuXG4gICAgICBpZiAobWVzc2FnZS5yZXNwb25zZS5yaXNrcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlY3Rpb25zLnB1c2goe1xuICAgICAgICAgIGtleTogYCR7bWVzc2FnZS5pZH0tcmlza2AsXG4gICAgICAgICAga2luZDogJ3Jpc2snLFxuICAgICAgICAgIGxhYmVsOiAnUmlzcXVlcycsXG4gICAgICAgICAgbGluZXM6IG1lc3NhZ2UucmVzcG9uc2Uucmlza3MsXG4gICAgICAgICAgbGlzdDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNlY3Rpb25zO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZSA9IG1lc3NhZ2UudGV4dD8udHJpbSgpID8/ICcnO1xuICAgIGlmICghc291cmNlKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgbGluZXMgPSBzb3VyY2VcbiAgICAgIC5zcGxpdCgvXFxuKy8pXG4gICAgICAubWFwKChsaW5lKSA9PiBsaW5lLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICBjb25zdCBzZWN0aW9uczogUGFyc2VkU2VjdGlvbltdID0gW107XG4gICAgbGV0IGN1cnJlbnQ6IFBhcnNlZFNlY3Rpb24gPSB7XG4gICAgICBrZXk6IGAke21lc3NhZ2UuaWR9LWRlZmF1bHRgLFxuICAgICAga2luZDogJ2FuYWx5c2lzJyxcbiAgICAgIGxhYmVsOiAnQW5hbHlzZScsXG4gICAgICBsaW5lczogW10sXG4gICAgICBsaXN0OiBmYWxzZVxuICAgIH07XG5cbiAgICBjb25zdCBwdXNoQ3VycmVudCA9ICgpID0+IHtcbiAgICAgIGlmICghY3VycmVudC5saW5lcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY3VycmVudC5saXN0ID0gY3VycmVudC5saW5lcy5ldmVyeSgobGluZSkgPT4gL15bLeKAol0vLnRlc3QobGluZSkpO1xuICAgICAgY3VycmVudC5saW5lcyA9IGN1cnJlbnQubGluZXMubWFwKChsaW5lKSA9PiBsaW5lLnJlcGxhY2UoL15bLeKAol1cXHMqLywgJycpKTtcbiAgICAgIHNlY3Rpb25zLnB1c2goeyAuLi5jdXJyZW50IH0pO1xuICAgIH07XG5cbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcbiAgICAgIGNvbnN0IGRldGVjdGVkID0gdGhpcy5kZXRlY3RTZWN0aW9uKGxpbmUpO1xuICAgICAgaWYgKGRldGVjdGVkKSB7XG4gICAgICAgIHB1c2hDdXJyZW50KCk7XG4gICAgICAgIGN1cnJlbnQgPSB7XG4gICAgICAgICAga2V5OiBgJHttZXNzYWdlLmlkfS0ke2RldGVjdGVkLmtpbmR9LSR7c2VjdGlvbnMubGVuZ3RofWAsXG4gICAgICAgICAga2luZDogZGV0ZWN0ZWQua2luZCxcbiAgICAgICAgICBsYWJlbDogZGV0ZWN0ZWQubGFiZWwsXG4gICAgICAgICAgbGluZXM6IFtsaW5lLnJlcGxhY2UoL14oXFxkK1xcLik/XFxzKihSw6lzdW3DqXxSZXN1bWV8QW5hbHlzZXxSZWNvbW1hbmRhdGlvbnM/fFJpc3F1ZXM/KVxccyo6Py9pLCAnJykudHJpbSgpXS5maWx0ZXIoQm9vbGVhbiksXG4gICAgICAgICAgbGlzdDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnQubGluZXMucHVzaChsaW5lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwdXNoQ3VycmVudCgpO1xuICAgIHJldHVybiBzZWN0aW9ucy5sZW5ndGggPyBzZWN0aW9ucyA6IFt7IC4uLmN1cnJlbnQgfV07XG4gIH1cblxuICBzZWN0aW9uQ2xhc3Moa2luZDogUGFyc2VkU2VjdGlvblsna2luZCddKSB7XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlICdzdW1tYXJ5JzpcbiAgICAgICAgcmV0dXJuICd0YWctc3VtbWFyeSc7XG4gICAgICBjYXNlICdhbmFseXNpcyc6XG4gICAgICAgIHJldHVybiAndGFnLWFuYWx5c2lzJztcbiAgICAgIGNhc2UgJ3JlY29tbWVuZGF0aW9uJzpcbiAgICAgICAgcmV0dXJuICd0YWctcmVjb21tZW5kYXRpb24nO1xuICAgICAgY2FzZSAncmlzayc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ3RhZy1yaXNrJztcbiAgICB9XG4gIH1cblxuICBnZXRTdGF0cyhtZXNzYWdlOiBBc3Npc3RhbnRDaGF0TWVzc2FnZSk6IFN0YXRDYXJkW10ge1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLm1lc3NhZ2VUZXh0KG1lc3NhZ2UpO1xuICAgIGNvbnN0IGRldGVjdGVkID0gQXJyYXkuZnJvbSh0ZXh0Lm1hdGNoQWxsKC9cXGJcXGR7MSwzfSg/OlsuLF1cXGQrKT9cXGIvZykpXG4gICAgICAubWFwKChtYXRjaCkgPT4gTnVtYmVyLnBhcnNlRmxvYXQobWF0Y2hbMF0ucmVwbGFjZSgnLCcsICcuJykpKVxuICAgICAgLmZpbHRlcigodmFsdWUpID0+IE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkpO1xuXG4gICAgY29uc3QgZGVmYXVsdHM6IFJlY29yZDxBc3Npc3RhbnRSb2xlLCBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0+ID0ge1xuICAgICAgRU5TRUlHTkFOVDogWzc0LCA0OSwgNjNdLFxuICAgICAgQ0hFRl9ERVBBUlRFTUVOVDogWzcxLCA1NiwgNTldLFxuICAgICAgQURNSU5JU1RSQVRJT046IFs3NywgNjEsIDU0XSxcbiAgICAgIFNVUEVSX0FETUlOOiBbNzYsIDU4LCA1N11cbiAgICB9O1xuICAgIGNvbnN0IGZhbGxiYWNrID0gZGVmYXVsdHNbdGhpcy5zZWxlY3RlZFJvbGUoKV07XG5cbiAgICBjb25zdCBwZXJmID0gdGhpcy5jbGFtcFNjb3JlKGRldGVjdGVkWzBdID8/IGZhbGxiYWNrWzBdKTtcbiAgICBjb25zdCByZXNlYXJjaCA9IHRoaXMuY2xhbXBTY29yZShkZXRlY3RlZFsxXSA/PyBmYWxsYmFja1sxXSk7XG4gICAgY29uc3QgcmlzayA9IHRoaXMuY2xhbXBTY29yZShkZXRlY3RlZFsyXSA/PyBmYWxsYmFja1syXSk7XG5cbiAgICByZXR1cm4gW1xuICAgICAgeyBsYWJlbDogJ1BFUkYgU0NPUkUnLCB2YWx1ZTogcGVyZiwgdHJlbmQ6IHBlcmYgPj0gNTUgPyAzLjYgOiAtNC4yIH0sXG4gICAgICB7IGxhYmVsOiAnUkVDSEVSQ0hFJywgdmFsdWU6IHJlc2VhcmNoLCB0cmVuZDogcmVzZWFyY2ggPj0gNTAgPyAyLjQgOiAtMy43IH0sXG4gICAgICB7IGxhYmVsOiAnUklTUVVFJywgdmFsdWU6IHJpc2ssIHRyZW5kOiByaXNrIDw9IDU1ID8gMi4xIDogLTIuOSB9XG4gICAgXTtcbiAgfVxuXG4gIGdldFByb2dyZXNzKHN0YXRzOiBTdGF0Q2FyZFtdKTogUHJvZ3Jlc3NNZXRyaWNbXSB7XG4gICAgY29uc3QgcGVyZiA9IHN0YXRzWzBdPy52YWx1ZSA/PyA2MDtcbiAgICBjb25zdCByZXNlYXJjaCA9IHN0YXRzWzFdPy52YWx1ZSA/PyA1MDtcbiAgICBjb25zdCByaXNrID0gc3RhdHNbMl0/LnZhbHVlID8/IDUwO1xuICAgIGNvbnN0IHN1cGVydmlzaW9uID0gdGhpcy5jbGFtcFNjb3JlKDEwMCAtIE1hdGguYWJzKDUwIC0gcmlzaykgKiAxLjQ1KTtcbiAgICByZXR1cm4gW1xuICAgICAgeyBsYWJlbDogJ0Vuc2VpZ25lbWVudCcsIHZhbHVlOiBwZXJmLCB0b25lOiAndGVhY2hpbmcnIH0sXG4gICAgICB7IGxhYmVsOiAnUmVjaGVyY2hlJywgdmFsdWU6IHJlc2VhcmNoLCB0b25lOiAncmVzZWFyY2gnIH0sXG4gICAgICB7IGxhYmVsOiAnRW5jYWRyZW1lbnQnLCB2YWx1ZTogc3VwZXJ2aXNpb24sIHRvbmU6ICdzdXBlcnZpc2lvbicgfVxuICAgIF07XG4gIH1cblxuICBwcm9ncmVzc0ZpbGxDbGFzcyh0b25lOiBQcm9ncmVzc01ldHJpY1sndG9uZSddKSB7XG4gICAgc3dpdGNoICh0b25lKSB7XG4gICAgICBjYXNlICd0ZWFjaGluZyc6XG4gICAgICAgIHJldHVybiAnZmlsbC10ZWFjaGluZyc7XG4gICAgICBjYXNlICdyZXNlYXJjaCc6XG4gICAgICAgIHJldHVybiAnZmlsbC1yZXNlYXJjaCc7XG4gICAgICBjYXNlICdzdXBlcnZpc2lvbic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ2ZpbGwtc3VwZXJ2aXNpb24nO1xuICAgIH1cbiAgfVxuXG4gIHRyZW5kQ2xhc3ModmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiB2YWx1ZSA+PSAwID8gJ3RyZW5kLXVwJyA6ICd0cmVuZC1kb3duJztcbiAgfVxuXG4gIHRyZW5kQXJyb3codmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiB2YWx1ZSA+PSAwID8gJ+KWsicgOiAn4pa8JztcbiAgfVxuXG4gIGZvcm1hdFRyZW5kKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gYCR7TWF0aC5hYnModmFsdWUpLnRvRml4ZWQoMSl9JWA7XG4gIH1cblxuICBmb3JtYXRWYWx1ZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHZhbHVlLnRvRml4ZWQoMSk7XG4gIH1cblxuICBmb3JtYXRMaW5lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5lc2NhcGVIdG1sKHZhbHVlKS5yZXBsYWNlKC9cXCpcXCooLis/KVxcKlxcKi9nLCAnPHN0cm9uZz4kMTwvc3Ryb25nPicpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXRlY3RTZWN0aW9uKGxpbmU6IHN0cmluZyk6IHsga2luZDogUGFyc2VkU2VjdGlvblsna2luZCddOyBsYWJlbDogc3RyaW5nIH0gfCBudWxsIHtcbiAgICBjb25zdCBub3JtYWxpemVkID0gbGluZS5ub3JtYWxpemUoJ05GRCcpLnJlcGxhY2UoL1tcXHUwMzAwLVxcdTAzNmZdL2csICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICgvXigxXFwuKT9cXHMqcmVzdW1lXFxiLy50ZXN0KG5vcm1hbGl6ZWQpKSB7XG4gICAgICByZXR1cm4geyBraW5kOiAnc3VtbWFyeScsIGxhYmVsOiAnUsOpc3Vtw6knIH07XG4gICAgfVxuICAgIGlmICgvXigyXFwuKT9cXHMqYW5hbHlzZVxcYi8udGVzdChub3JtYWxpemVkKSkge1xuICAgICAgcmV0dXJuIHsga2luZDogJ2FuYWx5c2lzJywgbGFiZWw6ICdBbmFseXNlJyB9O1xuICAgIH1cbiAgICBpZiAoL14oM1xcLik/XFxzKnJlY29tbWFuZC8udGVzdChub3JtYWxpemVkKSkge1xuICAgICAgcmV0dXJuIHsga2luZDogJ3JlY29tbWVuZGF0aW9uJywgbGFiZWw6ICdSZWNvbW1hbmRhdGlvbicgfTtcbiAgICB9XG4gICAgaWYgKC9eKDRcXC4pP1xccypyaXNxdWUvLnRlc3Qobm9ybWFsaXplZCkpIHtcbiAgICAgIHJldHVybiB7IGtpbmQ6ICdyaXNrJywgbGFiZWw6ICdSaXNxdWVzJyB9O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgbWVzc2FnZVRleHQobWVzc2FnZTogQXNzaXN0YW50Q2hhdE1lc3NhZ2UpIHtcbiAgICBpZiAobWVzc2FnZS5yZXNwb25zZSkge1xuICAgICAgY29uc3QgYm9keSA9IFtcbiAgICAgICAgbWVzc2FnZS5yZXNwb25zZS5zdW1tYXJ5LFxuICAgICAgICBtZXNzYWdlLnJlc3BvbnNlLmFuYWx5c2lzLFxuICAgICAgICAuLi5tZXNzYWdlLnJlc3BvbnNlLnJlY29tbWVuZGF0aW9ucyxcbiAgICAgICAgLi4ubWVzc2FnZS5yZXNwb25zZS5yaXNrc1xuICAgICAgXTtcbiAgICAgIHJldHVybiBib2R5LmpvaW4oJyAnKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lc3NhZ2UudGV4dCA/PyBtZXNzYWdlLnF1ZXN0aW9uID8/ICcnO1xuICB9XG5cbiAgcHJpdmF0ZSBhdXRvUmVzaXplKGVsZW1lbnQ6IEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke01hdGgubWluKGVsZW1lbnQuc2Nyb2xsSGVpZ2h0LCAxNDApfXB4YDtcbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRDb21wb3NlcigpIHtcbiAgICBjb25zdCBjb21wb3NlciA9IHRoaXMuY29tcG9zZXJFbD8ubmF0aXZlRWxlbWVudDtcbiAgICBpZiAoIWNvbXBvc2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbXBvc2VyLnZhbHVlID0gJyc7XG4gICAgY29tcG9zZXIuc3R5bGUuaGVpZ2h0ID0gJzQwcHgnO1xuICB9XG5cbiAgcHJpdmF0ZSBzY3JvbGxUb0JvdHRvbVNvb24oKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNjcm9sbFRvQm90dG9tKCksIDApO1xuICB9XG5cbiAgcHJpdmF0ZSBzY3JvbGxUb0JvdHRvbSgpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLm1lc3NhZ2VzRWw/Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29udGFpbmVyLnNjcm9sbFRvcCA9IGNvbnRhaW5lci5zY3JvbGxIZWlnaHQ7XG4gIH1cblxuICBwcml2YXRlIGV4cG9ydENvbnZlcnNhdGlvbigpIHtcbiAgICBjb25zdCBsaW5lcyA9IHRoaXMubWVzc2FnZXMoKVxuICAgICAgLm1hcCgobWVzc2FnZSkgPT4ge1xuICAgICAgICBpZiAobWVzc2FnZS5zZW5kZXIgPT09ICd1c2VyJykge1xuICAgICAgICAgIHJldHVybiBgW1VTRVJdICR7bWVzc2FnZS5xdWVzdGlvbiA/PyAnJ31gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgW0FJXSAke3RoaXMubWVzc2FnZVRleHQobWVzc2FnZSl9YDtcbiAgICAgIH0pXG4gICAgICAuam9pbignXFxuXFxuJyk7XG5cbiAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2xpbmVzXSwgeyB0eXBlOiAndGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04JyB9KTtcbiAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgbGluay5ocmVmID0gdXJsO1xuICAgIGxpbmsuZG93bmxvYWQgPSAncGVyZmlhLWNoYXQtaGlzdG9yeS50eHQnO1xuICAgIGxpbmsuY2xpY2soKTtcbiAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gIH1cblxuICBwcml2YXRlIHJlc29sdmVBbGxvd2VkUm9sZShjdXJyZW50OiBSb2xlVHlwZSB8IG51bGwpOiBBc3Npc3RhbnRSb2xlIHtcbiAgICBpZiAoXG4gICAgICBjdXJyZW50ID09PSAnRU5TRUlHTkFOVCcgfHxcbiAgICAgIGN1cnJlbnQgPT09ICdDSEVGX0RFUEFSVEVNRU5UJyB8fFxuICAgICAgY3VycmVudCA9PT0gJ0FETUlOSVNUUkFUSU9OJyB8fFxuICAgICAgY3VycmVudCA9PT0gJ1NVUEVSX0FETUlOJ1xuICAgICkge1xuICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgfVxuICAgIHJldHVybiAnRU5TRUlHTkFOVCc7XG4gIH1cblxuICBwcml2YXRlIGRlZmF1bHRQZXJpb2RMYWJlbCgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgICBpZiAobm93LmdldE1vbnRoKCkgPj0gNykge1xuICAgICAgcmV0dXJuIGAke3llYXJ9LSR7eWVhciArIDF9YDtcbiAgICB9XG4gICAgcmV0dXJuIGAke3llYXIgLSAxfS0ke3llYXJ9YDtcbiAgfVxuXG4gIHByaXZhdGUgY2xhbXBTY29yZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgdmFsdWUpKTtcbiAgfVxuXG4gIHByaXZhdGUgZXNjYXBlSHRtbCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKVxuICAgICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgICAgLnJlcGxhY2UoLycvZywgJyYjMzk7Jyk7XG4gIH1cbn1cbiIsIjxidXR0b25cbiAgY2xhc3M9XCJhc3Npc3RhbnQtZmFiXCJcbiAgdHlwZT1cImJ1dHRvblwiXG4gIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiaXNPcGVuKClcIlxuICBhcmlhLWxhYmVsPVwiT3V2cmlyIFBlcmZJQSBBc3Npc3RhbnRcIlxuICAoY2xpY2spPVwidG9nZ2xlKClcIlxuPlxuICBJQVxuPC9idXR0b24+XG5cbkBpZiAoaXNPcGVuKCkpIHtcbiAgPHNlY3Rpb24gY2xhc3M9XCJwZXJmaWEtc2hlbGxcIj5cbiAgICA8ZGl2IGNsYXNzPVwib3JiIG9yYi1ibHVlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm9yYiBvcmItdmlvbGV0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9kaXY+XG5cbiAgICA8aGVhZGVyIGNsYXNzPVwidG9wYmFyXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwidG9wYmFyLWxlZnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFpLWF2YXRhclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCI+XG4gICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICBkPVwiTTEyIDIuMmwxLjggNC43IDQuOCAxLjgtNC44IDEuOEwxMiAxNS4ybC0xLjgtNC43LTQuOC0xLjggNC44LTEuOEwxMiAyLjJ6TTE4LjMgMTQuOWwuOCAyLjEgMi4xLjgtMi4xLjgtLjggMi4xLS44LTIuMS0yLjEtLjggMi4xLS44LjgtMi4xek02LjEgMTQuM2wuNiAxLjYgMS42LjYtMS42LjYtLjYgMS42LS42LTEuNi0xLjYtLjYgMS42LS42LjYtMS42elwiXG4gICAgICAgICAgICAgIGZpbGw9XCIjZmZmXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWRlbnRpdHlcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaWRlbnRpdHktdG9wXCI+XG4gICAgICAgICAgICA8c3Ryb25nPlBlcmZJQSBBc3Npc3RhbnQ8L3N0cm9uZz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2UtYWlcIj5BSTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInN0YXR1cy1saW5lXCI+PHNwYW4gY2xhc3M9XCJzdGF0dXMtZG90XCI+PC9zcGFuPkFjdGlmIMK3IEFuYWx5c2UgZW4gdGVtcHMgcsOpZWw8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0b3BiYXItYWN0aW9uc1wiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiaWNvbi1idG5cIiB0eXBlPVwiYnV0dG9uXCIgdGl0bGU9XCJIaXN0b3JpcXVlXCIgYXJpYS1sYWJlbD1cIkhpc3RvcmlxdWVcIiAoY2xpY2spPVwicnVuVG9wYmFyQWN0aW9uKCdoaXN0b3J5JylcIj5cbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0xMiA1djdsNC4yIDIuNlwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjEuOFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiAvPlxuICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgZD1cIk00IDEyYTggOCAwIDEwOC04IDcuOSA3LjkgMCAwMC01LjggMi41TTQgNHY0aDRcIlxuICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIxLjhcIlxuICAgICAgICAgICAgICBzdHJva2UtbGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiaWNvbi1idG5cIiB0eXBlPVwiYnV0dG9uXCIgdGl0bGU9XCJFeHBvcnRlclwiIGFyaWEtbGFiZWw9XCJFeHBvcnRlclwiIChjbGljayk9XCJydW5Ub3BiYXJBY3Rpb24oJ2V4cG9ydCcpXCI+XG4gICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgNHYxMG0wIDBsLTMuMi0zLjJNMTIgMTRsMy4yLTMuMlwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjEuOFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiAvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk01IDE2LjdWMjBoMTR2LTMuM1wiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjEuOFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImljb24tYnRuXCIgdHlwZT1cImJ1dHRvblwiIHRpdGxlPVwiUGFyYW3DqHRyZXNcIiBhcmlhLWxhYmVsPVwiUGFyYW3DqHRyZXNcIiAoY2xpY2spPVwicnVuVG9wYmFyQWN0aW9uKCdzZXR0aW5ncycpXCI+XG4gICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTIgOC44YTMuMiAzLjIgMCAxMDAgNi40IDMuMiAzLjIgMCAwMDAtNi40elwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjEuOFwiIC8+XG4gICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICBkPVwiTTE5LjQgMTAuNmwxLjEgMS40LTEuMiAyLTEuOC4xYTYgNiAwIDAxLS42IDEuNGwxLjEgMS40LTEuOCAxLjgtMS40LTEuMWE2IDYgMCAwMS0xLjQuNmwtLjEgMS44aC0ybC0uMS0xLjhhNiA2IDAgMDEtMS40LS42bC0xLjQgMS4xLTEuOC0xLjggMS4xLTEuNGE2IDYgMCAwMS0uNi0xLjRMMy41IDE0IDIuMyAxMmwxLjEtMS40IDEuOC0uMWE2IDYgMCAwMS42LTEuNEw0LjcgNy43bDEuOC0xLjggMS40IDEuMWE2IDYgMCAwMTEuNC0uNmwuMS0xLjhoMmwuMSAxLjhhNiA2IDAgMDExLjQuNmwxLjQtMS4xIDEuOCAxLjgtMS4xIDEuNGMuMy40LjUuOS42IDEuNGwxLjguMXpcIlxuICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9XCIxLjJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2hlYWRlcj5cblxuICAgIDxkaXYgY2xhc3M9XCJyb2xlYmFyXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwicm9sZWNoaXBzXCI+XG4gICAgICAgIEBmb3IgKGNoaXAgb2Ygcm9sZUNoaXBzOyB0cmFjayBjaGlwLnJvbGUpIHtcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzcz1cInJvbGUtY2hpcFwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIFtjbGFzcy5hY3RpdmVdPVwic2VsZWN0ZWRSb2xlKCkgPT09IGNoaXAucm9sZVwiXG4gICAgICAgICAgICBbY2xhc3MubG9ja2VkXT1cIiFpc1JvbGVBbGxvd2VkKGNoaXAucm9sZSlcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cIiFpc1JvbGVBbGxvd2VkKGNoaXAucm9sZSlcIlxuICAgICAgICAgICAgW3RpdGxlXT1cImlzUm9sZUFsbG93ZWQoY2hpcC5yb2xlKSA/ICdSw7RsZSBhY3RpZiBwb3VyIGNlIGNvbXB0ZScgOiAnQWNjw6hzIHLDqXNlcnbDqSDDoCB1biBhdXRyZSBwcm9maWwnXCJcbiAgICAgICAgICAgIChjbGljayk9XCJzZWxlY3RSb2xlKGNoaXAucm9sZSlcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxzcGFuPnt7IGNoaXAuaWNvbiB9fTwvc3Bhbj5cbiAgICAgICAgICAgIHt7IGNoaXAubGFiZWwgfX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2ICNtZXNzYWdlc0VsIGNsYXNzPVwibWVzc2FnZXMtd3JhcFwiPlxuICAgICAgQGZvciAobWVzc2FnZSBvZiBtZXNzYWdlcygpOyB0cmFjayB0cmFja0J5TWVzc2FnZUlkKCRpbmRleCwgbWVzc2FnZSkpIHtcbiAgICAgICAgPGFydGljbGUgY2xhc3M9XCJtZXNzYWdlLXJvd1wiIFtjbGFzcy51c2VyXT1cIm1lc3NhZ2Uuc2VuZGVyID09PSAndXNlcidcIiBbY2xhc3MuYWldPVwibWVzc2FnZS5zZW5kZXIgPT09ICdhc3Npc3RhbnQnXCI+XG4gICAgICAgICAgQGlmIChtZXNzYWdlLnNlbmRlciA9PT0gJ2Fzc2lzdGFudCcpIHtcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtc2ctYXZhdGFyIGFpXCI+4pymPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibXNnLWJ1YmJsZVwiPlxuICAgICAgICAgICAgICBAZm9yIChzZWN0aW9uIG9mIGdldFNlY3Rpb25zKG1lc3NhZ2UpOyB0cmFjayBzZWN0aW9uLmtleSkge1xuICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwic2VjdGlvbi1ibG9ja1wiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzZWN0aW9uLXRhZ1wiIFtjbGFzc109XCJzZWN0aW9uQ2xhc3Moc2VjdGlvbi5raW5kKVwiPnt7IHNlY3Rpb24ubGFiZWwgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10ZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgIEBpZiAoc2VjdGlvbi5saXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgQGZvciAobGluZSBvZiBzZWN0aW9uLmxpbmVzOyB0cmFjayBsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBbaW5uZXJIVE1MXT1cImZvcm1hdExpbmUobGluZSlcIj48L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICAgIH0gQGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIEBmb3IgKGxpbmUgb2Ygc2VjdGlvbi5saW5lczsgdHJhY2sgbGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgPHAgW2lubmVySFRNTF09XCJmb3JtYXRMaW5lKGxpbmUpXCI+PC9wPlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN0YXRzLWdyaWRcIj5cbiAgICAgICAgICAgICAgICBAZm9yIChzdGF0IG9mIGdldFN0YXRzKG1lc3NhZ2UpOyB0cmFjayBzdGF0LmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cInN0YXQtY2FyZFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3RhdC1sYWJlbFwiPnt7IHN0YXQubGFiZWwgfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN0YXQtdmFsdWVcIj57eyBmb3JtYXRWYWx1ZShzdGF0LnZhbHVlKSB9fTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3RhdC10cmVuZFwiIFtjbGFzc109XCJ0cmVuZENsYXNzKHN0YXQudHJlbmQpXCI+XG4gICAgICAgICAgICAgICAgICAgICAge3sgdHJlbmRBcnJvdyhzdGF0LnRyZW5kKSB9fSB7eyBmb3JtYXRUcmVuZChzdGF0LnRyZW5kKSB9fVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1wYWNrXCI+XG4gICAgICAgICAgICAgICAgQGZvciAobWV0cmljIG9mIGdldFByb2dyZXNzKGdldFN0YXRzKG1lc3NhZ2UpKTsgdHJhY2sgbWV0cmljLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtbGluZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+e3sgbWV0cmljLmxhYmVsIH19PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRyYWNrXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZpbGxcIiBbY2xhc3NdPVwicHJvZ3Jlc3NGaWxsQ2xhc3MobWV0cmljLnRvbmUpXCIgW3N0eWxlLndpZHRoLiVdPVwibWV0cmljLnZhbHVlXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57eyBmb3JtYXRWYWx1ZShtZXRyaWMudmFsdWUpIH19JTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpdmlkZXJcIj5TZXNzaW9uIMK3IEFuYWx5c2UgZGUgcGVyZm9ybWFuY2U8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIH0gQGVsc2Uge1xuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1zZy1idWJibGVcIj5cbiAgICAgICAgICAgICAgPHA+e3sgbWVzc2FnZS5xdWVzdGlvbiB9fTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1zZy1hdmF0YXIgdXNlclwiPnt7IHNlbGVjdGVkUm9sZSgpID09PSAnQ0hFRl9ERVBBUlRFTUVOVCcgPyAnQ0QnIDogc2VsZWN0ZWRSb2xlKCkgPT09ICdBRE1JTklTVFJBVElPTicgPyAnQUQnIDogc2VsZWN0ZWRSb2xlKCkgPT09ICdTVVBFUl9BRE1JTicgPyAnU0EnIDogJ0VOJyB9fTwvZGl2PlxuICAgICAgICAgIH1cbiAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgfVxuXG4gICAgICBAaWYgKHBlbmRpbmcoKSkge1xuICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cIm1lc3NhZ2Utcm93IGFpXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1zZy1hdmF0YXIgYWlcIj7inKY8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXNnLWJ1YmJsZVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0eXBpbmctd3JhcFwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR5cGluZy1kb3RcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidHlwaW5nLWRvdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0eXBpbmctZG90XCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2FydGljbGU+XG4gICAgICB9XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwicXVpY2tiYXJcIj5cbiAgICAgIEBmb3IgKGNoaXAgb2YgYWN0aXZlUXVpY2tDaGlwcygpOyB0cmFjayBjaGlwLmxhYmVsKSB7XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJxdWljay1jaGlwXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJhcHBseVF1aWNrQ2hpcChjaGlwKVwiPnt7IGNoaXAuaWNvbiB9fSB7eyBjaGlwLmxhYmVsIH19PC9idXR0b24+XG4gICAgICB9XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXRiYXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC13cmFwXCI+XG4gICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICNjb21wb3NlckVsXG4gICAgICAgICAgY2xhc3M9XCJjb21wb3NlclwiXG4gICAgICAgICAgcm93cz1cIjFcIlxuICAgICAgICAgIFt2YWx1ZV09XCJkcmFmdFF1ZXN0aW9uKClcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUG9zZXogdm90cmUgcXVlc3Rpb24gw6AgUGVyZklBLi4uXCJcbiAgICAgICAgICAoaW5wdXQpPVwib25Db21wb3NlcklucHV0KCRldmVudClcIlxuICAgICAgICAgIChrZXlkb3duKT1cIm9uQ29tcG9zZXJLZXlkb3duKCRldmVudClcIlxuICAgICAgICA+PC90ZXh0YXJlYT5cblxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYXR0YWNoLWJ0blwiIHR5cGU9XCJidXR0b25cIiBhcmlhLWxhYmVsPVwiSm9pbmRyZVwiPlxuICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgd2lkdGg9XCIxN1wiIGhlaWdodD1cIjE3XCI+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTguNSAxMi41bDYuMy02LjNhMyAzIDAgMTE0LjIgNC4ybC04LjEgOC4xYTUgNSAwIDAxLTcuMS03LjFsOC04XCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMS44XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJzZW5kLWJ0blwiIHR5cGU9XCJidXR0b25cIiBhcmlhLWxhYmVsPVwiRW52b3llclwiIFtkaXNhYmxlZF09XCIhY2FuU2VuZCgpXCIgKGNsaWNrKT1cInNlbmRNZXNzYWdlKClcIj5cbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHdpZHRoPVwiMTdcIiBoZWlnaHQ9XCIxN1wiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk00IDEybDE1LTctMy44IDE0LTQuMS01LjRMNCAxMnpcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIxLjhcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8Zm9vdGVyIGNsYXNzPVwiZm9vdGVyXCI+XG4gICAgICA8c3Bhbj5Eb25uw6llcyBwcm90w6lnw6llcyDCtyBGYWN1bHTDqTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiZm9vdGVyLXJpZ2h0XCI+PHNwYW4gY2xhc3M9XCJzbWFsbC1ncmVlblwiPjwvc3Bhbj5jbGF1ZGUtc29ubmV0LTQgwrcgUGVyZklBIHYyLjA8L3NwYW4+XG4gICAgPC9mb290ZXI+XG4gIDwvc2VjdGlvbj5cbn1cbiIsImltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFzc2lzdGFudENoYXRSZXF1ZXN0LCBBc3Npc3RhbnRDaGF0UmVzcG9uc2UgfSBmcm9tICcuLi9tb2RlbHMvYXNzaXN0YW50Lm1vZGVscyc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgQXNzaXN0YW50U2VydmljZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgaHR0cCA9IGluamVjdChIdHRwQ2xpZW50KTtcblxuICBjaGF0KHBheWxvYWQ6IEFzc2lzdGFudENoYXRSZXF1ZXN0KSB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PEFzc2lzdGFudENoYXRSZXNwb25zZT4oJy9hcGkvYXNzaXN0YW50L2NoYXQnLCBwYXlsb2FkKTtcbiAgfVxufVxuXG4iLCJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFVpVG9hc3RTZXJ2aWNlIH0gZnJvbSAnLi4vY29yZS9zZXJ2aWNlcy91aS10b2FzdC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXRvYXN0LW91dGxldCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHNlY3Rpb24gY2xhc3M9XCJ0b2FzdC1zdGFja1wiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGFyaWEtYXRvbWljPVwidHJ1ZVwiPlxuICAgICAgQGZvciAodG9hc3Qgb2YgdG9hc3RzKCk7IHRyYWNrIHRvYXN0LmlkKSB7XG4gICAgICAgIDxhcnRpY2xlIGNsYXNzPVwidG9hc3QtY2FyZCB0b2FzdC17eyB0b2FzdC50b25lIH19XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInRvYXN0LWNvcHlcIj5cbiAgICAgICAgICAgIDxzdHJvbmc+e3sgdG9hc3QudGl0bGUgfX08L3N0cm9uZz5cbiAgICAgICAgICAgIDxwPnt7IHRvYXN0Lm1lc3NhZ2UgfX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJ0b2FzdC1jbG9zZVwiIChjbGljayk9XCJkaXNtaXNzKHRvYXN0LmlkKVwiIGFyaWEtbGFiZWw9XCJGZXJtZXIgbGEgbm90aWZpY2F0aW9uXCI+XG4gICAgICAgICAgICDDl1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2FydGljbGU+XG4gICAgICB9XG4gICAgPC9zZWN0aW9uPlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICAudG9hc3Qtc3RhY2sge1xuICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgIHRvcDogMS40cmVtO1xuICAgICAgICByaWdodDogMS40cmVtO1xuICAgICAgICB6LWluZGV4OiA0MDtcbiAgICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgICAgZ2FwOiAwLjhyZW07XG4gICAgICAgIHdpZHRoOiBtaW4oMzYwcHgsIGNhbGMoMTAwdncgLSAycmVtKSk7XG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICAgfVxuXG4gICAgICAudG9hc3QtY2FyZCB7XG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogbWlubWF4KDAsIDFmcikgYXV0bztcbiAgICAgICAgZ2FwOiAwLjc1cmVtO1xuICAgICAgICBhbGlnbi1pdGVtczogc3RhcnQ7XG4gICAgICAgIHBhZGRpbmc6IDFyZW0gMS4wNXJlbTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcbiAgICAgICAgYm94LXNoYWRvdzogMCAyOHB4IDU1cHggcmdiYSgxNywgNDIsIDYzLCAwLjE4KTtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyMCwgNTAsIDc0LCAwLjA4KTtcbiAgICAgICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDE0cHgpO1xuICAgICAgICBwb2ludGVyLWV2ZW50czogYXV0bztcbiAgICAgIH1cblxuICAgICAgLnRvYXN0LWNvcHkgc3Ryb25nIHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDAuMjVyZW07XG4gICAgICAgIGZvbnQtc2l6ZTogMC45NXJlbTtcbiAgICAgIH1cblxuICAgICAgLnRvYXN0LWNvcHkgcCB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgY29sb3I6IHJnYmEoMjAsIDUwLCA3NCwgMC44KTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNTU7XG4gICAgICAgIGZvbnQtc2l6ZTogMC45cmVtO1xuICAgICAgfVxuXG4gICAgICAudG9hc3QtY2xvc2Uge1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGJvcmRlcjogMDtcbiAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiBpbmhlcml0O1xuICAgICAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgIG9wYWNpdHk6IDAuNztcbiAgICAgIH1cblxuICAgICAgLnRvYXN0LXN1Y2Nlc3Mge1xuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDIyNiwgMjQ3LCAyMzIsIDAuOTQpO1xuICAgICAgICBjb2xvcjogIzE1NWMzNztcbiAgICAgIH1cblxuICAgICAgLnRvYXN0LWVycm9yIHtcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDIzMywgMjMzLCAwLjk2KTtcbiAgICAgICAgY29sb3I6ICM4ZTJjMmM7XG4gICAgICB9XG5cbiAgICAgIC50b2FzdC1pbmZvIHtcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyMzEsIDI0MywgMjQ0LCAwLjk2KTtcbiAgICAgICAgY29sb3I6ICMxYjVjNjA7XG4gICAgICB9XG5cbiAgICAgIC50b2FzdC13YXJuaW5nIHtcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI0MywgMjI0LCAwLjk2KTtcbiAgICAgICAgY29sb3I6ICM4YjU2MGU7XG4gICAgICB9XG5cbiAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAgICAgICAudG9hc3Qtc3RhY2sge1xuICAgICAgICAgIHRvcDogYXV0bztcbiAgICAgICAgICByaWdodDogMXJlbTtcbiAgICAgICAgICBib3R0b206IDFyZW07XG4gICAgICAgICAgbGVmdDogMXJlbTtcbiAgICAgICAgICB3aWR0aDogYXV0bztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIGBcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgVG9hc3RPdXRsZXRDb21wb25lbnQge1xuICBwcml2YXRlIHJlYWRvbmx5IHRvYXN0U2VydmljZSA9IGluamVjdChVaVRvYXN0U2VydmljZSk7XG5cbiAgcmVhZG9ubHkgdG9hc3RzID0gdGhpcy50b2FzdFNlcnZpY2UudG9hc3RzO1xuXG4gIGRpc21pc3MoaWQ6IG51bWJlcikge1xuICAgIHRoaXMudG9hc3RTZXJ2aWNlLmRpc21pc3MoaWQpO1xuICB9XG59XG4iXSwibWFwcGlu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QSxXQUFBLEdBQUEsQ0FBQSxHQUFBLGdCQUFBLEdBQUEsQ0FBQSxHQUFBLGlCQUFBLEdBQUEsQ0FBQSxHQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsV0FBQSxHQUFBLENBQUEsUUFBQSxVQUFBLEdBQUEsd0JBQUEsaUJBQUEsR0FBQSxPQUFBLEdBQUEsQ0FBQSxHQUFBLFlBQUEsR0FBQSxDQUFBLEdBQUEsY0FBQSxHQUFBLENBQUEsR0FBQSxjQUFBLEdBQUEsQ0FBQSxHQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsaUJBQUEsR0FBQSxDQUFBLEdBQUEsZUFBQSxHQUFBLENBQUEsR0FBQSxjQUFBLEdBQUEsQ0FBQSxHQUFBLGVBQUEsR0FBQSxDQUFBLEdBQUEsWUFBQSxHQUFBLENBQUEsR0FBQSxhQUFBLEdBQUEsQ0FBQSxHQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsZUFBQSxHQUFBLENBQUEsR0FBQSxlQUFBLEdBQUEsQ0FBQSxHQUFBLGFBQUEsR0FBQSxjQUFBLEdBQUEsQ0FBQSxvQkFBQSxlQUFBLEdBQUEsWUFBQSxHQUFBLGNBQUEseUJBQUEsR0FBQSxDQUFBLEdBQUEsV0FBQSxHQUFBLENBQUEsUUFBQSxVQUFBLEdBQUEsWUFBQSxrQkFBQSxvQkFBQSxHQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsWUFBQSxrQkFBQSxtQkFBQSxHQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsYUFBQSxHQUFBLENBQUEsb0JBQUEsa0JBQUEsR0FBQSxlQUFBLEdBQUEsY0FBQSx5QkFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLEdBQUEsWUFBQSxrQkFBQSxvQkFBQSxHQUFBLE9BQUEsR0FBQSxDQUFBLEdBQUEsVUFBQSxHQUFBLENBQUEsR0FBQSxVQUFBLEdBQUEsQ0FBQSxlQUFBLFFBQUEsR0FBQSxtQkFBQSxHQUFBLENBQUEsR0FBQSxZQUFBLGtCQUFBLGlCQUFBLEdBQUEsQ0FBQSxHQUFBLGlCQUFBLEdBQUEsQ0FBQSxHQUFBLGtCQUFBLEdBQUEsQ0FBQSxHQUFBLGVBQUEsR0FBQSxDQUFBLEdBQUEsU0FBQSxHQUFBLENB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RUFBQSxDQUFBOzs7O2lGQUVwQyxtQkFBaUIsRUFBQSxXQUFBLHFCQUFBLFVBQUEseUNBQUEsWUFBQSxHQUFBLENBQUE7QUFBQSxHQUFBOzs7Ozs7OytEQUFqQixtQkFBaUIsRUFBQSxTQUFBLENBQUFDLEdBQUEsR0FBQSxDQUFBLFlBQUEsa0JBQUEsY0FBQSxzQkFBQSwwQkFBQSxVQUFBRixZQUFBQyx3QkFBQSxHQUFBLGFBQUEsRUFBQSxDQUFBO0VBQUE7QUFBQSxHQUFBLE9BQUEsY0FBQSxlQUFBLGNBQUEsMEJBQUEsS0FBQSxJQUFBLENBQUE7QUFBQSxHQUFBLE9BQUEsY0FBQSxlQUFBLGVBQUEsWUFBQSxPQUFBLFlBQUEsSUFBQSxHQUFBLDRCQUFBLE9BQUEsRUFBQSxPQUFBLE1BQUEsMEJBQUEsRUFBQSxTQUFBLENBQUE7QUFBQSxHQUFBOyIsIm5hbWVzIjpbIkNoYW5nZURldGVjdGlvblN0cmF0ZWd5IiwiQ29tcG9uZW50IiwiRGVzdHJveVJlZiIsImNvbXB1dGVkIiwiaW5qZWN0Iiwic2lnbmFsIiwidGFrZVVudGlsRGVzdHJveWVkIiwiaW5qZWN0IiwiSHR0cENsaWVudCIsIkluamVjdGFibGUiLCJpbmplY3QiLCJpbmplY3QiLCJzZWN0aW9ucyIsImkwIiwiQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kiLCJDb21wb25lbnQiLCJpbmplY3QiLCJpbmplY3QiLCJfZm9yVHJhY2swIiwiQ29tcG9uZW50IiwiQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kiLCJpMCIsIl9jMCIsIl9mb3JUcmFjazAiLCJfZm9yVHJhY2sxIiwiaW5qZWN0IiwiRGVzdHJveVJlZiIsImNvbXB1dGVkIiwic2lnbmFsIiwidGFrZVVudGlsRGVzdHJveWVkIiwiQ29tcG9uZW50IiwiQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kiLCJpMCJdfQ==
