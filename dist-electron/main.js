var E = Object.defineProperty;
var x = (e, n, t) => n in e ? E(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var y = (e, n, t) => x(e, typeof n != "symbol" ? n + "" : n, t);
import { app as u, BrowserWindow as v, ipcMain as o } from "electron";
import { fileURLToPath as b } from "node:url";
import c from "node:path";
import f from "node:fs/promises";
class L {
  constructor(n) {
    y(this, "mainConfig");
    this.mainConfig = n.mainConfig;
  }
}
class H {
  constructor(n) {
    y(this, "setting");
    this.setting = n.setting;
  }
}
const S = c.dirname(b(import.meta.url)), d = "data", z = "todo";
process.env.APP_ROOT = c.join(S, "..");
const g = process.env.VITE_DEV_SERVER_URL, j = c.join(process.env.APP_ROOT, "dist-electron"), _ = c.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = g ? c.join(process.env.APP_ROOT, "public") : _;
let N = process.env.NODE_ENV === "development", l, r, P = !1;
async function R() {
  const e = await U(), n = await k(), t = n ? n[0] : 800, i = n ? n[1] : 600;
  l = new v({
    icon: c.join(process.env.VITE_PUBLIC, "water.ico"),
    frame: !1,
    width: t,
    height: i,
    resizable: !1,
    transparent: !0,
    show: !1,
    skipTaskbar: !0,
    webPreferences: {
      preload: c.join(j, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), !e || !e[0] || !e[1] ? l.center() : l.setPosition(e[0], e[1]), o.handle("window:set-position", (s, a, w) => {
    l && l.setPosition(a, w, !0), P || (P = !0, setTimeout(() => {
      V(), P = !1;
    }, 500));
  }), o.handle("window:get-position", () => l ? l.getPosition() : [0, 0]), o.handle("window:create-note-window", () => {
    if (r) {
      r.show();
      return;
    }
    C();
  }), g ? l.loadURL(g) : l.loadFile(c.join(_, "index.html")), l.on("ready-to-show", () => {
    l == null || l.show();
  });
}
async function C() {
  r = new v({
    icon: c.join(process.env.VITE_PUBLIC, "water.ico"),
    frame: !1,
    width: 1400,
    height: 1e3,
    resizable: !1,
    show: !1,
    webPreferences: {
      preload: c.join(j, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      spellcheck: !1
    }
  }), g ? r.loadURL(g + "/note") : r.loadFile(c.join(_, "note.html")), r.webContents.on("before-input-event", (e, n) => {
    n.control && ["=", "-", "0"].includes(n.key) && e.preventDefault();
  }), o.removeHandler("window:close-note-window"), o.removeHandler("window:max-note-window"), o.removeHandler("window:min-note-window"), o.removeHandler("window:restore-note-window"), o.removeHandler("file:save"), o.removeHandler("file:open"), o.removeHandler("file:open-all"), o.removeHandler("file:delete"), o.removeHandler("setting:get"), o.removeHandler("config:get"), o.removeHandler("setting:set"), o.removeHandler("config:set"), o.handle("window:close-note-window", () => {
    r && (r.close(), r = null);
  }), o.handle("window:max-note-window", () => {
    r && r.maximize();
  }), o.handle("window:min-note-window", () => {
    r && r.minimize();
  }), o.handle("window:restore-note-window", () => {
    r && r.restore();
  }), o.handle("file:save", (e, n, t, i, s = d) => B(n, t, i, s)), o.handle("file:open", async (e, n, t = d) => await W(n, t)), o.handle("file:open-all", async (e, n = d) => await $(n)), o.handle("file:delete", async (e, n, t = d) => await q(n, t)), o.handle("setting:get", async (e, n) => await T(n)), o.handle("config:get", async (e, n) => await p(n)), o.handle("config:set", async (e, n, t) => A(n, t)), o.handle("setting:set", async (e, n, t) => J(n, t)), r.on("ready-to-show", () => {
    r == null || r.show();
  });
}
u.on("window-all-closed", () => {
  process.platform !== "darwin" && (u.quit(), l = null, r = null);
});
u.on("activate", () => {
  v.getAllWindows().length === 0 && (R(), C());
});
u.whenReady().then(async () => {
  var n;
  await O(), await O(z);
  const e = await T("");
  u.setLoginItemSettings({
    openAtLogin: !!(e != null && e.setting.autostart),
    openAsHidden: !0
  }), C(), (n = e == null ? void 0 : e.setting) != null && n.showClock && R();
});
async function V() {
  const e = await p("");
  if (!e || !l) return;
  const n = l.getPosition();
  e.mainConfig.position.x = n[0], e.mainConfig.position.y = n[1], await A("", e);
}
async function U() {
  const e = await p("");
  return !e || !e.mainConfig.position ? Promise.resolve(null) : Promise.resolve([e.mainConfig.position.x, e.mainConfig.position.y]);
}
async function k() {
  const e = await p("");
  if (!e) return Promise.resolve(null);
  const n = e.mainConfig.time.fontSize, t = 5, i = e.mainConfig.date.fontSize, s = e.mainConfig.date.content.length ? e.mainConfig.date.content.length : 12, a = 30, w = Math.max(n * t + a, i * s + a), m = n + i + a * 2;
  return Promise.resolve([w / 2, m]);
}
async function p(e) {
  try {
    e === "" && (e = process.env.APP_ROOT + "/config.json"), await f.access(e);
    const n = await f.readFile(e, "utf-8"), t = JSON.parse(n);
    return new L(t);
  } catch (n) {
    return console.error(n), null;
  }
}
async function T(e) {
  try {
    e === "" && (e = process.env.APP_ROOT + "/setting.json"), await f.access(e);
    const n = await f.readFile(e, "utf-8"), t = JSON.parse(n);
    return new H(t);
  } catch (n) {
    return console.error(n), null;
  }
}
async function A(e, n) {
  try {
    e === "" && (e = process.env.APP_ROOT + "/config.json");
    const t = await p(e);
    if (t === null)
      await f.writeFile(e, JSON.stringify(n, null, 2), "utf-8");
    else {
      const i = D(t, n);
      await f.writeFile(e, JSON.stringify(i, null, 2), "utf-8");
    }
    return !0;
  } catch (t) {
    return console.error(t), !1;
  }
}
async function J(e, n) {
  try {
    return e === "" && (e = process.env.APP_ROOT + "/setting.json"), await f.writeFile(e, JSON.stringify(n, null, 2), "utf-8"), !0;
  } catch (t) {
    return console.error(t), !1;
  }
}
function D(e, n) {
  const t = { ...e };
  for (const i in n)
    if (n.hasOwnProperty(i)) {
      const s = e[i], a = n[i];
      if (a === void 0) continue;
      a !== null && typeof a == "object" && !Array.isArray(a) && s !== null && typeof s == "object" && !Array.isArray(s) ? t[i] = D(s, a) : t[i] = a;
    }
  return t;
}
function h() {
  try {
    if (N)
      return c.resolve(S, "../");
    const e = u.getPath("exe");
    return c.dirname(e);
  } catch (e) {
    return console.error("解析安装目录失败：", e), u.getPath("documents");
  }
}
async function M(e) {
  try {
    return await f.access(e, 0), (await f.stat(e)).isDirectory();
  } catch {
    return !1;
  }
}
async function O(e = d) {
  const n = c.join(h(), e);
  await M(n) || await f.mkdir(n, { recursive: !0 });
}
function B(e, n, t, i = d) {
  return new Promise(async (s, a) => {
    try {
      const w = c.join(h(), i, e + "." + n);
      await f.writeFile(w, t, { encoding: "utf8" }), s(!0);
    } catch (w) {
      const m = `保存文件失败：${w.message}`;
      a(new Error(m));
    }
  });
}
function W(e, n = d) {
  return new Promise(async (t, i) => {
    try {
      const s = c.join(h(), n, e), a = await f.readFile(s, "utf-8");
      t(a);
    } catch {
      i("");
    }
  });
}
function $(e = d) {
  return new Promise(async (n, t) => {
    try {
      const i = c.join(h(), e), s = await f.readdir(i, { withFileTypes: !0 }), a = await Promise.all(
        s.filter((w) => w.isFile()).map(async (w) => {
          const m = w.name.split("."), F = m[0], I = m[1];
          return {
            name: F,
            type: I
          };
        })
      );
      n(a);
    } catch {
      t([]);
    }
  });
}
function q(e, n = d) {
  return new Promise(async (t, i) => {
    try {
      const s = c.join(h(), n, e);
      await f.unlink(s), t(!0);
    } catch {
      i(!1);
    }
  });
}
process.platform === "win32" && (u.commandLine.appendSwitch("high-dpi-support", "true"), u.commandLine.appendSwitch("force-device-scale-factor", "1"));
export {
  j as MAIN_DIST,
  _ as RENDERER_DIST,
  g as VITE_DEV_SERVER_URL
};
