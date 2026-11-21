# Claude Code theme

A cosmetic, appearance-only plugin for the DSH Web UI that makes the interface
read like the Claude Code terminal: warm charcoal surfaces, one monospace voice,
thin square-edged chrome, orange `✻` marks, a `>` prompt line for user messages,
`⏺`/`⎿`-style message prefixes, and flat terminal panels with no shadows.

The plugin changes appearance only. It never registers tools, hooks, models or
routes, never rewrites host markup or copy, never touches conversation/session/
agent logic, and never changes prompts or model behavior.

## What it does

While the skin is **on** it mounts exactly four things:

- `html[data-cc-theme="on"]` — a single attribute used for CSS scoping.
- `#dsh-claude-code-theme-skin` — one scoped stylesheet covering the shell,
  sidebar, conversation header, hero, composer, user prompt line, assistant
  markdown, code blocks, running indicator, tool cards, dialogs, menus and
  tooltips.
- One theme-token override layer (dark values duplicated into the light slot,
  because the API requires a `{light, dark}` pair and the skin is dark-only).
- Three brand slots: `sidebar.brand.mark`, `sidebar.brand.name` and
  `conversation.hero.brand.mark`, all at `priority: -1` so they shadow the
  shipped brand occupants.

While the plugin is **loaded** it also keeps a small `Claude Code` switch in
`sidebar.footer.action` (`✻ Claude Code ●`). The switch is registered outside
the appearance layer, so turning the skin off never removes the control that
turns it back on.

Turning the switch off disposes the attribute, both stylesheets' skin half, the
token layer and the three slot occupants, leaving the stock interface. The
preference is stored in `localStorage` under
`dsh.plugin.claude-code-theme.v2` (`"on"` / `"off"`; absent means on). The old
v1 key `dsh.plugin.claude-code-theme` is intentionally inert.

## Install

```sh
# in a DSH session (plugin_manager asks for approval once)
plugin_manager action=install_bundle target=/absolute/path/to/claude-code-theme
```

Then reload the Web UI. The skin is on by default.

> Naming: since **v2.1.0** the package is named `claude-code-theme` (unscoped).
> Installs made with 2.0.x were named `@local/claude-code-theme`; if you are
> migrating from one of those, remove that target first
> (`plugin_manager action=remove_bundle target=@local/claude-code-theme`), then
> install again by path, then restart `dsh web`.

## Uninstall / clean rollback

1. Turn the sidebar switch off (optional, restores the stock UI immediately).
2. Remove the bundle:

```sh
plugin_manager action=remove_bundle target=claude-code-theme
```

If the GUI ever feels stuck with the skin applied and the toggle is unreachable,
run this in the browser console and reload:

```js
localStorage.setItem('dsh.plugin.claude-code-theme.v2', 'off');
location.reload();
```

The plugin writes no profile files, edits no DSH package, and keeps no runtime
state beyond: one `<html>` attribute, one always-loaded chrome stylesheet, one
skin stylesheet while enabled, four slot registrations, one token layer and one
localStorage key. Removing the bundle reverses all of them.

## Version control

This plugin is versioned in Git and every change lands on
<https://github.com/qwerlancer/claude-code-theme> (private, `main`).

```sh
cd claude-code-theme
git add -A
git commit -m "describe the appearance change"
git push
```

Rules for the workspace copy: commit one logical change per commit, bump
`version` in `package.json` when the shipped look changes, run
`node test/smoke.mjs` before committing, and keep local tuning backups
(`.tmp-*`) out of Git — `.gitignore` already covers them.

## Files

- `client.js` — palette, chrome CSS, skin CSS, slot occupants, toggle store.
- `index.js` — client-only bundle entry (`apply` is a no-op on the host).
- `cordis.patch.yml` — inserts the bundle into the Web profile.
- `locale/en.json`, `locale/zh.json` — plugin metadata shown by the manager.
- `icon.svg` — the `✻` bundle icon.
- `test/smoke.mjs` — offline contract test for the palette shape, CSS scoping,
  slot priorities, the always-mounted toggle and full teardown.

Run it with `node test/smoke.mjs`; it mocks the module loader, document,
theme/locale services and slot registry, so it needs no browser.

## Notes and limits

- Target: the shipped DSH Web build. Selectors that depend on CSS-module hashes
  are listed in one `HASHED SELECTOR MAP` block at the top of `skin CSS` in
  `client.js` (`.pI_x6G_`, `.hHd-Xa_`, `.wSkVaW_`, `.pXSMma_`, `.uV2eYG_`,
  `.Sixlwa_`, `.hWmORq_`, `.EvIC1a_`, `.o3BgMG_`, `.CY-8Ka_`, `.DXqwVW_`,
  `.ztWv_q_`, `._7KE1Ra_`, `.yHnPSG_`). If a future DSH build renames them, update that map;
  the
  token palette and hash-free fallbacks (`[data-message-bubble]`,
  `[class*="_markdown_"]`, `[role="dialog"|"menu"|"tooltip"]`) keep the base look.
- The composer's "model · effort" pill (`._7KE1Ra_root`, the
  `conversation.input.model` occupant) is hidden while the skin is on, because
  the Claude Code prompt row has no model picker. This is CSS only — the slot
  occupant, its handlers and the `/model` command still work; turn the skin off
  to see the pill again.
- The account row at the sidebar foot (`settings.launcher` occupant,
  `.yHnPSG_trigger`) keeps its avatar icon but hides its label — "Signed in to
  DeepSeek", or the account name when one is set — while the skin is on. Pure
  CSS: the account menu, its handlers and sign-in/out are untouched, and
  turning the skin off brings the label back.
- Dark only by design. The light token slot carries the same dark values, so the
  UI does not switch to a light Claude look when the host preference changes.
- Other appearance themes should stay disabled; this plugin's token layer and
  stylesheet are not designed to blend with another skin.
- The plugin does not change the document title or favicon, and does not fill
  `conversation.composer.dock`.
