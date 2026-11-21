/*
 * Claude Code appearance skin for DSH Web.
 *
 * Appearance only: this plugin never changes host logic, state, prompts or
 * message content. It registers four UI slots, one theme-token layer, two
 * <style> elements and one <html> attribute while enabled.
 *
 * Lifecycle contract
 *   - The toggle is registered at apply() time and stays mounted, so the skin
 *     can always be switched back on after switching it off.
 *   - Everything visual lives in the appearance effect: html[data-cc-theme],
 *     #dsh-claude-code-theme-skin, the token layer and the three brand slots.
 *     Turning the toggle off disposes all of it and leaves the stock UI.
 *   - No factory-level DOM, title, favicon or storage side effects.
 *
 * Hashed selectors live only inside SKIN_CSS and are listed together in the
 * "HASHED SELECTOR MAP" block below. If a DSH upgrade changes a CSS-module
 * hash, update that map and the matching selectors; the fallback selectors
 * ([class*="_markdown_"], [role="dialog"], ...) keep the base look working.
 */

window.__ModuleLoader__.load({
  id: 'claude-code-theme',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    // ------------------------------------------------------------------ meta
    const SOURCE = 'claude-code-theme';
    const NS = 'claude-code-theme';
    const STORAGE_KEY = 'dsh.plugin.claude-code-theme.v2';
    const CHROME_STYLE_ID = 'dsh-claude-code-theme-chrome';
    const SKIN_STYLE_ID = 'dsh-claude-code-theme-skin';
    const ATTR = 'data-cc-theme';

    const MONO =
      '"SFMono-Regular", "SF Mono", "JetBrains Mono", "Fira Code", "Cascadia Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", "PingFang SC", "Microsoft YaHei", monospace';

    const STAR_CLIP =
      'polygon(50% 0%, 58.5% 35.28%, 93.3% 25%, 67% 50%, 93.3% 75%, 58.5% 64.72%, 50% 100%, 41.5% 64.72%, 6.7% 75%, 33% 50%, 6.7% 25%, 41.5% 35.28%)';

    // --------------------------------------------------------------- palette
    // Dark values are duplicated into both theme slots on purpose: the user
    // chose a dark-only appearance, and the theme API requires {light,dark}.
    const PALETTE = {
      '--dsw-alias-bg-base': '#2d2c27',
      '--dsw-alias-bg-document-preview': '#2d2c27',
      '--dsw-alias-label-document-preview': '#efece4',
      '--dsw-alias-bg-layer-1': '#393630',
      '--dsw-alias-bg-layer-2': '#46413a',
      '--dsw-alias-bg-layer-3': '#514d46',
      '--dsw-alias-bg-layer-4': '#545048',
      '--dsw-alias-bg-overlay': '#3a3731',
      '--dsw-alias-bg-module-platform': '#393630',
      '--dsw-alias-bg-multi-select': '#393630',
      '--dsw-alias-bg-skeleton': 'rgba(255, 255, 255, 0.06)',
      '--dsw-alias-bg-mask-1': 'rgba(0, 0, 0, 0.6)',
      '--dsw-alias-bg-mask-2': 'rgba(0, 0, 0, 0.2)',
      '--dsw-alias-bg-mask-3': 'rgba(0, 0, 0, 0.5)',
      '--dsw-alias-bg-mask-photo': 'rgba(0, 0, 0, 0.88)',
      '--dsw-alias-bg-mask-drop': 'rgba(45, 44, 39, 0.7)',
      '--dsw-alias-border-l1': 'rgba(255, 255, 255, 0.06)',
      '--dsw-alias-border-l2': 'rgba(255, 255, 255, 0.12)',
      '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 255, 255, 0.06)',
      '--dsw-alias-border-l3': 'rgba(255, 255, 255, 0.18)',
      '--dsw-alias-border-l4': 'rgba(255, 255, 255, 0.26)',
      '--dsw-alias-border-inverted': 'rgba(255, 255, 255, 0.08)',
      '--dsw-alias-border-inverted2': 'rgba(255, 255, 255, 0.12)',
      '--dsw-alias-separator-primary': 'rgba(255, 255, 255, 0.06)',
      '--dsw-alias-brand-primary': '#e08a6d',
      '--dsw-alias-brand-primary-new-color': '#e08a6d',
      '--dsw-alias-brand-primary-new-colorprimary-new-color': '#e08a6d',
      '--dsw-alias-brand-primary-invert': '#f7f4ec',
      '--dsw-alias-brand-text': '#ffffff',
      '--dsw-alias-button-contrast-fill': '#ece8df',
      '--dsw-alias-button-elevated-fill': '#46413a',
      '--dsw-alias-button-floating-fill': '#47433b',
      '--dsw-alias-button-floating-hover': '#565147',
      '--dsw-alias-button-ghost-active-border': '#b5ad9e',
      '--dsw-alias-button-ghost-active-fill': '#4e4a46',
      '--dsw-alias-button-info-fill': '#e08a6d',
      '--dsw-alias-button-info-hover': '#eb9c80',
      '--dsw-alias-button-primary-fill': '#e08a6d',
      '--dsw-alias-button-primary-hover': '#eb9c80',
      '--dsw-alias-button-primary-dimmed': '#734e3e',
      '--dsw-alias-button-tool-bar-fill': 'rgba(100, 94, 86, 0.5)',
      '--dsw-alias-button-tool-bar-hover': 'rgba(130, 123, 112, 0.6)',
      '--dsw-alias-interactive-bg-hover': 'rgba(255, 255, 255, 0.05)',
      '--dsw-alias-interactive-bg-active': 'rgba(255, 255, 255, 0.09)',
      '--dsw-alias-interactive-bg-hover-solid': '#514d46',
      '--dsw-alias-interactive-bg-hover-accent': 'rgba(255, 255, 255, 0.1)',
      '--dsw-alias-interactive-bg-hover-danger': 'rgba(224, 108, 97, 0.15)',
      '--dsw-alias-hover-accent': 'rgba(255, 255, 255, 0.15)',
      '--dsw-alias-hover-danger': 'rgba(224, 108, 97, 0.15)',
      '--dsw-alias-hover-solid': '#544e47',
      '--dsw-alias-label-primary': '#ffffff',
      '--dsw-alias-label-primary-dimmed': '#f4f0e8',
      '--dsw-alias-label-primary-foreground': '#2d2c27',
      '--dsw-alias-label-primary-inverted': '#2d2c27',
      '--dsw-alias-label-primary-bluish': '#ffffff',
      '--dsw-alias-label-secondary': '#e9e5db',
      '--dsw-alias-label-tertiary': '#d9d4ca',
      '--dsw-alias-label-quaternary': '#c6c1b7',
      '--dsw-alias-label-caption': '#d2cdc3',
      '--dsw-alias-label-dimmed': '#b9b3a7',
      '--dsw-alias-label-shimmer': 'rgba(255, 255, 255, 0.5)',
      '--dsw-alias-label-error': '#e05b57',
      '--dsw-alias-label-deep-diving': '#e08a6d',
      '--dsw-alias-label-deep-diving-shimmer': '#f2bfa9',
      '--dsw-alias-menu-icon': '#e0dcd2',
      '--dsw-alias-link': '#f2b79e',
      '--dsw-alias-markdown-citation': '#46413a',
      '--dsw-alias-markdown-code-block': '#21201c',
      '--dsw-alias-markdown-code-block-banner': '#393630',
      '--dsw-alias-markdown-code-segment-selected': '#4e4a46',
      '--dsw-alias-markdown-code-segment-unselected': '#21201c',
      '--dsw-alias-markdown-inline-code': '#514d46',
      '--dsw-alias-markdown-placeholder': '#393630',
      '--dsw-alias-markdown-tag': '#4e4a46',
      '--dsw-alias-state-business-primary': '#e08a6d',
      '--dsw-alias-state-business-tertiary': '#6b4d3b',
      '--dsw-alias-state-error-primary': '#e05b57',
      '--dsw-alias-state-error-secondary': '#f29991',
      '--dsw-alias-state-idle-primary': '#a09888',
      '--dsw-alias-state-success-primary': '#92bf5c',
      '--dsw-alias-state-success-secondary': '#a8c99a',
      '--dsw-alias-state-success-tertiary': '#33462d',
      '--dsw-alias-state-warn-primary': '#d9a75a',
      '--dsw-alias-state-warn-secondary': '#e8c07a',
      '--dsw-alias-state-warn-tertiary': '#4b401d',
      '--dsw-alias-state-warn-label': '#e0b45e',
      '--dsw-alias-state-done-primary': '#a78bfa',
      '--dsw-alias-code-diff-added': 'rgba(127, 166, 80, 0.08)',
      '--dsw-alias-code-diff-deleted': 'rgba(224, 91, 87, 0.12)',
      '--dsw-alias-file-diff-added-bg': '#293d2c',
      '--dsw-alias-file-diff-added-gutter': '#203123',
      '--dsw-alias-file-diff-added-marker': '#6fce86',
      '--dsw-alias-file-diff-deleted-bg': '#432924',
      '--dsw-alias-file-diff-deleted-gutter': '#341d1a',
      '--dsw-alias-file-diff-deleted-marker': '#f27d72',
      '--dsw-alias-scrollbar-bg-l1': '#676157',
      '--dsw-alias-scrollbar-bg-l2': '#756e64',
      '--dsw-alias-scrollbar-hover-l1': '#827b70',
      '--dsw-alias-scrollbar-hover-l2': '#928a7e',
      '--dsw-alias-tooltip-bg': '#514d46',
      '--dsw-alias-tooltip-key-bg': '#6b665b',
      '--dsw-alias-toast-bg': '#514d46',
      '--dsw-alias-toast-label': '#f2eee8',
      '--dsw-alias-switch-thumb': '#ece8df',
      '--dsw-alias-turn-trigger-bg': '#393630',
      '--dsw-alias-turn-trigger-bg-hover': '#46413a',
      '--dsw-alias-hovercard-bg': '#46413a',
      '--dsw-specific-bubble': '#46413a',
      '--dsw-specific-bubble-highlight': '#6b5647',
      '--dsw-specific-input-major': '#302d29',
      '--dsw-specific-login-input': '#302d29',
      '--dsw-specific-menu': '#46413a',
      '--dsw-menu-surface-fill': '#46413a',
      '--dsw-specific-selector': '#4e4a46',
      '--dsw-specific-sidebar-fill': '#302d29',
      '--dsw-specific-sidebar-nav-item-active': '#48443d',
      '--dsw-specific-sidebar-nav-item-active-accent': '#6b5143',
      '--dsw-specific-tip': '#46413a',
      '--dsw-font-family': MONO,
      '--dsw-font-family-brand': MONO,
      '--ds-font-family-code': MONO,
      '--dsw-radius-xs': '2px',
      '--dsw-radius-sm': '2px',
      '--dsw-radius-md': '3px',
      '--dsw-radius-lg': '3px',
      '--dsw-radius-xl': '4px',
      '--dsw-radius-panel': '4px',
      '--dsw-elevation-stroke-color': 'var(--dsw-alias-border-l1)',
      '--dsw-elevation-stroke': '0 0 0 1px var(--dsw-alias-border-l1)',
      '--dsw-elevation-soft': '0 0 0 1px var(--dsw-alias-border-l1)',
      '--dsw-elevation-panel': '0 0 0 1px var(--dsw-alias-border-l1)',
      '--dsw-elevation-prominent': '0 0 0 1px var(--dsw-alias-border-l2)',
      '--dsw-shadow-lv1': 'none',
      '--dsw-shadow-lv2': 'none',
      '--dsw-shadow-lv3': 'none',
      '--dsw-menu-backdrop-filter': 'none',
      '--dsw-mask-blur': 'none',
      '--dsw-focus-ring-color': '#e08a6d',
      '--dsw-focus-ring-width': '1px',
    };

    const TOKENS = {};
    for (const name of Object.keys(PALETTE)) {
      TOKENS[name] = { light: PALETTE[name], dark: PALETTE[name] };
    }

    const PALETTE_CSS = (() => {
      const body =
        'html[data-cc-theme="on"] body,' +
        'html[data-cc-theme="on"] body[data-ds-dark-theme]{' +
        Object.keys(PALETTE)
          .map((name) => name + ':' + PALETTE[name] + ' !important;')
          .join('') +
        '}';
      return body;
    })();

    // ---------------------------------------------------------------- chrome
    // Present whenever the plugin is loaded, including while the skin is off.
    const CHROME_CSS = `
.cc-star-mark {
  display: inline-block;
  flex: none;
  background: currentColor;
  clip-path: polygon(50% 0%, 58.5% 35.28%, 93.3% 25%, 67% 50%, 93.3% 75%, 58.5% 64.72%, 50% 100%, 41.5% 64.72%, 6.7% 75%, 33% 50%, 6.7% 25%, 41.5% 35.28%);
}
.cc-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 28px;
  min-width: 28px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 2px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary, #b7b2a7);
  font-family: ${MONO};
  font-size: 11px;
  line-height: 1;
  letter-spacing: 0;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
}
.cc-toggle:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.05));
  color: var(--dsw-alias-label-primary, #f7f4ec);
}
.cc-toggle[data-on="true"] {
  color: var(--dsw-alias-brand-primary, #e08a6d);
  border-color: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.12));
}
.cc-toggle[data-on="true"]:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, 0.05));
}
.cc-toggle[data-wide="true"] {
  min-width: 0;
  padding: 0 10px 0 8px;
}
.cc-toggle[data-wide="false"] .cc-toggle-label {
  display: none;
}
.cc-toggle .cc-toggle-star {
  width: 14px;
  height: 14px;
}
.cc-toggle-label {
  white-space: nowrap;
}
.cc-toggle-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--dsw-alias-label-dimmed, #8e877b);
}
.cc-toggle[data-on="true"] .cc-toggle-dot {
  background: var(--dsw-alias-brand-primary, #e08a6d);
}
`;

    // ------------------------------------------------------------------ skin
    const SKIN_CSS = `
/* =====================================================================
 * HASHED SELECTOR MAP (update here when DSH upgrades a CSS module)
 *   shell       .pI_x6G_
 *   sidebar     .hHd-Xa_
 *   header      .wSkVaW_
 *   hero        .pXSMma_
 *   composer    .uV2eYG_
 *   chat item   .Sixlwa_
 *   assistant   .hWmORq_
 *   running     .EvIC1a_
 *   tools       .o3BgMG_  .CY-8Ka_  .DXqwVW_  .ztWv_q_
 *   model pill  ._7KE1Ra_  (composer "Model · effort" trigger; hidden)
 *   account     .yHnPSG_  (sidebar-foot account trigger; its label hidden)
 * Fallbacks that do not depend on hashes: [data-message-bubble],
 * [class*="_markdown_"], [role="dialog"|"menu"|"tooltip"], tokens.
 * ===================================================================== */

html[data-cc-theme="on"] {
  color-scheme: dark;
  --cc-bg: #2d2c27;
  --cc-panel: #393630;
  --cc-panel-2: #46413a;
  --cc-panel-3: #514d46;
  --cc-line: #666057;
  --cc-line-strong: #878073;
  --cc-text: #ffffff;
  --cc-dim: #e9e5db;
  --cc-faint: #d4cfc5;
  --cc-accent: #e08a6d;
  --cc-accent-hover: #eb9c80;
  --cc-accent-dim: #6b4b3e;
  --cc-code: #21201c;
  --cc-mono: ${MONO};
  --cc-star-clip: polygon(50% 0%, 58.5% 35.28%, 93.3% 25%, 67% 50%, 93.3% 75%, 58.5% 64.72%, 50% 100%, 41.5% 64.72%, 6.7% 75%, 33% 50%, 6.7% 25%, 41.5% 35.28%);
}

html[data-cc-theme="on"] body {
  background: var(--cc-bg) !important;
  color: var(--cc-text);
  font-family: var(--cc-mono) !important;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
html[data-cc-theme="on"] body * {
  font-family: var(--cc-mono) !important;
}
html[data-cc-theme="on"] ::selection {
  background: rgba(224, 138, 109, 0.28);
  color: var(--cc-text);
}
html[data-cc-theme="on"] :focus-visible {
  outline: 1px solid var(--cc-accent);
  outline-offset: 1px;
}
html[data-cc-theme="on"] * {
  scrollbar-width: thin;
  scrollbar-color: #6b665a transparent;
}
html[data-cc-theme="on"] *::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}
html[data-cc-theme="on"] *::-webkit-scrollbar-track {
  background: transparent;
}
html[data-cc-theme="on"] *::-webkit-scrollbar-thumb {
  background: #6b665a;
  border: 2px solid var(--cc-bg);
  border-radius: 0;
}
html[data-cc-theme="on"] *::-webkit-scrollbar-thumb:hover {
  background: #6b645b;
}

/* ---- shell ---------------------------------------------------------- */
html[data-cc-theme="on"] .pI_x6G_frame {
  background: var(--cc-bg);
}
html[data-cc-theme="on"] .pI_x6G_sidebarCol {
  background: var(--cc-panel) !important;
  border-right: 1px solid var(--cc-line) !important;
}
html[data-cc-theme="on"] .pI_x6G_centerCol {
  background: var(--cc-bg) !important;
}
html[data-cc-theme="on"] .pI_x6G_rightbarCol {
  background: var(--cc-panel) !important;
  border-left: 1px solid var(--cc-line) !important;
}
html[data-cc-theme="on"] .pI_x6G_mainPanel,
html[data-cc-theme="on"] .pI_x6G_bottomRow {
  background: var(--cc-bg);
}
/* Stock overlayLayer is transparent (inset:0, z-index:20) and spans the
 * whole shell, so ANY background here dims the entire UI. A 0.4 black fill
 * used to put a permanent 0.6 multiplier on every pixel. Keep it clear. */
html[data-cc-theme="on"] .pI_x6G_overlayLayer {
  background: transparent;
}

/* ---- sidebar -------------------------------------------------------- */
html[data-cc-theme="on"] .hHd-Xa_root {
  color: var(--cc-dim);
}
html[data-cc-theme="on"] .hHd-Xa_logoRow {
  padding: 6px 8px;
}
html[data-cc-theme="on"] .hHd-Xa_brand {
  border-radius: 0 !important;
}
html[data-cc-theme="on"] .hHd-Xa_brandIdentity {
  gap: 8px;
}
html[data-cc-theme="on"] .hHd-Xa_brandMark {
  color: var(--cc-accent);
}
html[data-cc-theme="on"] .hHd-Xa_brandName {
  color: var(--cc-text);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
}
html[data-cc-theme="on"] .cc-brand-name {
  color: var(--cc-text);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
}
html[data-cc-theme="on"] .cc-brand-mark {
  color: var(--cc-accent);
}
html[data-cc-theme="on"] .hHd-Xa_newSession {
  min-height: 30px;
  border: 1px solid var(--cc-line) !important;
  border-radius: 2px !important;
  background: transparent !important;
  color: var(--cc-dim) !important;
  font-size: 12px;
  font-weight: 500;
}
html[data-cc-theme="on"] .hHd-Xa_newSession:hover {
  border-color: var(--cc-line-strong) !important;
  background: var(--cc-panel-2) !important;
  color: var(--cc-text) !important;
}
html[data-cc-theme="on"] .hHd-Xa_panelRow {
  border-radius: 2px !important;
  font-size: 12px;
}
html[data-cc-theme="on"] .hHd-Xa_panelActive {
  background: var(--cc-panel-2) !important;
  box-shadow: inset 2px 0 0 var(--cc-accent) !important;
}
html[data-cc-theme="on"] .hHd-Xa_panelIcon {
  color: var(--cc-faint);
}
html[data-cc-theme="on"] .hHd-Xa_footArea {
  border-top: 1px solid var(--cc-line);
}
html[data-cc-theme="on"] .hHd-Xa_footerActions {
  gap: 6px;
}
html[data-cc-theme="on"] .hHd-Xa_iconButton {
  width: 28px;
  height: 28px;
  border-radius: 2px !important;
  color: var(--cc-faint);
}
html[data-cc-theme="on"] .hHd-Xa_iconButton:hover {
  background: var(--cc-panel-2) !important;
  color: var(--cc-text);
}
html[data-cc-theme="on"] .hHd-Xa_copyVersion,
html[data-cc-theme="on"] .hHd-Xa_buildVersion,
html[data-cc-theme="on"] .hHd-Xa_localBuildBrand {
  color: var(--cc-faint);
  font-size: 10.5px;
}
/* The sidebar-foot account row (settings.launcher occupant) reads like the
 * Claude Code status line: the avatar icon stays, the "Signed in to …" /
 * account-name label is hidden. Pure CSS — the account menu, its handlers and
 * /login are untouched, and turning the toggle off brings the label back. */
html[data-cc-theme="on"] .yHnPSG_trigger .yHnPSG_label {
  display: none !important;
}

/* ---- header --------------------------------------------------------- */
html[data-cc-theme="on"] .wSkVaW_header {
  min-height: 50px;
  padding: 8px 20px 0;
  border-bottom: 1px solid var(--cc-line) !important;
  background: var(--cc-bg) !important;
}
html[data-cc-theme="on"] .wSkVaW_crumbs {
  gap: 2px;
}
html[data-cc-theme="on"] .wSkVaW_crumb {
  border-radius: 0 !important;
  padding: 2px 4px;
  color: var(--cc-faint);
  font-size: 12px;
}
html[data-cc-theme="on"] .wSkVaW_crumbCurrent {
  color: var(--cc-text);
  font-weight: 600;
}
html[data-cc-theme="on"] .wSkVaW_tabs {
  gap: 18px;
}
html[data-cc-theme="on"] .wSkVaW_tab {
  color: var(--cc-faint);
  font-size: 12px;
  letter-spacing: 0;
  text-transform: none;
}
html[data-cc-theme="on"] .wSkVaW_tabActive {
  color: var(--cc-text);
}
html[data-cc-theme="on"] .wSkVaW_tabActive::after {
  height: 2px;
  background: var(--cc-accent);
}

/* ---- hero ----------------------------------------------------------- */
html[data-cc-theme="on"] .pXSMma_stack {
  position: relative;
  padding: 26px 24px 20px;
  border: 1px solid var(--cc-line-strong);
  border-radius: 2px;
  background: var(--cc-panel);
}
html[data-cc-theme="on"] .pXSMma_stack::before {
  content: "\\273B  Claude Code";
  position: absolute;
  top: -9px;
  left: 16px;
  padding: 0 7px;
  background: var(--cc-panel);
  color: var(--cc-accent);
  font-size: 11.5px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0.06em;
}
html[data-cc-theme="on"] .pXSMma_headline {
  gap: 8px;
  color: var(--cc-text);
  font-size: 15px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0;
}
html[data-cc-theme="on"] .pXSMma_titleGroup {
  gap: 6px;
}
html[data-cc-theme="on"] .pXSMma_previewBadge {
  padding: 0 5px;
  border: 1px solid var(--cc-line);
  border-radius: 2px;
  background: transparent;
  color: var(--cc-faint);
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
html[data-cc-theme="on"] .pXSMma_workspace {
  border: 1px solid var(--cc-line);
  border-radius: 2px !important;
  background: transparent !important;
  color: var(--cc-faint);
  font-size: 11px;
}
html[data-cc-theme="on"] .pXSMma_workspace:hover {
  border-color: var(--cc-line-strong);
  color: var(--cc-dim);
}
html[data-cc-theme="on"] .cc-hero-star {
  color: var(--cc-accent);
  filter: none;
}

/* ---- composer ------------------------------------------------------- */
html[data-cc-theme="on"] .uV2eYG_card {
  border: 1px solid var(--cc-line-strong) !important;
  border-radius: 2px !important;
  background: var(--cc-panel) !important;
  box-shadow: none !important;
}
html[data-cc-theme="on"] .uV2eYG_card:focus-within {
  border-color: var(--cc-accent-dim) !important;
}
html[data-cc-theme="on"] .uV2eYG_grow {
  position: relative;
}
html[data-cc-theme="on"] .uV2eYG_grow::before {
  content: ">";
  position: absolute;
  top: 5px;
  left: 12px;
  color: var(--cc-accent);
  font-size: 13px;
  font-weight: 700;
  line-height: 21px;
  pointer-events: none;
}
html[data-cc-theme="on"] .uV2eYG_input {
  min-height: 32px;
  padding-left: 28px !important;
  border-radius: 0;
  color: var(--cc-text);
  font-size: 13px;
  line-height: 21px;
  caret-color: var(--cc-accent);
}
html[data-cc-theme="on"] .uV2eYG_placeholder {
  left: 28px !important;
  color: var(--cc-faint);
  font-size: 13px;
  line-height: 21px;
}
html[data-cc-theme="on"] .uV2eYG_row {
  padding: 2px 8px 8px;
}
html[data-cc-theme="on"] .uV2eYG_add {
  width: 24px;
  height: 24px;
  border: 1px solid var(--cc-line);
  border-radius: 2px !important;
  background: transparent !important;
  color: var(--cc-faint);
}
html[data-cc-theme="on"] .uV2eYG_add:hover {
  background: var(--cc-panel-2) !important;
  color: var(--cc-text);
}
html[data-cc-theme="on"] .uV2eYG_primary {
  width: 26px;
  height: 26px;
  border-radius: 2px !important;
  background: var(--cc-accent) !important;
  color: #302d29 !important;
  box-shadow: none !important;
}
html[data-cc-theme="on"] .uV2eYG_primary:hover {
  background: var(--cc-accent-hover) !important;
}
html[data-cc-theme="on"] .uV2eYG_select {
  height: 26px;
  border-radius: 2px !important;
  background: transparent !important;
  color: var(--cc-faint);
  font-size: 11px;
}
html[data-cc-theme="on"] .uV2eYG_notice {
  color: var(--cc-faint);
  font-size: 11px;
  line-height: 1.5;
}
html[data-cc-theme="on"] .uV2eYG_dock {
  color: var(--cc-faint);
  font-size: 11px;
}
/* The Claude Code CLI has no model picker in the prompt row, so the shipped
 * "model · effort" pill is hidden while the skin is on. This is pure CSS: the
 * slot occupant, its handlers and the /model command are untouched, and
 * turning the toggle off brings the pill straight back. */
html[data-cc-theme="on"] ._7KE1Ra_root {
  display: none !important;
}

/* ---- conversation header / options --------------------------------- */
html[data-cc-theme="on"] .wSkVaW_heroOptions {
  gap: 12px;
  color: var(--cc-faint);
  font-size: 11px;
}

/* ---- user message --------------------------------------------------- */
html[data-cc-theme="on"] .Sixlwa_userRow {
  align-items: flex-start;
  gap: 0;
}
html[data-cc-theme="on"] .Sixlwa_userStack {
  align-items: flex-start;
  gap: 6px;
  width: 100%;
  max-width: 100% !important;
}
html[data-cc-theme="on"] [data-message-bubble] {
  position: relative;
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 0 0 20px !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--cc-text);
  font-size: 13px;
  line-height: 21px;
}
html[data-cc-theme="on"] [data-message-bubble]::before {
  content: ">";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--cc-accent);
  font-weight: 700;
}
html[data-cc-theme="on"] .Sixlwa_attachmentRow {
  justify-content: flex-start;
  gap: 6px;
}
html[data-cc-theme="on"] .Sixlwa_fileCard {
  border: 1px solid var(--cc-line);
  border-radius: 2px !important;
  background: var(--cc-panel-2) !important;
  box-shadow: none !important;
}
html[data-cc-theme="on"] .Sixlwa_fileName {
  color: var(--cc-dim);
  font-size: 11.5px;
}
html[data-cc-theme="on"] .Sixlwa_fileMeta {
  color: var(--cc-faint);
  font-size: 10.5px;
}

/* ---- assistant message --------------------------------------------- */
html[data-cc-theme="on"] .hWmORq_root {
  position: relative;
  padding-left: 22px;
  color: var(--cc-text);
  font-size: 13px;
  line-height: 1.65;
}
html[data-cc-theme="on"] .hWmORq_root::before {
  content: "\\25CF";
  position: absolute;
  left: 2px;
  top: 0;
  color: var(--cc-accent);
  font-size: 11px;
  line-height: 21px;
}
html[data-cc-theme="on"] .hWmORq_body {
  gap: 10px;
}
html[data-cc-theme="on"] .hWmORq_stopped {
  color: var(--cc-faint);
  font-size: 11px;
}
html[data-cc-theme="on"] .xzv4MW_action {
  color: var(--cc-faint);
  font-size: 11px;
}

/* ---- markdown ------------------------------------------------------- */
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) {
  color: var(--cc-text);
  font-size: 13px;
  line-height: 1.65;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) p {
  margin: 0 0 10px;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) p:last-child {
  margin-bottom: 0;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) h1,
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) h2,
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) h3,
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) h4 {
  margin: 18px 0 8px;
  color: var(--cc-text);
  font-weight: 600;
  letter-spacing: 0;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) h1 { font-size: 16px; line-height: 24px; }
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) h2 { font-size: 15px; line-height: 22px; }
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) h3 { font-size: 14px; line-height: 21px; }
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) h4 { font-size: 13px; line-height: 20px; }
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) a {
  color: var(--cc-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) code {
  padding: 0 5px;
  border: 1px solid var(--cc-line);
  border-radius: 2px;
  background: var(--cc-panel-3);
  color: #f2bfa9;
  font-size: 12px;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) pre {
  margin: 10px 0;
  padding: 12px 14px;
  border: 1px solid var(--cc-line);
  border-radius: 2px;
  background: var(--cc-code) !important;
  overflow: auto;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) pre code {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent !important;
  color: inherit;
  font-size: 12px;
  line-height: 1.6;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) blockquote {
  margin: 10px 0;
  padding: 2px 0 2px 12px;
  border-left: 2px solid var(--cc-accent-dim);
  color: var(--cc-dim);
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) ul,
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) ol {
  padding-left: 22px;
  margin: 0 0 10px;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) li {
  margin: 2px 0;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) li::marker {
  color: var(--cc-accent);
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) hr {
  margin: 16px 0;
  border: 0;
  border-top: 1px solid var(--cc-line);
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) table {
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 12px;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) th,
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) td {
  padding: 5px 9px;
  border: 1px solid var(--cc-line);
  text-align: left;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) th {
  background: var(--cc-panel-2);
  font-weight: 600;
}
html[data-cc-theme="on"] :is(.hWmORq_body, [class*="_markdown_"]) img {
  max-width: 100%;
  border: 1px solid var(--cc-line);
  border-radius: 2px;
}

/* ---- running indicator --------------------------------------------- */
html[data-cc-theme="on"] .EvIC1a_running {
  color: var(--cc-dim);
  font-size: 12px;
}
html[data-cc-theme="on"] .EvIC1a_runningWhaleAnimated,
html[data-cc-theme="on"] .EvIC1a_runningWhaleStill {
  display: none !important;
}
html[data-cc-theme="on"] .EvIC1a_runningIcon {
  overflow: visible !important;
}
html[data-cc-theme="on"] .EvIC1a_runningIcon::before {
  content: "";
  display: block;
  width: 13px;
  height: 13px;
  background: var(--cc-accent);
  clip-path: var(--cc-star-clip);
  animation: cc-star-spin 1.6s linear infinite;
}
html[data-cc-theme="on"] .EvIC1a_runningText {
  color: var(--cc-dim);
}
html[data-cc-theme="on"] .EvIC1a_runningDivider {
  background: var(--cc-line);
}
html[data-cc-theme="on"] .EvIC1a_toBottom {
  color: var(--cc-faint);
}
@keyframes cc-star-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  html[data-cc-theme="on"] .EvIC1a_runningIcon::before {
    animation: none;
  }
}

/* ---- tool cards ----------------------------------------------------- */
html[data-cc-theme="on"] .o3BgMG_root {
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
html[data-cc-theme="on"] .o3BgMG_row {
  position: relative;
  padding: 3px 0 !important;
  color: var(--cc-dim);
  font-size: 12.5px;
}
html[data-cc-theme="on"] .o3BgMG_row::before {
  content: "\\25CF";
  position: absolute;
  left: -14px;
  top: 4px;
  color: var(--cc-accent);
  font-size: 9px;
  line-height: 18px;
}
html[data-cc-theme="on"] .o3BgMG_title {
  color: var(--cc-dim);
  font-size: 12.5px;
  font-weight: 500;
}
html[data-cc-theme="on"] .o3BgMG_leading {
  width: 14px;
  color: var(--cc-faint);
  opacity: 0.6;
}
html[data-cc-theme="on"] .o3BgMG_ioCard {
  position: relative;
  margin: 2px 0 6px;
  padding: 0 0 0 22px;
  border: 0;
  border-left: 1px solid var(--cc-line);
  border-radius: 0;
  background: transparent;
}
html[data-cc-theme="on"] .o3BgMG_ioCard::before {
  content: "\\23BF";
  position: absolute;
  left: 7px;
  top: 1px;
  color: var(--cc-faint);
  font-size: 11px;
  line-height: 18px;
}
html[data-cc-theme="on"] .o3BgMG_ioLabel {
  color: var(--cc-faint);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
html[data-cc-theme="on"] .o3BgMG_ioText {
  color: var(--cc-dim);
  font-size: 12px;
  line-height: 1.55;
}
html[data-cc-theme="on"] .o3BgMG_terminalBody,
html[data-cc-theme="on"] .o3BgMG_codeBody {
  padding: 10px 12px;
  border: 1px solid var(--cc-line);
  border-radius: 2px;
  background: var(--cc-code);
  color: var(--cc-dim);
  font-size: 12px;
  line-height: 1.55;
  overflow: auto;
}
html[data-cc-theme="on"] .o3BgMG_summary {
  color: var(--cc-faint);
  font-size: 11px;
}
html[data-cc-theme="on"] .CY-8Ka_card,
html[data-cc-theme="on"] .fsXYAq_card {
  border: 1px solid var(--cc-line) !important;
  border-radius: 2px !important;
  background: var(--cc-panel) !important;
  box-shadow: none !important;
}
html[data-cc-theme="on"] .CY-8Ka_terminal,
html[data-cc-theme="on"] .CY-8Ka_ioCard,
html[data-cc-theme="on"] .fsXYAq_terminal {
  border: 0;
  border-radius: 2px;
  background: var(--cc-code) !important;
  color: var(--cc-dim);
  font-size: 12px;
  line-height: 1.55;
}
html[data-cc-theme="on"] .DXqwVW_root,
html[data-cc-theme="on"] .DXqwVW_code {
  border: 1px solid var(--cc-line) !important;
  border-radius: 2px !important;
  background: var(--cc-code) !important;
  box-shadow: none !important;
}
html[data-cc-theme="on"] .ztWv_q_callRow {
  padding: 1px 0 1px 12px;
  border-left: 1px solid var(--cc-line);
  color: var(--cc-faint);
  font-size: 11.5px;
}
html[data-cc-theme="on"] .ztWv_q_callRow:hover {
  color: var(--cc-dim);
}

/* ---- overlays (dialogs, menus, tooltips) ---------------------------- */
html[data-cc-theme="on"] [role="dialog"] {
  background: var(--cc-panel-2) !important;
  border: 1px solid var(--cc-line-strong) !important;
  border-radius: 3px !important;
  box-shadow: none !important;
  color: var(--cc-text);
}
html[data-cc-theme="on"] [role="menu"] {
  background: var(--cc-panel-2) !important;
  border: 1px solid var(--cc-line) !important;
  border-radius: 2px !important;
  box-shadow: none !important;
  color: var(--cc-text);
}
html[data-cc-theme="on"] [role="tooltip"] {
  background: var(--cc-panel-3) !important;
  border: 1px solid var(--cc-line) !important;
  border-radius: 2px !important;
  box-shadow: none !important;
  color: var(--cc-dim) !important;
  font-size: 11.5px;
}
html[data-cc-theme="on"] [class*="_dialog_"] {
  border-radius: 3px !important;
}
html[data-cc-theme="on"] [class*="_modal_"] {
  border-radius: 3px !important;
}
`;

    // --------------------------------------------------------------- locale
    const EN = {
      'brand.name': 'Claude Code',
      'toggle.on': 'Claude Code appearance is on. Click to turn off.',
      'toggle.off': 'Claude Code appearance is off. Click to turn on.',
    };
    const ZH = {
      'brand.name': 'Claude Code',
      'toggle.on': 'Claude Code 外观已开启，点击关闭。',
      'toggle.off': 'Claude Code 外观已关闭，点击开启。',
    };

    // ---------------------------------------------------------------- store
    function readEnabled() {
      try {
        return window.localStorage.getItem(STORAGE_KEY) !== 'off';
      } catch (_error) {
        return true;
      }
    }

    function writeEnabled(enabled) {
      try {
        window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
      } catch (_error) {
        // Storage can be unavailable in private or embedded contexts.
      }
    }

    function createStore() {
      let enabled = readEnabled();
      const listeners = new Set();
      return {
        get() {
          return enabled;
        },
        set(next) {
          const value = Boolean(next);
          if (value === enabled) return;
          enabled = value;
          writeEnabled(value);
          for (const listener of Array.from(listeners)) {
            try {
              listener();
            } catch (error) {
              console.error('[claude-code-theme] store listener failed', error);
            }
          }
        },
        subscribe(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
      };
    }

    // ----------------------------------------------------------- components
    function Star(props) {
      const size = props && typeof props.size === 'number' ? props.size : 14;
      const className = 'cc-star-mark' + (props && props.className ? ' ' + props.className : '');
      return h('span', {
        className,
        'aria-hidden': 'true',
        style: {
          width: size + 'px',
          height: size + 'px',
          clipPath: STAR_CLIP,
          WebkitClipPath: STAR_CLIP,
        },
      });
    }

    function BrandMark(props) {
      const requested = props && typeof props.size === 'number' ? props.size : 24;
      const className = 'cc-brand-mark' + (props && props.className ? ' ' + props.className : '');
      return h(Star, { size: Math.max(16, Math.round(requested * 0.84)), className });
    }

    function HeroMark(props) {
      const size = props && typeof props.size === 'number' ? props.size : 34;
      const className = 'cc-hero-star' + (props && props.className ? ' ' + props.className : '');
      return h(Star, { size, className });
    }

    function makeBrandName(locale) {
      return function BrandName() {
        React.useSyncExternalStore(
          (listener) => locale.subscribe(listener),
          () => locale.getSnapshot(),
          () => locale.getSnapshot(),
        );
        const t = locale.bind(NS);
        const name = t('brand.name');
        return h(
          'span',
          { className: 'cc-brand-name' },
          name && name !== 'brand.name' ? name : 'Claude Code',
        );
      };
    }

    function makeToggle(store, locale) {
      return function ClaudeCodeToggle(props) {
        const on = React.useSyncExternalStore(
          (listener) => store.subscribe(listener),
          () => store.get(),
          () => store.get(),
        );
        React.useSyncExternalStore(
          (listener) => locale.subscribe(listener),
          () => locale.getSnapshot(),
          () => locale.getSnapshot(),
        );
        const t = locale.bind(NS);
        const label = on ? t('toggle.on') : t('toggle.off');
        const wide = Boolean(props && props.wide);
        return h(
          'button',
          {
            type: 'button',
            className: 'cc-toggle',
            'data-on': on ? 'true' : 'false',
            'data-wide': wide ? 'true' : 'false',
            role: 'switch',
            'aria-checked': on,
            'aria-label': label,
            title: label,
            onClick: () => store.set(!on),
          },
          h(Star, { size: 14, className: 'cc-toggle-star' }),
          h('span', { className: 'cc-toggle-label' }, 'Claude Code'),
          h('span', { className: 'cc-toggle-dot', 'aria-hidden': 'true' }),
        );
      };
    }

    // ------------------------------------------------------------- mounting
    function injectStyle(id, css) {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
      const style = document.createElement('style');
      style.id = id;
      style.textContent = css;
      document.head.appendChild(style);
      return style;
    }

    function removeStyle(style) {
      if (!style) return;
      if (typeof style.remove === 'function') {
        style.remove();
        return;
      }
      if (style.parentNode) style.parentNode.removeChild(style);
    }

    function mountSkin(ctx, theme, locale) {
      const disposers = [];
      let style = null;
      let layer = null;
      try {
        document.documentElement.setAttribute(ATTR, 'on');
        style = injectStyle(SKIN_STYLE_ID, PALETTE_CSS + SKIN_CSS);
        layer = theme.overrideTokens(SOURCE, TOKENS);
        const mount = (slot, id, component) => {
          disposers.push(
            ctx.slots.inject(slot, () =>
              ctx.slots.register({ name: slot, id, priority: -1 }, component),
            ),
          );
        };
        mount('sidebar.brand.mark', 'claude-code-brand-mark', BrandMark);
        mount('sidebar.brand.name', 'claude-code-brand-name', makeBrandName(locale));
        mount('conversation.hero.brand.mark', 'claude-code-hero-mark', HeroMark);
      } catch (error) {
        for (const dispose of disposers.reverse()) {
          try {
            dispose();
          } catch (_error) {
            // best effort during failed activation
          }
        }
        removeStyle(style);
        if (layer) {
          try {
            layer();
          } catch (_error) {
            // best effort
          }
        }
        document.documentElement.removeAttribute(ATTR);
        throw error;
      }

      let disposed = false;
      return () => {
        if (disposed) return;
        disposed = true;
        for (const dispose of disposers.reverse()) {
          try {
            dispose();
          } catch (error) {
            console.error('[claude-code-theme] slot cleanup failed', error);
          }
        }
        removeStyle(style);
        if (layer) {
          try {
            layer();
          } catch (error) {
            console.error('[claude-code-theme] token cleanup failed', error);
          }
        }
        document.documentElement.removeAttribute(ATTR);
      };
    }

    // ------------------------------------------------------------------ apply
    return {
      inject: ['slots', 'theme', 'locale'],
      apply(ctx) {
        const theme = ctx.get('theme');
        const locale = ctx.get('locale');
        if (!theme || typeof theme.overrideTokens !== 'function') {
          console.warn('[claude-code-theme] theme service unavailable; skin not applied');
          return;
        }
        if (!locale || typeof locale.bind !== 'function') {
          console.warn('[claude-code-theme] locale service unavailable; skin not applied');
          return;
        }

        const store = createStore();
        const Toggle = makeToggle(store, locale);

        ctx.effect(() => locale.register(NS, { en: EN, zh: ZH }), 'claude-code-theme: locale');

        ctx.effect(() => {
          const chrome = injectStyle(CHROME_STYLE_ID, CHROME_CSS);
          return () => removeStyle(chrome);
        }, 'claude-code-theme: chrome');

        ctx.effect(
          () =>
            ctx.slots.inject('sidebar.footer.action', () =>
              ctx.slots.register(
                { name: 'sidebar.footer.action', id: 'claude-code-toggle', order: 10 },
                Toggle,
              ),
            ),
          'claude-code-theme: toggle',
        );

        ctx.effect(() => {
          let teardown = null;
          const sync = () => {
            if (store.get() && !teardown) {
              try {
                teardown = mountSkin(ctx, theme, locale);
              } catch (error) {
                console.error('[claude-code-theme] failed to enable skin', error);
                store.set(false);
              }
            } else if (!store.get() && teardown) {
              const dispose = teardown;
              teardown = null;
              try {
                dispose();
              } catch (error) {
                console.error('[claude-code-theme] failed to disable skin', error);
              }
            }
          };
          sync();
          const unsubscribe = store.subscribe(sync);
          return () => {
            unsubscribe();
            if (teardown) {
              const dispose = teardown;
              teardown = null;
              try {
                dispose();
              } catch (error) {
                console.error('[claude-code-theme] cleanup failed', error);
              }
            }
          };
        }, 'claude-code-theme: appearance');
      },
    };
  },
});
