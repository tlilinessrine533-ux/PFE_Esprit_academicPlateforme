import { injectQuery as __vite__injectQuery } from "/@vite/client";import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/chunk-7BIUZUPX.js");import {
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
var _forTrack0 = ($index, $item) => $item.label;
var _forTrack1 = ($index, $item) => $item.key;
function AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_4_Conditional_4_For_2_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElement(0, "li", 53);
  }
  if (rf & 2) {
    const line_r3 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(6);
    i03.\u0275\u0275domProperty("innerHTML", ctx_r1.formatLine(line_r3), i03.\u0275\u0275sanitizeHtml);
  }
}
function AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_4_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "ul");
    i03.\u0275\u0275repeaterCreate(1, AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_4_Conditional_4_For_2_Template, 1, 1, "li", 53, i03.\u0275\u0275repeaterTrackByIdentity);
    i03.\u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const section_r4 = i03.\u0275\u0275nextContext().$implicit;
    i03.\u0275\u0275advance();
    i03.\u0275\u0275repeater(section_r4.lines);
  }
}
function AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_4_Conditional_5_For_1_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElement(0, "p", 53);
  }
  if (rf & 2) {
    const line_r5 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(6);
    i03.\u0275\u0275domProperty("innerHTML", ctx_r1.formatLine(line_r5), i03.\u0275\u0275sanitizeHtml);
  }
}
function AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275repeaterCreate(0, AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_4_Conditional_5_For_1_Template, 1, 1, "p", 53, i03.\u0275\u0275repeaterTrackByIdentity);
  }
  if (rf & 2) {
    const section_r4 = i03.\u0275\u0275nextContext().$implicit;
    i03.\u0275\u0275repeater(section_r4.lines);
  }
}
function AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_4_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "section", 45)(1, "span", 51);
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(3, "div", 52);
    i03.\u0275\u0275conditionalCreate(4, AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_4_Conditional_4_Template, 3, 0, "ul")(5, AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_4_Conditional_5_Template, 2, 0);
    i03.\u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const section_r4 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(4);
    i03.\u0275\u0275advance();
    i03.\u0275\u0275classMap(ctx_r1.sectionClass(section_r4.kind));
    i03.\u0275\u0275advance();
    i03.\u0275\u0275textInterpolate(section_r4.label);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275conditional(section_r4.list ? 4 : 5);
  }
}
function AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_7_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "article", 47)(1, "div", 54);
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(3, "div", 55);
    i03.\u0275\u0275text(4);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(5, "div", 56);
    i03.\u0275\u0275text(6);
    i03.\u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const stat_r6 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(4);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(stat_r6.label);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(ctx_r1.formatValue(stat_r6.value));
    i03.\u0275\u0275advance();
    i03.\u0275\u0275classMap(ctx_r1.trendClass(stat_r6.trend));
    i03.\u0275\u0275advance();
    i03.\u0275\u0275textInterpolate2(" ", ctx_r1.trendArrow(stat_r6.trend), " ", ctx_r1.formatTrend(stat_r6.trend), " ");
  }
}
function AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_10_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "div", 49)(1, "label");
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(3, "div", 57);
    i03.\u0275\u0275domElement(4, "div", 58);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(5, "span");
    i03.\u0275\u0275text(6);
    i03.\u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const metric_r7 = ctx.$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(4);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(metric_r7.label);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275classMap(ctx_r1.progressFillClass(metric_r7.tone));
    i03.\u0275\u0275styleProp("width", metric_r7.value, "%");
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate1("", ctx_r1.formatValue(metric_r7.value), "%");
  }
}
function AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "div", 43);
    i03.\u0275\u0275text(1, "\u2726");
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(2, "div", 44);
    i03.\u0275\u0275repeaterCreate(3, AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_4_Template, 6, 4, "section", 45, _forTrack1);
    i03.\u0275\u0275domElementStart(5, "div", 46);
    i03.\u0275\u0275repeaterCreate(6, AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_7_Template, 7, 6, "article", 47, _forTrack0);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(8, "div", 48);
    i03.\u0275\u0275repeaterCreate(9, AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_For_10_Template, 7, 6, "div", 49, _forTrack0);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(11, "div", 50);
    i03.\u0275\u0275text(12, "Session \xB7 Analyse de performance");
    i03.\u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const message_r8 = i03.\u0275\u0275nextContext().$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(2);
    i03.\u0275\u0275advance(3);
    i03.\u0275\u0275repeater(ctx_r1.getSections(message_r8));
    i03.\u0275\u0275advance(3);
    i03.\u0275\u0275repeater(ctx_r1.getStats(message_r8));
    i03.\u0275\u0275advance(3);
    i03.\u0275\u0275repeater(ctx_r1.getProgress(ctx_r1.getStats(message_r8)));
  }
}
function AssistantWidgetComponent_Conditional_2_For_33_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "div", 44)(1, "p");
    i03.\u0275\u0275text(2);
    i03.\u0275\u0275domElementEnd()();
    i03.\u0275\u0275domElementStart(3, "div", 59);
    i03.\u0275\u0275text(4);
    i03.\u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const message_r8 = i03.\u0275\u0275nextContext().$implicit;
    const ctx_r1 = i03.\u0275\u0275nextContext(2);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(message_r8.question);
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275textInterpolate(ctx_r1.accountRole() === "CHEF_DEPARTEMENT" ? "CD" : ctx_r1.accountRole() === "ADMINISTRATION" ? "AD" : ctx_r1.accountRole() === "SUPER_ADMIN" ? "SA" : "EN");
  }
}
function AssistantWidgetComponent_Conditional_2_For_33_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "article", 42);
    i03.\u0275\u0275conditionalCreate(1, AssistantWidgetComponent_Conditional_2_For_33_Conditional_1_Template, 13, 0)(2, AssistantWidgetComponent_Conditional_2_For_33_Conditional_2_Template, 5, 2);
    i03.\u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const message_r8 = ctx.$implicit;
    i03.\u0275\u0275classProp("user", message_r8.sender === "user")("ai", message_r8.sender === "assistant");
    i03.\u0275\u0275advance();
    i03.\u0275\u0275conditional(message_r8.sender === "assistant" ? 1 : 2);
  }
}
function AssistantWidgetComponent_Conditional_2_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    i03.\u0275\u0275domElementStart(0, "article", 28)(1, "div", 43);
    i03.\u0275\u0275text(2, "\u2726");
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(3, "div", 44)(4, "span", 60);
    i03.\u0275\u0275domElement(5, "span", 61)(6, "span", 61)(7, "span", 61);
    i03.\u0275\u0275domElementEnd()()();
  }
}
function AssistantWidgetComponent_Conditional_2_For_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = i03.\u0275\u0275getCurrentView();
    i03.\u0275\u0275domElementStart(0, "button", 62);
    i03.\u0275\u0275domListener("click", function AssistantWidgetComponent_Conditional_2_For_37_Template_button_click_0_listener() {
      const chip_r10 = i03.\u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = i03.\u0275\u0275nextContext(2);
      return i03.\u0275\u0275resetView(ctx_r1.applyQuickChip(chip_r10));
    });
    i03.\u0275\u0275text(1);
    i03.\u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const chip_r10 = ctx.$implicit;
    i03.\u0275\u0275advance();
    i03.\u0275\u0275textInterpolate2("", chip_r10.icon, " ", chip_r10.label);
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
    i03.\u0275\u0275domElementStart(30, "div", 26, 0);
    i03.\u0275\u0275repeaterCreate(32, AssistantWidgetComponent_Conditional_2_For_33_Template, 3, 5, "article", 27, i03.\u0275\u0275componentInstance().trackByMessageId, true);
    i03.\u0275\u0275conditionalCreate(34, AssistantWidgetComponent_Conditional_2_Conditional_34_Template, 8, 0, "article", 28);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(35, "div", 29);
    i03.\u0275\u0275repeaterCreate(36, AssistantWidgetComponent_Conditional_2_For_37_Template, 2, 2, "button", 30, _forTrack0);
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(38, "div", 31)(39, "div", 32)(40, "textarea", 33, 1);
    i03.\u0275\u0275domListener("input", function AssistantWidgetComponent_Conditional_2_Template_textarea_input_40_listener($event) {
      i03.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i03.\u0275\u0275nextContext();
      return i03.\u0275\u0275resetView(ctx_r1.onComposerInput($event));
    })("keydown", function AssistantWidgetComponent_Conditional_2_Template_textarea_keydown_40_listener($event) {
      i03.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i03.\u0275\u0275nextContext();
      return i03.\u0275\u0275resetView(ctx_r1.onComposerKeydown($event));
    });
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(42, "button", 34);
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275domElementStart(43, "svg", 35);
    i03.\u0275\u0275domElement(44, "path", 36);
    i03.\u0275\u0275domElementEnd()();
    i03.\u0275\u0275namespaceHTML();
    i03.\u0275\u0275domElementStart(45, "button", 37);
    i03.\u0275\u0275domListener("click", function AssistantWidgetComponent_Conditional_2_Template_button_click_45_listener() {
      i03.\u0275\u0275restoreView(_r1);
      const ctx_r1 = i03.\u0275\u0275nextContext();
      return i03.\u0275\u0275resetView(ctx_r1.sendMessage());
    });
    i03.\u0275\u0275namespaceSVG();
    i03.\u0275\u0275domElementStart(46, "svg", 35);
    i03.\u0275\u0275domElement(47, "path", 38);
    i03.\u0275\u0275domElementEnd()()()();
    i03.\u0275\u0275namespaceHTML();
    i03.\u0275\u0275domElementStart(48, "footer", 39)(49, "span");
    i03.\u0275\u0275text(50, "Donn\xE9es prot\xE9g\xE9es \xB7 Facult\xE9");
    i03.\u0275\u0275domElementEnd();
    i03.\u0275\u0275domElementStart(51, "span", 40);
    i03.\u0275\u0275domElement(52, "span", 41);
    i03.\u0275\u0275text(53, "claude-sonnet-4 \xB7 PerfIA v2.0");
    i03.\u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = i03.\u0275\u0275nextContext();
    i03.\u0275\u0275advance(32);
    i03.\u0275\u0275repeater(ctx_r1.messages());
    i03.\u0275\u0275advance(2);
    i03.\u0275\u0275conditional(ctx_r1.pending() ? 34 : -1);
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
  accountRole = computed(() => this.resolveAllowedRole(this.role()), ...ngDevMode ? [{ debugName: "accountRole" }] : (
    /* istanbul ignore next */
    []
  ));
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
    return map[this.accountRole()];
  }, ...ngDevMode ? [{ debugName: "activeQuickChips" }] : (
    /* istanbul ignore next */
    []
  ));
  toggle() {
    this.isOpen.update((value) => !value);
    if (this.isOpen()) {
      setTimeout(() => this.scrollToBottom(), 0);
    }
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
    const fallback = defaults[this.accountRole()];
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
  }, decls: 3, vars: 2, consts: [["messagesEl", ""], ["composerEl", ""], ["type", "button", "aria-label", "Ouvrir PerfIA Assistant", 1, "assistant-fab", 3, "click"], [1, "perfia-shell"], ["aria-hidden", "true", 1, "orb", "orb-blue"], ["aria-hidden", "true", 1, "orb", "orb-violet"], [1, "topbar"], [1, "topbar-left"], ["aria-hidden", "true", 1, "ai-avatar"], ["viewBox", "0 0 24 24", "fill", "none"], ["d", "M12 2.2l1.8 4.7 4.8 1.8-4.8 1.8L12 15.2l-1.8-4.7-4.8-1.8 4.8-1.8L12 2.2zM18.3 14.9l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8.8-2.1zM6.1 14.3l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6z", "fill", "#fff"], [1, "identity"], [1, "identity-top"], [1, "badge-ai"], [1, "status-line"], [1, "status-dot"], [1, "topbar-actions"], ["type", "button", "title", "Historique", "aria-label", "Historique", 1, "icon-btn", 3, "click"], ["d", "M12 5v7l4.2 2.6", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round"], ["d", "M4 12a8 8 0 108-8 7.9 7.9 0 00-5.8 2.5M4 4v4h4", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round"], ["type", "button", "title", "Exporter", "aria-label", "Exporter", 1, "icon-btn", 3, "click"], ["d", "M12 4v10m0 0l-3.2-3.2M12 14l3.2-3.2", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round"], ["d", "M5 16.7V20h14v-3.3", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round"], ["type", "button", "title", "Param\xE8tres", "aria-label", "Param\xE8tres", 1, "icon-btn", 3, "click"], ["d", "M12 8.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4z", "stroke", "currentColor", "stroke-width", "1.8"], ["d", "M19.4 10.6l1.1 1.4-1.2 2-1.8.1a6 6 0 01-.6 1.4l1.1 1.4-1.8 1.8-1.4-1.1a6 6 0 01-1.4.6l-.1 1.8h-2l-.1-1.8a6 6 0 01-1.4-.6l-1.4 1.1-1.8-1.8 1.1-1.4a6 6 0 01-.6-1.4L3.5 14 2.3 12l1.1-1.4 1.8-.1a6 6 0 01.6-1.4L4.7 7.7l1.8-1.8 1.4 1.1a6 6 0 011.4-.6l.1-1.8h2l.1 1.8a6 6 0 011.4.6l1.4-1.1 1.8 1.8-1.1 1.4c.3.4.5.9.6 1.4l1.8.1z", "stroke", "currentColor", "stroke-width", "1.2"], [1, "messages-wrap"], [1, "message-row", 3, "user", "ai"], [1, "message-row", "ai"], [1, "quickbar"], ["type", "button", 1, "quick-chip"], [1, "inputbar"], [1, "input-wrap"], ["rows", "1", "placeholder", "Posez votre question \xE0 PerfIA...", 1, "composer", 3, "input", "keydown", "value"], ["type", "button", "aria-label", "Joindre", 1, "attach-btn"], ["viewBox", "0 0 24 24", "fill", "none", "width", "17", "height", "17"], ["d", "M8.5 12.5l6.3-6.3a3 3 0 114.2 4.2l-8.1 8.1a5 5 0 01-7.1-7.1l8-8", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round"], ["type", "button", "aria-label", "Envoyer", 1, "send-btn", 3, "click", "disabled"], ["d", "M4 12l15-7-3.8 14-4.1-5.4L4 12z", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linejoin", "round"], [1, "footer"], [1, "footer-right"], [1, "small-green"], [1, "message-row"], [1, "msg-avatar", "ai"], [1, "msg-bubble"], [1, "section-block"], [1, "stats-grid"], [1, "stat-card"], [1, "progress-pack"], [1, "progress-line"], [1, "divider"], [1, "section-tag"], [1, "section-text"], [3, "innerHTML"], [1, "stat-label"], [1, "stat-value"], [1, "stat-trend"], [1, "track"], [1, "fill"], [1, "msg-avatar", "user"], [1, "typing-wrap"], [1, "typing-dot"], ["type", "button", 1, "quick-chip", 3, "click"]], template: function AssistantWidgetComponent_Template(rf, ctx) {
    if (rf & 1) {
      i03.\u0275\u0275domElementStart(0, "button", 2);
      i03.\u0275\u0275domListener("click", function AssistantWidgetComponent_Template_button_click_0_listener() {
        return ctx.toggle();
      });
      i03.\u0275\u0275text(1, " IA\n");
      i03.\u0275\u0275domElementEnd();
      i03.\u0275\u0275conditionalCreate(2, AssistantWidgetComponent_Conditional_2_Template, 54, 3, "section", 3);
    }
    if (rf & 2) {
      i03.\u0275\u0275attribute("aria-expanded", ctx.isOpen());
      i03.\u0275\u0275advance(2);
      i03.\u0275\u0275conditional(ctx.isOpen() ? 2 : -1);
    }
  }, styles: ['\n[_nghost-%COMP%] {\n  --accent: #4f6ef7;\n  --accent2: #7c3aed;\n  --accent3: #06b6d4;\n  --surface: rgba(15, 18, 32, 0.97);\n  --surface2: rgba(22, 28, 48, 0.95);\n  --surface3: rgba(30, 38, 65, 0.9);\n  --text1: #f0f4ff;\n  --text2: #a8b4d4;\n  --text3: #5a6a99;\n  --border: rgba(79, 110, 247, 0.2);\n  position: fixed;\n  right: 1rem;\n  bottom: 1rem;\n  z-index: 80;\n  font-family: "Outfit", sans-serif;\n}\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.assistant-fab[_ngcontent-%COMP%] {\n  width: 4rem;\n  height: 4rem;\n  border-radius: 999px;\n  border: 1px solid rgba(156, 184, 255, 0.5);\n  font-family: inherit;\n  font-size: 1.26rem;\n  font-weight: 800;\n  letter-spacing: 0.06em;\n  color: #fff;\n  cursor: pointer;\n  background:\n    radial-gradient(\n      90% 90% at 28% 22%,\n      rgba(255, 126, 174, 0.75),\n      transparent 62%),\n    linear-gradient(\n      140deg,\n      rgba(255, 74, 130, 0.96),\n      rgba(122, 58, 237, 0.95));\n  box-shadow:\n    0 18px 36px rgba(8, 13, 38, 0.6),\n    0 0 18px rgba(79, 110, 247, 0.52),\n    inset 0 1px 0 rgba(255, 255, 255, 0.36);\n}\n.perfia-shell[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0;\n  bottom: 4.8rem;\n  width: min(100vw - 1rem, 780px);\n  max-height: calc(100vh - 6rem);\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr) auto auto auto;\n  border-radius: 24px;\n  border: 1px solid var(--border);\n  background: var(--surface);\n  box-shadow:\n    0 32px 80px rgba(0, 0, 0, 0.6),\n    0 0 0 1px rgba(79, 110, 247, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.05);\n  transform-origin: right bottom;\n  transform: perspective(1200px) rotateX(1.5deg);\n  transition: transform 0.28s ease;\n  overflow: hidden;\n  isolation: isolate;\n}\n.perfia-shell[_ngcontent-%COMP%]:hover {\n  transform: perspective(1200px) rotateX(0deg);\n}\n.perfia-shell[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background-image:\n    linear-gradient(rgba(79, 110, 247, 0.08) 1px, transparent 1px),\n    linear-gradient(\n      90deg,\n      rgba(79, 110, 247, 0.08) 1px,\n      transparent 1px);\n  background-size: 40px 40px;\n  opacity: 0.42;\n  pointer-events: none;\n  z-index: 0;\n}\n.orb[_ngcontent-%COMP%] {\n  position: absolute;\n  border-radius: 999px;\n  filter: blur(24px);\n  pointer-events: none;\n  z-index: 1;\n}\n.orb-blue[_ngcontent-%COMP%] {\n  top: -95px;\n  right: -95px;\n  width: 260px;\n  height: 260px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(6, 182, 212, 0.52),\n      transparent 64%);\n  animation: _ngcontent-%COMP%_pulse1 6s ease-in-out infinite;\n}\n.orb-violet[_ngcontent-%COMP%] {\n  left: -98px;\n  bottom: -114px;\n  width: 290px;\n  height: 290px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(124, 58, 237, 0.45),\n      transparent 68%);\n  animation: _ngcontent-%COMP%_pulse2 8s ease-in-out infinite;\n}\n.topbar[_ngcontent-%COMP%], \n.messages-wrap[_ngcontent-%COMP%], \n.quickbar[_ngcontent-%COMP%], \n.inputbar[_ngcontent-%COMP%], \n.footer[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n}\n.topbar[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  padding: 0.88rem 1rem;\n  background: var(--surface2);\n  border-bottom: 1px solid rgba(79, 110, 247, 0.16);\n}\n.topbar-left[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.78rem;\n}\n.ai-avatar[_ngcontent-%COMP%] {\n  position: relative;\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  display: grid;\n  place-items: center;\n  color: #fff;\n  flex: none;\n  background:\n    linear-gradient(\n      135deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 16px rgba(79, 110, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.32);\n  animation: _ngcontent-%COMP%_avatarGlow 3s infinite;\n}\n.ai-avatar[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  inset: -3px;\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      120deg,\n      #7fa8ff,\n      #a066ff,\n      #35d2ff);\n  opacity: 0.85;\n  z-index: -1;\n  animation: _ngcontent-%COMP%_ringRotate 4s linear infinite;\n}\n.ai-avatar[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 22px;\n  height: 22px;\n}\n.identity[_ngcontent-%COMP%] {\n  min-width: 0;\n  display: grid;\n  gap: 0.13rem;\n}\n.identity-top[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.identity-top[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.04rem;\n  color: var(--text1);\n  white-space: nowrap;\n}\n.badge-ai[_ngcontent-%COMP%] {\n  padding: 0.15rem 0.54rem;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  letter-spacing: 0.05em;\n  color: #fff;\n  background:\n    linear-gradient(\n      135deg,\n      var(--accent),\n      var(--accent2));\n}\n.status-line[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  font-size: 0.78rem;\n  color: var(--text2);\n}\n.status-dot[_ngcontent-%COMP%] {\n  width: 0.53rem;\n  height: 0.53rem;\n  border-radius: 999px;\n  background: #22c55e;\n  box-shadow: 0 0 10px rgba(34, 197, 94, 0.78);\n  animation: _ngcontent-%COMP%_blink 2s infinite;\n}\n.topbar-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n}\n.icon-btn[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 11px;\n  border: 1px solid rgba(156, 184, 255, 0.3);\n  background: rgba(255, 255, 255, 0.02);\n  color: var(--text2);\n  cursor: pointer;\n  display: grid;\n  place-items: center;\n  transition: all 0.18s ease;\n}\n.icon-btn[_ngcontent-%COMP%]:hover {\n  border-color: rgba(122, 176, 255, 0.82);\n  color: #deebff;\n  box-shadow: 0 0 14px rgba(79, 110, 247, 0.34);\n}\n.icon-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n}\n.rolebar[_ngcontent-%COMP%] {\n  padding: 0.7rem 0.86rem;\n  border-bottom: 1px solid rgba(79, 110, 247, 0.16);\n  background: rgba(22, 28, 48, 0.72);\n}\n.rolechips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.45rem;\n}\n.role-chip[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(114, 133, 190, 0.32);\n  background: transparent;\n  color: var(--text2);\n  padding: 0.44rem 0.84rem;\n  font-family: inherit;\n  font-weight: 700;\n  letter-spacing: 0.03em;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.role-chip.active[_ngcontent-%COMP%] {\n  color: #fff;\n  background:\n    linear-gradient(\n      130deg,\n      rgba(79, 110, 247, 0.92),\n      rgba(124, 58, 237, 0.86));\n  border-color: rgba(122, 176, 255, 0.86);\n  box-shadow: 0 0 18px rgba(79, 110, 247, 0.35);\n}\n.role-chip.locked[_ngcontent-%COMP%], \n.role-chip[_ngcontent-%COMP%]:disabled {\n  opacity: 0.46;\n  cursor: not-allowed;\n  filter: grayscale(0.2);\n}\n.messages-wrap[_ngcontent-%COMP%] {\n  min-height: 220px;\n  overflow: auto;\n  padding: 0.96rem 0.82rem;\n  overscroll-behavior: contain;\n}\n.messages-wrap[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 0.45rem;\n}\n.messages-wrap[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(79, 110, 247, 0.88),\n      rgba(124, 58, 237, 0.76));\n}\n.message-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.55rem;\n  margin-bottom: 0.68rem;\n  animation: _ngcontent-%COMP%_msgIn 0.35s cubic-bezier(0.23, 1, 0.32, 1);\n}\n.message-row.user[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.msg-avatar[_ngcontent-%COMP%] {\n  width: 30px;\n  height: 30px;\n  border-radius: 9px;\n  flex: none;\n  font-size: 0.75rem;\n  font-weight: 800;\n  display: grid;\n  place-items: center;\n}\n.msg-avatar.ai[_ngcontent-%COMP%] {\n  color: #fff;\n  background:\n    linear-gradient(\n      140deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 14px rgba(79, 110, 247, 0.4);\n}\n.msg-avatar.user[_ngcontent-%COMP%] {\n  color: #d8e0ff;\n  background: rgba(22, 28, 48, 0.96);\n  border: 1px solid rgba(154, 178, 239, 0.22);\n}\n.msg-bubble[_ngcontent-%COMP%] {\n  max-width: min(86%, 640px);\n  border: 1px solid rgba(129, 154, 225, 0.24);\n  padding: 0.66rem 0.78rem;\n}\n.message-row.ai[_ngcontent-%COMP%]   .msg-bubble[_ngcontent-%COMP%] {\n  background: var(--surface3);\n  border-radius: 4px 16px 16px 16px;\n}\n.message-row.user[_ngcontent-%COMP%]   .msg-bubble[_ngcontent-%COMP%] {\n  color: #eef2ff;\n  background:\n    linear-gradient(\n      135deg,\n      #4f6ef7,\n      #5b50f0);\n  border-color: rgba(156, 180, 255, 0.34);\n  border-radius: 16px 4px 16px 16px;\n  box-shadow: 0 4px 20px rgba(79, 110, 247, 0.35);\n}\n.msg-bubble[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.1rem 0 0;\n  color: var(--text1);\n  line-height: 1.5;\n}\n.section-block[_ngcontent-%COMP%]    + .section-block[_ngcontent-%COMP%] {\n  margin-top: 0.5rem;\n}\n.section-tag[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 0.15rem 0.52rem;\n  font-size: 0.69rem;\n  letter-spacing: 0.05em;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.tag-summary[_ngcontent-%COMP%] {\n  color: #34d399;\n  background: rgba(52, 211, 153, 0.13);\n}\n.tag-analysis[_ngcontent-%COMP%] {\n  color: #818cf8;\n  background: rgba(129, 140, 248, 0.14);\n}\n.tag-recommendation[_ngcontent-%COMP%] {\n  color: #fcd34d;\n  background: rgba(252, 211, 77, 0.14);\n}\n.tag-risk[_ngcontent-%COMP%] {\n  color: #fca5a5;\n  background: rgba(248, 113, 113, 0.12);\n}\n.section-text[_ngcontent-%COMP%] {\n  margin-top: 0.34rem;\n  font-size: 0.92rem;\n}\n.section-text[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  margin: 0;\n  padding-left: 1rem;\n  display: grid;\n  gap: 0.16rem;\n}\n.stats-grid[_ngcontent-%COMP%] {\n  margin-top: 0.62rem;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.35rem;\n}\n.stat-card[_ngcontent-%COMP%] {\n  border-radius: 10px;\n  border: 1px solid rgba(129, 154, 225, 0.18);\n  background: rgba(15, 18, 32, 0.8);\n  padding: 0.42rem 0.5rem;\n}\n.stat-label[_ngcontent-%COMP%] {\n  font-family: "JetBrains Mono", monospace;\n  text-transform: uppercase;\n  font-size: 0.58rem;\n  color: var(--text3);\n}\n.stat-value[_ngcontent-%COMP%] {\n  font-family: "JetBrains Mono", monospace;\n  font-size: 18px;\n  font-weight: 800;\n  margin-top: 0.18rem;\n}\n.stat-trend[_ngcontent-%COMP%] {\n  margin-top: 0.08rem;\n  font-size: 0.69rem;\n  font-family: "JetBrains Mono", monospace;\n}\n.trend-up[_ngcontent-%COMP%] {\n  color: #34d399;\n}\n.trend-down[_ngcontent-%COMP%] {\n  color: #f87171;\n}\n.progress-pack[_ngcontent-%COMP%] {\n  margin-top: 0.56rem;\n  display: grid;\n  gap: 0.3rem;\n}\n.progress-line[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 7rem 1fr auto;\n  align-items: center;\n  gap: 0.45rem;\n}\n.progress-line[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.progress-line[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.66rem;\n  color: var(--text2);\n  font-family: "JetBrains Mono", monospace;\n}\n.track[_ngcontent-%COMP%] {\n  height: 6px;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.06);\n  overflow: hidden;\n}\n.fill[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: inherit;\n  box-shadow: 0 0 12px currentColor;\n}\n.fill-teaching[_ngcontent-%COMP%] {\n  color: #6fa3ff;\n  background:\n    linear-gradient(\n      90deg,\n      #4f6ef7,\n      #7c3aed);\n}\n.fill-research[_ngcontent-%COMP%] {\n  color: #67d9ff;\n  background:\n    linear-gradient(\n      90deg,\n      #7c3aed,\n      #06b6d4);\n}\n.fill-supervision[_ngcontent-%COMP%] {\n  color: #ffb95a;\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b,\n      #fb7185);\n}\n.divider[_ngcontent-%COMP%] {\n  margin: 0.7rem 0 0.15rem;\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--text3);\n  font-family: "JetBrains Mono", monospace;\n  font-size: 0.74rem;\n}\n.divider[_ngcontent-%COMP%]::before, \n.divider[_ngcontent-%COMP%]::after {\n  content: "";\n  height: 1px;\n  background: rgba(112, 131, 191, 0.3);\n}\n.typing-wrap[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.typing-dot[_ngcontent-%COMP%] {\n  width: 0.4rem;\n  height: 0.4rem;\n  border-radius: 999px;\n  animation: _ngcontent-%COMP%_typingBounce 0.9s ease-in-out infinite;\n}\n.typing-dot[_ngcontent-%COMP%]:nth-child(1) {\n  background: #4f6ef7;\n  animation-delay: 0s;\n}\n.typing-dot[_ngcontent-%COMP%]:nth-child(2) {\n  background: #6366f1;\n  animation-delay: 0.2s;\n}\n.typing-dot[_ngcontent-%COMP%]:nth-child(3) {\n  background: #7c3aed;\n  animation-delay: 0.4s;\n}\n.quickbar[_ngcontent-%COMP%] {\n  padding: 0.55rem 0.76rem 0.72rem;\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.quick-chip[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  border: 1px solid rgba(117, 143, 214, 0.34);\n  padding: 0.42rem 0.78rem;\n  color: var(--text2);\n  background: rgba(255, 255, 255, 0.02);\n  font-family: inherit;\n  cursor: pointer;\n  transition: all 0.18s ease;\n}\n.quick-chip[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  border-color: rgba(122, 176, 255, 0.85);\n  background: rgba(79, 110, 247, 0.14);\n  color: #deebff;\n}\n.inputbar[_ngcontent-%COMP%] {\n  padding: 0.72rem 0.82rem 0.78rem;\n  background: var(--surface2);\n  border-top: 1px solid rgba(79, 110, 247, 0.16);\n}\n.input-wrap[_ngcontent-%COMP%] {\n  border-radius: 16px;\n  border: 1px solid rgba(122, 146, 207, 0.34);\n  background: rgba(15, 18, 32, 0.58);\n  padding: 0.44rem;\n  display: grid;\n  grid-template-columns: 1fr auto auto;\n  gap: 0.35rem;\n  align-items: end;\n}\n.composer[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 40px;\n  max-height: 140px;\n  resize: none;\n  border: 0;\n  outline: none;\n  border-radius: 12px;\n  background: transparent;\n  color: var(--text1);\n  font: inherit;\n  font-size: 0.98rem;\n  line-height: 1.4;\n  padding: 0.48rem 0.58rem;\n}\n.composer[_ngcontent-%COMP%]::placeholder {\n  color: #7f8cb0;\n}\n.input-wrap[_ngcontent-%COMP%]:focus-within {\n  border-color: rgba(109, 160, 255, 0.92);\n  box-shadow: 0 0 0 1px rgba(109, 160, 255, 0.24), 0 0 20px rgba(79, 110, 247, 0.32);\n}\n.attach-btn[_ngcontent-%COMP%], \n.send-btn[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  border: 1px solid rgba(122, 146, 207, 0.36);\n  display: grid;\n  place-items: center;\n  cursor: pointer;\n}\n.attach-btn[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.03);\n  color: var(--text2);\n}\n.send-btn[_ngcontent-%COMP%] {\n  border-color: rgba(156, 185, 255, 0.55);\n  color: #fff;\n  background:\n    linear-gradient(\n      140deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 18px rgba(79, 110, 247, 0.45);\n  transition: transform 0.18s ease;\n}\n.send-btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: scale(1.06);\n}\n.send-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.58;\n  cursor: not-allowed;\n}\n.footer[_ngcontent-%COMP%] {\n  border-top: 1px solid rgba(79, 110, 247, 0.18);\n  background: rgba(11, 15, 29, 0.9);\n  padding: 0.5rem 0.82rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.7rem;\n  color: var(--text3);\n  font-family: "JetBrains Mono", monospace;\n  font-size: 0.73rem;\n}\n.footer-right[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.small-green[_ngcontent-%COMP%] {\n  width: 0.45rem;\n  height: 0.45rem;\n  border-radius: 999px;\n  background: #2fd684;\n  animation: _ngcontent-%COMP%_blink 2s infinite;\n}\n@media (max-width: 780px) {\n  [_nghost-%COMP%] {\n    right: 0.45rem;\n    bottom: 0.45rem;\n  }\n  .assistant-fab[_ngcontent-%COMP%] {\n    width: 3.6rem;\n    height: 3.6rem;\n  }\n  .perfia-shell[_ngcontent-%COMP%] {\n    width: calc(100vw - 0.7rem);\n    bottom: 4.3rem;\n    max-height: calc(100vh - 5.4rem);\n  }\n  .messages-wrap[_ngcontent-%COMP%] {\n    min-height: 180px;\n    padding: 0.68rem;\n  }\n  .msg-bubble[_ngcontent-%COMP%] {\n    max-width: 92%;\n  }\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .progress-line[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 0.2rem;\n  }\n  .input-wrap[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .attach-btn[_ngcontent-%COMP%], \n   .send-btn[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .footer[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n}\n@keyframes _ngcontent-%COMP%_avatarGlow {\n  0%, 100% {\n    box-shadow: 0 0 12px rgba(79, 110, 247, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.22);\n  }\n  50% {\n    box-shadow:\n      0 0 24px rgba(79, 110, 247, 0.75),\n      0 0 18px rgba(124, 58, 237, 0.45),\n      inset 0 1px 0 rgba(255, 255, 255, 0.28);\n  }\n}\n@keyframes _ngcontent-%COMP%_ringRotate {\n  0% {\n    filter: hue-rotate(0deg);\n  }\n  100% {\n    filter: hue-rotate(360deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse1 {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 0.78;\n  }\n  50% {\n    transform: scale(1.16);\n    opacity: 0.45;\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse2 {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 0.82;\n  }\n  50% {\n    transform: scale(1.2);\n    opacity: 0.36;\n  }\n}\n@keyframes _ngcontent-%COMP%_blink {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.3;\n  }\n}\n@keyframes _ngcontent-%COMP%_msgIn {\n  from {\n    transform: translateY(7px) scale(0.985);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0) scale(1);\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_typingBounce {\n  0%, 80%, 100% {\n    transform: translateY(0);\n    opacity: 0.6;\n  }\n  40% {\n    transform: translateY(-4px);\n    opacity: 1;\n  }\n}\n/*# sourceMappingURL=assistant-widget.component.css.map */'], changeDetection: 0 });
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
            <div class="msg-avatar user">{{ accountRole() === 'CHEF_DEPARTEMENT' ? 'CD' : accountRole() === 'ADMINISTRATION' ? 'AD' : accountRole() === 'SUPER_ADMIN' ? 'SA' : 'EN' }}</div>
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
`, styles: ['/* src/app/shared/assistant-widget.component.css */\n:host {\n  --accent: #4f6ef7;\n  --accent2: #7c3aed;\n  --accent3: #06b6d4;\n  --surface: rgba(15, 18, 32, 0.97);\n  --surface2: rgba(22, 28, 48, 0.95);\n  --surface3: rgba(30, 38, 65, 0.9);\n  --text1: #f0f4ff;\n  --text2: #a8b4d4;\n  --text3: #5a6a99;\n  --border: rgba(79, 110, 247, 0.2);\n  position: fixed;\n  right: 1rem;\n  bottom: 1rem;\n  z-index: 80;\n  font-family: "Outfit", sans-serif;\n}\n* {\n  box-sizing: border-box;\n}\n.assistant-fab {\n  width: 4rem;\n  height: 4rem;\n  border-radius: 999px;\n  border: 1px solid rgba(156, 184, 255, 0.5);\n  font-family: inherit;\n  font-size: 1.26rem;\n  font-weight: 800;\n  letter-spacing: 0.06em;\n  color: #fff;\n  cursor: pointer;\n  background:\n    radial-gradient(\n      90% 90% at 28% 22%,\n      rgba(255, 126, 174, 0.75),\n      transparent 62%),\n    linear-gradient(\n      140deg,\n      rgba(255, 74, 130, 0.96),\n      rgba(122, 58, 237, 0.95));\n  box-shadow:\n    0 18px 36px rgba(8, 13, 38, 0.6),\n    0 0 18px rgba(79, 110, 247, 0.52),\n    inset 0 1px 0 rgba(255, 255, 255, 0.36);\n}\n.perfia-shell {\n  position: absolute;\n  right: 0;\n  bottom: 4.8rem;\n  width: min(100vw - 1rem, 780px);\n  max-height: calc(100vh - 6rem);\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr) auto auto auto;\n  border-radius: 24px;\n  border: 1px solid var(--border);\n  background: var(--surface);\n  box-shadow:\n    0 32px 80px rgba(0, 0, 0, 0.6),\n    0 0 0 1px rgba(79, 110, 247, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.05);\n  transform-origin: right bottom;\n  transform: perspective(1200px) rotateX(1.5deg);\n  transition: transform 0.28s ease;\n  overflow: hidden;\n  isolation: isolate;\n}\n.perfia-shell:hover {\n  transform: perspective(1200px) rotateX(0deg);\n}\n.perfia-shell::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  background-image:\n    linear-gradient(rgba(79, 110, 247, 0.08) 1px, transparent 1px),\n    linear-gradient(\n      90deg,\n      rgba(79, 110, 247, 0.08) 1px,\n      transparent 1px);\n  background-size: 40px 40px;\n  opacity: 0.42;\n  pointer-events: none;\n  z-index: 0;\n}\n.orb {\n  position: absolute;\n  border-radius: 999px;\n  filter: blur(24px);\n  pointer-events: none;\n  z-index: 1;\n}\n.orb-blue {\n  top: -95px;\n  right: -95px;\n  width: 260px;\n  height: 260px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(6, 182, 212, 0.52),\n      transparent 64%);\n  animation: pulse1 6s ease-in-out infinite;\n}\n.orb-violet {\n  left: -98px;\n  bottom: -114px;\n  width: 290px;\n  height: 290px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(124, 58, 237, 0.45),\n      transparent 68%);\n  animation: pulse2 8s ease-in-out infinite;\n}\n.topbar,\n.messages-wrap,\n.quickbar,\n.inputbar,\n.footer {\n  position: relative;\n  z-index: 2;\n}\n.topbar {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 0.8rem;\n  padding: 0.88rem 1rem;\n  background: var(--surface2);\n  border-bottom: 1px solid rgba(79, 110, 247, 0.16);\n}\n.topbar-left {\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.78rem;\n}\n.ai-avatar {\n  position: relative;\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  display: grid;\n  place-items: center;\n  color: #fff;\n  flex: none;\n  background:\n    linear-gradient(\n      135deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 16px rgba(79, 110, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.32);\n  animation: avatarGlow 3s infinite;\n}\n.ai-avatar::before {\n  content: "";\n  position: absolute;\n  inset: -3px;\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      120deg,\n      #7fa8ff,\n      #a066ff,\n      #35d2ff);\n  opacity: 0.85;\n  z-index: -1;\n  animation: ringRotate 4s linear infinite;\n}\n.ai-avatar svg {\n  width: 22px;\n  height: 22px;\n}\n.identity {\n  min-width: 0;\n  display: grid;\n  gap: 0.13rem;\n}\n.identity-top {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.42rem;\n}\n.identity-top strong {\n  font-size: 1.04rem;\n  color: var(--text1);\n  white-space: nowrap;\n}\n.badge-ai {\n  padding: 0.15rem 0.54rem;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  letter-spacing: 0.05em;\n  color: #fff;\n  background:\n    linear-gradient(\n      135deg,\n      var(--accent),\n      var(--accent2));\n}\n.status-line {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  font-size: 0.78rem;\n  color: var(--text2);\n}\n.status-dot {\n  width: 0.53rem;\n  height: 0.53rem;\n  border-radius: 999px;\n  background: #22c55e;\n  box-shadow: 0 0 10px rgba(34, 197, 94, 0.78);\n  animation: blink 2s infinite;\n}\n.topbar-actions {\n  display: flex;\n  gap: 0.45rem;\n}\n.icon-btn {\n  width: 36px;\n  height: 36px;\n  border-radius: 11px;\n  border: 1px solid rgba(156, 184, 255, 0.3);\n  background: rgba(255, 255, 255, 0.02);\n  color: var(--text2);\n  cursor: pointer;\n  display: grid;\n  place-items: center;\n  transition: all 0.18s ease;\n}\n.icon-btn:hover {\n  border-color: rgba(122, 176, 255, 0.82);\n  color: #deebff;\n  box-shadow: 0 0 14px rgba(79, 110, 247, 0.34);\n}\n.icon-btn svg {\n  width: 17px;\n  height: 17px;\n}\n.rolebar {\n  padding: 0.7rem 0.86rem;\n  border-bottom: 1px solid rgba(79, 110, 247, 0.16);\n  background: rgba(22, 28, 48, 0.72);\n}\n.rolechips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.45rem;\n}\n.role-chip {\n  border-radius: 999px;\n  border: 1px solid rgba(114, 133, 190, 0.32);\n  background: transparent;\n  color: var(--text2);\n  padding: 0.44rem 0.84rem;\n  font-family: inherit;\n  font-weight: 700;\n  letter-spacing: 0.03em;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.role-chip.active {\n  color: #fff;\n  background:\n    linear-gradient(\n      130deg,\n      rgba(79, 110, 247, 0.92),\n      rgba(124, 58, 237, 0.86));\n  border-color: rgba(122, 176, 255, 0.86);\n  box-shadow: 0 0 18px rgba(79, 110, 247, 0.35);\n}\n.role-chip.locked,\n.role-chip:disabled {\n  opacity: 0.46;\n  cursor: not-allowed;\n  filter: grayscale(0.2);\n}\n.messages-wrap {\n  min-height: 220px;\n  overflow: auto;\n  padding: 0.96rem 0.82rem;\n  overscroll-behavior: contain;\n}\n.messages-wrap::-webkit-scrollbar {\n  width: 0.45rem;\n}\n.messages-wrap::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(79, 110, 247, 0.88),\n      rgba(124, 58, 237, 0.76));\n}\n.message-row {\n  display: flex;\n  gap: 0.55rem;\n  margin-bottom: 0.68rem;\n  animation: msgIn 0.35s cubic-bezier(0.23, 1, 0.32, 1);\n}\n.message-row.user {\n  justify-content: flex-end;\n}\n.msg-avatar {\n  width: 30px;\n  height: 30px;\n  border-radius: 9px;\n  flex: none;\n  font-size: 0.75rem;\n  font-weight: 800;\n  display: grid;\n  place-items: center;\n}\n.msg-avatar.ai {\n  color: #fff;\n  background:\n    linear-gradient(\n      140deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 14px rgba(79, 110, 247, 0.4);\n}\n.msg-avatar.user {\n  color: #d8e0ff;\n  background: rgba(22, 28, 48, 0.96);\n  border: 1px solid rgba(154, 178, 239, 0.22);\n}\n.msg-bubble {\n  max-width: min(86%, 640px);\n  border: 1px solid rgba(129, 154, 225, 0.24);\n  padding: 0.66rem 0.78rem;\n}\n.message-row.ai .msg-bubble {\n  background: var(--surface3);\n  border-radius: 4px 16px 16px 16px;\n}\n.message-row.user .msg-bubble {\n  color: #eef2ff;\n  background:\n    linear-gradient(\n      135deg,\n      #4f6ef7,\n      #5b50f0);\n  border-color: rgba(156, 180, 255, 0.34);\n  border-radius: 16px 4px 16px 16px;\n  box-shadow: 0 4px 20px rgba(79, 110, 247, 0.35);\n}\n.msg-bubble p {\n  margin: 0.1rem 0 0;\n  color: var(--text1);\n  line-height: 1.5;\n}\n.section-block + .section-block {\n  margin-top: 0.5rem;\n}\n.section-tag {\n  display: inline-flex;\n  align-items: center;\n  border-radius: 999px;\n  padding: 0.15rem 0.52rem;\n  font-size: 0.69rem;\n  letter-spacing: 0.05em;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.tag-summary {\n  color: #34d399;\n  background: rgba(52, 211, 153, 0.13);\n}\n.tag-analysis {\n  color: #818cf8;\n  background: rgba(129, 140, 248, 0.14);\n}\n.tag-recommendation {\n  color: #fcd34d;\n  background: rgba(252, 211, 77, 0.14);\n}\n.tag-risk {\n  color: #fca5a5;\n  background: rgba(248, 113, 113, 0.12);\n}\n.section-text {\n  margin-top: 0.34rem;\n  font-size: 0.92rem;\n}\n.section-text ul {\n  margin: 0;\n  padding-left: 1rem;\n  display: grid;\n  gap: 0.16rem;\n}\n.stats-grid {\n  margin-top: 0.62rem;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 0.35rem;\n}\n.stat-card {\n  border-radius: 10px;\n  border: 1px solid rgba(129, 154, 225, 0.18);\n  background: rgba(15, 18, 32, 0.8);\n  padding: 0.42rem 0.5rem;\n}\n.stat-label {\n  font-family: "JetBrains Mono", monospace;\n  text-transform: uppercase;\n  font-size: 0.58rem;\n  color: var(--text3);\n}\n.stat-value {\n  font-family: "JetBrains Mono", monospace;\n  font-size: 18px;\n  font-weight: 800;\n  margin-top: 0.18rem;\n}\n.stat-trend {\n  margin-top: 0.08rem;\n  font-size: 0.69rem;\n  font-family: "JetBrains Mono", monospace;\n}\n.trend-up {\n  color: #34d399;\n}\n.trend-down {\n  color: #f87171;\n}\n.progress-pack {\n  margin-top: 0.56rem;\n  display: grid;\n  gap: 0.3rem;\n}\n.progress-line {\n  display: grid;\n  grid-template-columns: 7rem 1fr auto;\n  align-items: center;\n  gap: 0.45rem;\n}\n.progress-line label,\n.progress-line span {\n  font-size: 0.66rem;\n  color: var(--text2);\n  font-family: "JetBrains Mono", monospace;\n}\n.track {\n  height: 6px;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.06);\n  overflow: hidden;\n}\n.fill {\n  height: 100%;\n  border-radius: inherit;\n  box-shadow: 0 0 12px currentColor;\n}\n.fill-teaching {\n  color: #6fa3ff;\n  background:\n    linear-gradient(\n      90deg,\n      #4f6ef7,\n      #7c3aed);\n}\n.fill-research {\n  color: #67d9ff;\n  background:\n    linear-gradient(\n      90deg,\n      #7c3aed,\n      #06b6d4);\n}\n.fill-supervision {\n  color: #ffb95a;\n  background:\n    linear-gradient(\n      90deg,\n      #f59e0b,\n      #fb7185);\n}\n.divider {\n  margin: 0.7rem 0 0.15rem;\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  align-items: center;\n  gap: 0.5rem;\n  color: var(--text3);\n  font-family: "JetBrains Mono", monospace;\n  font-size: 0.74rem;\n}\n.divider::before,\n.divider::after {\n  content: "";\n  height: 1px;\n  background: rgba(112, 131, 191, 0.3);\n}\n.typing-wrap {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.24rem;\n}\n.typing-dot {\n  width: 0.4rem;\n  height: 0.4rem;\n  border-radius: 999px;\n  animation: typingBounce 0.9s ease-in-out infinite;\n}\n.typing-dot:nth-child(1) {\n  background: #4f6ef7;\n  animation-delay: 0s;\n}\n.typing-dot:nth-child(2) {\n  background: #6366f1;\n  animation-delay: 0.2s;\n}\n.typing-dot:nth-child(3) {\n  background: #7c3aed;\n  animation-delay: 0.4s;\n}\n.quickbar {\n  padding: 0.55rem 0.76rem 0.72rem;\n  display: flex;\n  gap: 0.45rem;\n  flex-wrap: wrap;\n}\n.quick-chip {\n  border-radius: 999px;\n  border: 1px solid rgba(117, 143, 214, 0.34);\n  padding: 0.42rem 0.78rem;\n  color: var(--text2);\n  background: rgba(255, 255, 255, 0.02);\n  font-family: inherit;\n  cursor: pointer;\n  transition: all 0.18s ease;\n}\n.quick-chip:hover {\n  transform: translateY(-1px);\n  border-color: rgba(122, 176, 255, 0.85);\n  background: rgba(79, 110, 247, 0.14);\n  color: #deebff;\n}\n.inputbar {\n  padding: 0.72rem 0.82rem 0.78rem;\n  background: var(--surface2);\n  border-top: 1px solid rgba(79, 110, 247, 0.16);\n}\n.input-wrap {\n  border-radius: 16px;\n  border: 1px solid rgba(122, 146, 207, 0.34);\n  background: rgba(15, 18, 32, 0.58);\n  padding: 0.44rem;\n  display: grid;\n  grid-template-columns: 1fr auto auto;\n  gap: 0.35rem;\n  align-items: end;\n}\n.composer {\n  width: 100%;\n  min-height: 40px;\n  max-height: 140px;\n  resize: none;\n  border: 0;\n  outline: none;\n  border-radius: 12px;\n  background: transparent;\n  color: var(--text1);\n  font: inherit;\n  font-size: 0.98rem;\n  line-height: 1.4;\n  padding: 0.48rem 0.58rem;\n}\n.composer::placeholder {\n  color: #7f8cb0;\n}\n.input-wrap:focus-within {\n  border-color: rgba(109, 160, 255, 0.92);\n  box-shadow: 0 0 0 1px rgba(109, 160, 255, 0.24), 0 0 20px rgba(79, 110, 247, 0.32);\n}\n.attach-btn,\n.send-btn {\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  border: 1px solid rgba(122, 146, 207, 0.36);\n  display: grid;\n  place-items: center;\n  cursor: pointer;\n}\n.attach-btn {\n  background: rgba(255, 255, 255, 0.03);\n  color: var(--text2);\n}\n.send-btn {\n  border-color: rgba(156, 185, 255, 0.55);\n  color: #fff;\n  background:\n    linear-gradient(\n      140deg,\n      var(--accent),\n      var(--accent2));\n  box-shadow: 0 0 18px rgba(79, 110, 247, 0.45);\n  transition: transform 0.18s ease;\n}\n.send-btn:hover:not(:disabled) {\n  transform: scale(1.06);\n}\n.send-btn:disabled {\n  opacity: 0.58;\n  cursor: not-allowed;\n}\n.footer {\n  border-top: 1px solid rgba(79, 110, 247, 0.18);\n  background: rgba(11, 15, 29, 0.9);\n  padding: 0.5rem 0.82rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.7rem;\n  color: var(--text3);\n  font-family: "JetBrains Mono", monospace;\n  font-size: 0.73rem;\n}\n.footer-right {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.34rem;\n}\n.small-green {\n  width: 0.45rem;\n  height: 0.45rem;\n  border-radius: 999px;\n  background: #2fd684;\n  animation: blink 2s infinite;\n}\n@media (max-width: 780px) {\n  :host {\n    right: 0.45rem;\n    bottom: 0.45rem;\n  }\n  .assistant-fab {\n    width: 3.6rem;\n    height: 3.6rem;\n  }\n  .perfia-shell {\n    width: calc(100vw - 0.7rem);\n    bottom: 4.3rem;\n    max-height: calc(100vh - 5.4rem);\n  }\n  .messages-wrap {\n    min-height: 180px;\n    padding: 0.68rem;\n  }\n  .msg-bubble {\n    max-width: 92%;\n  }\n  .stats-grid {\n    grid-template-columns: 1fr;\n  }\n  .progress-line {\n    grid-template-columns: 1fr;\n    gap: 0.2rem;\n  }\n  .input-wrap {\n    grid-template-columns: 1fr;\n  }\n  .attach-btn,\n  .send-btn {\n    width: 100%;\n  }\n  .footer {\n    flex-direction: column;\n    align-items: flex-start;\n  }\n}\n@keyframes avatarGlow {\n  0%, 100% {\n    box-shadow: 0 0 12px rgba(79, 110, 247, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.22);\n  }\n  50% {\n    box-shadow:\n      0 0 24px rgba(79, 110, 247, 0.75),\n      0 0 18px rgba(124, 58, 237, 0.45),\n      inset 0 1px 0 rgba(255, 255, 255, 0.28);\n  }\n}\n@keyframes ringRotate {\n  0% {\n    filter: hue-rotate(0deg);\n  }\n  100% {\n    filter: hue-rotate(360deg);\n  }\n}\n@keyframes pulse1 {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 0.78;\n  }\n  50% {\n    transform: scale(1.16);\n    opacity: 0.45;\n  }\n}\n@keyframes pulse2 {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 0.82;\n  }\n  50% {\n    transform: scale(1.2);\n    opacity: 0.36;\n  }\n}\n@keyframes blink {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.3;\n  }\n}\n@keyframes msgIn {\n  from {\n    transform: translateY(7px) scale(0.985);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0) scale(1);\n    opacity: 1;\n  }\n}\n@keyframes typingBounce {\n  0%, 80%, 100% {\n    transform: translateY(0);\n    opacity: 0.6;\n  }\n  40% {\n    transform: translateY(-4px);\n    opacity: 1;\n  }\n}\n/*# sourceMappingURL=assistant-widget.component.css.map */\n'] }]
  }], null, { composerEl: [{
    type: ViewChild,
    args: ["composerEl"]
  }], messagesEl: [{
    type: ViewChild,
    args: ["messagesEl"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassDebugInfo(AssistantWidgetComponent, { className: "AssistantWidgetComponent", filePath: "src/app/shared/assistant-widget.component.ts", lineNumber: 52 });
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbGF5b3V0L2FwcC1zaGVsbC5jb21wb25lbnQudHMiLCJzcmMvYXBwL2xheW91dC9hcHAtc2hlbGwuY29tcG9uZW50Lmh0bWwiLCJzcmMvYXBwL2NvcmUvc2VydmljZXMvbm90aWZpY2F0aW9uLnNlcnZpY2UudHMiLCJzcmMvYXBwL3NoYXJlZC9hc3Npc3RhbnQtd2lkZ2V0LmNvbXBvbmVudC50cyIsInNyYy9hcHAvc2hhcmVkL2Fzc2lzdGFudC13aWRnZXQuY29tcG9uZW50Lmh0bWwiLCJzcmMvYXBwL2NvcmUvc2VydmljZXMvYXNzaXN0YW50LnNlcnZpY2UudHMiLCJzcmMvYXBwL3NoYXJlZC90b2FzdC1vdXRsZXQuY29tcG9uZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERhdGVQaXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIERlc3Ryb3lSZWYsIGNvbXB1dGVkLCBpbmplY3QsIHNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgdGFrZVVudGlsRGVzdHJveWVkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS9yeGpzLWludGVyb3AnO1xuaW1wb3J0IHsgTmF2aWdhdGlvbkVuZCwgUm91dGVyLCBSb3V0ZXJMaW5rLCBSb3V0ZXJMaW5rQWN0aXZlLCBSb3V0ZXJPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgZmlsdGVyLCB0aW1lciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uT3ZlcnZpZXdSZXNwb25zZSB9IGZyb20gJy4uL2NvcmUvbW9kZWxzL25vdGlmaWNhdGlvbi5tb2RlbHMnO1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9jb3JlL3NlcnZpY2VzL2F1dGguc2VydmljZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vY29yZS9zZXJ2aWNlcy9ub3RpZmljYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBVaVRvYXN0U2VydmljZSB9IGZyb20gJy4uL2NvcmUvc2VydmljZXMvdWktdG9hc3Quc2VydmljZSc7XG5pbXBvcnQgeyBBc3Npc3RhbnRXaWRnZXRDb21wb25lbnQgfSBmcm9tICcuLi9zaGFyZWQvYXNzaXN0YW50LXdpZGdldC5jb21wb25lbnQnO1xuaW1wb3J0IHsgVG9hc3RPdXRsZXRDb21wb25lbnQgfSBmcm9tICcuLi9zaGFyZWQvdG9hc3Qtb3V0bGV0LmNvbXBvbmVudCc7XG5cbmludGVyZmFjZSBTaGVsbE5hdkNoaWxkSXRlbSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHBhdGg6IHN0cmluZztcbiAgaGludDogc3RyaW5nO1xuICB2aXNpYmxlPzogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIFNoZWxsTmF2SXRlbSB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHBhdGg6IHN0cmluZztcbiAgaWNvbjogc3RyaW5nO1xuICBoaW50OiBzdHJpbmc7XG4gIHZpc2libGU6IGJvb2xlYW47XG4gIGNvbGxhcHNpYmxlPzogYm9vbGVhbjtcbiAgY2hpbGRyZW4/OiBTaGVsbE5hdkNoaWxkSXRlbVtdO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtc2hlbGwnLFxuICBpbXBvcnRzOiBbUm91dGVyTGluaywgUm91dGVyTGlua0FjdGl2ZSwgUm91dGVyT3V0bGV0LCBUb2FzdE91dGxldENvbXBvbmVudCwgQXNzaXN0YW50V2lkZ2V0Q29tcG9uZW50LCBEYXRlUGlwZV0sXG4gIHRlbXBsYXRlVXJsOiAnLi9hcHAtc2hlbGwuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybDogJy4vYXBwLXNoZWxsLmNvbXBvbmVudC5jc3MnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBBcHBTaGVsbENvbXBvbmVudCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXV0aFNlcnZpY2UgPSBpbmplY3QoQXV0aFNlcnZpY2UpO1xuICBwcml2YXRlIHJlYWRvbmx5IG5vdGlmaWNhdGlvblNlcnZpY2UgPSBpbmplY3QoTm90aWZpY2F0aW9uU2VydmljZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgdG9hc3RTZXJ2aWNlID0gaW5qZWN0KFVpVG9hc3RTZXJ2aWNlKTtcbiAgcHJpdmF0ZSByZWFkb25seSBkZXN0cm95UmVmID0gaW5qZWN0KERlc3Ryb3lSZWYpO1xuICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlciA9IGluamVjdChSb3V0ZXIpO1xuXG4gIHJlYWRvbmx5IHVzZXIgPSB0aGlzLmF1dGhTZXJ2aWNlLnVzZXI7XG4gIHJlYWRvbmx5IGlzQWRtaW5pc3RyYXRpb24gPSBjb21wdXRlZCgoKSA9PiB0aGlzLmF1dGhTZXJ2aWNlLmhhc0FueVJvbGUoJ0FETUlOSVNUUkFUSU9OJykpO1xuICByZWFkb25seSBpc0RlcGFydG1lbnRIZWFkID0gY29tcHV0ZWQoKCkgPT4gdGhpcy5hdXRoU2VydmljZS5oYXNBbnlSb2xlKCdDSEVGX0RFUEFSVEVNRU5UJykpO1xuICByZWFkb25seSBpc1N1cGVyQWRtaW4gPSBjb21wdXRlZCgoKSA9PiB0aGlzLmF1dGhTZXJ2aWNlLmhhc0FueVJvbGUoJ1NVUEVSX0FETUlOJykpO1xuICByZWFkb25seSBzaG93Tm90aWZpY2F0aW9uQ2VudGVyID0gY29tcHV0ZWQoKCkgPT4gZmFsc2UpO1xuICByZWFkb25seSBub3RpZmljYXRpb25zTG9hZGluZyA9IHNpZ25hbChmYWxzZSk7XG4gIHJlYWRvbmx5IG5vdGlmaWNhdGlvbk92ZXJ2aWV3ID0gc2lnbmFsPE5vdGlmaWNhdGlvbk92ZXJ2aWV3UmVzcG9uc2UgfCBudWxsPihudWxsKTtcbiAgcmVhZG9ubHkgY3VycmVudFVybCA9IHNpZ25hbCh0aGlzLnJvdXRlci51cmwpO1xuICByZWFkb25seSBjdXJyZW50RGF0ZVRpbWUgPSBzaWduYWwobmV3IERhdGUoKSk7XG4gIHJlYWRvbmx5IGV4cGFuZGVkTmF2R3JvdXBzID0gc2lnbmFsPFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+Pih7fSk7XG4gIHJlYWRvbmx5IG5hdkl0ZW1zID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGNvbnN0IGl0ZW1zOiBTaGVsbE5hdkl0ZW1bXSA9IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6IHRoaXMuaXNBZG1pbmlzdHJhdGlvbigpIHx8IHRoaXMuaXNEZXBhcnRtZW50SGVhZCgpID8gJ1RhYmxlYXUgZGUgYm9yZCBkZSBwZXJmb3JtYW5jZScgOiAnVGFibGVhdSBkZSBib3JkJyxcbiAgICAgICAgcGF0aDogJy9kYXNoYm9hcmQnLFxuICAgICAgICBpY29uOiAnVEInLFxuICAgICAgICBoaW50OiB0aGlzLmlzQWRtaW5pc3RyYXRpb24oKSB8fCB0aGlzLmlzRGVwYXJ0bWVudEhlYWQoKSA/ICdJbmRpY2F0ZXVycyBldCBzdWl2aScgOiAnJyxcbiAgICAgICAgdmlzaWJsZTogIXRoaXMuaXNTdXBlckFkbWluKClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiB0aGlzLmlzRGVwYXJ0bWVudEhlYWQoKSA/ICdBY3Rpdml0ZXMgZW5zZWlnbmFudHMnIDogJ01lcyBhY3Rpdml0ZXMnLFxuICAgICAgICBwYXRoOiAnL3RlYWNoaW5nJyxcbiAgICAgICAgaWNvbjogJ0FDJyxcbiAgICAgICAgaGludDogdGhpcy5pc0RlcGFydG1lbnRIZWFkKCkgPyAnQ29uc3VsdGF0aW9uIGR1IGRlcGFydGVtZW50JyA6ICdUb3V0ZXMgdm9zIGRlY2xhcmF0aW9ucycsXG4gICAgICAgIHZpc2libGU6IHRoaXMuYXV0aFNlcnZpY2UuaGFzQW55Um9sZSgnRU5TRUlHTkFOVCcsICdDSEVGX0RFUEFSVEVNRU5UJyksXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgeyBsYWJlbDogJ0NvdXJzJywgcGF0aDogJy90ZWFjaGluZycsIGhpbnQ6ICdGb3JtYXRpb24gZXQgbW9kdWxlcycgfSxcbiAgICAgICAgICB7IGxhYmVsOiAnRW5jYWRyZW1lbnRzJywgcGF0aDogJy9zdXBlcnZpc2lvbicsIGhpbnQ6ICdQRkUgZXQganVyeXMnIH0sXG4gICAgICAgICAgeyBsYWJlbDogJ1JlY2hlcmNoZScsIHBhdGg6ICcvcmVzZWFyY2gnLCBoaW50OiAnQXJ0aWNsZXMgZXQgY29uZmVyZW5jZXMnIH0sXG4gICAgICAgICAgeyBsYWJlbDogJ0V2ZW5lbWVudHMnLCBwYXRoOiAnL2V2ZW50cycsIGhpbnQ6ICdPcmdhbmlzYXRpb24gc2NpZW50aWZpcXVlJyB9LFxuICAgICAgICAgIHsgbGFiZWw6ICdTdXJ2ZWlsbGFuY2VzJywgcGF0aDogJy9leGFtLXN1cnZlaWxsYW5jZScsIGhpbnQ6ICdFeGFtZW5zJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUmVzcG9uc2FiaWxpdGVzJyxcbiAgICAgICAgICAgIHBhdGg6ICcvcmVzcG9uc2liaWxpdGllcycsXG4gICAgICAgICAgICBoaW50OiAnUm9sZXMgaW5zdGl0dXRpb25uZWxzJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdQYXJ0ZW5hcmlhdCcsXG4gICAgICAgICAgICBwYXRoOiAnL3BhcnRuZXJzaGlwcycsXG4gICAgICAgICAgICBoaW50OiAnRGVjbGFyYXRpb24gYWNhZGVtaXF1ZSAvIHByb2Zlc3Npb25uZWxsZScsXG4gICAgICAgICAgICB2aXNpYmxlOiB0aGlzLmF1dGhTZXJ2aWNlLmhhc0FueVJvbGUoJ0VOU0VJR05BTlQnLCAnQ0hFRl9ERVBBUlRFTUVOVCcpXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0Rpc3BvbmliaWxpdGUnLFxuICAgICAgICBwYXRoOiAnL2F2YWlsYWJpbGl0eS9sZWF2ZScsXG4gICAgICAgIGljb246ICdEUCcsXG4gICAgICAgIGhpbnQ6ICdDb25nZXMgZXQgbWlzc2lvbnMnLFxuICAgICAgICB2aXNpYmxlOiB0aGlzLmF1dGhTZXJ2aWNlLmhhc0FueVJvbGUoJ0VOU0VJR05BTlQnKSxcbiAgICAgICAgY29sbGFwc2libGU6IHRydWUsXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgeyBsYWJlbDogJ0RlbWFuZGVyIHVuIGNvbmdlJywgcGF0aDogJy9hdmFpbGFiaWxpdHkvbGVhdmUnLCBoaW50OiAnRGVjbGFyYXRpb24gZGUgY29uZ2UnIH0sXG4gICAgICAgICAgeyBsYWJlbDogJ0RlbWFuZGVyIHVuZSBtaXNzaW9uJywgcGF0aDogJy9hdmFpbGFiaWxpdHkvbWlzc2lvbicsIGhpbnQ6ICdEZWNsYXJhdGlvbiBkZSBtaXNzaW9uJyB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiB0aGlzLmlzU3VwZXJBZG1pbigpID8gJ1V0aWxpc2F0ZXVycyBldCByb2xlcycgOiAnVXRpbGlzYXRldXJzJyxcbiAgICAgICAgcGF0aDogJy91c2VycycsXG4gICAgICAgIGljb246ICdVUycsXG4gICAgICAgIGhpbnQ6IHRoaXMuaXNTdXBlckFkbWluKCkgPyAnR2VzdGlvbiBkZXMgdXRpbGlzYXRldXJzIGV0IGRlcyByb2xlcycgOiAnQ29tcHRlcyBldCByb2xlcycsXG4gICAgICAgIHZpc2libGU6IHRoaXMuYXV0aFNlcnZpY2UuaGFzQW55Um9sZSgnU1VQRVJfQURNSU4nKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6IHRoaXMuaXNEZXBhcnRtZW50SGVhZCgpXG4gICAgICAgICAgPyAnVmFsaWRhdGlvbiBkZXBhcnRlbWVudGFsZSdcbiAgICAgICAgICA6ICdXb3JrZmxvdycsXG4gICAgICAgIHBhdGg6ICcvd29ya2Zsb3cnLFxuICAgICAgICBpY29uOiAnV0YnLFxuICAgICAgICBoaW50OiB0aGlzLmlzRGVwYXJ0bWVudEhlYWQoKSA/ICdWYWxpZGVyIG91IHJlamV0ZXIgbGVzIGRvc3NpZXJzJyA6ICdWYWxpZGF0aW9uIGRlcyBkb3NzaWVycycsXG4gICAgICAgIHZpc2libGU6IHRoaXMuYXV0aFNlcnZpY2UuaGFzQW55Um9sZSgnQ0hFRl9ERVBBUlRFTUVOVCcsICdBRE1JTklTVFJBVElPTicpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogdGhpcy5pc0FkbWluaXN0cmF0aW9uKClcbiAgICAgICAgICA/ICdSYXBwb3J0cyBpbnN0aXR1dGlvbm5lbHMnXG4gICAgICAgICAgOiB0aGlzLmlzRGVwYXJ0bWVudEhlYWQoKVxuICAgICAgICAgICAgPyAnUmFwcG9ydHMgZGVwYXJ0ZW1lbnRhdXgnXG4gICAgICAgICAgICA6ICdSYXBwb3J0IGluZGl2aWR1ZWwnLFxuICAgICAgICBwYXRoOiAnL3JlcG9ydHMnLFxuICAgICAgICBpY29uOiAnUlAnLFxuICAgICAgICBoaW50OiB0aGlzLmlzQWRtaW5pc3RyYXRpb24oKVxuICAgICAgICAgID8gJ1JhcHBvcnRzIGV0IHByaW1lcyBkZSBwZXJmb3JtYW5jZSdcbiAgICAgICAgICA6IHRoaXMuaXNEZXBhcnRtZW50SGVhZCgpXG4gICAgICAgICAgICA/ICdFeHBvcnRzIGNvbnNvbGlkZXMgZHUgZGVwYXJ0ZW1lbnQnXG4gICAgICAgICAgICA6ICdHZW5lcmF0aW9uIGV0IGhpc3RvcmlxdWUgaW5kaXZpZHVlbCcsXG4gICAgICAgIHZpc2libGU6ICF0aGlzLmlzU3VwZXJBZG1pbigpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ1Byb2ZpbCBldCBzZWN1cml0ZScsXG4gICAgICAgIHBhdGg6ICcvcHJvZmlsZScsXG4gICAgICAgIGljb246ICdQUicsXG4gICAgICAgIGhpbnQ6ICdDb21wdGUsIHByb2ZpbCBldCAyRkEnLFxuICAgICAgICB2aXNpYmxlOiB0aGlzLmF1dGhTZXJ2aWNlLmhhc0FueVJvbGUoJ0VOU0VJR05BTlQnLCAnQ0hFRl9ERVBBUlRFTUVOVCcsICdBRE1JTklTVFJBVElPTicsICdTVVBFUl9BRE1JTicpXG4gICAgICB9XG4gICAgXTtcblxuICAgIHJldHVybiBpdGVtc1xuICAgICAgLm1hcCgoaXRlbSkgPT4gKHtcbiAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgY2hpbGRyZW46IGl0ZW0uY2hpbGRyZW4/LmZpbHRlcigoY2hpbGQpID0+IGNoaWxkLnZpc2libGUgIT09IGZhbHNlKVxuICAgICAgfSkpXG4gICAgICAuZmlsdGVyKChpdGVtKSA9PiBpdGVtLnZpc2libGUpO1xuICB9KTtcbiAgcmVhZG9ubHkgcmVjZW50Tm90aWZpY2F0aW9ucyA9IGNvbXB1dGVkKCgpID0+ICh0aGlzLm5vdGlmaWNhdGlvbk92ZXJ2aWV3KCk/Lm5vdGlmaWNhdGlvbnMgPz8gW10pLnNsaWNlKDAsIDMpKTtcbiAgcmVhZG9ubHkgdW5yZWFkTm90aWZpY2F0aW9uc0NvdW50ID0gY29tcHV0ZWQoKCkgPT4gdGhpcy5ub3RpZmljYXRpb25PdmVydmlldygpPy51bnJlYWRDb3VudCA/PyAwKTtcbiAgcmVhZG9ubHkgY3VycmVudERhdGVMYWJlbCA9IGNvbXB1dGVkKCgpID0+XG4gICAgbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoJ2ZyLUZSJywge1xuICAgICAgd2Vla2RheTogJ2xvbmcnLFxuICAgICAgZGF5OiAnMi1kaWdpdCcsXG4gICAgICBtb250aDogJ2xvbmcnXG4gICAgfSkuZm9ybWF0KHRoaXMuY3VycmVudERhdGVUaW1lKCkpXG4gICk7XG4gIHJlYWRvbmx5IGN1cnJlbnRUaW1lTGFiZWwgPSBjb21wdXRlZCgoKSA9PlxuICAgIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdmci1GUicsIHtcbiAgICAgIGhvdXI6ICcyLWRpZ2l0JyxcbiAgICAgIG1pbnV0ZTogJzItZGlnaXQnXG4gICAgfSkuZm9ybWF0KHRoaXMuY3VycmVudERhdGVUaW1lKCkpXG4gICk7XG4gIHJlYWRvbmx5IHdvcmtzcGFjZUdyZWV0aW5nID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGNvbnN0IGhvdXIgPSB0aGlzLmN1cnJlbnREYXRlVGltZSgpLmdldEhvdXJzKCk7XG5cbiAgICBpZiAoaG91ciA8IDEyKSB7XG4gICAgICByZXR1cm4gJ0JvbmpvdXInO1xuICAgIH1cblxuICAgIGlmIChob3VyIDwgMTgpIHtcbiAgICAgIHJldHVybiAnQm9uIGFwcmVzLW1pZGknO1xuICAgIH1cblxuICAgIHJldHVybiAnQm9uc29pcic7XG4gIH0pO1xuICByZWFkb25seSBhY3RpdmVXb3Jrc3BhY2VMYWJlbCA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50VXJsID0gdGhpcy5jdXJyZW50VXJsKCk7XG5cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5uYXZJdGVtcygpKSB7XG4gICAgICBjb25zdCBhY3RpdmVDaGlsZCA9IGl0ZW0uY2hpbGRyZW4/LmZpbmQoKGNoaWxkKSA9PiBjdXJyZW50VXJsID09PSBjaGlsZC5wYXRoIHx8IGN1cnJlbnRVcmwuc3RhcnRzV2l0aChgJHtjaGlsZC5wYXRofS9gKSk7XG4gICAgICBpZiAoYWN0aXZlQ2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIGFjdGl2ZUNoaWxkLmxhYmVsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudFVybCA9PT0gaXRlbS5wYXRoIHx8IGN1cnJlbnRVcmwuc3RhcnRzV2l0aChgJHtpdGVtLnBhdGh9L2ApKSB7XG4gICAgICAgIHJldHVybiBpdGVtLmxhYmVsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAnRXNwYWNlIGRlIHRyYXZhaWwnO1xuICB9KTtcbiAgcmVhZG9ubHkgYWN0aXZlV29ya3NwYWNlSGludCA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50VXJsID0gdGhpcy5jdXJyZW50VXJsKCk7XG5cbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5uYXZJdGVtcygpKSB7XG4gICAgICBjb25zdCBhY3RpdmVDaGlsZCA9IGl0ZW0uY2hpbGRyZW4/LmZpbmQoKGNoaWxkKSA9PiBjdXJyZW50VXJsID09PSBjaGlsZC5wYXRoIHx8IGN1cnJlbnRVcmwuc3RhcnRzV2l0aChgJHtjaGlsZC5wYXRofS9gKSk7XG4gICAgICBpZiAoYWN0aXZlQ2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIGFjdGl2ZUNoaWxkLmhpbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50VXJsID09PSBpdGVtLnBhdGggfHwgY3VycmVudFVybC5zdGFydHNXaXRoKGAke2l0ZW0ucGF0aH0vYCkpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaGludDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gJ1BsYXRlZm9ybWUgYWNhZGVtaXF1ZSBFU1BSSVQnO1xuICB9KTtcbiAgcmVhZG9ubHkgdXNlckluaXRpYWxzID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRVc2VyID0gdGhpcy51c2VyKCk7XG4gICAgaWYgKCFjdXJyZW50VXNlcikge1xuICAgICAgcmV0dXJuICdVJztcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7Y3VycmVudFVzZXIuZmlyc3ROYW1lLmNoYXJBdCgwKX0ke2N1cnJlbnRVc2VyLmxhc3ROYW1lLmNoYXJBdCgwKX1gLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoZXZlbnQpOiBldmVudCBpcyBOYXZpZ2F0aW9uRW5kID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCksXG4gICAgICAgIHRha2VVbnRpbERlc3Ryb3llZCh0aGlzLmRlc3Ryb3lSZWYpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnRVcmwuc2V0KGV2ZW50LnVybEFmdGVyUmVkaXJlY3RzKTtcbiAgICAgIH0pO1xuXG4gICAgdGltZXIoMCwgMjAwMDApXG4gICAgICAucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQodGhpcy5kZXN0cm95UmVmKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLmN1cnJlbnREYXRlVGltZS5zZXQobmV3IERhdGUoKSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnNob3dOb3RpZmljYXRpb25DZW50ZXIoKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubG9hZE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbG9nb3V0KCkge1xuICAgIHRoaXMuYXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gIH1cblxuICByb2xlTGFiZWwocm9sZTogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gICAgc3dpdGNoIChyb2xlKSB7XG4gICAgICBjYXNlICdFTlNFSUdOQU5UJzpcbiAgICAgICAgcmV0dXJuICdFbnNlaWduYW50JztcbiAgICAgIGNhc2UgJ0NIRUZfREVQQVJURU1FTlQnOlxuICAgICAgICByZXR1cm4gJ0NoZWYgZGUgZGVwYXJ0ZW1lbnQnO1xuICAgICAgY2FzZSAnQURNSU5JU1RSQVRJT04nOlxuICAgICAgICByZXR1cm4gJ0FkbWluaXN0cmF0aW9uJztcbiAgICAgIGNhc2UgJ1NVUEVSX0FETUlOJzpcbiAgICAgICAgcmV0dXJuICdTdXBlciBhZG1pbmlzdHJhdGV1cic7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ1V0aWxpc2F0ZXVyJztcbiAgICB9XG4gIH1cblxuICBsb2FkTm90aWZpY2F0aW9ucyhzaG93RXJyb3JUb2FzdCA9IGZhbHNlKSB7XG4gICAgaWYgKCF0aGlzLnNob3dOb3RpZmljYXRpb25DZW50ZXIoKSkge1xuICAgICAgdGhpcy5ub3RpZmljYXRpb25PdmVydmlldy5zZXQobnVsbCk7XG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbnNMb2FkaW5nLnNldChmYWxzZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ub3RpZmljYXRpb25zTG9hZGluZy5zZXQodHJ1ZSk7XG5cbiAgICB0aGlzLm5vdGlmaWNhdGlvblNlcnZpY2VcbiAgICAgIC5nZXRPdmVydmlldygpXG4gICAgICAucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQodGhpcy5kZXN0cm95UmVmKSlcbiAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICBuZXh0OiAob3ZlcnZpZXcpID0+IHtcbiAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbk92ZXJ2aWV3LnNldChvdmVydmlldyk7XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zTG9hZGluZy5zZXQoZmFsc2UpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKCkgPT4ge1xuICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9uc0xvYWRpbmcuc2V0KGZhbHNlKTtcbiAgICAgICAgICBpZiAoc2hvd0Vycm9yVG9hc3QpIHtcbiAgICAgICAgICAgIHRoaXMudG9hc3RTZXJ2aWNlLndhcm5pbmcoXG4gICAgICAgICAgICAgICdOb3RpZmljYXRpb25zIGluZGlzcG9uaWJsZXMnLFxuICAgICAgICAgICAgICBcIkxlIGNlbnRyZSBkZSBub3RpZmljYXRpb25zIG4nYSBwYXMgcHUgZXRyZSBjaGFyZ2UuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG1hcmtOb3RpZmljYXRpb25Bc1JlYWQobm90aWZpY2F0aW9uSWQ6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5zaG93Tm90aWZpY2F0aW9uQ2VudGVyKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm5vdGlmaWNhdGlvblNlcnZpY2VcbiAgICAgIC5tYXJrQXNSZWFkKG5vdGlmaWNhdGlvbklkKVxuICAgICAgLnBpcGUodGFrZVVudGlsRGVzdHJveWVkKHRoaXMuZGVzdHJveVJlZikpXG4gICAgICAuc3Vic2NyaWJlKHtcbiAgICAgICAgbmV4dDogKG92ZXJ2aWV3KSA9PiB7XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25PdmVydmlldy5zZXQob3ZlcnZpZXcpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKCkgPT4ge1xuICAgICAgICAgIHRoaXMudG9hc3RTZXJ2aWNlLndhcm5pbmcoJ0FjdGlvbiBpbXBvc3NpYmxlJywgXCJMYSBub3RpZmljYXRpb24gbidhIHBhcyBwdSBldHJlIG1pc2UgYSBqb3VyLlwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBtYXJrQWxsTm90aWZpY2F0aW9uc0FzUmVhZCgpIHtcbiAgICBpZiAoIXRoaXMuc2hvd05vdGlmaWNhdGlvbkNlbnRlcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ub3RpZmljYXRpb25TZXJ2aWNlXG4gICAgICAubWFya0FsbEFzUmVhZCgpXG4gICAgICAucGlwZSh0YWtlVW50aWxEZXN0cm95ZWQodGhpcy5kZXN0cm95UmVmKSlcbiAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICBuZXh0OiAob3ZlcnZpZXcpID0+IHtcbiAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbk92ZXJ2aWV3LnNldChvdmVydmlldyk7XG4gICAgICAgICAgdGhpcy50b2FzdFNlcnZpY2Uuc3VjY2VzcygnTm90aWZpY2F0aW9ucyBsdWVzJywgJ1RvdXRlcyBsZXMgbm90aWZpY2F0aW9ucyB2aXNpYmxlcyBvbnQgZXRlIG1hcnF1ZWVzIGNvbW1lIGx1ZXMuJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy50b2FzdFNlcnZpY2Uud2FybmluZygnQWN0aW9uIGltcG9zc2libGUnLCBcIkxlcyBub3RpZmljYXRpb25zIG4nb250IHBhcyBwdSBldHJlIG1pc2VzIGEgam91ci5cIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgaXNSb3V0ZUFjdGl2ZShwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjdXJyZW50VXJsID0gdGhpcy5jdXJyZW50VXJsKCk7XG4gICAgcmV0dXJuIGN1cnJlbnRVcmwgPT09IHBhdGggfHwgY3VycmVudFVybC5zdGFydHNXaXRoKGAke3BhdGh9L2ApO1xuICB9XG5cbiAgaXNOYXZJdGVtQWN0aXZlKGl0ZW06IFNoZWxsTmF2SXRlbSkge1xuICAgIHJldHVybiB0aGlzLmlzUm91dGVBY3RpdmUoaXRlbS5wYXRoKTtcbiAgfVxuXG4gIGlzTmF2R3JvdXBBY3RpdmUoaXRlbTogU2hlbGxOYXZJdGVtKSB7XG4gICAgaWYgKGl0ZW0uY2hpbGRyZW4/LnNvbWUoKGNoaWxkKSA9PiB0aGlzLmlzUm91dGVBY3RpdmUoY2hpbGQucGF0aCkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pc05hdkl0ZW1BY3RpdmUoaXRlbSk7XG4gIH1cblxuICBpc05hdkdyb3VwRXhwYW5kZWQoaXRlbTogU2hlbGxOYXZJdGVtKSB7XG4gICAgaWYgKCFpdGVtLmNvbGxhcHNpYmxlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5leHBhbmRlZE5hdkdyb3VwcygpW2l0ZW0ucGF0aF0gPT09IHRydWU7XG4gIH1cblxuICB0b2dnbGVOYXZHcm91cChpdGVtOiBTaGVsbE5hdkl0ZW0pIHtcbiAgICBpZiAoIWl0ZW0uY29sbGFwc2libGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmV4cGFuZGVkTmF2R3JvdXBzLnVwZGF0ZSgoZ3JvdXBzKSA9PiAoe1xuICAgICAgLi4uZ3JvdXBzLFxuICAgICAgW2l0ZW0ucGF0aF06ICFncm91cHNbaXRlbS5wYXRoXVxuICAgIH0pKTtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cInNoZWxsLWxheW91dFwiPlxuICA8YXNpZGUgY2xhc3M9XCJzaGVsbC1zaWRlYmFyXCI+XG4gICAgPGRpdiBjbGFzcz1cInNpZGViYXItYnJhbmRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJsb2dvLWNhcmRcIj5cbiAgICAgICAgPGltZyBzcmM9XCIvbG9nby1lc3ByaXQtYXJpYW5hLmpwZ1wiIGFsdD1cIkVTUFJJVFwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJicmFuZC1jb3B5XCI+XG4gICAgICAgIDxzdHJvbmc+UGxhdGVmb3JtZSBhY2FkZW1pcXVlPC9zdHJvbmc+XG4gICAgICAgIDxzcGFuPlN1aXZpIGFjYWRlbWlxdWUgRVNQUklUPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8bmF2IGNsYXNzPVwic2hlbGwtbmF2XCI+XG4gICAgICBAZm9yIChpdGVtIG9mIG5hdkl0ZW1zKCk7IHRyYWNrIGl0ZW0ucGF0aCkge1xuICAgICAgICBAaWYgKGl0ZW0uY2hpbGRyZW4/Lmxlbmd0aCkge1xuICAgICAgICAgIDxkaXYgY2xhc3M9XCJuYXYtZ3JvdXBcIiBbY2xhc3MuYWN0aXZlLWdyb3VwXT1cImlzTmF2R3JvdXBBY3RpdmUoaXRlbSlcIj5cbiAgICAgICAgICAgIEBpZiAoaXRlbS5jb2xsYXBzaWJsZSkge1xuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJuYXYtbGluayBuYXYtZ3JvdXAtbGluayBuYXYtZ3JvdXAtdG9nZ2xlXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBbY2xhc3MuYWN0aXZlLWxpbmtdPVwiaXNOYXZHcm91cEFjdGl2ZShpdGVtKVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJpc05hdkdyb3VwRXhwYW5kZWQoaXRlbSlcIlxuICAgICAgICAgICAgICAgIChjbGljayk9XCJ0b2dnbGVOYXZHcm91cChpdGVtKVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5hdi1pY29uXCI+e3sgaXRlbS5pY29uIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LWNvcHlcIj5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e3sgaXRlbS5sYWJlbCB9fTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgQGlmIChpdGVtLmhpbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgPHNtYWxsPnt7IGl0ZW0uaGludCB9fTwvc21hbGw+XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LWdyb3VwLWNoZXZyb25cIiBbY2xhc3MuZXhwYW5kZWRdPVwiaXNOYXZHcm91cEV4cGFuZGVkKGl0ZW0pXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIH0gQGVsc2Uge1xuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3M9XCJuYXYtbGluayBuYXYtZ3JvdXAtbGluayBuYXYtZ3JvdXAtbGFiZWxcIlxuICAgICAgICAgICAgICAgIFtjbGFzcy5hY3RpdmUtbGlua109XCJpc05hdkdyb3VwQWN0aXZlKGl0ZW0pXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LWljb25cIj57eyBpdGVtLmljb24gfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtY29weVwiPlxuICAgICAgICAgICAgICAgICAgPHN0cm9uZz57eyBpdGVtLmxhYmVsIH19PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICBAaWYgKGl0ZW0uaGludCkge1xuICAgICAgICAgICAgICAgICAgICA8c21hbGw+e3sgaXRlbS5oaW50IH19PC9zbWFsbD5cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmF2LXN1Ym1lbnVcIiBbY2xhc3MubmF2LXN1Ym1lbnUtY29sbGFwc2VkXT1cIiFpc05hdkdyb3VwRXhwYW5kZWQoaXRlbSlcIj5cbiAgICAgICAgICAgICAgQGZvciAoY2hpbGQgb2YgaXRlbS5jaGlsZHJlbjsgdHJhY2sgY2hpbGQucGF0aCkge1xuICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cIm5hdi1zdWJsaW5rXCJcbiAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rXT1cImNoaWxkLnBhdGhcIlxuICAgICAgICAgICAgICAgICAgcm91dGVyTGlua0FjdGl2ZT1cImFjdGl2ZS1zdWJsaW5rXCJcbiAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc109XCJ7IGV4YWN0OiB0cnVlIH1cIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LXN1YmxpbmstZG90XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtc3VibGluay1jb3B5XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+e3sgY2hpbGQubGFiZWwgfX08L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgPHNtYWxsPnt7IGNoaWxkLmhpbnQgfX08L3NtYWxsPlxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIH0gQGVsc2Uge1xuICAgICAgICAgIDxhXG4gICAgICAgICAgICBjbGFzcz1cIm5hdi1saW5rXCJcbiAgICAgICAgICAgIFtyb3V0ZXJMaW5rXT1cIml0ZW0ucGF0aFwiXG4gICAgICAgICAgICByb3V0ZXJMaW5rQWN0aXZlPVwiYWN0aXZlLWxpbmtcIlxuICAgICAgICAgICAgW3JvdXRlckxpbmtBY3RpdmVPcHRpb25zXT1cInsgZXhhY3Q6IHRydWUgfVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtaWNvblwiPnt7IGl0ZW0uaWNvbiB9fTwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LWNvcHlcIj5cbiAgICAgICAgICAgICAgPHN0cm9uZz57eyBpdGVtLmxhYmVsIH19PC9zdHJvbmc+XG4gICAgICAgICAgICAgIEBpZiAoaXRlbS5oaW50KSB7XG4gICAgICAgICAgICAgICAgPHNtYWxsPnt7IGl0ZW0uaGludCB9fTwvc21hbGw+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2E+XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICA8L25hdj5cblxuICAgIEBpZiAoc2hvd05vdGlmaWNhdGlvbkNlbnRlcigpKSB7XG4gICAgICA8c2VjdGlvbiBjbGFzcz1cInNpZGViYXItY2VudGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjZW50ZXItaGVhZGVyXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwiZXllYnJvd1wiPkNlbnRyZTwvcD5cbiAgICAgICAgICAgIDxzdHJvbmc+Tm90aWZpY2F0aW9uczwvc3Ryb25nPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIEBpZiAodW5yZWFkTm90aWZpY2F0aW9uc0NvdW50KCkgPiAwKSB7XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5vdGlmaWNhdGlvbi1iYWRnZVwiPnt7IHVucmVhZE5vdGlmaWNhdGlvbnNDb3VudCgpIH19PC9zcGFuPlxuICAgICAgICAgIH1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgQGlmIChub3RpZmljYXRpb25zTG9hZGluZygpKSB7XG4gICAgICAgICAgPHAgY2xhc3M9XCJzaWRlYmFyLWVtcHR5XCI+Q2hhcmdlbWVudC4uLjwvcD5cbiAgICAgICAgfSBAZWxzZSBpZiAocmVjZW50Tm90aWZpY2F0aW9ucygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIDxwIGNsYXNzPVwic2lkZWJhci1lbXB0eVwiPkF1Y3VuZSBub3RpZmljYXRpb24gcmVjZW50ZS48L3A+XG4gICAgICAgIH0gQGVsc2Uge1xuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtaW5pLW5vdGlmaWNhdGlvbi1saXN0XCI+XG4gICAgICAgICAgICBAZm9yIChub3RpZmljYXRpb24gb2YgcmVjZW50Tm90aWZpY2F0aW9ucygpOyB0cmFjayBub3RpZmljYXRpb24uaWQpIHtcbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1pbmktbm90aWZpY2F0aW9uXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJtYXJrTm90aWZpY2F0aW9uQXNSZWFkKG5vdGlmaWNhdGlvbi5pZClcIj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPnt7IG5vdGlmaWNhdGlvbi50aXRsZSB9fTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgIDxzbWFsbD57eyBub3RpZmljYXRpb24uY3JlYXRlZEF0IHwgZGF0ZTogJ2RkL01NIEhIOm1tJyB9fTwvc21hbGw+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICB9XG5cbiAgICAgICAgQGlmICh1bnJlYWROb3RpZmljYXRpb25zQ291bnQoKSA+IDApIHtcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic2lkZWJhci1naG9zdC1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cIm1hcmtBbGxOb3RpZmljYXRpb25zQXNSZWFkKClcIj5Ub3V0IGxpcmU8L2J1dHRvbj5cbiAgICAgICAgfVxuICAgICAgPC9zZWN0aW9uPlxuICAgIH1cblxuICAgIDxkaXYgY2xhc3M9XCJzaGVsbC11c2VyLWNhcmRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ1c2VyLWF2YXRhclwiPnt7IHVzZXJJbml0aWFscygpIH19PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwidXNlci1jb3B5XCI+XG4gICAgICAgIDxzdHJvbmc+e3sgdXNlcigpPy5maXJzdE5hbWUgfX0ge3sgdXNlcigpPy5sYXN0TmFtZSB9fTwvc3Ryb25nPlxuICAgICAgICA8c3Bhbj57eyByb2xlTGFiZWwodXNlcigpPy5yb2xlKSB9fTwvc3Bhbj5cbiAgICAgICAgQGlmICh1c2VyKCk/LmRlcGFydG1lbnROYW1lKSB7XG4gICAgICAgICAgPHNtYWxsPnt7IHVzZXIoKT8uZGVwYXJ0bWVudE5hbWUgfX08L3NtYWxsPlxuICAgICAgICB9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJzaWRlYmFyLWdob3N0LWJ1dHRvbiBsb2dvdXQtYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJsb2dvdXQoKVwiPkRlY29ubmV4aW9uPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvYXNpZGU+XG5cbiAgPHNlY3Rpb24gY2xhc3M9XCJzaGVsbC1tYWluXCI+XG4gICAgPGhlYWRlciBjbGFzcz1cInNoZWxsLWhlYWRlclwiPlxuICAgICAgPGRpdiBjbGFzcz1cImhlYWRlci1icmFuZFwiPlxuICAgICAgICA8aW1nIHNyYz1cIi9sb2dvLWVzcHJpdC1hcmlhbmEuanBnXCIgYWx0PVwiRVNQUklUXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRlci1jb3B5XCI+XG4gICAgICAgICAgPHN0cm9uZz5IT05PUklTIFVOSVRFRCBVTklWRVJTSVRJRVM8L3N0cm9uZz5cbiAgICAgICAgICA8c3Bhbj5QbGF0ZWZvcm1lIGFjYWRlbWlxdWUgRVNQUklUPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyLXByZXNlbmNlXCI+XG4gICAgICAgIDxhcnRpY2xlIGNsYXNzPVwicHJlc2VuY2UtY2FyZFwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJlc2VuY2UtZG90XCI+PC9zcGFuPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcmVzZW5jZS1jb3B5XCI+XG4gICAgICAgICAgICA8c21hbGw+e3sgd29ya3NwYWNlR3JlZXRpbmcoKSB9fTwvc21hbGw+XG4gICAgICAgICAgICA8c3Ryb25nPnt7IGFjdGl2ZVdvcmtzcGFjZUxhYmVsKCkgfX08L3N0cm9uZz5cbiAgICAgICAgICAgIDxzcGFuPnt7IGFjdGl2ZVdvcmtzcGFjZUhpbnQoKSB9fTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9hcnRpY2xlPlxuXG4gICAgICAgIDxhcnRpY2xlIGNsYXNzPVwiY2xvY2stY2FyZFwiPlxuICAgICAgICAgIDxzbWFsbD57eyBjdXJyZW50RGF0ZUxhYmVsKCkgfX08L3NtYWxsPlxuICAgICAgICAgIDxzdHJvbmc+e3sgY3VycmVudFRpbWVMYWJlbCgpIH19PC9zdHJvbmc+XG4gICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyLW1ldGFcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJoZWFkZXItcm9sZVwiPnt7IHJvbGVMYWJlbCh1c2VyKCk/LnJvbGUpIH19PC9zcGFuPlxuICAgICAgICA8c3Ryb25nPnt7IHVzZXIoKT8uZmlyc3ROYW1lIH19IHt7IHVzZXIoKT8ubGFzdE5hbWUgfX08L3N0cm9uZz5cbiAgICAgIDwvZGl2PlxuICAgIDwvaGVhZGVyPlxuXG4gICAgPGRpdiBjbGFzcz1cInNoZWxsLWNvbnRlbnRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LXN0YWdlXCI+XG4gICAgICAgIDxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L3NlY3Rpb24+XG48L2Rpdj5cbjxhcHAtdG9hc3Qtb3V0bGV0PjwvYXBwLXRvYXN0LW91dGxldD5cbjxhcHAtYXNzaXN0YW50LXdpZGdldD48L2FwcC1hc3Npc3RhbnQtd2lkZ2V0PlxuXHJcbiIsImltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbk92ZXJ2aWV3UmVzcG9uc2UgfSBmcm9tICcuLi9tb2RlbHMvbm90aWZpY2F0aW9uLm1vZGVscyc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uU2VydmljZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgaHR0cCA9IGluamVjdChIdHRwQ2xpZW50KTtcblxuICBnZXRPdmVydmlldygpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxOb3RpZmljYXRpb25PdmVydmlld1Jlc3BvbnNlPignL2FwaS9ub3RpZmljYXRpb25zJyk7XG4gIH1cblxuICBtYXJrQXNSZWFkKGlkOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8Tm90aWZpY2F0aW9uT3ZlcnZpZXdSZXNwb25zZT4oYC9hcGkvbm90aWZpY2F0aW9ucy8ke2lkfS9yZWFkYCwge30pO1xuICB9XG5cbiAgbWFya0FsbEFzUmVhZCgpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8Tm90aWZpY2F0aW9uT3ZlcnZpZXdSZXNwb25zZT4oJy9hcGkvbm90aWZpY2F0aW9ucy9yZWFkLWFsbCcsIHt9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRGVzdHJveVJlZiwgRWxlbWVudFJlZiwgVmlld0NoaWxkLCBjb21wdXRlZCwgaW5qZWN0LCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHRha2VVbnRpbERlc3Ryb3llZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvcnhqcy1pbnRlcm9wJztcbmltcG9ydCB7IEFzc2lzdGFudENoYXRSZXNwb25zZSB9IGZyb20gJy4uL2NvcmUvbW9kZWxzL2Fzc2lzdGFudC5tb2RlbHMnO1xuaW1wb3J0IHsgUm9sZVR5cGUgfSBmcm9tICcuLi9jb3JlL21vZGVscy9zaGFyZWQubW9kZWxzJztcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vY29yZS9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UnO1xuaW1wb3J0IHsgQXNzaXN0YW50U2VydmljZSB9IGZyb20gJy4uL2NvcmUvc2VydmljZXMvYXNzaXN0YW50LnNlcnZpY2UnO1xuaW1wb3J0IHsgVWlUb2FzdFNlcnZpY2UgfSBmcm9tICcuLi9jb3JlL3NlcnZpY2VzL3VpLXRvYXN0LnNlcnZpY2UnO1xuaW1wb3J0IHsgZXh0cmFjdEVycm9yTWVzc2FnZSB9IGZyb20gJy4uL2NvcmUvdXRpbHMvaHR0cC1lcnJvci51dGlsJztcblxudHlwZSBBc3Npc3RhbnRSb2xlID0gJ0VOU0VJR05BTlQnIHwgJ0NIRUZfREVQQVJURU1FTlQnIHwgJ0FETUlOSVNUUkFUSU9OJyB8ICdTVVBFUl9BRE1JTic7XG5cbmludGVyZmFjZSBRdWlja0NoaXAge1xuICBpY29uOiBzdHJpbmc7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHByb21wdDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQXNzaXN0YW50Q2hhdE1lc3NhZ2Uge1xuICBpZDogbnVtYmVyO1xuICBzZW5kZXI6ICd1c2VyJyB8ICdhc3Npc3RhbnQnO1xuICBxdWVzdGlvbj86IHN0cmluZztcbiAgcmVzcG9uc2U/OiBBc3Npc3RhbnRDaGF0UmVzcG9uc2U7XG4gIHRleHQ/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBQYXJzZWRTZWN0aW9uIHtcbiAga2V5OiBzdHJpbmc7XG4gIGtpbmQ6ICdzdW1tYXJ5JyB8ICdhbmFseXNpcycgfCAncmVjb21tZW5kYXRpb24nIHwgJ3Jpc2snO1xuICBsYWJlbDogc3RyaW5nO1xuICBsaW5lczogc3RyaW5nW107XG4gIGxpc3Q6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBTdGF0Q2FyZCB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHZhbHVlOiBudW1iZXI7XG4gIHRyZW5kOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBQcm9ncmVzc01ldHJpYyB7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHZhbHVlOiBudW1iZXI7XG4gIHRvbmU6ICd0ZWFjaGluZycgfCAncmVzZWFyY2gnIHwgJ3N1cGVydmlzaW9uJztcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLWFzc2lzdGFudC13aWRnZXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vYXNzaXN0YW50LXdpZGdldC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsOiAnLi9hc3Npc3RhbnQtd2lkZ2V0LmNvbXBvbmVudC5jc3MnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBBc3Npc3RhbnRXaWRnZXRDb21wb25lbnQge1xuICBwcml2YXRlIHJlYWRvbmx5IGRlc3Ryb3lSZWYgPSBpbmplY3QoRGVzdHJveVJlZik7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXV0aFNlcnZpY2UgPSBpbmplY3QoQXV0aFNlcnZpY2UpO1xuICBwcml2YXRlIHJlYWRvbmx5IGFzc2lzdGFudFNlcnZpY2UgPSBpbmplY3QoQXNzaXN0YW50U2VydmljZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgdG9hc3RTZXJ2aWNlID0gaW5qZWN0KFVpVG9hc3RTZXJ2aWNlKTtcblxuICBAVmlld0NoaWxkKCdjb21wb3NlckVsJykgcHJpdmF0ZSBjb21wb3NlckVsPzogRWxlbWVudFJlZjxIVE1MVGV4dEFyZWFFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgnbWVzc2FnZXNFbCcpIHByaXZhdGUgbWVzc2FnZXNFbD86IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuXG4gIHJlYWRvbmx5IHJvbGUgPSB0aGlzLmF1dGhTZXJ2aWNlLnJvbGU7XG4gIHJlYWRvbmx5IGlzT3BlbiA9IHNpZ25hbChmYWxzZSk7XG4gIHJlYWRvbmx5IHBlbmRpbmcgPSBzaWduYWwoZmFsc2UpO1xuICByZWFkb25seSBkcmFmdFF1ZXN0aW9uID0gc2lnbmFsKCcnKTtcbiAgcmVhZG9ubHkgcGVyaW9kTGFiZWwgPSBzaWduYWwodGhpcy5kZWZhdWx0UGVyaW9kTGFiZWwoKSk7XG4gIHJlYWRvbmx5IGFjY291bnRSb2xlID0gY29tcHV0ZWQ8QXNzaXN0YW50Um9sZT4oKCkgPT4gdGhpcy5yZXNvbHZlQWxsb3dlZFJvbGUodGhpcy5yb2xlKCkpKTtcbiAgcmVhZG9ubHkgbWVzc2FnZXMgPSBzaWduYWw8QXNzaXN0YW50Q2hhdE1lc3NhZ2VbXT4oW1xuICAgIHtcbiAgICAgIGlkOiBEYXRlLm5vdygpLFxuICAgICAgc2VuZGVyOiAnYXNzaXN0YW50JyxcbiAgICAgIHRleHQ6XG4gICAgICAgIFwiUsOpc3Vtw6k6IEFzc2lzdGFudCBQZXJmSUEgaW5pdGlhbGlzw6kuXFxuQW5hbHlzZTogSmUgc3VpcyBwcsOqdCDDoCBhbmFseXNlciB2b3MgcGVyZm9ybWFuY2VzIGFjYWTDqW1pcXVlcyBlbiB0ZW1wcyByw6llbC5cXG5SZWNvbW1hbmRhdGlvbnM6IFBvc2V6IHVuZSBxdWVzdGlvbiBwcsOpY2lzZSBwb3VyIG9idGVuaXIgdW5lIHLDqXBvbnNlIGFjdGlvbm5hYmxlLlwiXG4gICAgfVxuICBdKTtcbiAgcmVhZG9ubHkgY2FuU2VuZCA9IGNvbXB1dGVkKCgpID0+IHRoaXMuZHJhZnRRdWVzdGlvbigpLnRyaW0oKS5sZW5ndGggPiAwICYmICF0aGlzLnBlbmRpbmcoKSk7XG4gIHJlYWRvbmx5IGFjdGl2ZVF1aWNrQ2hpcHMgPSBjb21wdXRlZDxRdWlja0NoaXBbXT4oKCkgPT4ge1xuICAgIGNvbnN0IG1hcDogUmVjb3JkPEFzc2lzdGFudFJvbGUsIFF1aWNrQ2hpcFtdPiA9IHtcbiAgICAgIEVOU0VJR05BTlQ6IFtcbiAgICAgICAgeyBpY29uOiAn4pqhJywgbGFiZWw6ICdEw6l0YWlsIGR1IHNjb3JlJywgcHJvbXB0OiAnRXhwbGlxdWUgcG91cnF1b2kgbW9uIHNjb3JlIGVzdCBmYWlibGUuJyB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWNvbjogJ/Cfp6AnLFxuICAgICAgICAgIGxhYmVsOiAnU2ltdWxhdGlvbiB3aGF0LWlmJyxcbiAgICAgICAgICBwcm9tcHQ6IFwiUXVlIHNlIHBhc3NlLXQtaWwgc2kgaidham91dGUgMSBwdWJsaWNhdGlvbiBldCAxIGVuY2FkcmVtZW50ID9cIlxuICAgICAgICB9LFxuICAgICAgICB7IGljb246ICfwn5OLJywgbGFiZWw6IFwiUGxhbiBkJ2FjdGlvblwiLCBwcm9tcHQ6ICdEb25uZS1tb2kgdW4gcGxhbiBkZSBwcm9tb3Rpb24gc3VyIDMgbW9pcy4nIH0sXG4gICAgICAgIHsgaWNvbjogJ+KaoO+4jycsIGxhYmVsOiAnQW5vbWFsaWVzJywgcHJvbXB0OiBcIlkgYS10LWlsIGRlcyBhbm9tYWxpZXMgZGFucyBtZXMgYWN0aXZpdMOpcyA/XCIgfVxuICAgICAgXSxcbiAgICAgIENIRUZfREVQQVJURU1FTlQ6IFtcbiAgICAgICAgeyBpY29uOiAn8J+TiicsIGxhYmVsOiAnQ29tcGFyZXIgw6lxdWlwZScsIHByb21wdDogJ1F1ZWxzIGVuc2VpZ25hbnRzIHNvbnQgZW4gZGlmZmljdWx0w6kgZGFucyBtb24gZMOpcGFydGVtZW50ID8nIH0sXG4gICAgICAgIHsgaWNvbjogJ/Cfp6onLCBsYWJlbDogJ1NpbXVsYXRpb24gY2hhcmdlJywgcHJvbXB0OiBcIlF1ZWwgaW1wYWN0IHNpIG9uIGF1Z21lbnRlIGxhIHJlY2hlcmNoZSBkZSBsJ8OpcXVpcGUgZGUgMjAlID9cIiB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWNvbjogJ/Cfl4LvuI8nLFxuICAgICAgICAgIGxhYmVsOiAnQWN0aW9ucyBjb25jcsOodGVzJyxcbiAgICAgICAgICBwcm9tcHQ6IFwiRG9ubmUtbW9pIGRlcyByZWNvbW1hbmRhdGlvbnMgY29uY3LDqHRlcyBkZSByw6lwYXJ0aXRpb24gcG91ciDDqXF1aWxpYnJlciBsJ8OpcXVpcGUuXCJcbiAgICAgICAgfSxcbiAgICAgICAgeyBpY29uOiAn4pqg77iPJywgbGFiZWw6ICdSaXNxdWVzJywgcHJvbXB0OiBcIlF1ZWxzIHNvbnQgbGVzIHJpc3F1ZXMgZGUgc291cy1wZXJmb3JtYW5jZSBkZSBsJ8OpcXVpcGUgP1wiIH1cbiAgICAgIF0sXG4gICAgICBBRE1JTklTVFJBVElPTjogW1xuICAgICAgICB7IGljb246ICfwn5uh77iPJywgbGFiZWw6ICdWw6lyaWZpZXIgYW5vbWFsaWVzJywgcHJvbXB0OiBcIlkgYS10LWlsIGRlcyBhbm9tYWxpZXMgZGFucyBsZXMgYWN0aXZpdMOpcyBzb3VtaXNlcyA/XCIgfSxcbiAgICAgICAgeyBpY29uOiAn4pyFJywgbGFiZWw6ICdBaWRlIHZhbGlkYXRpb24nLCBwcm9tcHQ6ICdRdWVsbGUgZMOpY2lzaW9uIHJlY29tbWFuZGVzLXR1IHBvdXIgdmFsaWRlciBjZXMgZG9zc2llcnMgPycgfSxcbiAgICAgICAgeyBpY29uOiAn8J+TgScsIGxhYmVsOiAnQ29udHLDtGxlIHdvcmtmbG93JywgcHJvbXB0OiBcIlF1ZWxzIGRvc3NpZXJzIGRvaXZlbnQgw6p0cmUgdHJhaXTDqXMgZW4gcHJpb3JpdMOpIGF1am91cmQnaHVpID9cIiB9LFxuICAgICAgICB7IGljb246ICfimqDvuI8nLCBsYWJlbDogJ0NhcyBzdXNwZWN0cycsIHByb21wdDogJ0TDqXRlY3RlIGxlcyBjYXMgc3VzcGVjdHMgZGUgc3VyY2hhcmdlIG91IGRvdWJsb24uJyB9XG4gICAgICBdLFxuICAgICAgU1VQRVJfQURNSU46IFtcbiAgICAgICAgeyBpY29uOiAn8J+MjScsIGxhYmVsOiAnw4l0YXQgZ2xvYmFsJywgcHJvbXB0OiBcIlF1ZWwgZXN0IGwnw6l0YXQgZ2xvYmFsIGRlIGxhIGZhY3VsdMOpID9cIiB9LFxuICAgICAgICB7IGljb246ICfwn5SuJywgbGFiZWw6ICdQcm9qZWN0aW9uIDIwJScsIHByb21wdDogXCJRdWUgc2UgcGFzc2UtdC1pbCBzaSBvbiBhdWdtZW50ZSBsYSByZWNoZXJjaGUgZGUgMjAlID9cIiB9LFxuICAgICAgICB7IGljb246ICfwn5OMJywgbGFiZWw6ICdQcmlvcml0w6lzJywgcHJvbXB0OiAnRG9ubmUtbW9pIGxlcyBwcmlvcml0w6lzIHN0cmF0w6lnaXF1ZXMgaW1tw6lkaWF0ZXMuJyB9LFxuICAgICAgICB7IGljb246ICfimqDvuI8nLCBsYWJlbDogJ0FsZXJ0ZXMgY3JpdGlxdWVzJywgcHJvbXB0OiAnUXVlbHMgc29udCBsZXMgcG9pbnRzIGZhaWJsZXMgY3JpdGlxdWVzIGF1IG5pdmVhdSBmYWN1bHTDqSA/JyB9XG4gICAgICBdXG4gICAgfTtcbiAgICByZXR1cm4gbWFwW3RoaXMuYWNjb3VudFJvbGUoKV07XG4gIH0pO1xuXG4gIHRvZ2dsZSgpIHtcbiAgICB0aGlzLmlzT3Blbi51cGRhdGUoKHZhbHVlKSA9PiAhdmFsdWUpO1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2Nyb2xsVG9Cb3R0b20oKSwgMCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlUGVyaW9kTGFiZWwodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMucGVyaW9kTGFiZWwuc2V0KHZhbHVlKTtcbiAgfVxuXG4gIG9uQ29tcG9zZXJJbnB1dChldmVudDogRXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICB0aGlzLmRyYWZ0UXVlc3Rpb24uc2V0KHRhcmdldC52YWx1ZSk7XG4gICAgdGhpcy5hdXRvUmVzaXplKHRhcmdldCk7XG4gIH1cblxuICBvbkNvbXBvc2VyS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicgJiYgIWV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5zZW5kTWVzc2FnZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFwcGx5UXVpY2tDaGlwKGNoaXA6IFF1aWNrQ2hpcCkge1xuICAgIHRoaXMuZHJhZnRRdWVzdGlvbi5zZXQoY2hpcC5wcm9tcHQpO1xuICAgIGNvbnN0IGNvbXBvc2VyID0gdGhpcy5jb21wb3NlckVsPy5uYXRpdmVFbGVtZW50O1xuICAgIGlmIChjb21wb3Nlcikge1xuICAgICAgY29tcG9zZXIudmFsdWUgPSBjaGlwLnByb21wdDtcbiAgICAgIHRoaXMuYXV0b1Jlc2l6ZShjb21wb3Nlcik7XG4gICAgfVxuICAgIHRoaXMuc2VuZE1lc3NhZ2UoKTtcbiAgfVxuXG4gIHNlbmRNZXNzYWdlKCkge1xuICAgIGNvbnN0IHF1ZXN0aW9uID0gdGhpcy5kcmFmdFF1ZXN0aW9uKCkudHJpbSgpO1xuICAgIGlmICghcXVlc3Rpb24gfHwgdGhpcy5wZW5kaW5nKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1lc3NhZ2VzLnVwZGF0ZSgoaXRlbXMpID0+IFtcbiAgICAgIC4uLml0ZW1zLFxuICAgICAge1xuICAgICAgICBpZDogRGF0ZS5ub3coKSxcbiAgICAgICAgc2VuZGVyOiAndXNlcicsXG4gICAgICAgIHF1ZXN0aW9uXG4gICAgICB9XG4gICAgXSk7XG4gICAgdGhpcy5kcmFmdFF1ZXN0aW9uLnNldCgnJyk7XG4gICAgdGhpcy5wZW5kaW5nLnNldCh0cnVlKTtcbiAgICB0aGlzLnJlc2V0Q29tcG9zZXIoKTtcbiAgICB0aGlzLnNjcm9sbFRvQm90dG9tU29vbigpO1xuXG4gICAgdGhpcy5hc3Npc3RhbnRTZXJ2aWNlXG4gICAgICAuY2hhdCh7XG4gICAgICAgIHF1ZXN0aW9uLFxuICAgICAgICBwZXJpb2RMYWJlbDogdGhpcy5wZXJpb2RMYWJlbCgpLnRyaW0oKSB8fCBudWxsXG4gICAgICB9KVxuICAgICAgLnBpcGUodGFrZVVudGlsRGVzdHJveWVkKHRoaXMuZGVzdHJveVJlZikpXG4gICAgICAuc3Vic2NyaWJlKHtcbiAgICAgICAgbmV4dDogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wZW5kaW5nLnNldChmYWxzZSk7XG4gICAgICAgICAgdGhpcy5tZXNzYWdlcy51cGRhdGUoKGl0ZW1zKSA9PiBbXG4gICAgICAgICAgICAuLi5pdGVtcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6IERhdGUubm93KCkgKyAxLFxuICAgICAgICAgICAgICBzZW5kZXI6ICdhc3Npc3RhbnQnLFxuICAgICAgICAgICAgICByZXNwb25zZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0pO1xuICAgICAgICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b21Tb29uKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiAoZXJyb3IpID0+IHtcbiAgICAgICAgICB0aGlzLnBlbmRpbmcuc2V0KGZhbHNlKTtcbiAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZXh0cmFjdEVycm9yTWVzc2FnZShlcnJvciwgXCJMJ2Fzc2lzdGFudCBuJ2EgcGFzIHB1IHLDqXBvbmRyZS5cIik7XG4gICAgICAgICAgdGhpcy50b2FzdFNlcnZpY2Uud2FybmluZygnQXNzaXN0YW50IGluZGlzcG9uaWJsZScsIG1lc3NhZ2UpO1xuICAgICAgICAgIHRoaXMubWVzc2FnZXMudXBkYXRlKChpdGVtcykgPT4gW1xuICAgICAgICAgICAgLi4uaXRlbXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiBEYXRlLm5vdygpICsgMixcbiAgICAgICAgICAgICAgc2VuZGVyOiAnYXNzaXN0YW50JyxcbiAgICAgICAgICAgICAgdGV4dDogYFLDqXN1bcOpOiBBcHBlbCBBUEkgaW5kaXNwb25pYmxlLlxcbkFuYWx5c2U6ICR7bWVzc2FnZX1cXG5SZWNvbW1hbmRhdGlvbnM6IFbDqXJpZmlleiBsYSBkaXNwb25pYmlsaXTDqSBkdSBiYWNrZW5kIHB1aXMgcsOpZXNzYXllei5gXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSk7XG4gICAgICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbVNvb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBydW5Ub3BiYXJBY3Rpb24oYWN0aW9uOiAnaGlzdG9yeScgfCAnZXhwb3J0JyB8ICdzZXR0aW5ncycpIHtcbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgY2FzZSAnaGlzdG9yeSc6XG4gICAgICAgIHRoaXMubWVzc2FnZXNFbD8ubmF0aXZlRWxlbWVudC5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgICAgICB0aGlzLnRvYXN0U2VydmljZS5pbmZvKCdIaXN0b3JpcXVlJywgXCJEw6lmaWxlbWVudCB2ZXJzIGxlIGTDqWJ1dCBkZSBsJ2hpc3RvcmlxdWUuXCIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2V4cG9ydCc6XG4gICAgICAgIHRoaXMuZXhwb3J0Q29udmVyc2F0aW9uKCk7XG4gICAgICAgIHRoaXMudG9hc3RTZXJ2aWNlLnN1Y2Nlc3MoJ0V4cG9ydCcsICdDb252ZXJzYXRpb24gZXhwb3J0w6llIGVuIGZpY2hpZXIgdGV4dGUuJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2V0dGluZ3MnOlxuICAgICAgICB0aGlzLnRvYXN0U2VydmljZS5pbmZvKCdQYXJhbcOodHJlcycsIFwiTGVzIHBhcmFtw6h0cmVzIGF2YW5jw6lzIGFycml2ZW50IGRhbnMgbGEgcHJvY2hhaW5lIGl0w6lyYXRpb24uXCIpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0cmFja0J5TWVzc2FnZUlkKF86IG51bWJlciwgbWVzc2FnZTogQXNzaXN0YW50Q2hhdE1lc3NhZ2UpIHtcbiAgICByZXR1cm4gbWVzc2FnZS5pZDtcbiAgfVxuXG4gIGdldFNlY3Rpb25zKG1lc3NhZ2U6IEFzc2lzdGFudENoYXRNZXNzYWdlKTogUGFyc2VkU2VjdGlvbltdIHtcbiAgICBpZiAobWVzc2FnZS5yZXNwb25zZSkge1xuICAgICAgY29uc3Qgc2VjdGlvbnM6IFBhcnNlZFNlY3Rpb25bXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGtleTogYCR7bWVzc2FnZS5pZH0tc3VtbWFyeWAsXG4gICAgICAgICAga2luZDogJ3N1bW1hcnknLFxuICAgICAgICAgIGxhYmVsOiAnUsOpc3Vtw6knLFxuICAgICAgICAgIGxpbmVzOiBbbWVzc2FnZS5yZXNwb25zZS5zdW1tYXJ5XSxcbiAgICAgICAgICBsaXN0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAga2V5OiBgJHttZXNzYWdlLmlkfS1hbmFseXNpc2AsXG4gICAgICAgICAga2luZDogJ2FuYWx5c2lzJyxcbiAgICAgICAgICBsYWJlbDogJ0FuYWx5c2UnLFxuICAgICAgICAgIGxpbmVzOiBbbWVzc2FnZS5yZXNwb25zZS5hbmFseXNpc10sXG4gICAgICAgICAgbGlzdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGtleTogYCR7bWVzc2FnZS5pZH0tcmVjb2AsXG4gICAgICAgICAga2luZDogJ3JlY29tbWVuZGF0aW9uJyxcbiAgICAgICAgICBsYWJlbDogJ1JlY29tbWFuZGF0aW9uJyxcbiAgICAgICAgICBsaW5lczogbWVzc2FnZS5yZXNwb25zZS5yZWNvbW1lbmRhdGlvbnMsXG4gICAgICAgICAgbGlzdDogdHJ1ZVxuICAgICAgICB9XG4gICAgICBdO1xuXG4gICAgICBpZiAobWVzc2FnZS5yZXNwb25zZS5yaXNrcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlY3Rpb25zLnB1c2goe1xuICAgICAgICAgIGtleTogYCR7bWVzc2FnZS5pZH0tcmlza2AsXG4gICAgICAgICAga2luZDogJ3Jpc2snLFxuICAgICAgICAgIGxhYmVsOiAnUmlzcXVlcycsXG4gICAgICAgICAgbGluZXM6IG1lc3NhZ2UucmVzcG9uc2Uucmlza3MsXG4gICAgICAgICAgbGlzdDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNlY3Rpb25zO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZSA9IG1lc3NhZ2UudGV4dD8udHJpbSgpID8/ICcnO1xuICAgIGlmICghc291cmNlKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgbGluZXMgPSBzb3VyY2VcbiAgICAgIC5zcGxpdCgvXFxuKy8pXG4gICAgICAubWFwKChsaW5lKSA9PiBsaW5lLnRyaW0oKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICBjb25zdCBzZWN0aW9uczogUGFyc2VkU2VjdGlvbltdID0gW107XG4gICAgbGV0IGN1cnJlbnQ6IFBhcnNlZFNlY3Rpb24gPSB7XG4gICAgICBrZXk6IGAke21lc3NhZ2UuaWR9LWRlZmF1bHRgLFxuICAgICAga2luZDogJ2FuYWx5c2lzJyxcbiAgICAgIGxhYmVsOiAnQW5hbHlzZScsXG4gICAgICBsaW5lczogW10sXG4gICAgICBsaXN0OiBmYWxzZVxuICAgIH07XG5cbiAgICBjb25zdCBwdXNoQ3VycmVudCA9ICgpID0+IHtcbiAgICAgIGlmICghY3VycmVudC5saW5lcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY3VycmVudC5saXN0ID0gY3VycmVudC5saW5lcy5ldmVyeSgobGluZSkgPT4gL15bLeKAol0vLnRlc3QobGluZSkpO1xuICAgICAgY3VycmVudC5saW5lcyA9IGN1cnJlbnQubGluZXMubWFwKChsaW5lKSA9PiBsaW5lLnJlcGxhY2UoL15bLeKAol1cXHMqLywgJycpKTtcbiAgICAgIHNlY3Rpb25zLnB1c2goeyAuLi5jdXJyZW50IH0pO1xuICAgIH07XG5cbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcbiAgICAgIGNvbnN0IGRldGVjdGVkID0gdGhpcy5kZXRlY3RTZWN0aW9uKGxpbmUpO1xuICAgICAgaWYgKGRldGVjdGVkKSB7XG4gICAgICAgIHB1c2hDdXJyZW50KCk7XG4gICAgICAgIGN1cnJlbnQgPSB7XG4gICAgICAgICAga2V5OiBgJHttZXNzYWdlLmlkfS0ke2RldGVjdGVkLmtpbmR9LSR7c2VjdGlvbnMubGVuZ3RofWAsXG4gICAgICAgICAga2luZDogZGV0ZWN0ZWQua2luZCxcbiAgICAgICAgICBsYWJlbDogZGV0ZWN0ZWQubGFiZWwsXG4gICAgICAgICAgbGluZXM6IFtsaW5lLnJlcGxhY2UoL14oXFxkK1xcLik/XFxzKihSw6lzdW3DqXxSZXN1bWV8QW5hbHlzZXxSZWNvbW1hbmRhdGlvbnM/fFJpc3F1ZXM/KVxccyo6Py9pLCAnJykudHJpbSgpXS5maWx0ZXIoQm9vbGVhbiksXG4gICAgICAgICAgbGlzdDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnQubGluZXMucHVzaChsaW5lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwdXNoQ3VycmVudCgpO1xuICAgIHJldHVybiBzZWN0aW9ucy5sZW5ndGggPyBzZWN0aW9ucyA6IFt7IC4uLmN1cnJlbnQgfV07XG4gIH1cblxuICBzZWN0aW9uQ2xhc3Moa2luZDogUGFyc2VkU2VjdGlvblsna2luZCddKSB7XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlICdzdW1tYXJ5JzpcbiAgICAgICAgcmV0dXJuICd0YWctc3VtbWFyeSc7XG4gICAgICBjYXNlICdhbmFseXNpcyc6XG4gICAgICAgIHJldHVybiAndGFnLWFuYWx5c2lzJztcbiAgICAgIGNhc2UgJ3JlY29tbWVuZGF0aW9uJzpcbiAgICAgICAgcmV0dXJuICd0YWctcmVjb21tZW5kYXRpb24nO1xuICAgICAgY2FzZSAncmlzayc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ3RhZy1yaXNrJztcbiAgICB9XG4gIH1cblxuICBnZXRTdGF0cyhtZXNzYWdlOiBBc3Npc3RhbnRDaGF0TWVzc2FnZSk6IFN0YXRDYXJkW10ge1xuICAgIGNvbnN0IHRleHQgPSB0aGlzLm1lc3NhZ2VUZXh0KG1lc3NhZ2UpO1xuICAgIGNvbnN0IGRldGVjdGVkID0gQXJyYXkuZnJvbSh0ZXh0Lm1hdGNoQWxsKC9cXGJcXGR7MSwzfSg/OlsuLF1cXGQrKT9cXGIvZykpXG4gICAgICAubWFwKChtYXRjaCkgPT4gTnVtYmVyLnBhcnNlRmxvYXQobWF0Y2hbMF0ucmVwbGFjZSgnLCcsICcuJykpKVxuICAgICAgLmZpbHRlcigodmFsdWUpID0+IE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkpO1xuXG4gICAgY29uc3QgZGVmYXVsdHM6IFJlY29yZDxBc3Npc3RhbnRSb2xlLCBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0+ID0ge1xuICAgICAgRU5TRUlHTkFOVDogWzc0LCA0OSwgNjNdLFxuICAgICAgQ0hFRl9ERVBBUlRFTUVOVDogWzcxLCA1NiwgNTldLFxuICAgICAgQURNSU5JU1RSQVRJT046IFs3NywgNjEsIDU0XSxcbiAgICAgIFNVUEVSX0FETUlOOiBbNzYsIDU4LCA1N11cbiAgICB9O1xuICAgIGNvbnN0IGZhbGxiYWNrID0gZGVmYXVsdHNbdGhpcy5hY2NvdW50Um9sZSgpXTtcblxuICAgIGNvbnN0IHBlcmYgPSB0aGlzLmNsYW1wU2NvcmUoZGV0ZWN0ZWRbMF0gPz8gZmFsbGJhY2tbMF0pO1xuICAgIGNvbnN0IHJlc2VhcmNoID0gdGhpcy5jbGFtcFNjb3JlKGRldGVjdGVkWzFdID8/IGZhbGxiYWNrWzFdKTtcbiAgICBjb25zdCByaXNrID0gdGhpcy5jbGFtcFNjb3JlKGRldGVjdGVkWzJdID8/IGZhbGxiYWNrWzJdKTtcblxuICAgIHJldHVybiBbXG4gICAgICB7IGxhYmVsOiAnUEVSRiBTQ09SRScsIHZhbHVlOiBwZXJmLCB0cmVuZDogcGVyZiA+PSA1NSA/IDMuNiA6IC00LjIgfSxcbiAgICAgIHsgbGFiZWw6ICdSRUNIRVJDSEUnLCB2YWx1ZTogcmVzZWFyY2gsIHRyZW5kOiByZXNlYXJjaCA+PSA1MCA/IDIuNCA6IC0zLjcgfSxcbiAgICAgIHsgbGFiZWw6ICdSSVNRVUUnLCB2YWx1ZTogcmlzaywgdHJlbmQ6IHJpc2sgPD0gNTUgPyAyLjEgOiAtMi45IH1cbiAgICBdO1xuICB9XG5cbiAgZ2V0UHJvZ3Jlc3Moc3RhdHM6IFN0YXRDYXJkW10pOiBQcm9ncmVzc01ldHJpY1tdIHtcbiAgICBjb25zdCBwZXJmID0gc3RhdHNbMF0/LnZhbHVlID8/IDYwO1xuICAgIGNvbnN0IHJlc2VhcmNoID0gc3RhdHNbMV0/LnZhbHVlID8/IDUwO1xuICAgIGNvbnN0IHJpc2sgPSBzdGF0c1syXT8udmFsdWUgPz8gNTA7XG4gICAgY29uc3Qgc3VwZXJ2aXNpb24gPSB0aGlzLmNsYW1wU2NvcmUoMTAwIC0gTWF0aC5hYnMoNTAgLSByaXNrKSAqIDEuNDUpO1xuICAgIHJldHVybiBbXG4gICAgICB7IGxhYmVsOiAnRW5zZWlnbmVtZW50JywgdmFsdWU6IHBlcmYsIHRvbmU6ICd0ZWFjaGluZycgfSxcbiAgICAgIHsgbGFiZWw6ICdSZWNoZXJjaGUnLCB2YWx1ZTogcmVzZWFyY2gsIHRvbmU6ICdyZXNlYXJjaCcgfSxcbiAgICAgIHsgbGFiZWw6ICdFbmNhZHJlbWVudCcsIHZhbHVlOiBzdXBlcnZpc2lvbiwgdG9uZTogJ3N1cGVydmlzaW9uJyB9XG4gICAgXTtcbiAgfVxuXG4gIHByb2dyZXNzRmlsbENsYXNzKHRvbmU6IFByb2dyZXNzTWV0cmljWyd0b25lJ10pIHtcbiAgICBzd2l0Y2ggKHRvbmUpIHtcbiAgICAgIGNhc2UgJ3RlYWNoaW5nJzpcbiAgICAgICAgcmV0dXJuICdmaWxsLXRlYWNoaW5nJztcbiAgICAgIGNhc2UgJ3Jlc2VhcmNoJzpcbiAgICAgICAgcmV0dXJuICdmaWxsLXJlc2VhcmNoJztcbiAgICAgIGNhc2UgJ3N1cGVydmlzaW9uJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnZmlsbC1zdXBlcnZpc2lvbic7XG4gICAgfVxuICB9XG5cbiAgdHJlbmRDbGFzcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHZhbHVlID49IDAgPyAndHJlbmQtdXAnIDogJ3RyZW5kLWRvd24nO1xuICB9XG5cbiAgdHJlbmRBcnJvdyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHZhbHVlID49IDAgPyAn4payJyA6ICfilrwnO1xuICB9XG5cbiAgZm9ybWF0VHJlbmQodmFsdWU6IG51bWJlcikge1xuICAgIHJldHVybiBgJHtNYXRoLmFicyh2YWx1ZSkudG9GaXhlZCgxKX0lYDtcbiAgfVxuXG4gIGZvcm1hdFZhbHVlKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdmFsdWUudG9GaXhlZCgxKTtcbiAgfVxuXG4gIGZvcm1hdExpbmUodmFsdWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmVzY2FwZUh0bWwodmFsdWUpLnJlcGxhY2UoL1xcKlxcKiguKz8pXFwqXFwqL2csICc8c3Ryb25nPiQxPC9zdHJvbmc+Jyk7XG4gIH1cblxuICBwcml2YXRlIGRldGVjdFNlY3Rpb24obGluZTogc3RyaW5nKTogeyBraW5kOiBQYXJzZWRTZWN0aW9uWydraW5kJ107IGxhYmVsOiBzdHJpbmcgfSB8IG51bGwge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBsaW5lLm5vcm1hbGl6ZSgnTkZEJykucmVwbGFjZSgvW1xcdTAzMDAtXFx1MDM2Zl0vZywgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKC9eKDFcXC4pP1xccypyZXN1bWVcXGIvLnRlc3Qobm9ybWFsaXplZCkpIHtcbiAgICAgIHJldHVybiB7IGtpbmQ6ICdzdW1tYXJ5JywgbGFiZWw6ICdSw6lzdW3DqScgfTtcbiAgICB9XG4gICAgaWYgKC9eKDJcXC4pP1xccyphbmFseXNlXFxiLy50ZXN0KG5vcm1hbGl6ZWQpKSB7XG4gICAgICByZXR1cm4geyBraW5kOiAnYW5hbHlzaXMnLCBsYWJlbDogJ0FuYWx5c2UnIH07XG4gICAgfVxuICAgIGlmICgvXigzXFwuKT9cXHMqcmVjb21tYW5kLy50ZXN0KG5vcm1hbGl6ZWQpKSB7XG4gICAgICByZXR1cm4geyBraW5kOiAncmVjb21tZW5kYXRpb24nLCBsYWJlbDogJ1JlY29tbWFuZGF0aW9uJyB9O1xuICAgIH1cbiAgICBpZiAoL14oNFxcLik/XFxzKnJpc3F1ZS8udGVzdChub3JtYWxpemVkKSkge1xuICAgICAgcmV0dXJuIHsga2luZDogJ3Jpc2snLCBsYWJlbDogJ1Jpc3F1ZXMnIH07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBtZXNzYWdlVGV4dChtZXNzYWdlOiBBc3Npc3RhbnRDaGF0TWVzc2FnZSkge1xuICAgIGlmIChtZXNzYWdlLnJlc3BvbnNlKSB7XG4gICAgICBjb25zdCBib2R5ID0gW1xuICAgICAgICBtZXNzYWdlLnJlc3BvbnNlLnN1bW1hcnksXG4gICAgICAgIG1lc3NhZ2UucmVzcG9uc2UuYW5hbHlzaXMsXG4gICAgICAgIC4uLm1lc3NhZ2UucmVzcG9uc2UucmVjb21tZW5kYXRpb25zLFxuICAgICAgICAuLi5tZXNzYWdlLnJlc3BvbnNlLnJpc2tzXG4gICAgICBdO1xuICAgICAgcmV0dXJuIGJvZHkuam9pbignICcpO1xuICAgIH1cbiAgICByZXR1cm4gbWVzc2FnZS50ZXh0ID8/IG1lc3NhZ2UucXVlc3Rpb24gPz8gJyc7XG4gIH1cblxuICBwcml2YXRlIGF1dG9SZXNpemUoZWxlbWVudDogSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7TWF0aC5taW4oZWxlbWVudC5zY3JvbGxIZWlnaHQsIDE0MCl9cHhgO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNldENvbXBvc2VyKCkge1xuICAgIGNvbnN0IGNvbXBvc2VyID0gdGhpcy5jb21wb3NlckVsPy5uYXRpdmVFbGVtZW50O1xuICAgIGlmICghY29tcG9zZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29tcG9zZXIudmFsdWUgPSAnJztcbiAgICBjb21wb3Nlci5zdHlsZS5oZWlnaHQgPSAnNDBweCc7XG4gIH1cblxuICBwcml2YXRlIHNjcm9sbFRvQm90dG9tU29vbigpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2Nyb2xsVG9Cb3R0b20oKSwgMCk7XG4gIH1cblxuICBwcml2YXRlIHNjcm9sbFRvQm90dG9tKCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMubWVzc2FnZXNFbD8ubmF0aXZlRWxlbWVudDtcbiAgICBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb250YWluZXIuc2Nyb2xsVG9wID0gY29udGFpbmVyLnNjcm9sbEhlaWdodDtcbiAgfVxuXG4gIHByaXZhdGUgZXhwb3J0Q29udmVyc2F0aW9uKCkge1xuICAgIGNvbnN0IGxpbmVzID0gdGhpcy5tZXNzYWdlcygpXG4gICAgICAubWFwKChtZXNzYWdlKSA9PiB7XG4gICAgICAgIGlmIChtZXNzYWdlLnNlbmRlciA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgcmV0dXJuIGBbVVNFUl0gJHttZXNzYWdlLnF1ZXN0aW9uID8/ICcnfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBbQUldICR7dGhpcy5tZXNzYWdlVGV4dChtZXNzYWdlKX1gO1xuICAgICAgfSlcbiAgICAgIC5qb2luKCdcXG5cXG4nKTtcblxuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbbGluZXNdLCB7IHR5cGU6ICd0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLTgnIH0pO1xuICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsaW5rLmhyZWYgPSB1cmw7XG4gICAgbGluay5kb3dubG9hZCA9ICdwZXJmaWEtY2hhdC1oaXN0b3J5LnR4dCc7XG4gICAgbGluay5jbGljaygpO1xuICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzb2x2ZUFsbG93ZWRSb2xlKGN1cnJlbnQ6IFJvbGVUeXBlIHwgbnVsbCk6IEFzc2lzdGFudFJvbGUge1xuICAgIGlmIChcbiAgICAgIGN1cnJlbnQgPT09ICdFTlNFSUdOQU5UJyB8fFxuICAgICAgY3VycmVudCA9PT0gJ0NIRUZfREVQQVJURU1FTlQnIHx8XG4gICAgICBjdXJyZW50ID09PSAnQURNSU5JU1RSQVRJT04nIHx8XG4gICAgICBjdXJyZW50ID09PSAnU1VQRVJfQURNSU4nXG4gICAgKSB7XG4gICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9XG4gICAgcmV0dXJuICdFTlNFSUdOQU5UJztcbiAgfVxuXG4gIHByaXZhdGUgZGVmYXVsdFBlcmlvZExhYmVsKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICAgIGlmIChub3cuZ2V0TW9udGgoKSA+PSA3KSB7XG4gICAgICByZXR1cm4gYCR7eWVhcn0tJHt5ZWFyICsgMX1gO1xuICAgIH1cbiAgICByZXR1cm4gYCR7eWVhciAtIDF9LSR7eWVhcn1gO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGFtcFNjb3JlKHZhbHVlOiBudW1iZXIpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTAwLCB2YWx1ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBlc2NhcGVIdG1sKHZhbHVlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgICAucmVwbGFjZSgvJy9nLCAnJiMzOTsnKTtcbiAgfVxufVxuIiwiPGJ1dHRvblxuICBjbGFzcz1cImFzc2lzdGFudC1mYWJcIlxuICB0eXBlPVwiYnV0dG9uXCJcbiAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJpc09wZW4oKVwiXG4gIGFyaWEtbGFiZWw9XCJPdXZyaXIgUGVyZklBIEFzc2lzdGFudFwiXG4gIChjbGljayk9XCJ0b2dnbGUoKVwiXG4+XG4gIElBXG48L2J1dHRvbj5cblxuQGlmIChpc09wZW4oKSkge1xuICA8c2VjdGlvbiBjbGFzcz1cInBlcmZpYS1zaGVsbFwiPlxuICAgIDxkaXYgY2xhc3M9XCJvcmIgb3JiLWJsdWVcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwib3JiIG9yYi12aW9sZXRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2Rpdj5cblxuICAgIDxoZWFkZXIgY2xhc3M9XCJ0b3BiYXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0b3BiYXItbGVmdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYWktYXZhdGFyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIj5cbiAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgIGQ9XCJNMTIgMi4ybDEuOCA0LjcgNC44IDEuOC00LjggMS44TDEyIDE1LjJsLTEuOC00LjctNC44LTEuOCA0LjgtMS44TDEyIDIuMnpNMTguMyAxNC45bC44IDIuMSAyLjEuOC0yLjEuOC0uOCAyLjEtLjgtMi4xLTIuMS0uOCAyLjEtLjguOC0yLjF6TTYuMSAxNC4zbC42IDEuNiAxLjYuNi0xLjYuNi0uNiAxLjYtLjYtMS42LTEuNi0uNiAxLjYtLjYuNi0xLjZ6XCJcbiAgICAgICAgICAgICAgZmlsbD1cIiNmZmZcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJpZGVudGl0eVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpZGVudGl0eS10b3BcIj5cbiAgICAgICAgICAgIDxzdHJvbmc+UGVyZklBIEFzc2lzdGFudDwvc3Ryb25nPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZS1haVwiPkFJPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3RhdHVzLWxpbmVcIj48c3BhbiBjbGFzcz1cInN0YXR1cy1kb3RcIj48L3NwYW4+QWN0aWYgwrcgQW5hbHlzZSBlbiB0ZW1wcyByw6llbDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzcz1cInRvcGJhci1hY3Rpb25zXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJpY29uLWJ0blwiIHR5cGU9XCJidXR0b25cIiB0aXRsZT1cIkhpc3RvcmlxdWVcIiBhcmlhLWxhYmVsPVwiSGlzdG9yaXF1ZVwiIChjbGljayk9XCJydW5Ub3BiYXJBY3Rpb24oJ2hpc3RvcnknKVwiPlxuICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCI+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTEyIDV2N2w0LjIgMi42XCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMS44XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIC8+XG4gICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICBkPVwiTTQgMTJhOCA4IDAgMTA4LTggNy45IDcuOSAwIDAwLTUuOCAyLjVNNCA0djRoNFwiXG4gICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjEuOFwiXG4gICAgICAgICAgICAgIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJpY29uLWJ0blwiIHR5cGU9XCJidXR0b25cIiB0aXRsZT1cIkV4cG9ydGVyXCIgYXJpYS1sYWJlbD1cIkV4cG9ydGVyXCIgKGNsaWNrKT1cInJ1blRvcGJhckFjdGlvbignZXhwb3J0JylcIj5cbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0xMiA0djEwbTAgMGwtMy4yLTMuMk0xMiAxNGwzLjItMy4yXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMS44XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIC8+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTUgMTYuN1YyMGgxNHYtMy4zXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMS44XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiaWNvbi1idG5cIiB0eXBlPVwiYnV0dG9uXCIgdGl0bGU9XCJQYXJhbcOodHJlc1wiIGFyaWEtbGFiZWw9XCJQYXJhbcOodHJlc1wiIChjbGljayk9XCJydW5Ub3BiYXJBY3Rpb24oJ3NldHRpbmdzJylcIj5cbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0xMiA4LjhhMy4yIDMuMiAwIDEwMCA2LjQgMy4yIDMuMiAwIDAwMC02LjR6XCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMS44XCIgLz5cbiAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgIGQ9XCJNMTkuNCAxMC42bDEuMSAxLjQtMS4yIDItMS44LjFhNiA2IDAgMDEtLjYgMS40bDEuMSAxLjQtMS44IDEuOC0xLjQtMS4xYTYgNiAwIDAxLTEuNC42bC0uMSAxLjhoLTJsLS4xLTEuOGE2IDYgMCAwMS0xLjQtLjZsLTEuNCAxLjEtMS44LTEuOCAxLjEtMS40YTYgNiAwIDAxLS42LTEuNEwzLjUgMTQgMi4zIDEybDEuMS0xLjQgMS44LS4xYTYgNiAwIDAxLjYtMS40TDQuNyA3LjdsMS44LTEuOCAxLjQgMS4xYTYgNiAwIDAxMS40LS42bC4xLTEuOGgybC4xIDEuOGE2IDYgMCAwMTEuNC42bDEuNC0xLjEgMS44IDEuOC0xLjEgMS40Yy4zLjQuNS45LjYgMS40bDEuOC4xelwiXG4gICAgICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjEuMlwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvaGVhZGVyPlxuXG4gICAgPGRpdiAjbWVzc2FnZXNFbCBjbGFzcz1cIm1lc3NhZ2VzLXdyYXBcIj5cbiAgICAgIEBmb3IgKG1lc3NhZ2Ugb2YgbWVzc2FnZXMoKTsgdHJhY2sgdHJhY2tCeU1lc3NhZ2VJZCgkaW5kZXgsIG1lc3NhZ2UpKSB7XG4gICAgICAgIDxhcnRpY2xlIGNsYXNzPVwibWVzc2FnZS1yb3dcIiBbY2xhc3MudXNlcl09XCJtZXNzYWdlLnNlbmRlciA9PT0gJ3VzZXInXCIgW2NsYXNzLmFpXT1cIm1lc3NhZ2Uuc2VuZGVyID09PSAnYXNzaXN0YW50J1wiPlxuICAgICAgICAgIEBpZiAobWVzc2FnZS5zZW5kZXIgPT09ICdhc3Npc3RhbnQnKSB7XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibXNnLWF2YXRhciBhaVwiPuKcpjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1zZy1idWJibGVcIj5cbiAgICAgICAgICAgICAgQGZvciAoc2VjdGlvbiBvZiBnZXRTZWN0aW9ucyhtZXNzYWdlKTsgdHJhY2sgc2VjdGlvbi5rZXkpIHtcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInNlY3Rpb24tYmxvY2tcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2VjdGlvbi10YWdcIiBbY2xhc3NdPVwic2VjdGlvbkNsYXNzKHNlY3Rpb24ua2luZClcIj57eyBzZWN0aW9uLmxhYmVsIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdGV4dFwiPlxuICAgICAgICAgICAgICAgICAgICBAaWYgKHNlY3Rpb24ubGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICAgICAgICAgIEBmb3IgKGxpbmUgb2Ygc2VjdGlvbi5saW5lczsgdHJhY2sgbGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgW2lubmVySFRNTF09XCJmb3JtYXRMaW5lKGxpbmUpXCI+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgICB9IEBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBAZm9yIChsaW5lIG9mIHNlY3Rpb24ubGluZXM7IHRyYWNrIGxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIFtpbm5lckhUTUxdPVwiZm9ybWF0TGluZShsaW5lKVwiPjwvcD5cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdGF0cy1ncmlkXCI+XG4gICAgICAgICAgICAgICAgQGZvciAoc3RhdCBvZiBnZXRTdGF0cyhtZXNzYWdlKTsgdHJhY2sgc3RhdC5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgPGFydGljbGUgY2xhc3M9XCJzdGF0LWNhcmRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN0YXQtbGFiZWxcIj57eyBzdGF0LmxhYmVsIH19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdGF0LXZhbHVlXCI+e3sgZm9ybWF0VmFsdWUoc3RhdC52YWx1ZSkgfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN0YXQtdHJlbmRcIiBbY2xhc3NdPVwidHJlbmRDbGFzcyhzdGF0LnRyZW5kKVwiPlxuICAgICAgICAgICAgICAgICAgICAgIHt7IHRyZW5kQXJyb3coc3RhdC50cmVuZCkgfX0ge3sgZm9ybWF0VHJlbmQoc3RhdC50cmVuZCkgfX1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2FydGljbGU+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtcGFja1wiPlxuICAgICAgICAgICAgICAgIEBmb3IgKG1ldHJpYyBvZiBnZXRQcm9ncmVzcyhnZXRTdGF0cyhtZXNzYWdlKSk7IHRyYWNrIG1ldHJpYy5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWxpbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPnt7IG1ldHJpYy5sYWJlbCB9fTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0cmFja1wiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWxsXCIgW2NsYXNzXT1cInByb2dyZXNzRmlsbENsYXNzKG1ldHJpYy50b25lKVwiIFtzdHlsZS53aWR0aC4lXT1cIm1ldHJpYy52YWx1ZVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3sgZm9ybWF0VmFsdWUobWV0cmljLnZhbHVlKSB9fSU8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaXZpZGVyXCI+U2Vzc2lvbiDCtyBBbmFseXNlIGRlIHBlcmZvcm1hbmNlPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB9IEBlbHNlIHtcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtc2ctYnViYmxlXCI+XG4gICAgICAgICAgICAgIDxwPnt7IG1lc3NhZ2UucXVlc3Rpb24gfX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtc2ctYXZhdGFyIHVzZXJcIj57eyBhY2NvdW50Um9sZSgpID09PSAnQ0hFRl9ERVBBUlRFTUVOVCcgPyAnQ0QnIDogYWNjb3VudFJvbGUoKSA9PT0gJ0FETUlOSVNUUkFUSU9OJyA/ICdBRCcgOiBhY2NvdW50Um9sZSgpID09PSAnU1VQRVJfQURNSU4nID8gJ1NBJyA6ICdFTicgfX08L2Rpdj5cbiAgICAgICAgICB9XG4gICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgIH1cblxuICAgICAgQGlmIChwZW5kaW5nKCkpIHtcbiAgICAgICAgPGFydGljbGUgY2xhc3M9XCJtZXNzYWdlLXJvdyBhaVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtc2ctYXZhdGFyIGFpXCI+4pymPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1zZy1idWJibGVcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidHlwaW5nLXdyYXBcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0eXBpbmctZG90XCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR5cGluZy1kb3RcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidHlwaW5nLWRvdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgfVxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cInF1aWNrYmFyXCI+XG4gICAgICBAZm9yIChjaGlwIG9mIGFjdGl2ZVF1aWNrQ2hpcHMoKTsgdHJhY2sgY2hpcC5sYWJlbCkge1xuICAgICAgICA8YnV0dG9uIGNsYXNzPVwicXVpY2stY2hpcFwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiYXBwbHlRdWlja0NoaXAoY2hpcClcIj57eyBjaGlwLmljb24gfX0ge3sgY2hpcC5sYWJlbCB9fTwvYnV0dG9uPlxuICAgICAgfVxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cImlucHV0YmFyXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtd3JhcFwiPlxuICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAjY29tcG9zZXJFbFxuICAgICAgICAgIGNsYXNzPVwiY29tcG9zZXJcIlxuICAgICAgICAgIHJvd3M9XCIxXCJcbiAgICAgICAgICBbdmFsdWVdPVwiZHJhZnRRdWVzdGlvbigpXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlBvc2V6IHZvdHJlIHF1ZXN0aW9uIMOgIFBlcmZJQS4uLlwiXG4gICAgICAgICAgKGlucHV0KT1cIm9uQ29tcG9zZXJJbnB1dCgkZXZlbnQpXCJcbiAgICAgICAgICAoa2V5ZG93bik9XCJvbkNvbXBvc2VyS2V5ZG93bigkZXZlbnQpXCJcbiAgICAgICAgPjwvdGV4dGFyZWE+XG5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImF0dGFjaC1idG5cIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1sYWJlbD1cIkpvaW5kcmVcIj5cbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHdpZHRoPVwiMTdcIiBoZWlnaHQ9XCIxN1wiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk04LjUgMTIuNWw2LjMtNi4zYTMgMyAwIDExNC4yIDQuMmwtOC4xIDguMWE1IDUgMCAwMS03LjEtNy4xbDgtOFwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjEuOFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwic2VuZC1idG5cIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1sYWJlbD1cIkVudm95ZXJcIiBbZGlzYWJsZWRdPVwiIWNhblNlbmQoKVwiIChjbGljayk9XCJzZW5kTWVzc2FnZSgpXCI+XG4gICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiB3aWR0aD1cIjE3XCIgaGVpZ2h0PVwiMTdcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNNCAxMmwxNS03LTMuOCAxNC00LjEtNS40TDQgMTJ6XCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMS44XCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGZvb3RlciBjbGFzcz1cImZvb3RlclwiPlxuICAgICAgPHNwYW4+RG9ubsOpZXMgcHJvdMOpZ8OpZXMgwrcgRmFjdWx0w6k8L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImZvb3Rlci1yaWdodFwiPjxzcGFuIGNsYXNzPVwic21hbGwtZ3JlZW5cIj48L3NwYW4+Y2xhdWRlLXNvbm5ldC00IMK3IFBlcmZJQSB2Mi4wPC9zcGFuPlxuICAgIDwvZm9vdGVyPlxuICA8L3NlY3Rpb24+XG59XG4iLCJpbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBc3Npc3RhbnRDaGF0UmVxdWVzdCwgQXNzaXN0YW50Q2hhdFJlc3BvbnNlIH0gZnJvbSAnLi4vbW9kZWxzL2Fzc2lzdGFudC5tb2RlbHMnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEFzc2lzdGFudFNlcnZpY2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IGh0dHAgPSBpbmplY3QoSHR0cENsaWVudCk7XG5cbiAgY2hhdChwYXlsb2FkOiBBc3Npc3RhbnRDaGF0UmVxdWVzdCkge1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxBc3Npc3RhbnRDaGF0UmVzcG9uc2U+KCcvYXBpL2Fzc2lzdGFudC9jaGF0JywgcGF5bG9hZCk7XG4gIH1cbn1cblxuIiwiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBVaVRvYXN0U2VydmljZSB9IGZyb20gJy4uL2NvcmUvc2VydmljZXMvdWktdG9hc3Quc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC10b2FzdC1vdXRsZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzZWN0aW9uIGNsYXNzPVwidG9hc3Qtc3RhY2tcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIiBhcmlhLWF0b21pYz1cInRydWVcIj5cbiAgICAgIEBmb3IgKHRvYXN0IG9mIHRvYXN0cygpOyB0cmFjayB0b2FzdC5pZCkge1xuICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cInRvYXN0LWNhcmQgdG9hc3Qte3sgdG9hc3QudG9uZSB9fVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdC1jb3B5XCI+XG4gICAgICAgICAgICA8c3Ryb25nPnt7IHRvYXN0LnRpdGxlIH19PC9zdHJvbmc+XG4gICAgICAgICAgICA8cD57eyB0b2FzdC5tZXNzYWdlIH19PC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwidG9hc3QtY2xvc2VcIiAoY2xpY2spPVwiZGlzbWlzcyh0b2FzdC5pZClcIiBhcmlhLWxhYmVsPVwiRmVybWVyIGxhIG5vdGlmaWNhdGlvblwiPlxuICAgICAgICAgICAgw5dcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgfVxuICAgIDwvc2VjdGlvbj5cbiAgYCxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgICAgLnRvYXN0LXN0YWNrIHtcbiAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICB0b3A6IDEuNHJlbTtcbiAgICAgICAgcmlnaHQ6IDEuNHJlbTtcbiAgICAgICAgei1pbmRleDogNDA7XG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIGdhcDogMC44cmVtO1xuICAgICAgICB3aWR0aDogbWluKDM2MHB4LCBjYWxjKDEwMHZ3IC0gMnJlbSkpO1xuICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAgIH1cblxuICAgICAgLnRvYXN0LWNhcmQge1xuICAgICAgICBkaXNwbGF5OiBncmlkO1xuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IG1pbm1heCgwLCAxZnIpIGF1dG87XG4gICAgICAgIGdhcDogMC43NXJlbTtcbiAgICAgICAgYWxpZ24taXRlbXM6IHN0YXJ0O1xuICAgICAgICBwYWRkaW5nOiAxcmVtIDEuMDVyZW07XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgMjhweCA1NXB4IHJnYmEoMTcsIDQyLCA2MywgMC4xOCk7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjAsIDUwLCA3NCwgMC4wOCk7XG4gICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxNHB4KTtcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gICAgICB9XG5cbiAgICAgIC50b2FzdC1jb3B5IHN0cm9uZyB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAwLjI1cmVtO1xuICAgICAgICBmb250LXNpemU6IDAuOTVyZW07XG4gICAgICB9XG5cbiAgICAgIC50b2FzdC1jb3B5IHAge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGNvbG9yOiByZ2JhKDIwLCA1MCwgNzQsIDAuOCk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjU1O1xuICAgICAgICBmb250LXNpemU6IDAuOXJlbTtcbiAgICAgIH1cblxuICAgICAgLnRvYXN0LWNsb3NlIHtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBib3JkZXI6IDA7XG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgICAgICBjb2xvcjogaW5oZXJpdDtcbiAgICAgICAgZm9udC1zaXplOiAxLjJyZW07XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgICBvcGFjaXR5OiAwLjc7XG4gICAgICB9XG5cbiAgICAgIC50b2FzdC1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyMjYsIDI0NywgMjMyLCAwLjk0KTtcbiAgICAgICAgY29sb3I6ICMxNTVjMzc7XG4gICAgICB9XG5cbiAgICAgIC50b2FzdC1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyMzMsIDIzMywgMC45Nik7XG4gICAgICAgIGNvbG9yOiAjOGUyYzJjO1xuICAgICAgfVxuXG4gICAgICAudG9hc3QtaW5mbyB7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjMxLCAyNDMsIDI0NCwgMC45Nik7XG4gICAgICAgIGNvbG9yOiAjMWI1YzYwO1xuICAgICAgfVxuXG4gICAgICAudG9hc3Qtd2FybmluZyB7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNDMsIDIyNCwgMC45Nik7XG4gICAgICAgIGNvbG9yOiAjOGI1NjBlO1xuICAgICAgfVxuXG4gICAgICBAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgICAgICAgLnRvYXN0LXN0YWNrIHtcbiAgICAgICAgICB0b3A6IGF1dG87XG4gICAgICAgICAgcmlnaHQ6IDFyZW07XG4gICAgICAgICAgYm90dG9tOiAxcmVtO1xuICAgICAgICAgIGxlZnQ6IDFyZW07XG4gICAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFRvYXN0T3V0bGV0Q29tcG9uZW50IHtcbiAgcHJpdmF0ZSByZWFkb25seSB0b2FzdFNlcnZpY2UgPSBpbmplY3QoVWlUb2FzdFNlcnZpY2UpO1xuXG4gIHJlYWRvbmx5IHRvYXN0cyA9IHRoaXMudG9hc3RTZXJ2aWNlLnRvYXN0cztcblxuICBkaXNtaXNzKGlkOiBudW1iZXIpIHtcbiAgICB0aGlzLnRvYXN0U2VydmljZS5kaXNtaXNzKGlkKTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsU0FBUyxnQkFBZ0I7QUFDekIsU0FBUywyQkFBQUEsMEJBQXlCLGFBQUFDLFlBQVcsY0FBQUMsYUFBWSxZQUFBQyxXQUFVLFVBQUFDLFNBQVEsVUFBQUMsZUFBYztBQUN6RixTQUFTLHNCQUFBQywyQkFBMEI7QUFDbkMsU0FBUyxlQUFlLFFBQVEsWUFBWSxrQkFBa0Isb0JBQW9CO0FBQ2xGLFNBQVMsUUFBUSxhQUFhOzs7QUVKOUIsU0FBUyxrQkFBa0I7QUFDM0IsU0FBUyxZQUFZLGNBQWM7O0FBSTdCLElBQU8sc0JBQVAsTUFBTyxxQkFBbUI7RUFDYixPQUFPLE9BQU8sVUFBVTtFQUV6QyxjQUFXO0FBQ1QsV0FBTyxLQUFLLEtBQUssSUFBa0Msb0JBQW9CO0VBQ3pFO0VBRUEsV0FBVyxJQUFVO0FBQ25CLFdBQU8sS0FBSyxLQUFLLEtBQW1DLHNCQUFzQixFQUFFLFNBQVMsQ0FBQSxDQUFFO0VBQ3pGO0VBRUEsZ0JBQWE7QUFDWCxXQUFPLEtBQUssS0FBSyxLQUFtQywrQkFBK0IsQ0FBQSxDQUFFO0VBQ3ZGOztxQ0FiVyxzQkFBbUI7RUFBQTsrRUFBbkIsc0JBQW1CLFNBQW5CLHFCQUFtQixXQUFBLFlBRE4sT0FBTSxDQUFBOzs7K0VBQ25CLHFCQUFtQixDQUFBO1VBRC9CO1dBQVcsRUFBRSxZQUFZLE9BQU0sQ0FBRTs7Ozs7QUNKbEMsU0FBUyx5QkFBeUIsV0FBVyxZQUF3QixXQUFXLFVBQVUsVUFBQUMsU0FBUSxjQUFjO0FBQ2hILFNBQVMsMEJBQTBCOzs7QUVEbkMsU0FBUyxjQUFBQyxtQkFBa0I7QUFDM0IsU0FBUyxjQUFBQyxh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QSxDQUFBLEdBQUEsaUJBQUEsR0FBQSxDQUFBLEdBQUEsZUFBQSxHQUFBLENBQUEsR0FBQSxjQUFBLEdBQUEsQ0FBQSxHQUFBLGVBQUEsR0FBQSxDQUFBLEdBQUEsWUFBQSxHQUFBLENBQUEsR0FBQSxhQUFBLEdBQUEsQ0FBQSxHQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsZUFBQSxHQUFBLENBQUEsR0FBQSxlQUFBLEdBQUEsQ0FBQSxHQUFBLGFBQUEsR0FBQSxjQUFBLEdBQUEsQ0FBQSxvQkFBQSxlQUFBLEdBQUEsWUFBQSxHQUFBLGNBQUEseUJBQUEsR0FBQSxDQUFBLEdBQUEsV0FBQSxHQUFBLENBQUEsUUFBQSxVQUFBLEdBQUEsWUFBQSxrQkFBQSxvQkFBQSxHQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsWUFBQSxrQkFBQSxtQkFBQSxHQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsYUFBQSxHQUFBLENBQUEsb0JBQUEsa0JBQUEsR0FBQSxlQUFBLEdBQUEsY0FBQSx5QkFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLEdBQUEsWUFBQSxrQkFBQSxvQkFBQSxHQUFBLE9BQUEsR0FBQSxDQUFBLEdBQUEsVUFBQSxHQUFBLENBQUEsR0FBQSxVQUFBLEdBQUEsQ0FBQSxlQUFBLFFBQUEsR0FBQSxtQkFBQSxHQUFBLENBQUEsR0FBQSxZQUFBLGtCQUFBLGlCQUFBLEdBQUEsQ0FBQSxHQUFBLGlCQUFBLEdBQUEsQ0FBQSxHQUFBLGtCQUFBLEdBQUEsQ0FBQSxHQUFBLGVBQUEsR0FBQSxDQUFBLEdBQUEsU0FBQSxHQUFBLENBQUEsR0FBQSxvQkFBQSxHQUFBLENBQUEsR0FBQSxlQUFBLEdBQUEsQ0FBQSxHQUFBLHdCQUFBLEdBQUEsQ0FBQSxRQUFBLFVBQUEsR0FBQSxzQkFBQSxHQUFBLENBQUEsUUFBQSxVQUFBLEdBQUEsbUJBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxHQUFBLHFCQUFBLEdBQUEsT0FBQSxHQUFBLENBQUEsUUFBQSxVQUFBLEdBQUEsd0JBQUEsR0FBQSxPQUFBLENBQUEsR0FBQSxVQUFBLFNBQUEs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QSxlQUFBLGNBQUEsMEJBQUEsS0FBQSxJQUFBLENBQUE7QUFBQSxHQUFBLE9BQUEsY0FBQSxlQUFBLGVBQUEsWUFBQSxPQUFBLFlBQUEsSUFBQSxHQUFBLDRCQUFBLE9BQUEsRUFBQSxPQUFBLE1BQUEsMEJBQUEsRUFBQSxTQUFBLENBQUE7QUFBQSxHQUFBOyIsIm5hbWVzIjpbIkNoYW5nZURldGVjdGlvblN0cmF0ZWd5IiwiQ29tcG9uZW50IiwiRGVzdHJveVJlZiIsImNvbXB1dGVkIiwiaW5qZWN0Iiwic2lnbmFsIiwidGFrZVVudGlsRGVzdHJveWVkIiwiaW5qZWN0IiwiSHR0cENsaWVudCIsIkluamVjdGFibGUiLCJpbmplY3QiLCJpbmplY3QiLCJzZWN0aW9ucyIsImkwIiwiQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kiLCJDb21wb25lbnQiLCJpbmplY3QiLCJpbmplY3QiLCJfZm9yVHJhY2swIiwiQ29tcG9uZW50IiwiQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kiLCJpMCIsIl9jMCIsIl9mb3JUcmFjazAiLCJfZm9yVHJhY2sxIiwiaW5qZWN0IiwiRGVzdHJveVJlZiIsImNvbXB1dGVkIiwic2lnbmFsIiwidGFrZVVudGlsRGVzdHJveWVkIiwiQ29tcG9uZW50IiwiQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kiLCJpMCJdfQ==
