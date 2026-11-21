import assert from 'node:assert/strict';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const entry = path.join(here, '..', 'client.js');

const storage = new Map();
const styleNodes = [];

globalThis.document = {
  getElementById(id) {
    return styleNodes.find((node) => node.id === id && !node.removed) || null;
  },
  createElement(tag) {
    return {
      tagName: tag.toUpperCase(),
      id: '',
      textContent: '',
      removed: false,
      parentNode: null,
      remove() {
        this.removed = true;
      },
    };
  },
  head: {
    appendChild(node) {
      node.parentNode = this;
      styleNodes.push(node);
    },
  },
  documentElement: {
    attributes: {},
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    removeAttribute(name) {
      delete this.attributes[name];
    },
  },
  title: 'DSH',
};

globalThis.window = {
  localStorage: {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
  },
  __ModuleLoader__: {
    load(definition) {
      globalThis.__loaded = definition;
    },
  },
};

await import(pathToFileURL(entry).href);

const loaded = globalThis.__loaded;
assert.ok(loaded, 'module registers through __ModuleLoader__');
assert.equal(loaded.id, 'claude-code-theme');
assert.equal(document.title, 'DSH', 'factory has no title side effect');
assert.equal(styleNodes.length, 0, 'factory injects no styles');
assert.equal(document.documentElement.attributes['data-cc-theme'], undefined, 'factory sets no attribute');

const themeCalls = [];
let tokenLayerDisposed = 0;
const theme = {
  overrideTokens(source, tokens) {
    themeCalls.push({ source, tokens });
    return () => {
      tokenLayerDisposed += 1;
    };
  },
};

const localeDicts = new Map();
let localeDisposed = 0;
const locale = {
  register(namespace, dictionaries) {
    localeDicts.set(namespace, dictionaries);
    return () => {
      localeDisposed += 1;
    };
  },
  bind(namespace) {
    return (key) => {
      const dict = localeDicts.get(namespace);
      return (dict && dict.en && dict.en[key]) || key;
    };
  },
  subscribe() {
    return () => {};
  },
  getSnapshot() {
    return 'en';
  },
};

const injectedKeys = [];
const registrations = [];
const removedRegistrations = [];
const slots = {
  inject(key, callback) {
    injectedKeys.push(key);
    return callback();
  },
  register(options, component) {
    registrations.push({ options, component });
    return () => {
      removedRegistrations.push(options.id);
    };
  },
};

const effects = [];
const ctx = {
  slots,
  get(service) {
    if (service === 'theme') return theme;
    if (service === 'locale') return locale;
    if (service === 'slots') return slots;
    return undefined;
  },
  effect(callback, label) {
    effects.push({ label, dispose: callback() });
  },
};

const React = {
  createElement(type, props, ...children) {
    return {
      type,
      props: Object.assign({}, props, {
        children: children.length <= 1 ? children[0] : children,
      }),
    };
  },
  useSyncExternalStore(subscribe, getSnapshot) {
    return getSnapshot();
  },
};

const plugin = loaded.factory((id) => {
  assert.equal(id, 'react');
  return React;
});

assert.deepEqual(plugin.inject, ['slots', 'theme', 'locale']);

plugin.apply(ctx);

assert.equal(effects.length, 4, 'locale + chrome + toggle + appearance effects');
assert.equal(themeCalls.length, 1, 'appearance activates on apply (default on)');
assert.equal(themeCalls[0].source, 'claude-code-theme');

const tokens = themeCalls[0].tokens;
const names = Object.keys(tokens);
assert.ok(names.length >= 130, 'palette covers a wide alias surface: ' + names.length);
for (const name of names) {
  assert.equal(typeof tokens[name].light, 'string', name + ' has a light value');
  assert.equal(typeof tokens[name].dark, 'string', name + ' has a dark value');
  assert.equal(tokens[name].dark, tokens[name].light, name + ' forces one dark look in both slots');
}
assert.ok(names.includes('--dsw-font-family'));
assert.ok(tokens['--dsw-font-family'].dark.includes('monospace'));
assert.equal(tokens['--dsw-radius-panel'].dark, '4px');
assert.equal(tokens['--dsw-alias-bg-base'].dark, '#2d2c27');
assert.equal(tokens['--dsw-alias-label-primary'].dark, '#ffffff');
assert.equal(tokens['--dsw-alias-label-secondary'].dark, '#e9e5db');
assert.ok(tokens['--dsw-alias-bg-layer-1'].dark.startsWith('#'));
assert.ok(/^#[0-9a-f]{6}$/.test(tokens['--dsw-menu-surface-fill'].dark), 'menu material is opaque (no bleed-through)');
assert.ok(/^#[0-9a-f]{6}$/.test(tokens['--dsw-specific-menu'].dark), 'inline menu surface is opaque');
assert.ok(!names.some((name) => name.startsWith('--dsw-alias-specific-')), 'specific-* tokens use their real names');

const chrome = styleNodes.find((node) => node.id === 'dsh-claude-code-theme-chrome');
const skin = styleNodes.find((node) => node.id === 'dsh-claude-code-theme-skin');
assert.ok(chrome, 'chrome stylesheet is injected');
assert.ok(skin, 'skin stylesheet is injected');
assert.ok(chrome.textContent.includes('.cc-toggle'));
assert.ok(chrome.textContent.includes('.cc-star-mark'));
assert.ok(skin.textContent.includes('html[data-cc-theme="on"] .uV2eYG_card'), 'skin rules are scoped');
assert.ok(skin.textContent.includes('[data-message-bubble]'));
assert.ok(skin.textContent.includes('.EvIC1a_runningIcon::before'));
assert.ok(skin.textContent.includes('.hHd-Xa_newSession'));
assert.ok(skin.textContent.includes('\\273B'), 'hero legend star is present');
assert.ok(skin.textContent.includes('\\25CF'), 'assistant bullet is present');
assert.ok(skin.textContent.includes('\\23BF'), 'tool output corner is present');
assert.ok(
  /\.pI_x6G_overlayLayer\s*\{[^}]*background:\s*transparent/.test(skin.textContent),
  'shell overlay layer stays transparent (no full-page dim)',
);
assert.ok(
  !/\.pI_x6G_overlayLayer\s*\{[^}]*rgba\(0,\s*0,\s*0/.test(skin.textContent),
  'shell overlay layer never painted with a black veil',
);
assert.ok(
  /html\[data-cc-theme="on"\]\s+\._7KE1Ra_root\s*\{[^}]*display:\s*none/.test(skin.textContent),
  'composer model pill is hidden while the skin is on',
);
assert.ok(
  !/^\._7KE1Ra_root\s*\{/m.test(skin.textContent),
  'model pill rule stays scoped to the skin attribute',
);
assert.ok(!skin.textContent.includes('</style>'));
assert.equal(document.documentElement.attributes['data-cc-theme'], 'on');
assert.equal(document.title, 'DSH', 'apply does not touch the title');

assert.deepEqual(injectedKeys, [
  'sidebar.footer.action',
  'sidebar.brand.mark',
  'sidebar.brand.name',
  'conversation.hero.brand.mark',
]);
assert.equal(registrations.length, 4);
const byName = new Map(registrations.map((entry) => [entry.options.name, entry]));
for (const name of ['sidebar.brand.mark', 'sidebar.brand.name', 'conversation.hero.brand.mark']) {
  assert.equal(byName.get(name).options.priority, -1, name + ' shadows the shipped occupant');
}
assert.equal(byName.get('sidebar.footer.action').options.order, 10);
assert.equal(byName.get('sidebar.footer.action').component().props.children[1].props.children, 'Claude Code');

const brandName = byName.get('sidebar.brand.name').component();
assert.equal(brandName.props.children, 'Claude Code');

const heroElement = byName.get('conversation.hero.brand.mark').component({ size: 34 });
assert.equal(heroElement.props.size, 34);
assert.ok(heroElement.props.className.includes('cc-hero-star'));
const heroStar = heroElement.type(heroElement.props);
assert.equal(heroStar.props.style.width, '34px');
assert.ok(heroStar.props.className.includes('cc-star-mark'));

const localeEntry = localeDicts.get('claude-code-theme');
assert.ok(localeEntry.en['toggle.on']);
assert.ok(localeEntry.zh['toggle.off']);

// Toggle off: skin, token layer, attribute and brand slots all disappear;
// the toggle itself stays mounted so it can switch back on.
const toggle = byName.get('sidebar.footer.action').component;
let button = toggle({ wide: true });
assert.equal(button.type, 'button');
assert.equal(button.props['data-on'], 'true');
assert.equal(button.props.role, 'switch');
assert.equal(button.props['aria-checked'], true);

button.props.onClick();
assert.equal(storage.get('dsh.plugin.claude-code-theme.v2'), 'off');
assert.equal(tokenLayerDisposed, 1, 'palette layer removed when switched off');
assert.ok(skin.removed, 'skin stylesheet removed when switched off');
assert.equal(document.documentElement.attributes['data-cc-theme'], undefined);
assert.deepEqual(removedRegistrations.sort(), [
  'claude-code-brand-mark',
  'claude-code-brand-name',
  'claude-code-hero-mark',
]);
assert.ok(byName.get('sidebar.footer.action'), 'toggle registration is not removed on off');

// Toggle back on: fresh snapshot, click, everything returns.
button = toggle({ wide: false });
assert.equal(button.props['data-on'], 'false');
button.props.onClick();
assert.equal(storage.get('dsh.plugin.claude-code-theme.v2'), 'on');
assert.equal(themeCalls.length, 2, 'palette layer re-created when switched on');
assert.equal(document.documentElement.attributes['data-cc-theme'], 'on');
assert.equal(registrations.length, 7, 'three brand slots re-registered');

// Teardown disposes every effect without leaving DOM behind.
for (const effect of effects.reverse()) effect.dispose();
assert.ok(localeDisposed >= 1);
assert.equal(document.documentElement.attributes['data-cc-theme'], undefined);
assert.ok(styleNodes.every((node) => node.removed), 'all injected styles removed on teardown');
assert.ok(removedRegistrations.includes('claude-code-toggle'));

console.log('smoke ok');
