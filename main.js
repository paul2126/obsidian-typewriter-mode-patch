var {
    defineProperty: st,
    getOwnPropertyNames: li,
    getOwnPropertyDescriptor: ci,
  } = Object,
  ui = Object.prototype.hasOwnProperty;
var kt = new WeakMap(),
  yi = (t) => {
    var i = kt.get(t),
      e;
    if (i) return i;
    if (
      ((i = st({}, "__esModule", { value: !0 })),
      (t && typeof t === "object") || typeof t === "function")
    )
      li(t).map(
        (r) =>
          !ui.call(i, r) &&
          st(i, r, {
            get: () => t[r],
            enumerable: !(e = ci(t, r)) || e.enumerable,
          })
      );
    return kt.set(t, i), i;
  };
var bi = (t, i) => {
  for (var e in i)
    st(t, e, {
      get: i[e],
      enumerable: !0,
      configurable: !0,
      set: (r) => (i[e] = () => r),
    });
};

var Li = {};
bi(Li, { default: () => Pt });
module.exports = yi(Li);
var hi = require("obsidian");
var T = `<!-- markdownlint-disable -->
**Thank you for using Typewriter Mode!** If you like the plugin, please consider supporting me on [GitHub Sponsors](https://github.com/sponsors/davisriedel) or [buy me a coffee](https://www.buymeacoffee.com/davis.riedel). I am a computer science student and develop this plugin in my spare time. Your support will ensure the continuous development and maintenance of the plugin. <br> <a href="https://www.buymeacoffee.com/davis.riedel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;"></a> <br>
If you find any bugs or have a feature request, please don't hesitate to [open an issue on GitHub](https://github.com/davisriedel/obsidian-typewriter-mode/issues). You are also welcome to contribute to the project.
`;
var Kt = `# Typewriter Mode updated to v{{tag-name}}

{{funding}}

## What's new?

Here's what's new since the last version you had installed:

***

{{release-notes}}
`;
var $t = require("obsidian"),
  x = require("obsidian");
async function Ci(t, i, e, r) {
  let n = await fetch(`https://api.github.com/repos/${t}/${i}/releases`),
    o = await n.json();
  if ((!n.ok && "message" in o) || !Array.isArray(o))
    throw new Error(
      `Failed to fetch releases: ${o.message ?? "Unknown error"}`
    );
  if (e == null) return o.filter((d) => !d.draft && !d.prerelease);
  let m = o.findIndex((d) => d.tag_name === e);
  if (m === -1) throw new Error(`Could not find release with tag ${e}`);
  return o.slice(0, m).filter((d) => !d.draft && (r || !d.prerelease));
}
class mt extends x.Modal {
  currentVersion;
  previousVersion;
  constructor(t, i, e) {
    super(t);
    this.currentVersion = i;
    this.previousVersion = e;
  }
  fetchAndDisplayReleaseNotes() {
    let t = this.currentVersion.includes("-");
    Ci("davisriedel", "obsidian-typewriter-mode", this.previousVersion, t)
      .then((i) => {
        if (i.length === 0)
          this.displayError(new Error("No new releases found"));
        else this.displayReleaseNotes(i);
      })
      .catch((i) => {
        this.displayError(i);
      });
  }
  onOpen() {
    let { contentEl: t } = this;
    t.empty(),
      t.createEl("h2", { text: "Fetching release notes..." }),
      this.fetchAndDisplayReleaseNotes();
  }
  displayReleaseNotes(t) {
    let { contentEl: i } = this;
    i.empty(), i.classList.add("ptm-update-modal-container");
    let e = i.createDiv("ptm-update-modal"),
      r = t.map(
        (o) => `### ${o.tag_name}

${o.body}`
      ).join(`
---
`),
      n = Kt.replace("{{tag-name}}", t[0].tag_name)
        .replace("{{funding}}", T)
        .replace("{{release-notes}}", r);
    x.MarkdownRenderer.render(
      this.app,
      n,
      e,
      this.app.vault.getRoot().path,
      new $t.Component()
    );
  }
  displayError(t) {
    let { contentEl: i } = this;
    i.empty(),
      i.classList.add("ptm-update-modal-container"),
      i.createDiv("ptm-update-modal").createEl("h2", { text: t.message });
  }
}
function l(t) {
  return t.dom.ownerDocument.querySelector(
    ".workspace-leaf.mod-active .cm-editor, .mod-inside-iframe .cm-editor"
  );
}
function C(t) {
  return t.dom.ownerDocument.querySelector(
    ".workspace-leaf.mod-active .cm-scroller, .mod-inside-iframe .cm-scroller"
  );
}
function dt(t) {
  return t.dom.ownerDocument.querySelector(
    ".workspace-leaf.mod-active .cm-sizer, .mod-inside-iframe .cm-sizer"
  );
}
class at {
  tm;
  view;
  constructor(t, i) {
    (this.tm = t), (this.view = i);
  }
  getActiveLineProp(t) {
    let i = this.view.contentDOM
      .querySelector(".cm-active.cm-line")
      ?.getCssPropertyValue(t)
      .replace("px", "");
    if (!i) return null;
    return Number.parseFloat(i);
  }
  getActiveLineOffset(t) {
    let i = t.top,
      e = l(this.view);
    if (!e) return 0;
    let r = e.getBoundingClientRect().top;
    return i - r;
  }
  getTypewriterOffset() {
    let t = l(this.view);
    if (!t) return 0;
    return t.clientHeight * this.tm.settings.typewriterOffset;
  }
  getTypewriterPositionData() {
    let t = this.view.coordsAtPos(this.view.state.selection.main.head);
    if (!t) return null;
    let i = t.bottom - t.top,
      e = this.getActiveLineProp("line-height");
    if (!e) return null;
    let r = 0,
      n = 0;
    if (i > e) (r = i), (n = 0);
    else (r = e), (n = (r - i) / 2);
    let o = this.getTypewriterOffset(),
      m = this.getActiveLineOffset(t),
      {
        isTypewriterScrollEnabled: d,
        isKeepLinesAboveAndBelowEnabled: g,
        isOnlyMaintainTypewriterOffsetWhenReachedEnabled: y,
      } = this.tm.settings,
      p = l(this.view),
      h = C(this.view),
      c;
    if (!p || !h) c = 0;
    else if (d) {
      if (((c = o), y))
        if (m < 0) c = 0;
        else c = h.scrollTop + m < o ? Math.min(o, m) : o;
    } else if (g) {
      let { linesAboveAndBelow: Ht } = this.tm.settings,
        At = this.view.defaultLineHeight * Ht,
        Ut = p.clientHeight - this.view.defaultLineHeight * (Ht + 1),
        pi = h.scrollTop !== 0 && m < At,
        gi = m > Ut;
      if (pi) c = At;
      else if (gi) c = Ut;
      else c = m;
    } else c = this.getActiveLineOffset(t);
    return {
      typewriterOffset: o,
      scrollOffset: c,
      activeLineOffset: m,
      lineHeight: r,
      lineOffset: n,
    };
  }
}
var Vt = require("@codemirror/state"),
  Wt = require("@codemirror/state"),
  L = require("@codemirror/view"),
  M = require("obsidian");
var ht = require("@codemirror/view");
function vt(t, i, e) {
  let r = !1;
  for (let n of i)
    if (t.slice(e + 1 - n.length, e + 1) === n) {
      r = !0;
      break;
    }
  return r;
}

function Ot(t, i, e) {
  let r = t.sentenceDelimiters.split(""),
    n = t.extraCharacters.split(""),
    o = t.ignoredPatterns.split(`
`),
    m = i.from,
    d = i.text,
    g = -1;
  for (let p = e - m - 1; p >= 0; p--)
    if (r.contains(d[p])) {
      if (vt(d, o, p)) continue;
      let h = 1;
      while (d[p + h] === " " && h < e - m - 1) h += 1;
      while (n.contains(d[p + h]) && r.contains(d[p + h - 1]) && h < e - m - 1)
        h += 1;
      g = p + h;
      break;
    }
  if (g === -1) g = 0;
  let y = -1;
  for (let p = e - m; p < i.length; p++)
    if (r.contains(d[p])) {
      if (vt(d, o, p)) continue;
      let h = 1;
      while (r.contains(d[p + h]) && h < i.length) h += 1;
      while (n.contains(d[p + h]) && h < i.length) h += 1;
      y = p + h;
      break;
    }
  if (y !== -1) return { start: g + m, end: y + m };
  return { start: g + m, end: null };
}
function Ft(t, i) {
  let e = [],
    n = t.state.selection.main.from,
    o = t.state.doc.lineAt(n),
    m = Ot(i, o, n);
  if (m.end == null) {
    if (n > o.from) m = Ot(i, o, n - 1);
  }
  let { start: d, end: g } = m;
  if (g == null) g = o.to;
  function y(p, h, c) {
    e.push(
      ht.Decoration.mark({ inclusive: !0, attributes: {}, class: c }).range(
        p,
        h
      )
    );
  }
  if (d !== g) {
    if ((y(d, g, "active-sentence"), o.from !== d))
      y(o.from, d, "active-paragraph");
    if (g !== o.to) y(g, o.to, "active-paragraph");
  }
  return ht.Decoration.set(e, !0);
}
var pt = "ptm-current-line",
  gt = "ptm-current-line-fade-before",
  lt = "ptm-current-line-fade-after";
class It {
  tm;
  view;
  domResizeObserver = null;
  onScrollEventKey;
  isListeningToOnScroll = !1;
  isOnScrollClassSet = !1;
  isInitialInteraction = !0;
  isRenderingAllowedUserEvent = !1;
  decorations = Vt.RangeSet.empty;
  isPerWindowPropsReloadRequired = !1;
  isComposing = !1;
  constructor(t, i) {
    (this.tm = t),
      (this.view = i),
      (this.onScrollEventKey = M.Platform.isMobile ? "touchmove" : "wheel"),
      this.onLoad();
  }
  destroy() {
    this.domResizeObserver?.disconnect(),
      this.destroyCurrentLine(),
      this.removeScrollListener(),
      this.removeCompositionListeners(),
      window.removeEventListener(
        "moveByCommand",
        this.moveByCommand.bind(this)
      );
  }
  onLoad() {
    (this.domResizeObserver = new ResizeObserver(this.onResize.bind(this))),
      this.domResizeObserver.observe(this.view.dom.ownerDocument.body),
      window.addEventListener("moveByCommand", this.moveByCommand.bind(this)),
      this.setupCompositionListeners(),
      this.watchEmbeddedMarkdown(),
      this.onReconfigured(),
      window.requestAnimationFrame(() => {
        this.restoreCursorPosition(this.view);
      });
  }
  setupCompositionListeners() {
    let inputEl = this.view.contentDOM;
    if (inputEl) {
      inputEl.addEventListener(
        "compositionstart",
        this.onCompositionStart.bind(this)
      );
      inputEl.addEventListener(
        "compositionend",
        this.onCompositionEnd.bind(this)
      );
    }
  }
  removeCompositionListeners() {
    let inputEl = this.view.contentDOM;
    if (inputEl) {
      inputEl.removeEventListener(
        "compositionstart",
        this.onCompositionStart.bind(this)
      );
      inputEl.removeEventListener(
        "compositionend",
        this.onCompositionEnd.bind(this)
      );
    }
  }
  onCompositionStart() {
    this.isComposing = !0;
  }
  onCompositionEnd() {
    this.isComposing = !1;
  }
  userEventAllowed(t) {
    let i = /^(select|input|delete|undo|redo)(\..+)?$/,
      e = /^(select.pointer)$/;
    if (this.tm.settings.isTypewriterOnlyUseCommandsEnabled)
      (i = /^(input|delete|undo|redo)(\..+)?$/), (e = /^(select)(\..+)?$/);
    return i.test(t) && !e.test(t);
  }
  inspectTransactions(t) {
    let i = [],
      e = !1;
    for (let n of t.transactions) {
      if (n.reconfigured) e = !0;
      let o = n.annotation(Wt.Transaction.userEvent);
      if (o !== void 0) i.push(o);
    }
    if (i.length === 0)
      return { isReconfigured: e, isUserEvent: !1, allowedUserEvents: null };
    return {
      isReconfigured: !1,
      isUserEvent: !0,
      allowedUserEvents: i.reduce((n, o) => {
        return n && this.userEventAllowed(o);
      }, i.length > 0),
    };
  }
  update(t) {
    let {
      isReconfigured: i,
      isUserEvent: e,
      allowedUserEvents: r,
    } = this.inspectTransactions(t);
    if (this.isTableCell()) return;
    if (i) this.onReconfigured();
    if (this.isDisabled()) return;
    if (!e) {
      this.updateNonUserEvent();
      return;
    }
    r ? this.updateAllowedUserEvent() : this.updateDisallowedUserEvent();
  }
  isTableCell() {
    return (
      this.view.dom.parentElement?.parentElement?.className.contains(
        "table-cell-wrapper"
      ) ?? !1
    );
  }
  isMarkdownFile() {
    let t = this.tm.plugin.app.workspace.getActiveViewOfType(M.ItemView);
    if (!t) return (this.isPerWindowPropsReloadRequired = !0), !1;
    return t.getViewType() === "markdown";
  }
  isDisabledInFrontmatter() {
    let t = this.tm.plugin.app.workspace.getActiveFile();
    if (!t) return (this.isPerWindowPropsReloadRequired = !0), !1;
    let i = this.tm.plugin.app.metadataCache.getFileCache(t)?.frontmatter;
    if (!i) return !1;
    if (!Object.hasOwn(i, "typewriter-mode")) return !1;
    return !i["typewriter-mode"];
  }
  isDisabled() {
    if (!this.tm.settings.isPluginActivated) return !0;
    if (!this.isMarkdownFile()) return !0;
    if (this.isDisabledInFrontmatter()) return !0;
  }
  onReconfigured() {
    if (((this.isPerWindowPropsReloadRequired = !0), this.isDisabled()))
      this.destroyCurrentLine(),
        this.resetPadding(this.view),
        this.loadPerWindowProps();
    else this.updateAfterExternalEvent();
  }
  watchEmbeddedMarkdown() {
    let i = this.tm.perWindowProps;
    new MutationObserver((r) => {
      r.forEach((n) => {
        [].forEach.call(n.addedNodes, (o) => {
          if (
            o.nodeType === Node.ELEMENT_NODE &&
            o.matches(".markdown-embed-content iframe.embed-iframe")
          ) {
            let m = o.contentDocument?.body;
            if (!m) return;
            this.loadPerWindowPropsOnElement(i, m);
          }
        });
      });
    }).observe(this.view.dom.ownerDocument, { childList: !0, subtree: !0 });
  }
  loadPerWindowPropsOnElement(t, i) {
    for (let e of t.allBodyClasses) i.classList.remove(e);
    if ((i.addClasses(t.persistentBodyClasses), !this.isDisabled()))
      i.addClasses(t.bodyClasses);
    i.setCssProps(t.cssVariables), i.setAttrs(t.bodyAttrs);
  }
  getMarkdownBodies() {
    let t = this.view.dom.ownerDocument.querySelectorAll(
        ".markdown-embed-content iframe.embed-iframe"
      ),
      i = Array.from(t).flatMap((e) => {
        let r = e.contentDocument?.body;
        return r ? [r] : [];
      });
    return [this.view.dom.ownerDocument.body, ...i];
  }
  loadPerWindowProps() {
    if (!this.isPerWindowPropsReloadRequired) return;
    this.isPerWindowPropsReloadRequired = !1;
    let t = this.getMarkdownBodies();
    for (let i of t)
      this.loadPerWindowPropsOnElement(this.tm.perWindowProps, i);
  }
  loadCurrentLine(t = this.view) {
    let i = l(t);
    if (!i) return null;
    let e = i.querySelector(`.${pt}`);
    if (!e)
      (e = document.createElement("div")), (e.className = pt), i.appendChild(e);
    if (this.tm.settings.isFadeLinesEnabled) {
      let r = i.querySelector(`.${gt}`),
        n = i.querySelector(`.${lt}`);
      if (!r)
        (r = document.createElement("div")),
          (r.className = gt),
          i.appendChild(r);
      if (!n)
        (n = document.createElement("div")),
          (n.className = lt),
          i.appendChild(n);
      return { currentLine: e, fadeBefore: r, fadeAfter: n };
    }
    return { currentLine: e };
  }
  destroyCurrentLine(t = this.view) {
    let i = l(t);
    if (!i) return;
    let e = i.querySelector(`.${pt}`),
      r = i.querySelector(`.${gt}`),
      n = i.querySelector(`.${lt}`);
    e?.remove(), r?.remove(), n?.remove();
  }
  setupScrollListener() {
    if (this.isListeningToOnScroll) return;
    let t = C(this.view);
    if (t)
      t.addEventListener(this.onScrollEventKey, this.onScroll.bind(this), {
        passive: !0,
      }),
        (this.isListeningToOnScroll = !0);
  }
  removeScrollListener() {
    if (!this.isListeningToOnScroll) return;
    let t = C(this.view);
    if (t)
      t.removeEventListener(this.onScrollEventKey, this.onScroll),
        (this.isListeningToOnScroll = !1);
  }
  measureTypewriterPosition(t, i) {
    this.view.requestMeasure({
      key: t,
      read: (e) => new at(this.tm, e).getTypewriterPositionData(),
      write: (e, r) => {
        if (!e) return;
        window.requestAnimationFrame(() => {
          i(e, r);
        });
      },
    });
  }
  updateAllowedUserEvent() {
    this.removeScrollListener(), this.applyDecorations();
    let t = l(this.view);
    if (t) {
      if (
        (t.classList.remove("ptm-scroll"),
        (this.isOnScrollClassSet = !1),
        t.classList.remove("ptm-select"),
        this.isInitialInteraction)
      )
        t.classList.remove("ptm-first-open"), (this.isInitialInteraction = !1);
    }
    (this.isRenderingAllowedUserEvent = !0),
      this.measureTypewriterPosition(
        "TypewriterModeUpdateAfterAllowedUserEvent",
        (i, e) => {
          if (!i) return;
          this.recenterAndMoveCurrentLine(e, i),
            (this.isRenderingAllowedUserEvent = !1),
            this.handleCursorStateUpdate(e);
        }
      );
  }
  updateDisallowedUserEvent() {
    if (this.isRenderingAllowedUserEvent) return;
    let t = l(this.view);
    if (t) {
      if (this.isInitialInteraction)
        t.classList.remove("ptm-first-open"), (this.isInitialInteraction = !1);
      t.classList.add("ptm-select");
    }
    this.measureTypewriterPosition(
      "TypewriterModeUpdateAfterDisallowedUserEvent",
      (i, e) => {
        if (!i) return;
        this.handleCursorStateUpdate(e);
        let { activeLineOffset: r, lineHeight: n, lineOffset: o } = i;
        if (
          this.tm.settings.isHighlightCurrentLineEnabled ||
          this.tm.settings.isFadeLinesEnabled
        )
          this.moveCurrentLine(e, r, o, n);
      }
    );
  }
  updateNonUserEvent() {
    if ((this.applyDecorations(), !this.isInitialInteraction)) return;
    if (this.tm.settings.isOnlyActivateAfterFirstInteractionEnabled) {
      let t = l(this.view);
      if (t) t.classList.add("ptm-first-open");
    }
  }
  moveByCommand() {
    let t = l(this.view);
    if (t) t.classList.remove("ptm-select");
    this.updateAllowedUserEvent();
  }
  onResize() {
    if (this.isDisabled()) return;
    this.updateAfterExternalEvent();
  }
  onScroll() {
    this.measureTypewriterPosition("TypewriterModeOnScroll", (t, i) => {
      if (!this.isOnScrollClassSet) {
        let o = l(this.view);
        if (o) o.classList.add("ptm-scroll"), (this.isOnScrollClassSet = !0);
      }
      if (!t) return;
      let { activeLineOffset: e, lineOffset: r, lineHeight: n } = t;
      this.moveCurrentLine(i, e, r, n);
    });
  }
  applyDecorations() {
    if (
      !this.tm.settings.isDimUnfocusedEnabled ||
      this.tm.settings.dimUnfocusedMode !== "sentences"
    )
      return;
    this.decorations = Ft(this.view, {
      sentenceDelimiters: ".!?",
      extraCharacters: "*“”‘’",
      ignoredPatterns: "Mr.",
    });
  }
  updateAfterExternalEvent() {
    if (this.isTableCell()) {
      this.destroyCurrentLine();
      return;
    }
    this.loadPerWindowProps(),
      this.applyDecorations(),
      this.measureTypewriterPosition(
        "TypewriterModeUpdateAfterExternalEvent",
        (t, i) => {
          if ((this.setupScrollListener(), !t)) return;
          if (this.tm.settings.isTypewriterScrollEnabled)
            this.setPadding(i, t.typewriterOffset);
          this.recenterAndMoveCurrentLine(i, t);
        }
      );
  }
  moveCurrentLine(t, i, e, r) {
    let n = this.loadCurrentLine(t);
    if (!n) return;
    if (
      ((n.currentLine.style.height = `${r}px`),
      (n.currentLine.style.top = `${i - e}px`),
      n.fadeBefore)
    )
      n.fadeBefore.style.top = `calc(${i - e}px - 100vh)`;
    if (n.fadeAfter) n.fadeAfter.style.top = `${i - e + r}px`;
  }
  setPadding(t, i) {
    let e = dt(t);
    if (!e) return;
    e.style.padding = this.tm.settings
      .isOnlyMaintainTypewriterOffsetWhenReachedEnabled
      ? `0 0 ${i}px 0`
      : `${i}px 0`;
  }
  resetPadding(t) {
    if (!this.isMarkdownFile()) return;
    let i = dt(t);
    if (!i) return;
    i.style.removeProperty("padding");
  }
  recenter(t, i) {
    // Avoid scrollIntoView during active IME composition to prevent Korean character input issues
    if (this.isComposing) {
      return;
    }
    let e = t.state.selection.main.head,
      r = L.EditorView.scrollIntoView(e, { y: "start", yMargin: i }),
      n = t.state.update({ effects: r });
    t.dispatch(n);
  }
  recenterAndMoveCurrentLine(
    t,
    { scrollOffset: i, lineOffset: e, lineHeight: r }
  ) {
    let {
      isTypewriterScrollEnabled: n,
      isKeepLinesAboveAndBelowEnabled: o,
      isHighlightCurrentLineEnabled: m,
      isFadeLinesEnabled: d,
    } = this.tm.settings;
    if (n || o) this.recenter(t, i);
    if (m || d) this.moveCurrentLine(t, i, e, r);
  }
  handleCursorStateUpdate(t) {
    if (!this.tm.settings.isRestoreCursorPositionEnabled) return;
    this.tm
      .getRestoreCursorPositionFeature()
      .setCursorState(t.state.selection.main);
  }
  restoreCursorPosition(t) {
    let i = this.tm.getRestoreCursorPositionFeature();
    i.saveState();
    let e = this.tm.plugin.app.workspace.getActiveFile()?.path;
    if (e) {
      let r = i.state[e];
      if (r) {
        if (
          !this.tm.plugin.app.workspace.containerEl.querySelector(
            "span.is-flashing"
          )
        )
          t.dispatch({ selection: r });
      }
    }
  }
}
function ct(t) {
  return L.ViewPlugin.define(
    (i) => {
      return new It(t, i);
    },
    { decorations: (i) => i.decorations }
  );
}
var b = require("obsidian");
class E extends b.PluginSettingTab {
  tm;
  constructor(t, i) {
    super(t, i.plugin);
    this.tm = i;
  }
  addHeading(t) {
    return new b.Setting(this.containerEl).setName(t).setHeading();
  }
  addText(t) {
    return new b.Setting(this.containerEl).setName(t);
  }
  display() {
    this.containerEl.empty();
    for (let i of Object.values(this.tm.features.general))
      i.registerSetting(this);
    if (
      (this.addHeading("Typewriter"),
      this.tm.settings.isKeepLinesAboveAndBelowEnabled)
    )
      this.addText(
        'Not available if "keep lines above and below" is activated'
      );
    for (let i of Object.values(this.tm.features.typewriter))
      i.registerSetting(this);
    if (
      (this.addHeading("Keep lines above and below"),
      this.tm.settings.isTypewriterScrollEnabled)
    )
      this.addText("Not available if typewriter scrolling is activated");
    for (let i of Object.values(this.tm.features.keepAboveAndBelow))
      i.registerSetting(this);
    this.addHeading("Highlight current line");
    for (let i of Object.values(this.tm.features.currentLine))
      i.registerSetting(this);
    this.addHeading("Dimming");
    for (let i of Object.values(this.tm.features.dimming))
      i.registerSetting(this);
    this.addHeading("Limit line width");
    for (let i of Object.values(this.tm.features.maxChar))
      i.registerSetting(this);
    this.addHeading("Restore cursor position");
    for (let i of Object.values(this.tm.features.restoreCursorPosition))
      i.registerSetting(this);
    this.addHeading("Writing focus");
    for (let i of Object.values(this.tm.features.writingFocus))
      i.registerSetting(this);
    this.addHeading("Update notice and funding");
    for (let i of Object.values(this.tm.features.updates))
      i.registerSetting(this);
    let t = this.containerEl.createDiv();
    this.containerEl.appendChild(t),
      b.MarkdownRenderer.render(
        this.app,
        T,
        t,
        this.app.vault.getRoot().path,
        new b.Component()
      );
  }
}
class S {
  tm;
  constructor(t) {
    this.tm = t;
  }
  load() {}
}
function Ti(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}
class ut extends S {
  load() {
    for (let t of ["up", "down"])
      this.tm.plugin.addCommand({
        id: `move-typewriter-${t}`,
        name: `Move typewriter ${t}`,
        hotkeys: [
          { modifiers: ["Mod"], key: t === "up" ? "ArrowUp" : "ArrowDown" },
        ],
        editorCallback: (i, e) => this.onCommand(i, t),
      });
  }
  onCommand(t, i) {
    t.exec(`go${Ti(i)}`), window.dispatchEvent(new Event("moveByCommand"));
  }
}
class yt extends S {}
class bt extends yt {
  registerCommand() {
    this.tm.plugin.addCommand({
      id: this.commandKey,
      name: this.commandTitle,
      callback: this.onCommand.bind(this),
    });
  }
  load() {
    this.registerCommand();
  }
}
class u extends bt {
  registerCommand() {
    this.tm.plugin.addCommand({
      id: `${this.commandKey}-toggle`,
      name: `Toggle ${this.commandTitle}`,
      callback: this.onCommand.bind(this),
    }),
      this.tm.plugin.addCommand({
        id: `${this.commandKey}-enable`,
        name: `Enable ${this.commandTitle}`,
        callback: this.onEnable.bind(this),
      }),
      this.tm.plugin.addCommand({
        id: `${this.commandKey}-disable`,
        name: `Disable ${this.commandTitle}`,
        callback: this.onDisable.bind(this),
      });
  }
  onCommand() {
    this.featureToggle?.toggle();
  }
  onEnable() {
    this.featureToggle?.toggle(!0);
  }
  onDisable() {
    this.featureToggle?.toggle(!1);
  }
}
class St extends u {
  commandKey = "dimming";
  commandTitle = "dimming";
  featureToggle = this.tm.features.dimming.isDimUnfocusedEnabled;
}
class ft extends u {
  commandKey = "typewriter-mode-plugin";
  commandTitle = "typewriter mode plugin";
  featureToggle = this.tm.features.general.isPluginActivated;
}
class Ct extends u {
  commandKey = "typewriter";
  commandTitle = "typewriter scrolling";
  featureToggle = this.tm.features.typewriter.isTypewriterScrollEnabled;
}
class Tt extends u {
  featureToggle = null;
  commandKey = "typewriter-scrolling-and-paragraph-dimming";
  commandTitle = "typewriter scrolling and paragraph dimming";
  onCommand() {
    let t = this.tm.features.typewriter.isTypewriterScrollEnabled,
      i = this.tm.features.dimming.isDimUnfocusedEnabled,
      e = t.getSettingValue() && i.getSettingValue();
    t.toggle(!e), i.toggle(!e);
  }
  onEnable() {
    this.tm.features.typewriter.isTypewriterScrollEnabled.toggle(!0),
      this.tm.features.dimming.isDimUnfocusedEnabled.toggle(!0);
  }
  onDisable() {
    this.tm.features.typewriter.isTypewriterScrollEnabled.toggle(!1),
      this.tm.features.dimming.isDimUnfocusedEnabled.toggle(!1);
  }
}
var xt = require("obsidian"),
  Lt = require("obsidian");
class Mt {
  tm;
  constructor(t) {
    this.tm = t;
  }
  focusModeActive = !1;
  maximizedClass = "ptm-maximized";
  focusModeClass = "ptm-focus-mode";
  vignetteElClass = "ptm-writing-focus-vignette-element";
  vignetteStyleAttr = "data-ptm-writing-focus-vignette-style";
  leftSplitCollapsed = !1;
  rightSplitCollapsed = !1;
  prevWasFullscreen = !1;
  addVignette(t) {
    let i = this.tm.settings.doesWritingFocusShowHeader
      ? t.containerEl
      : t.contentEl;
    i.classList.add(this.vignetteElClass),
      i.setAttr(
        this.vignetteStyleAttr,
        this.tm.settings.writingFocusVignetteStyle
      );
  }
  removeVignette(t) {
    let i = this.tm.settings.doesWritingFocusShowHeader
      ? t.containerEl
      : t.contentEl;
    i.removeAttribute(this.vignetteStyleAttr),
      i.classList.remove(this.vignetteElClass);
  }
  startFullscreen(t) {
    if (Lt.Platform.isMobile) return;
    let i = window.electron.remote.getCurrentWindow();
    (this.prevWasFullscreen = i.isFullScreen()), i.setFullScreen(!0);
    let e = () => {
      this.onExitFullscreenWritingFocus(t), i.off("leave-full-screen", e);
    };
    i.on("leave-full-screen", e);
  }
  exitFullscreen() {
    if (Lt.Platform.isMobile) return;
    if (this.prevWasFullscreen) return;
    window.electron.remote.getCurrentWindow().setFullScreen(!1);
  }
  onExitFullscreenWritingFocus(t) {
    if (this.focusModeActive) this.disableFocusModeForView(t);
  }
  storeSplitsValues() {
    (this.leftSplitCollapsed =
      this.tm.plugin.app.workspace.leftSplit.collapsed),
      (this.rightSplitCollapsed =
        this.tm.plugin.app.workspace.rightSplit.collapsed);
  }
  collapseSplits() {
    this.tm.plugin.app.workspace.leftSplit.collapse(),
      this.tm.plugin.app.workspace.rightSplit.collapse();
  }
  restoreSplits() {
    if (!this.leftSplitCollapsed)
      this.tm.plugin.app.workspace.leftSplit.expand();
    if (!this.rightSplitCollapsed)
      this.tm.plugin.app.workspace.rightSplit.expand();
  }
  removeExtraneousClasses() {
    if (this.tm.plugin.app.workspace.containerEl.hasClass(this.maximizedClass))
      this.tm.plugin.app.workspace.containerEl.removeClass(this.maximizedClass);
    if (document.body.classList.contains(this.focusModeClass))
      document.body.classList.remove(this.focusModeClass);
  }
  enableFocusModeForView(t) {
    if (
      ((this.focusModeActive = !0),
      !document.body.classList.contains(this.focusModeClass))
    )
      this.storeSplitsValues();
    if (
      (this.collapseSplits(),
      this.tm.plugin.app.workspace.containerEl.toggleClass(
        this.maximizedClass,
        !this.tm.plugin.app.workspace.containerEl.hasClass(this.maximizedClass)
      ),
      document.body.classList.toggle(
        this.focusModeClass,
        !document.body.classList.contains(this.focusModeClass)
      ),
      document.body.classList.contains(this.focusModeClass))
    )
      Array.from(
        document.querySelectorAll(`.${this.focusModeClass} .workspace-split`)
      ).forEach((i) => {
        let e = i;
        if (e.querySelector(".mod-active")) e.style.display = "flex";
        else e.style.display = "none";
      });
    if (this.tm.settings.doesWritingFocusShowVignette) this.addVignette(t);
    if (this.tm.settings.isWritingFocusFullscreen) this.startFullscreen(t);
  }
  disableFocusModeForView(t) {
    if (
      (this.removeExtraneousClasses(),
      document.body.classList.contains(this.focusModeClass))
    )
      document.body.classList.remove(this.focusModeClass);
    if (
      (this.restoreSplits(),
      Array.from(document.querySelectorAll(".workspace-split")).forEach((i) => {
        let e = i;
        e.style.display = "flex";
      }),
      this.tm.settings.doesWritingFocusShowVignette)
    )
      this.removeVignette(t);
    if (this.tm.settings.isWritingFocusFullscreen) this.exitFullscreen();
    this.focusModeActive = !1;
  }
  enableFocusMode() {
    let t = this.tm.plugin.app.workspace.getActiveViewOfType(xt.ItemView);
    if (!t || t?.getViewType() === "empty") return;
    this.enableFocusModeForView(t);
  }
  disableFocusMode() {
    let t = this.tm.plugin.app.workspace.getActiveViewOfType(xt.ItemView);
    if (!t || t?.getViewType() === "empty") return;
    this.disableFocusModeForView(t);
  }
  toggleFocusMode() {
    this.focusModeActive ? this.disableFocusMode() : this.enableFocusMode();
  }
}
class Et extends u {
  featureToggle = null;
  commandKey = "writing-focus";
  commandTitle = "writing focus";
  writingFocus = new Mt(this.tm);
  onCommand() {
    this.writingFocus.toggleFocusMode();
  }
  onEnable() {
    this.writingFocus.enableFocusMode();
  }
  onDisable() {
    this.writingFocus.disableFocusMode();
  }
  async onload() {
    this.tm.plugin.addRibbonIcon("enter", "Toggle Writing Focus", (t) => {
      this.writingFocus.toggleFocusMode();
    });
  }
}
function jt(t) {
  return [ft, Ct, St, Tt, ut, Et].reduce((i, e) => {
    let r = new e(t);
    return (i[r.commandKey] = new e(t)), i;
  }, {});
}
function xi(t, i) {
  return Object.fromEntries(
    Object.entries(t).map(([e, r], n) => [e, i(r, e, n)])
  );
}
function Bt(t, i) {
  return xi(i, (e) => {
    return e.reduce((r, n) => {
      let o = new n(t);
      return (r[o.settingKey] = o), r;
    }, {});
  });
}
class a extends S {
  enable() {}
  disable() {}
  getBodyClasses() {
    return [];
  }
  getSettingKey() {
    return this.settingKey;
  }
  getSettingValue() {
    return this.tm.settings[this.settingKey];
  }
}
var qt = require("obsidian");
class f extends a {
  settingKey;
  themeMode;
  constructor(t, i) {
    super(t);
    (this.themeMode = i), (this.settingKey = `currentLineHighlightColor-${i}`);
  }
  registerSetting(t) {
    new qt.Setting(t.containerEl)
      .setName(`Current line highlight color in ${this.themeMode} themes`)
      .setDesc(
        `The color of the current line highlight in ${this.themeMode} themes`
      )
      .setClass("typewriter-mode-setting")
      .addText((i) =>
        i.setValue(this.getSettingValue()).onChange((e) => {
          this.changeCurrentLineHighlightColor(e);
        })
      );
  }
  load() {
    this.tm.setCSSVariable(
      `--current-line-highlight-color-${this.themeMode}`,
      `${this.getSettingValue()}`
    );
  }
  changeCurrentLineHighlightColor(t) {
    (this.tm.settings[this.settingKey] = t),
      this.tm.setCSSVariable(
        `--current-line-highlight-color-${this.themeMode}`,
        `${t}`
      ),
      this.tm.saveSettings().then();
  }
}
class w extends f {
  constructor(t) {
    super(t, "dark");
  }
}
class P extends f {
  constructor(t) {
    super(t, "light");
  }
}
var Gt = require("obsidian");
class H extends a {
  settingKey = "currentLineHighlightStyle";
  getBodyClasses() {
    return [
      "ptm-current-line-highlight-box",
      "ptm-current-line-highlight-underline",
    ];
  }
  registerSetting(t) {
    new Gt.Setting(t.containerEl)
      .setName("Current line highlight style")
      .setDesc("The style of the current line highlight")
      .setClass("typewriter-mode-setting")
      .addDropdown((i) =>
        i
          .addOption("box", "Box")
          .addOption("underline", "Underline")
          .setValue(this.tm.settings.currentLineHighlightStyle)
          .onChange((e) => {
            this.changeCurrentLineHighlightStyle(e), t.display();
          })
      );
  }
  load() {
    super.load(), this.applyClass();
  }
  applyClass() {
    let t = `ptm-current-line-highlight-${this.tm.settings.currentLineHighlightStyle}`;
    for (let i of this.getBodyClasses())
      this.tm.perWindowProps.bodyClasses.remove(i);
    this.tm.perWindowProps.bodyClasses.push(t);
  }
  changeCurrentLineHighlightStyle(t) {
    (this.tm.settings.currentLineHighlightStyle = t),
      this.applyClass(),
      this.tm.saveSettings().then();
  }
}
var Yt = require("obsidian");
class A extends a {
  settingKey = "currentLineHighlightUnderlineThickness";
  registerSetting(t) {
    new Yt.Setting(t.containerEl)
      .setName("Current line underline thickness")
      .setDesc(
        "The thickness of the underline that highlights the current line"
      )
      .setClass("typewriter-mode-setting")
      .addSlider((i) =>
        i
          .setLimits(1, 5, 1)
          .setDynamicTooltip()
          .setValue(this.tm.settings.currentLineHighlightUnderlineThickness)
          .onChange((e) => {
            this.changeCurrentLineHighlightUnderlineThickness(e);
          })
      );
  }
  load() {
    this.tm.setCSSVariable(
      "--current-line-highlight-underline-thickness",
      `${this.tm.settings.currentLineHighlightUnderlineThickness}px`
    );
  }
  changeCurrentLineHighlightUnderlineThickness(t) {
    (this.tm.settings.currentLineHighlightUnderlineThickness = t),
      this.tm.setCSSVariable(
        "--current-line-highlight-underline-thickness",
        `${t}px`
      ),
      this.tm.saveSettings();
  }
}
var _t = require("obsidian");
class s extends a {
  toggleClass = null;
  isToggleClassPersistent = !1;
  getBodyClasses() {
    if (this.toggleClass) return [this.toggleClass];
    return [];
  }
  isSettingEnabled() {
    return !0;
  }
  getToggleClass() {
    return this.toggleClass;
  }
  registerSetting(t) {
    new _t.Setting(t.containerEl)
      .setName(this.settingTitle)
      .setDesc(this.settingDesc)
      .setClass("typewriter-mode-setting")
      .addToggle((i) =>
        i.setValue(this.getSettingValue()).onChange((e) => {
          this.toggle(e), t.display();
        })
      )
      .setDisabled(!this.isSettingEnabled());
  }
  load() {
    this.tm.settings[this.settingKey] ? this.enable() : this.disable();
  }
  toggle(t = null) {
    let i = t;
    if (i === null) i = !this.getSettingValue();
    (this.tm.settings = { ...this.tm.settings, [this.settingKey]: i }),
      i ? this.enable() : this.disable(),
      this.tm.saveSettings().then();
  }
  enable() {
    if (this.toggleClass) {
      let t = this.isToggleClassPersistent
        ? "persistentBodyClasses"
        : "bodyClasses";
      if (!this.tm.perWindowProps[t].contains(this.toggleClass))
        this.tm.perWindowProps[t].push(this.toggleClass);
    }
  }
  disable() {
    if (this.toggleClass) {
      let t = this.isToggleClassPersistent
        ? "persistentBodyClasses"
        : "bodyClasses";
      this.tm.perWindowProps[t].remove(this.toggleClass);
    }
  }
}
class U extends s {
  settingKey = "isFadeLinesEnabled";
  toggleClass = "ptm-fade-lines";
  settingTitle = "Fade lines";
  settingDesc =
    "This places a gradient on the lines above and below the current line, making the text fade out more and more towards the top and bottom of the editor.";
}
var Jt = require("obsidian");
class k extends a {
  settingKey = "fadeLinesIntensity";
  registerSetting(t) {
    new Jt.Setting(t.containerEl)
      .setName("Intensity of the fade lines gradient")
      .setDesc("How soon lines shall be faded out")
      .setClass("typewriter-mode-setting")
      .addSlider((i) =>
        i
          .setLimits(0, 100, 5)
          .setDynamicTooltip()
          .setValue(this.tm.settings.fadeLinesIntensity * 100)
          .onChange((e) => {
            this.changeFadeLinesIntensity(e / 100);
          })
      );
  }
  load() {
    this.tm.setCSSVariable(
      "--ptm-fade-lines-intensity",
      `${this.tm.settings.fadeLinesIntensity * 100}%`
    );
  }
  changeFadeLinesIntensity(t = 0.5) {
    (this.tm.settings.fadeLinesIntensity = t),
      this.tm.setCSSVariable("--ptm-fade-lines-intensity", `${t * 100}%`),
      this.tm.saveSettings();
  }
}
class K extends s {
  settingKey = "isHighlightCurrentLineEnabled";
  toggleClass = "ptm-highlight-current-line";
  settingTitle = "Highlight current line";
  settingDesc = "Highlights the line that the cursor is currently on";
}
class $ extends s {
  settingKey = "isHighlightCurrentLineOnlyInFocusedEditorEnabled";
  toggleClass = "ptm-highlight-current-line-only-in-active-editor";
  hasCommand = !1;
  settingTitle = "Highlight current line only in focused note";
  settingDesc =
    "Only show highlighted line in the note your cursor is on (e.g. if you have multiple notes open in split panes)";
}
var Qt = [K, U, k, P, w, H, A, $];
class v extends s {
  settingKey = "isDimHighlightListParentEnabled";
  toggleClass = "ptm-dim-highlight-list-parent";
  settingTitle = "Highlight list parents";
  settingDesc =
    "If this is enabled, the parent items of the active list item are not dimmed";
}
class O extends s {
  settingKey = "isDimTableAsOneEnabled";
  toggleClass = "ptm-dim-table-as-one";
  settingTitle = "Undim all table cells when editing";
  settingDesc =
    "If this is enabled, all table cells are shown/not dimmed when you edit a table. If this is disabled, only the current table cell that you are editing is shown, while the other cells remain dimmed.";
}
class F extends s {
  settingKey = "isDimUnfocusedEnabled";
  toggleClass = "ptm-dim-unfocused";
  settingTitle = "Dim unfocused";
  settingDesc = "Dim unfocused paragraphs / sentences";
}
var Xt = require("obsidian");
class V extends a {
  settingKey = "dimUnfocusedEditorsBehavior";
  registerSetting(t) {
    new Xt.Setting(t.containerEl)
      .setName("Dimming behavior in unfocused notes")
      .setDesc(
        "How to dim paragraphs / sentences in notes / editors that your cursor is not on (e.g. if you have multiple notes open in split panes)"
      )
      .setClass("typewriter-mode-setting")
      .addDropdown((i) =>
        i
          .addOption("dim-none", "Do not dim anything")
          .addOption(
            "dim",
            "Dim all but the previously focused paragraph / sentence"
          )
          .addOption("dim-all", "Dim everything")
          .setValue(this.tm.settings.dimUnfocusedEditorsBehavior)
          .onChange((e) => {
            this.changeDimUnfocusedEditorsBehavior(e), t.display();
          })
      );
  }
  load() {
    super.load(),
      (this.tm.perWindowProps.bodyAttrs[
        "data-ptm-dim-unfocused-editors-behavior"
      ] = this.tm.settings.dimUnfocusedEditorsBehavior);
  }
  changeDimUnfocusedEditorsBehavior(t) {
    (this.tm.settings.dimUnfocusedEditorsBehavior = t),
      (this.tm.perWindowProps.bodyAttrs[
        "data-ptm-dim-unfocused-editors-behavior"
      ] = t),
      this.tm.saveSettings().then();
  }
}
var Zt = require("obsidian");
class W extends a {
  settingKey = "dimUnfocusedMode";
  registerSetting(t) {
    new Zt.Setting(t.containerEl)
      .setName("Dim unfocused mode")
      .setDesc("Choose to dim unfocused paragraphs or sentences")
      .setClass("typewriter-mode-setting")
      .addDropdown((i) =>
        i
          .addOption("paragraphs", "Paragraphs")
          .addOption("sentences", "Sentences")
          .setValue(this.tm.settings.dimUnfocusedMode)
          .onChange((e) => {
            this.change(e), t.display();
          })
      );
  }
  load() {
    super.load(),
      (this.tm.perWindowProps.bodyAttrs["data-ptm-dim-unfocused-mode"] =
        this.tm.settings.dimUnfocusedMode);
  }
  change(t) {
    (this.tm.settings.dimUnfocusedMode = t),
      (this.tm.perWindowProps.bodyAttrs["data-ptm-dim-unfocused-mode"] =
        this.tm.settings.dimUnfocusedMode),
      this.tm.saveSettings().then();
  }
}
var Rt = require("obsidian");
class I extends a {
  settingKey = "dimmedOpacity";
  registerSetting(t) {
    new Rt.Setting(t.containerEl)
      .setName("Opacity of dimmed elements")
      .setDesc("The opacity of dimmed elements")
      .setClass("typewriter-mode-setting")
      .addSlider((i) =>
        i
          .setLimits(0, 100, 5)
          .setDynamicTooltip()
          .setValue(this.tm.settings.dimmedOpacity * 100)
          .onChange((e) => {
            this.changeDimmedOpacity(e / 100);
          })
      );
  }
  load() {
    this.tm.setCSSVariable(
      "--dimmed-opacity",
      `${this.tm.settings.dimmedOpacity}`
    );
  }
  changeDimmedOpacity(t = 0.25) {
    (this.tm.settings.dimmedOpacity = t),
      this.tm.setCSSVariable("--dimmed-opacity", `${t}`),
      this.tm.saveSettings();
  }
}
class j extends s {
  settingKey = "isPauseDimUnfocusedWhileScrollingEnabled";
  toggleClass = "ptm-dim-unfocused-pause-while-scrolling";
  settingTitle = "Pause dimming while scrolling";
  settingDesc =
    "If this is enabled, paragraphs / sentences are not dimmed while scrolling";
}
class B extends s {
  settingKey = "isPauseDimUnfocusedWhileSelectingEnabled";
  toggleClass = "ptm-dim-unfocused-pause-while-selecting";
  settingTitle = "Pause dimming while selecting text";
  settingDesc =
    "If this is enabled, paragraphs / sentences are not dimmed while selecting text";
}
var zt = [F, W, v, O, I, j, B, V];
class q extends s {
  settingKey = "isOnlyActivateAfterFirstInteractionEnabled";
  settingTitle = "Only activate after first interaction";
  settingDesc =
    "Activate the focused line highlight and paragraph dimming only after the first interaction with the editor";
}
class G extends s {
  settingKey = "isPluginActivated";
  toggleClass = "ptm-plugin-activated";
  settingTitle = "Activate Typewriter Mode";
  settingDesc = "This enables or disables all the features below.";
}
var Dt = [G, q];
class Y extends s {
  settingKey = "isKeepLinesAboveAndBelowEnabled";
  settingTitle = "Keep lines above and below";
  settingDesc =
    "When enabled, always keeps the specified amount of lines above and below the current line in view";
  isSettingEnabled() {
    return !this.tm.settings.isTypewriterScrollEnabled;
  }
}
var Nt = require("obsidian");
class _ extends a {
  settingKey = "linesAboveAndBelow";
  registerSetting(t) {
    new Nt.Setting(t.containerEl)
      .setName("Amount of lines above and below the current line")
      .setDesc(
        "The amount of lines to always keep above and below the current line"
      )
      .setClass("typewriter-mode-setting")
      .addText((i) =>
        i
          .setValue(this.tm.settings.linesAboveAndBelow.toString())
          .onChange((e) => {
            this.changeAmountOfLinesAboveAndBelow(Number.parseInt(e));
          })
      );
  }
  changeAmountOfLinesAboveAndBelow(t) {
    (this.tm.settings.linesAboveAndBelow = t), this.tm.saveSettings().then();
  }
}
var ti = [Y, _];
class J extends s {
  settingKey = "isMaxCharsPerLineEnabled";
  toggleClass = "ptm-max-chars-per-line";
  isToggleClassPersistent = !0;
  settingTitle = "Limit maximum number of characters per line";
  settingDesc = "Limits the maximum number of characters per line";
}
var ii = require("obsidian");
class Q extends a {
  settingKey = "maxCharsPerLine";
  registerSetting(t) {
    new ii.Setting(t.containerEl)
      .setName("Maximum number of characters per line")
      .setDesc("The maximum number of characters per line")
      .setClass("typewriter-mode-setting")
      .addText((i) =>
        i
          .setValue(this.tm.settings.maxCharsPerLine.toString())
          .onChange((e) => {
            this.changeMaxCharsPerLine(Number.parseInt(e));
          })
      );
  }
  load() {
    this.tm.setCSSVariable(
      "--max-chars-per-line",
      `${this.tm.settings.maxCharsPerLine}ch`
    );
  }
  changeMaxCharsPerLine(t) {
    (this.tm.settings.maxCharsPerLine = t),
      this.tm.setCSSVariable("--max-chars-per-line", `${t}ch`),
      this.tm.saveSettings();
  }
}
var ei = [J, Q];
class X extends s {
  settingKey = "isRestoreCursorPositionEnabled";
  settingTitle = "Restore cursor position";
  settingDesc = "Restore the last cursor position when opening files";
  stateFilePath = `${this.tm.plugin.manifest.dir}/cursor-positions.json`;
  state = {};
  enable() {
    super.enable(),
      this.loadState(),
      this.tm.plugin.registerEvent(
        this.tm.plugin.app.workspace.on("quit", this.saveState)
      ),
      this.tm.plugin.registerEvent(
        this.tm.plugin.app.vault.on("rename", this.onRenameFile)
      ),
      this.tm.plugin.registerEvent(
        this.tm.plugin.app.vault.on("delete", this.onDeleteFile)
      );
  }
  disable() {
    this.saveState(),
      this.tm.plugin.app.workspace.off("quit", this.saveState),
      this.tm.plugin.app.workspace.off("rename", this.onRenameFile),
      this.tm.plugin.app.workspace.off("delete", this.onDeleteFile);
  }
  async loadState() {
    if (await this.tm.plugin.app.vault.adapter.exists(this.stateFilePath)) {
      let t = await this.tm.plugin.app.vault.adapter.read(this.stateFilePath);
      this.state = JSON.parse(t);
    }
  }
  async saveState() {
    await this.tm.plugin.app.vault.adapter.write(
      this.stateFilePath,
      JSON.stringify(this.state)
    );
  }
  onRenameFile(t, i) {
    let e = t.path,
      r = i;
    (this.state[e] = this.state[r]), delete this.state[r];
  }
  onDeleteFile(t) {
    let i = t.path;
    delete this.state[i];
  }
  async setCursorState(t) {
    let i = this.tm.plugin.app.workspace.getActiveFile()?.path;
    if (!i) return;
    this.state[i] = t;
  }
}
var ri = [X];
class Z extends s {
  settingKey = "isOnlyMaintainTypewriterOffsetWhenReachedEnabled";
  hasCommand = !1;
  settingTitle = "Only maintain typewriter offset when reached";
  settingDesc =
    "The line that the cursor is on will not be scrolled to the center of the editor until it the specified typewriter offset is reached. This removes the additional space at the top of the editor.";
}
var ni = require("obsidian");
class R extends a {
  settingKey = "typewriterOffset";
  registerSetting(t) {
    new ni.Setting(t.containerEl)
      .setName("Typewriter offset")
      .setDesc(
        "Positions the typewriter line at the specified percentage of the screen"
      )
      .setClass("typewriter-mode-setting")
      .addSlider((i) =>
        i
          .setLimits(0, 100, 5)
          .setDynamicTooltip()
          .setValue(this.tm.settings.typewriterOffset * 100)
          .onChange((e) => {
            this.changeTypewriterOffset(e / 100);
          })
      );
  }
  changeTypewriterOffset(t) {
    (this.tm.settings.typewriterOffset = t), this.tm.saveSettings().then();
  }
}
class z extends s {
  settingKey = "isTypewriterOnlyUseCommandsEnabled";
  toggleClass = "ptm-typewriter-only-use-commands";
  settingTitle = "Do not snap typewriter with arrow keys";
  settingDesc =
    "The typewriter will only snap when using this plugin's move commands. It will not snap when using the arrow keys. The move commands are by default Cmd/Ctrl+ArrowUp/ArrowDown, but you can assign your own hotkeys for the move commands in Obsidian's settings.";
}
class D extends s {
  settingKey = "isTypewriterScrollEnabled";
  toggleClass = "ptm-typewriter-scroll";
  settingTitle = "Typewriter scrolling";
  settingDesc = "Turns typewriter scrolling on or off";
  isSettingEnabled() {
    return !this.tm.settings.isKeepLinesAboveAndBelowEnabled;
  }
}
var oi = [D, R, Z, z];
class N extends s {
  settingKey = "isAnnounceUpdatesEnabled";
  toggleClass = "ptm-announce-updates";
  settingTitle = "Announce updates";
  settingDesc =
    "If enabled you will get a notice with release notes whenever you install a new version of Typewriter Mode";
}
var si = [N];
class tt extends s {
  settingKey = "isWritingFocusFullscreen";
  settingTitle = "Make Obsidian fullscreen in writing focus";
  settingDesc =
    "If enabled, the Obsidian window will toggle to fullscreen when entering writing focus";
}
class it extends s {
  settingKey = "doesWritingFocusShowHeader";
  toggleClass = "ptm-writing-focus-shows-header";
  settingTitle = "Show header in writing focus";
  settingDesc = "If enabled, the header will be shown in writing focus";
}
class et extends s {
  settingKey = "doesWritingFocusShowStatusBar";
  toggleClass = "ptm-writing-focus-shows-status-bar";
  settingTitle = "Show status bar in writing focus";
  settingDesc = "If enabled, the status bar will be shown in writing focus";
}
class rt extends s {
  settingKey = "doesWritingFocusShowVignette";
  settingTitle = "Writing focus vignette";
  settingDesc = "Add a vignette to the edges of the screen in writing focus";
}
var mi = require("obsidian");
class nt extends a {
  settingKey = "writingFocusVignetteStyle";
  registerSetting(t) {
    new mi.Setting(t.containerEl)
      .setName("Writing focus vignette style")
      .setDesc("The style of the vignette in writing focus mode")
      .setClass("typewriter-mode-setting")
      .addDropdown((i) =>
        i
          .addOption("box", "Box")
          .addOption("column", "Column")
          .setValue(this.tm.settings.writingFocusVignetteStyle)
          .onChange((e) => {
            this.changeVignetteStyle(e), t.display();
          })
      );
  }
  changeVignetteStyle(t) {
    (this.tm.settings.writingFocusVignetteStyle = t),
      this.tm.saveSettings().then();
  }
}
var di = [it, et, tt, rt, nt];
function ai(t) {
  return Bt(t, {
    currentLine: Qt,
    dimming: zt,
    general: Dt,
    keepAboveAndBelow: ti,
    maxChar: ei,
    typewriter: oi,
    updates: si,
    writingFocus: di,
    restoreCursorPosition: ri,
  });
}
var wt = {
  version: null,
  isAnnounceUpdatesEnabled: !0,
  isPluginActivated: !0,
  isTypewriterScrollEnabled: !0,
  isOnlyActivateAfterFirstInteractionEnabled: !1,
  isOnlyMaintainTypewriterOffsetWhenReachedEnabled: !1,
  isTypewriterOnlyUseCommandsEnabled: !1,
  typewriterOffset: 0.5,
  isKeepLinesAboveAndBelowEnabled: !1,
  linesAboveAndBelow: 5,
  isMaxCharsPerLineEnabled: !1,
  maxCharsPerLine: 64,
  isDimUnfocusedEnabled: !1,
  isDimHighlightListParentEnabled: !1,
  isDimTableAsOneEnabled: !0,
  dimUnfocusedMode: "paragraphs",
  dimUnfocusedEditorsBehavior: "dim",
  dimmedOpacity: 0.25,
  isPauseDimUnfocusedWhileScrollingEnabled: !0,
  isPauseDimUnfocusedWhileSelectingEnabled: !0,
  isHighlightCurrentLineEnabled: !0,
  isFadeLinesEnabled: !1,
  fadeLinesIntensity: 0.5,
  isHighlightCurrentLineOnlyInFocusedEditorEnabled: !1,
  currentLineHighlightStyle: "box",
  currentLineHighlightUnderlineThickness: 1,
  "currentLineHighlightColor-dark": "#444",
  "currentLineHighlightColor-light": "#ddd",
  doesWritingFocusShowHeader: !1,
  doesWritingFocusShowStatusBar: !1,
  doesWritingFocusShowVignette: !0,
  isWritingFocusFullscreen: !0,
  writingFocusVignetteStyle: "box",
  isRestoreCursorPositionEnabled: !1,
};
class ot {
  plugin;
  loadData;
  saveData;
  settings = wt;
  perWindowProps = {
    cssVariables: {},
    bodyClasses: [],
    bodyAttrs: {},
    allBodyClasses: [],
    persistentBodyClasses: [],
  };
  editorExtensions;
  features;
  commands;
  constructor(t, i, e) {
    (this.plugin = t),
      (this.loadData = i),
      (this.saveData = e),
      (this.features = ai(this)),
      (this.commands = jt(this)),
      (this.editorExtensions = [ct(this), []]);
  }
  async load() {
    await this.loadSettings(),
      await this.saveSettings(),
      this.loadPerWindowProps(),
      this.loadEditorExtension();
  }
  loadPerWindowProps() {
    let t = [];
    for (let i of Object.values(this.features))
      for (let e of Object.values(i))
        e.load(), (t = t.concat(e.getBodyClasses()));
    this.perWindowProps.allBodyClasses = t;
    for (let i of Object.values(this.commands)) i.load();
  }
  getRestoreCursorPositionFeature() {
    return this.features.restoreCursorPosition.isRestoreCursorPositionEnabled;
  }
  loadEditorExtension() {
    this.plugin.registerEditorExtension(this.editorExtensions);
  }
  loadSettingsTab() {
    this.plugin.addSettingTab(new E(this.plugin.app, this));
  }
  unload() {
    for (let t of Object.values(this.features))
      for (let i of Object.values(t)) i.disable();
  }
  async loadSettings() {
    let t = await this.loadData();
    this.settings = Object.assign(wt, t);
  }
  async saveSettings() {
    await this.saveData(this.settings),
      this.plugin.app.workspace.updateOptions();
  }
  setCSSVariable(t, i) {
    this.perWindowProps.cssVariables[t] = i;
  }
}
class Pt extends hi.Plugin {
  tm;
  constructor(t, i) {
    super(t, i);
    this.tm = new ot(
      this,
      async () => await this.loadData(),
      async (e) => await this.saveData(e)
    );
  }
  async onload() {
    await this.tm.load(),
      this.tm.loadSettingsTab(),
      this.app.workspace.onLayoutReady(() => {
        this.announceUpdate();
      });
  }
  onunload() {
    this.tm.unload();
  }
  announceUpdate() {
    let t = this.manifest.version,
      i = this.tm.settings.version;
    if (!i) return;
    if (t === i) return;
    if (
      ((this.tm.settings.version = t),
      this.tm.saveSettings().then(),
      this.tm.settings.isAnnounceUpdatesEnabled === !1)
    )
      return;
    new mt(this.app, t, i).open();
  }
}

/* nosourcemap */
