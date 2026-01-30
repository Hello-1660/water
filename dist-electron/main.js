var L = Object.defineProperty;
var k = (n, e, t) => e in n ? L(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var j = (n, e, t) => k(n, typeof e != "symbol" ? e + "" : e, t);
import { app as d, BrowserWindow as _, Tray as V, Menu as z, ipcMain as i } from "electron";
import { fileURLToPath as H } from "node:url";
import o from "node:path";
import l from "node:fs/promises";
class N {
  constructor(e) {
    j(this, "mainConfig");
    this.mainConfig = e.mainConfig;
  }
}
class U {
  constructor(e) {
    j(this, "setting");
    this.setting = e.setting;
  }
}
const O = o.dirname(H(import.meta.url)), g = "data", M = "todo", B = "timeTable";
process.env.APP_ROOT = o.join(O, "..");
const y = process.env.VITE_DEV_SERVER_URL, I = o.join(process.env.APP_ROOT, "dist-electron"), S = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = y ? o.join(process.env.APP_ROOT, "public") : S;
let m = process.env.NODE_ENV === "development", s, r, C = !1, p;
const J = d.requestSingleInstanceLock();
J || d.quit();
async function A() {
  if (s) return;
  let n = "";
  m || (n = o.join(u(), "config.json"));
  const e = await $(), t = await W(n), a = t ? t[0] : 800, c = t ? t[1] : 500;
  s = new _({
    icon: o.join(process.env.VITE_PUBLIC, "water.ico"),
    frame: !1,
    width: a,
    height: c,
    resizable: !1,
    transparent: !0,
    show: !1,
    skipTaskbar: !0,
    webPreferences: {
      preload: o.join(I, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), !e || !e[0] || !e[1] ? s.center() : s.setPosition(e[0], e[1]), i.handle("window:set-position", (f, w, h) => {
    s && s.setPosition(w, h, !0), C || (C = !0, setTimeout(() => {
      q(n), C = !1;
    }, 500));
  }), i.handle("window:get-position", () => s ? s.getPosition() : [0, 0]), i.handle("window:create-note-window", () => {
    if (r) {
      r.show();
      return;
    }
    F();
  }), y ? s.loadURL(y) : s.loadFile(o.join(S, "index.html")), s.on("ready-to-show", () => {
    s == null || s.show();
  });
}
async function F() {
  if (r) {
    r.show();
    return;
  }
  r = new _({
    icon: o.join(process.env.VITE_PUBLIC, "water.ico"),
    frame: !1,
    width: 1400,
    height: 1e3,
    resizable: !1,
    show: !1,
    webPreferences: {
      preload: o.join(I, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      spellcheck: !1
    }
  }), y ? r.loadURL(y + "/note") : r.loadFile(o.join(S, "note.html")), r.webContents.on("before-input-event", (n, e) => {
    e.control && ["=", "-", "0"].includes(e.key) && n.preventDefault();
  }), i.removeHandler("window:close-note-window"), i.removeHandler("window:max-note-window"), i.removeHandler("window:min-note-window"), i.removeHandler("window:restore-note-window"), i.removeHandler("file:save"), i.removeHandler("file:open"), i.removeHandler("file:open-all"), i.removeHandler("file:delete"), i.removeHandler("setting:get"), i.removeHandler("config:get"), i.removeHandler("setting:set"), i.removeHandler("config:set"), i.handle("window:close-note-window", () => {
    r && (r.close(), r = null);
  }), i.handle("window:max-note-window", () => {
    r && r.maximize();
  }), i.handle("window:min-note-window", () => {
    r && r.minimize();
  }), i.handle("window:restore-note-window", () => {
    r && r.restore();
  }), i.handle("file:save", (n, e, t, a, c = g) => Y(e, t, a, c)), i.handle("file:open", async (n, e, t = g) => await Z(e, t)), i.handle("file:open-all", async (n, e = g) => await ee(e)), i.handle("file:delete", async (n, e, t = g) => await ne(e, t)), i.handle("setting:get", async (n, e) => (m || (e = o.join(u(), "setting.json")), await R(e))), i.handle("config:get", async (n, e) => (m || (e = o.join(u(), "config.json")), await P(e))), i.handle("config:set", async (n, e, t) => (m || (e = o.join(u(), "config.json")), E(e, t))), i.handle("setting:set", async (n, e, t) => (m || (e = o.join(u(), "setting.json")), G(e, t))), r.on("ready-to-show", () => {
    r == null || r.show();
  });
}
d.on("window-all-closed", () => {
  process.platform !== "darwin" && (d.quit(), s = null, r = null);
});
d.on("activate", () => {
  _.getAllWindows().length === 0 && (A(), F());
});
d.whenReady().then(async () => {
  var t;
  await T(), await T(M), await T(B), await Q(), await X(), te();
  const n = m ? "" : o.join(u(), "setting.json"), e = await R(n);
  d.setLoginItemSettings({
    openAtLogin: !!(e != null && e.setting.autostart),
    openAsHidden: !0
  }), F(), (t = e == null ? void 0 : e.setting) != null && t.showClock && (A(), r == null || r.hide());
});
async function q(n) {
  const e = await P(n);
  if (!e || !s) return;
  const t = s.getPosition();
  e.mainConfig.position.x = t[0], e.mainConfig.position.y = t[1], await E("", e);
}
async function $() {
  const n = await P("");
  return !n || !n.mainConfig.position ? Promise.resolve(null) : Promise.resolve([n.mainConfig.position.x, n.mainConfig.position.y]);
}
async function W(n) {
  const e = await P(n);
  if (!e) return Promise.resolve(null);
  const t = e.mainConfig.time.fontSize, a = 5, c = e.mainConfig.date.fontSize, f = e.mainConfig.date.content.length ? e.mainConfig.date.content.length : 12, w = 30, h = Math.max(t * a + w, c * f + w), v = t + c + w * 2;
  return Promise.resolve([h / 2, v]);
}
async function P(n) {
  try {
    n === "" && (n = process.env.APP_ROOT + "/config.json"), await l.access(n);
    const e = await l.readFile(n, "utf-8"), t = JSON.parse(e);
    return new N(t);
  } catch (e) {
    return console.error(e), null;
  }
}
async function R(n) {
  try {
    n === "" && (n = process.env.APP_ROOT + "/setting.json"), await l.access(n);
    const e = await l.readFile(n, "utf-8"), t = JSON.parse(e);
    return new U(t);
  } catch (e) {
    return console.error(e), null;
  }
}
async function E(n, e) {
  try {
    n === "" && (n = process.env.APP_ROOT + "/config.json");
    const t = await P(n);
    if (t === null)
      await l.writeFile(n, JSON.stringify(e, null, 2), "utf-8");
    else {
      const a = x(t, e);
      await l.writeFile(n, JSON.stringify(a, null, 2), "utf-8");
    }
    return !0;
  } catch (t) {
    return console.error(t), !1;
  }
}
async function G(n, e) {
  try {
    return n === "" && (n = process.env.APP_ROOT + "/setting.json"), await l.writeFile(n, JSON.stringify(e, null, 2), "utf-8"), !0;
  } catch (t) {
    return console.error(t), !1;
  }
}
function x(n, e) {
  const t = { ...n };
  for (const a in e)
    if (e.hasOwnProperty(a)) {
      const c = n[a], f = e[a];
      if (f === void 0) continue;
      f !== null && typeof f == "object" && !Array.isArray(f) && c !== null && typeof c == "object" && !Array.isArray(c) ? t[a] = x(c, f) : t[a] = f;
    }
  return t;
}
function u() {
  try {
    if (m)
      return o.resolve(O, "../");
    const n = d.getPath("exe");
    return o.dirname(n);
  } catch (n) {
    return console.error("解析安装目录失败：", n), d.getPath("documents");
  }
}
async function K(n) {
  try {
    return await l.access(n, 0), (await l.stat(n)).isDirectory();
  } catch {
    return !1;
  }
}
async function b(n) {
  try {
    return await l.access(n, 0), (await l.stat(n)).isFile();
  } catch {
    return !1;
  }
}
async function Q() {
  if (m) return;
  const n = o.join(u(), "config.json");
  if (await b(n)) return;
  await l.writeFile(n, `
{
  "mainConfig": {
    "time": {
      "fontSize": 80,
      "fontColor": "#000000",
      "fontFamily": "Arial"
    },
    "date": {
      "fontSize": 80,
      "fontColor": "#000000",
      "fontFamily": "Arial",
      "content": "Hello"
    },
    "position": {
      "x": 1077,
      "y": 587
    }
  }
}`, "utf-8");
}
async function X() {
  if (m) return;
  const n = o.join(u(), "setting.json");
  if (await b(n)) return;
  await l.writeFile(n, `
	{
		"setting": {
			"autostart": false,
			"dark": false,
			"showClock": true
		}
	}`, "utf-8");
}
async function T(n = g) {
  const e = o.join(u(), n);
  await K(e) || await l.mkdir(e, { recursive: !0 });
}
function Y(n, e, t, a = g) {
  return new Promise(async (c, f) => {
    try {
      const w = o.join(u(), a, n + "." + e);
      await l.writeFile(w, t, { encoding: "utf8" }), c(!0);
    } catch (w) {
      const h = `保存文件失败：${w.message}`;
      f(new Error(h));
    }
  });
}
function Z(n, e = g) {
  return new Promise(async (t, a) => {
    try {
      const c = o.join(u(), e, n), f = await l.readFile(c, "utf-8");
      t(f);
    } catch {
      a("");
    }
  });
}
function ee(n = g) {
  return new Promise(async (e, t) => {
    try {
      const a = o.join(u(), n), c = await l.readdir(a, { withFileTypes: !0 }), f = await Promise.all(
        c.filter((w) => w.isFile()).map(async (w) => {
          const h = w.name.split("."), v = h[0], D = h[1];
          return {
            name: v,
            type: D
          };
        })
      );
      e(f);
    } catch {
      t([]);
    }
  });
}
function ne(n, e = g) {
  return new Promise(async (t, a) => {
    try {
      const c = o.join(u(), e, n);
      await l.unlink(c), t(!0);
    } catch {
      a(!1);
    }
  });
}
const te = () => {
  if (p) return;
  const n = o.join(process.env.VITE_PUBLIC, "water.ico");
  p = new V(n);
  const e = z.buildFromTemplate([
    {
      label: "显示/隐藏",
      click: () => {
        s && (s.isVisible() ? s.hide() : s.show());
      }
    },
    {
      label: "退出",
      click: () => {
        d.quit();
      }
    }
  ]);
  p.setToolTip("Salvation lies within"), p.setContextMenu(e), p.on("click", () => {
    s && (s.isVisible() ? s.hide() : s.show());
  });
};
process.platform === "win32" && (d.commandLine.appendSwitch("high-dpi-support", "true"), d.commandLine.appendSwitch("force-device-scale-factor", "1"));
export {
  I as MAIN_DIST,
  S as RENDERER_DIST,
  y as VITE_DEV_SERVER_URL
};
