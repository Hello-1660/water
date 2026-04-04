var ud = Object.defineProperty;
var fd = (e, t, n) => t in e ? ud(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Mi = (e, t, n) => fd(e, typeof t != "symbol" ? t + "" : t, n);
import qt, { app as ae, BrowserWindow as Bt, ipcMain as k, globalShortcut as Bl, Tray as dd, Menu as hd, screen as pd, dialog as Ha } from "electron";
import Ct from "fs";
import md from "constants";
import tr from "stream";
import Bo from "util";
import jl from "assert";
import se from "path";
import ai from "child_process";
import Hl from "events";
import nr from "crypto";
import ql from "tty";
import si from "os";
import bt from "url";
import Gl from "zlib";
import gd from "http";
import { spawn as bn, execFileSync as wd } from "node:child_process";
import { fileURLToPath as yd } from "node:url";
import V from "node:path";
import fe from "node:fs/promises";
var Re = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Be = {}, Vt = {}, De = {};
De.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
De.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var pt = md, Ed = process.cwd, Hr = null, vd = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Hr || (Hr = Ed.call(process)), Hr;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var qa = process.chdir;
  process.chdir = function(e) {
    Hr = null, qa.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, qa);
}
var _d = Ad;
function Ad(e) {
  pt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, d) {
    d && process.nextTick(d);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, d, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), vd === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function f(d, g, E) {
      var y = Date.now(), A = 0;
      c(d, g, function S(T) {
        if (T && (T.code === "EACCES" || T.code === "EPERM" || T.code === "EBUSY") && Date.now() - y < 6e4) {
          setTimeout(function() {
            e.stat(g, function(D, x) {
              D && D.code === "ENOENT" ? c(d, g, S) : E(T);
            });
          }, A), A < 100 && (A += 10);
          return;
        }
        E && E(T);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function f(d, g, E, y, A, S) {
      var T;
      if (S && typeof S == "function") {
        var D = 0;
        T = function(x, re, ue) {
          if (x && x.code === "EAGAIN" && D < 10)
            return D++, c.call(e, d, g, E, y, A, T);
          S.apply(this, arguments);
        };
      }
      return c.call(e, d, g, E, y, A, T);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(f, d, g, E, y) {
      for (var A = 0; ; )
        try {
          return c.call(e, f, d, g, E, y);
        } catch (S) {
          if (S.code === "EAGAIN" && A < 10) {
            A++;
            continue;
          }
          throw S;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(f, d, g) {
      c.open(
        f,
        pt.O_WRONLY | pt.O_SYMLINK,
        d,
        function(E, y) {
          if (E) {
            g && g(E);
            return;
          }
          c.fchmod(y, d, function(A) {
            c.close(y, function(S) {
              g && g(A || S);
            });
          });
        }
      );
    }, c.lchmodSync = function(f, d) {
      var g = c.openSync(f, pt.O_WRONLY | pt.O_SYMLINK, d), E = !0, y;
      try {
        y = c.fchmodSync(g, d), E = !1;
      } finally {
        if (E)
          try {
            c.closeSync(g);
          } catch {
          }
        else
          c.closeSync(g);
      }
      return y;
    };
  }
  function n(c) {
    pt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, d, g, E) {
      c.open(f, pt.O_SYMLINK, function(y, A) {
        if (y) {
          E && E(y);
          return;
        }
        c.futimes(A, d, g, function(S) {
          c.close(A, function(T) {
            E && E(S || T);
          });
        });
      });
    }, c.lutimesSync = function(f, d, g) {
      var E = c.openSync(f, pt.O_SYMLINK), y, A = !0;
      try {
        y = c.futimesSync(E, d, g), A = !1;
      } finally {
        if (A)
          try {
            c.closeSync(E);
          } catch {
          }
        else
          c.closeSync(E);
      }
      return y;
    }) : c.futimes && (c.lutimes = function(f, d, g, E) {
      E && process.nextTick(E);
    }, c.lutimesSync = function() {
    });
  }
  function r(c) {
    return c && function(f, d, g) {
      return c.call(e, f, d, function(E) {
        m(E) && (E = null), g && g.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(f, d) {
      try {
        return c.call(e, f, d);
      } catch (g) {
        if (!m(g)) throw g;
      }
    };
  }
  function o(c) {
    return c && function(f, d, g, E) {
      return c.call(e, f, d, g, function(y) {
        m(y) && (y = null), E && E.apply(this, arguments);
      });
    };
  }
  function a(c) {
    return c && function(f, d, g) {
      try {
        return c.call(e, f, d, g);
      } catch (E) {
        if (!m(E)) throw E;
      }
    };
  }
  function s(c) {
    return c && function(f, d, g) {
      typeof d == "function" && (g = d, d = null);
      function E(y, A) {
        A && (A.uid < 0 && (A.uid += 4294967296), A.gid < 0 && (A.gid += 4294967296)), g && g.apply(this, arguments);
      }
      return d ? c.call(e, f, d, E) : c.call(e, f, E);
    };
  }
  function l(c) {
    return c && function(f, d) {
      var g = d ? c.call(e, f, d) : c.call(e, f);
      return g && (g.uid < 0 && (g.uid += 4294967296), g.gid < 0 && (g.gid += 4294967296)), g;
    };
  }
  function m(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var Ga = tr.Stream, Td = Sd;
function Sd(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    Ga.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), s = 0, l = a.length; s < l; s++) {
      var m = a[s];
      this[m] = i[m];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(c, f) {
      if (c) {
        o.emit("error", c), o.readable = !1;
        return;
      }
      o.fd = f, o.emit("open", f), o._read();
    });
  }
  function n(r, i) {
    if (!(this instanceof n)) return new n(r, i);
    Ga.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), a = 0, s = o.length; a < s; a++) {
      var l = o[a];
      this[l] = i[l];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var Cd = Pd, bd = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Pd(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: bd(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var oe = Ct, Od = _d, Rd = Td, Id = Cd, Cr = Bo, _e, Vr;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (_e = Symbol.for("graceful-fs.queue"), Vr = Symbol.for("graceful-fs.previous")) : (_e = "___graceful-fs.queue", Vr = "___graceful-fs.previous");
function Nd() {
}
function Wl(e, t) {
  Object.defineProperty(e, _e, {
    get: function() {
      return t;
    }
  });
}
var jt = Nd;
Cr.debuglog ? jt = Cr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (jt = function() {
  var e = Cr.format.apply(Cr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!oe[_e]) {
  var Dd = Re[_e] || [];
  Wl(oe, Dd), oe.close = function(e) {
    function t(n, r) {
      return e.call(oe, n, function(i) {
        i || Wa(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Vr, {
      value: e
    }), t;
  }(oe.close), oe.closeSync = function(e) {
    function t(n) {
      e.apply(oe, arguments), Wa();
    }
    return Object.defineProperty(t, Vr, {
      value: e
    }), t;
  }(oe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    jt(oe[_e]), jl.equal(oe[_e].length, 0);
  });
}
Re[_e] || Wl(Re, oe[_e]);
var $e = jo(Id(oe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !oe.__patched && ($e = jo(oe), oe.__patched = !0);
function jo(e) {
  Od(e), e.gracefulify = jo, e.createReadStream = re, e.createWriteStream = ue;
  var t = e.readFile;
  e.readFile = n;
  function n(w, W, H) {
    return typeof W == "function" && (H = W, W = null), j(w, W, H);
    function j(J, R, P, N) {
      return t(J, R, function(b) {
        b && (b.code === "EMFILE" || b.code === "ENFILE") ? Jt([j, [J, R, P], b, N || Date.now(), Date.now()]) : typeof P == "function" && P.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(w, W, H, j) {
    return typeof H == "function" && (j = H, H = null), J(w, W, H, j);
    function J(R, P, N, b, $) {
      return r(R, P, N, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? Jt([J, [R, P, N, b], I, $ || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(w, W, H, j) {
    return typeof H == "function" && (j = H, H = null), J(w, W, H, j);
    function J(R, P, N, b, $) {
      return o(R, P, N, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? Jt([J, [R, P, N, b], I, $ || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(w, W, H, j) {
    return typeof H == "function" && (j = H, H = 0), J(w, W, H, j);
    function J(R, P, N, b, $) {
      return s(R, P, N, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? Jt([J, [R, P, N, b], I, $ || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var m = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(w, W, H) {
    typeof W == "function" && (H = W, W = null);
    var j = c.test(process.version) ? function(P, N, b, $) {
      return m(P, J(
        P,
        N,
        b,
        $
      ));
    } : function(P, N, b, $) {
      return m(P, N, J(
        P,
        N,
        b,
        $
      ));
    };
    return j(w, W, H);
    function J(R, P, N, b) {
      return function($, I) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Jt([
          j,
          [R, P, N],
          $,
          b || Date.now(),
          Date.now()
        ]) : (I && I.sort && I.sort(), typeof N == "function" && N.call(this, $, I));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var d = Rd(e);
    S = d.ReadStream, D = d.WriteStream;
  }
  var g = e.ReadStream;
  g && (S.prototype = Object.create(g.prototype), S.prototype.open = T);
  var E = e.WriteStream;
  E && (D.prototype = Object.create(E.prototype), D.prototype.open = x), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return S;
    },
    set: function(w) {
      S = w;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return D;
    },
    set: function(w) {
      D = w;
    },
    enumerable: !0,
    configurable: !0
  });
  var y = S;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return y;
    },
    set: function(w) {
      y = w;
    },
    enumerable: !0,
    configurable: !0
  });
  var A = D;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return A;
    },
    set: function(w) {
      A = w;
    },
    enumerable: !0,
    configurable: !0
  });
  function S(w, W) {
    return this instanceof S ? (g.apply(this, arguments), this) : S.apply(Object.create(S.prototype), arguments);
  }
  function T() {
    var w = this;
    ke(w.path, w.flags, w.mode, function(W, H) {
      W ? (w.autoClose && w.destroy(), w.emit("error", W)) : (w.fd = H, w.emit("open", H), w.read());
    });
  }
  function D(w, W) {
    return this instanceof D ? (E.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
  }
  function x() {
    var w = this;
    ke(w.path, w.flags, w.mode, function(W, H) {
      W ? (w.destroy(), w.emit("error", W)) : (w.fd = H, w.emit("open", H));
    });
  }
  function re(w, W) {
    return new e.ReadStream(w, W);
  }
  function ue(w, W) {
    return new e.WriteStream(w, W);
  }
  var X = e.open;
  e.open = ke;
  function ke(w, W, H, j) {
    return typeof H == "function" && (j = H, H = null), J(w, W, H, j);
    function J(R, P, N, b, $) {
      return X(R, P, N, function(I, M) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? Jt([J, [R, P, N, b], I, $ || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  return e;
}
function Jt(e) {
  jt("ENQUEUE", e[0].name, e[1]), oe[_e].push(e), Ho();
}
var br;
function Wa() {
  for (var e = Date.now(), t = 0; t < oe[_e].length; ++t)
    oe[_e][t].length > 2 && (oe[_e][t][3] = e, oe[_e][t][4] = e);
  Ho();
}
function Ho() {
  if (clearTimeout(br), br = void 0, oe[_e].length !== 0) {
    var e = oe[_e].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      jt("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      jt("TIMEOUT", t.name, n);
      var a = n.pop();
      typeof a == "function" && a.call(null, r);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), m = Math.min(l * 1.2, 100);
      s >= m ? (jt("RETRY", t.name, n), t.apply(null, n.concat([i]))) : oe[_e].push(e);
    }
    br === void 0 && (br = setTimeout(Ho, 0));
  }
}
(function(e) {
  const t = De.fromCallback, n = $e, r = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof n[i] == "function");
  Object.assign(e, n), r.forEach((i) => {
    e[i] = t(n[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? n.exists(i, o) : new Promise((a) => n.exists(i, a));
  }, e.read = function(i, o, a, s, l, m) {
    return typeof m == "function" ? n.read(i, o, a, s, l, m) : new Promise((c, f) => {
      n.read(i, o, a, s, l, (d, g, E) => {
        if (d) return f(d);
        c({ bytesRead: g, buffer: E });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.write(i, o, ...a) : new Promise((s, l) => {
      n.write(i, o, ...a, (m, c, f) => {
        if (m) return l(m);
        s({ bytesWritten: c, buffer: f });
      });
    });
  }, typeof n.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.writev(i, o, ...a) : new Promise((s, l) => {
      n.writev(i, o, ...a, (m, c, f) => {
        if (m) return l(m);
        s({ bytesWritten: c, buffers: f });
      });
    });
  }), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Vt);
var qo = {}, Vl = {};
const $d = se;
Vl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace($d.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const Yl = Vt, { checkPath: zl } = Vl, Xl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
qo.makeDir = async (e, t) => (zl(e), Yl.mkdir(e, {
  mode: Xl(t),
  recursive: !0
}));
qo.makeDirSync = (e, t) => (zl(e), Yl.mkdirSync(e, {
  mode: Xl(t),
  recursive: !0
}));
const Fd = De.fromPromise, { makeDir: xd, makeDirSync: Bi } = qo, ji = Fd(xd);
var ot = {
  mkdirs: ji,
  mkdirsSync: Bi,
  // alias
  mkdirp: ji,
  mkdirpSync: Bi,
  ensureDir: ji,
  ensureDirSync: Bi
};
const Ld = De.fromPromise, Kl = Vt;
function Ud(e) {
  return Kl.access(e).then(() => !0).catch(() => !1);
}
var Yt = {
  pathExists: Ld(Ud),
  pathExistsSync: Kl.existsSync
};
const cn = $e;
function kd(e, t, n, r) {
  cn.open(e, "r+", (i, o) => {
    if (i) return r(i);
    cn.futimes(o, t, n, (a) => {
      cn.close(o, (s) => {
        r && r(a || s);
      });
    });
  });
}
function Md(e, t, n) {
  const r = cn.openSync(e, "r+");
  return cn.futimesSync(r, t, n), cn.closeSync(r);
}
var Jl = {
  utimesMillis: kd,
  utimesMillisSync: Md
};
const fn = Vt, ye = se, Bd = Bo;
function jd(e, t, n) {
  const r = n.dereference ? (i) => fn.stat(i, { bigint: !0 }) : (i) => fn.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function Hd(e, t, n) {
  let r;
  const i = n.dereference ? (a) => fn.statSync(a, { bigint: !0 }) : (a) => fn.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: r };
}
function qd(e, t, n, r, i) {
  Bd.callbackify(jd)(e, t, r, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (rr(s, l)) {
        const m = ye.basename(e), c = ye.basename(t);
        return n === "move" && m !== c && m.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && Go(e, t) ? i(new Error(li(e, t, n))) : i(null, { srcStat: s, destStat: l });
  });
}
function Gd(e, t, n, r) {
  const { srcStat: i, destStat: o } = Hd(e, t, r);
  if (o) {
    if (rr(i, o)) {
      const a = ye.basename(e), s = ye.basename(t);
      if (n === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && Go(e, t))
    throw new Error(li(e, t, n));
  return { srcStat: i, destStat: o };
}
function Ql(e, t, n, r, i) {
  const o = ye.resolve(ye.dirname(e)), a = ye.resolve(ye.dirname(n));
  if (a === o || a === ye.parse(a).root) return i();
  fn.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : rr(t, l) ? i(new Error(li(e, n, r))) : Ql(e, t, a, r, i));
}
function Zl(e, t, n, r) {
  const i = ye.resolve(ye.dirname(e)), o = ye.resolve(ye.dirname(n));
  if (o === i || o === ye.parse(o).root) return;
  let a;
  try {
    a = fn.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (rr(t, a))
    throw new Error(li(e, n, r));
  return Zl(e, t, o, r);
}
function rr(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Go(e, t) {
  const n = ye.resolve(e).split(ye.sep).filter((i) => i), r = ye.resolve(t).split(ye.sep).filter((i) => i);
  return n.reduce((i, o, a) => i && r[a] === o, !0);
}
function li(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var mn = {
  checkPaths: qd,
  checkPathsSync: Gd,
  checkParentPaths: Ql,
  checkParentPathsSync: Zl,
  isSrcSubdir: Go,
  areIdentical: rr
};
const Le = $e, Bn = se, Wd = ot.mkdirs, Vd = Yt.pathExists, Yd = Jl.utimesMillis, jn = mn;
function zd(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), jn.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: a, destStat: s } = o;
    jn.checkParentPaths(e, a, t, "copy", (l) => l ? r(l) : n.filter ? ec(Va, s, e, t, n, r) : Va(s, e, t, n, r));
  });
}
function Va(e, t, n, r, i) {
  const o = Bn.dirname(n);
  Vd(o, (a, s) => {
    if (a) return i(a);
    if (s) return Yr(e, t, n, r, i);
    Wd(o, (l) => l ? i(l) : Yr(e, t, n, r, i));
  });
}
function ec(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((a) => a ? e(t, n, r, i, o) : o(), (a) => o(a));
}
function Xd(e, t, n, r, i) {
  return r.filter ? ec(Yr, e, t, n, r, i) : Yr(e, t, n, r, i);
}
function Yr(e, t, n, r, i) {
  (r.dereference ? Le.stat : Le.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? nh(s, e, t, n, r, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? Kd(s, e, t, n, r, i) : s.isSymbolicLink() ? oh(e, t, n, r, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Kd(e, t, n, r, i, o) {
  return t ? Jd(e, n, r, i, o) : tc(e, n, r, i, o);
}
function Jd(e, t, n, r, i) {
  if (r.overwrite)
    Le.unlink(n, (o) => o ? i(o) : tc(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function tc(e, t, n, r, i) {
  Le.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? Qd(e.mode, t, n, i) : ci(n, e.mode, i));
}
function Qd(e, t, n, r) {
  return Zd(e) ? eh(n, e, (i) => i ? r(i) : Ya(e, t, n, r)) : Ya(e, t, n, r);
}
function Zd(e) {
  return (e & 128) === 0;
}
function eh(e, t, n) {
  return ci(e, t | 128, n);
}
function Ya(e, t, n, r) {
  th(t, n, (i) => i ? r(i) : ci(n, e, r));
}
function ci(e, t, n) {
  return Le.chmod(e, t, n);
}
function th(e, t, n) {
  Le.stat(e, (r, i) => r ? n(r) : Yd(t, i.atime, i.mtime, n));
}
function nh(e, t, n, r, i, o) {
  return t ? nc(n, r, i, o) : rh(e.mode, n, r, i, o);
}
function rh(e, t, n, r, i) {
  Le.mkdir(n, (o) => {
    if (o) return i(o);
    nc(t, n, r, (a) => a ? i(a) : ci(n, e, i));
  });
}
function nc(e, t, n, r) {
  Le.readdir(e, (i, o) => i ? r(i) : rc(o, e, t, n, r));
}
function rc(e, t, n, r, i) {
  const o = e.pop();
  return o ? ih(e, o, t, n, r, i) : i();
}
function ih(e, t, n, r, i, o) {
  const a = Bn.join(n, t), s = Bn.join(r, t);
  jn.checkPaths(a, s, "copy", i, (l, m) => {
    if (l) return o(l);
    const { destStat: c } = m;
    Xd(c, a, s, i, (f) => f ? o(f) : rc(e, n, r, i, o));
  });
}
function oh(e, t, n, r, i) {
  Le.readlink(t, (o, a) => {
    if (o) return i(o);
    if (r.dereference && (a = Bn.resolve(process.cwd(), a)), e)
      Le.readlink(n, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? Le.symlink(a, n, i) : i(s) : (r.dereference && (l = Bn.resolve(process.cwd(), l)), jn.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && jn.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : ah(a, n, i)));
    else
      return Le.symlink(a, n, i);
  });
}
function ah(e, t, n) {
  Le.unlink(t, (r) => r ? n(r) : Le.symlink(e, t, n));
}
var sh = zd;
const Ce = $e, Hn = se, lh = ot.mkdirsSync, ch = Jl.utimesMillisSync, qn = mn;
function uh(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = qn.checkPathsSync(e, t, "copy", n);
  return qn.checkParentPathsSync(e, r, t, "copy"), fh(i, e, t, n);
}
function fh(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = Hn.dirname(n);
  return Ce.existsSync(i) || lh(i), ic(e, t, n, r);
}
function dh(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return ic(e, t, n, r);
}
function ic(e, t, n, r) {
  const o = (r.dereference ? Ce.statSync : Ce.lstatSync)(t);
  if (o.isDirectory()) return Eh(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return hh(o, e, t, n, r);
  if (o.isSymbolicLink()) return Ah(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function hh(e, t, n, r, i) {
  return t ? ph(e, n, r, i) : oc(e, n, r, i);
}
function ph(e, t, n, r) {
  if (r.overwrite)
    return Ce.unlinkSync(n), oc(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function oc(e, t, n, r) {
  return Ce.copyFileSync(t, n), r.preserveTimestamps && mh(e.mode, t, n), Wo(n, e.mode);
}
function mh(e, t, n) {
  return gh(e) && wh(n, e), yh(t, n);
}
function gh(e) {
  return (e & 128) === 0;
}
function wh(e, t) {
  return Wo(e, t | 128);
}
function Wo(e, t) {
  return Ce.chmodSync(e, t);
}
function yh(e, t) {
  const n = Ce.statSync(e);
  return ch(t, n.atime, n.mtime);
}
function Eh(e, t, n, r, i) {
  return t ? ac(n, r, i) : vh(e.mode, n, r, i);
}
function vh(e, t, n, r) {
  return Ce.mkdirSync(n), ac(t, n, r), Wo(n, e);
}
function ac(e, t, n) {
  Ce.readdirSync(e).forEach((r) => _h(r, e, t, n));
}
function _h(e, t, n, r) {
  const i = Hn.join(t, e), o = Hn.join(n, e), { destStat: a } = qn.checkPathsSync(i, o, "copy", r);
  return dh(a, i, o, r);
}
function Ah(e, t, n, r) {
  let i = Ce.readlinkSync(t);
  if (r.dereference && (i = Hn.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Ce.readlinkSync(n);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return Ce.symlinkSync(i, n);
      throw a;
    }
    if (r.dereference && (o = Hn.resolve(process.cwd(), o)), qn.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Ce.statSync(n).isDirectory() && qn.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return Th(i, n);
  } else
    return Ce.symlinkSync(i, n);
}
function Th(e, t) {
  return Ce.unlinkSync(t), Ce.symlinkSync(e, t);
}
var Sh = uh;
const Ch = De.fromCallback;
var Vo = {
  copy: Ch(sh),
  copySync: Sh
};
const za = $e, sc = se, Z = jl, Gn = process.platform === "win32";
function lc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || za[n], n = n + "Sync", e[n] = e[n] || za[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Yo(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), Z(e, "rimraf: missing path"), Z.strictEqual(typeof e, "string", "rimraf: path should be a string"), Z.strictEqual(typeof n, "function", "rimraf: callback function required"), Z(t, "rimraf: invalid options argument provided"), Z.strictEqual(typeof t, "object", "rimraf: options should be object"), lc(t), Xa(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const a = r * 100;
        return setTimeout(() => Xa(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function Xa(e, t, n) {
  Z(e), Z(t), Z(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && Gn)
      return Ka(e, t, r, n);
    if (i && i.isDirectory())
      return qr(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return Gn ? Ka(e, t, o, n) : qr(e, t, o, n);
        if (o.code === "EISDIR")
          return qr(e, t, o, n);
      }
      return n(o);
    });
  });
}
function Ka(e, t, n, r) {
  Z(e), Z(t), Z(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, a) => {
      o ? r(o.code === "ENOENT" ? null : n) : a.isDirectory() ? qr(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function Ja(e, t, n) {
  let r;
  Z(e), Z(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  try {
    r = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  r.isDirectory() ? Gr(e, t, n) : t.unlinkSync(e);
}
function qr(e, t, n, r) {
  Z(e), Z(t), Z(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? bh(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function bh(e, t, n) {
  Z(e), Z(t), Z(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((s) => {
      Yo(sc.join(e, s), t, (l) => {
        if (!a) {
          if (l) return n(a = l);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function cc(e, t) {
  let n;
  t = t || {}, lc(t), Z(e, "rimraf: missing path"), Z.strictEqual(typeof e, "string", "rimraf: path should be a string"), Z(t, "rimraf: missing options"), Z.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && Gn && Ja(e, t, r);
  }
  try {
    n && n.isDirectory() ? Gr(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return Gn ? Ja(e, t, r) : Gr(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    Gr(e, t, r);
  }
}
function Gr(e, t, n) {
  Z(e), Z(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      Ph(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function Ph(e, t) {
  if (Z(e), Z(t), t.readdirSync(e).forEach((n) => cc(sc.join(e, n), t)), Gn) {
    const n = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - n < 500);
  } else
    return t.rmdirSync(e, t);
}
var Oh = Yo;
Yo.sync = cc;
const zr = $e, Rh = De.fromCallback, uc = Oh;
function Ih(e, t) {
  if (zr.rm) return zr.rm(e, { recursive: !0, force: !0 }, t);
  uc(e, t);
}
function Nh(e) {
  if (zr.rmSync) return zr.rmSync(e, { recursive: !0, force: !0 });
  uc.sync(e);
}
var ui = {
  remove: Rh(Ih),
  removeSync: Nh
};
const Dh = De.fromPromise, fc = Vt, dc = se, hc = ot, pc = ui, Qa = Dh(async function(t) {
  let n;
  try {
    n = await fc.readdir(t);
  } catch {
    return hc.mkdirs(t);
  }
  return Promise.all(n.map((r) => pc.remove(dc.join(t, r))));
});
function Za(e) {
  let t;
  try {
    t = fc.readdirSync(e);
  } catch {
    return hc.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = dc.join(e, n), pc.removeSync(n);
  });
}
var $h = {
  emptyDirSync: Za,
  emptydirSync: Za,
  emptyDir: Qa,
  emptydir: Qa
};
const Fh = De.fromCallback, mc = se, wt = $e, gc = ot;
function xh(e, t) {
  function n() {
    wt.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  wt.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = mc.dirname(e);
    wt.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? gc.mkdirs(o, (l) => {
          if (l) return t(l);
          n();
        }) : t(a);
      s.isDirectory() ? n() : wt.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Lh(e) {
  let t;
  try {
    t = wt.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = mc.dirname(e);
  try {
    wt.statSync(n).isDirectory() || wt.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") gc.mkdirsSync(n);
    else throw r;
  }
  wt.writeFileSync(e, "");
}
var Uh = {
  createFile: Fh(xh),
  createFileSync: Lh
};
const kh = De.fromCallback, wc = se, gt = $e, yc = ot, Mh = Yt.pathExists, { areIdentical: Ec } = mn;
function Bh(e, t, n) {
  function r(i, o) {
    gt.link(i, o, (a) => {
      if (a) return n(a);
      n(null);
    });
  }
  gt.lstat(t, (i, o) => {
    gt.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), n(a);
      if (o && Ec(s, o)) return n(null);
      const l = wc.dirname(t);
      Mh(l, (m, c) => {
        if (m) return n(m);
        if (c) return r(e, t);
        yc.mkdirs(l, (f) => {
          if (f) return n(f);
          r(e, t);
        });
      });
    });
  });
}
function jh(e, t) {
  let n;
  try {
    n = gt.lstatSync(t);
  } catch {
  }
  try {
    const o = gt.lstatSync(e);
    if (n && Ec(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = wc.dirname(t);
  return gt.existsSync(r) || yc.mkdirsSync(r), gt.linkSync(e, t);
}
var Hh = {
  createLink: kh(Bh),
  createLinkSync: jh
};
const yt = se, Ln = $e, qh = Yt.pathExists;
function Gh(e, t, n) {
  if (yt.isAbsolute(e))
    return Ln.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = yt.dirname(t), i = yt.join(r, e);
    return qh(i, (o, a) => o ? n(o) : a ? n(null, {
      toCwd: i,
      toDst: e
    }) : Ln.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), n(s)) : n(null, {
      toCwd: e,
      toDst: yt.relative(r, e)
    })));
  }
}
function Wh(e, t) {
  let n;
  if (yt.isAbsolute(e)) {
    if (n = Ln.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = yt.dirname(t), i = yt.join(r, e);
    if (n = Ln.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = Ln.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: yt.relative(r, e)
    };
  }
}
var Vh = {
  symlinkPaths: Gh,
  symlinkPathsSync: Wh
};
const vc = $e;
function Yh(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  vc.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function zh(e, t) {
  let n;
  if (t) return t;
  try {
    n = vc.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var Xh = {
  symlinkType: Yh,
  symlinkTypeSync: zh
};
const Kh = De.fromCallback, _c = se, Ye = Vt, Ac = ot, Jh = Ac.mkdirs, Qh = Ac.mkdirsSync, Tc = Vh, Zh = Tc.symlinkPaths, ep = Tc.symlinkPathsSync, Sc = Xh, tp = Sc.symlinkType, np = Sc.symlinkTypeSync, rp = Yt.pathExists, { areIdentical: Cc } = mn;
function ip(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, Ye.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Ye.stat(e),
      Ye.stat(t)
    ]).then(([a, s]) => {
      if (Cc(a, s)) return r(null);
      es(e, t, n, r);
    }) : es(e, t, n, r);
  });
}
function es(e, t, n, r) {
  Zh(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, tp(o.toCwd, n, (a, s) => {
      if (a) return r(a);
      const l = _c.dirname(t);
      rp(l, (m, c) => {
        if (m) return r(m);
        if (c) return Ye.symlink(e, t, s, r);
        Jh(l, (f) => {
          if (f) return r(f);
          Ye.symlink(e, t, s, r);
        });
      });
    });
  });
}
function op(e, t, n) {
  let r;
  try {
    r = Ye.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const s = Ye.statSync(e), l = Ye.statSync(t);
    if (Cc(s, l)) return;
  }
  const i = ep(e, t);
  e = i.toDst, n = np(i.toCwd, n);
  const o = _c.dirname(t);
  return Ye.existsSync(o) || Qh(o), Ye.symlinkSync(e, t, n);
}
var ap = {
  createSymlink: Kh(ip),
  createSymlinkSync: op
};
const { createFile: ts, createFileSync: ns } = Uh, { createLink: rs, createLinkSync: is } = Hh, { createSymlink: os, createSymlinkSync: as } = ap;
var sp = {
  // file
  createFile: ts,
  createFileSync: ns,
  ensureFile: ts,
  ensureFileSync: ns,
  // link
  createLink: rs,
  createLinkSync: is,
  ensureLink: rs,
  ensureLinkSync: is,
  // symlink
  createSymlink: os,
  createSymlinkSync: as,
  ensureSymlink: os,
  ensureSymlinkSync: as
};
function lp(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function cp(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var zo = { stringify: lp, stripBom: cp };
let dn;
try {
  dn = $e;
} catch {
  dn = Ct;
}
const fi = De, { stringify: bc, stripBom: Pc } = zo;
async function up(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || dn, r = "throws" in t ? t.throws : !0;
  let i = await fi.fromCallback(n.readFile)(e, t);
  i = Pc(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (r)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return o;
}
const fp = fi.fromPromise(up);
function dp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || dn, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = Pc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function hp(e, t, n = {}) {
  const r = n.fs || dn, i = bc(t, n);
  await fi.fromCallback(r.writeFile)(e, i, n);
}
const pp = fi.fromPromise(hp);
function mp(e, t, n = {}) {
  const r = n.fs || dn, i = bc(t, n);
  return r.writeFileSync(e, i, n);
}
var gp = {
  readFile: fp,
  readFileSync: dp,
  writeFile: pp,
  writeFileSync: mp
};
const Pr = gp;
var wp = {
  // jsonfile exports
  readJson: Pr.readFile,
  readJsonSync: Pr.readFileSync,
  writeJson: Pr.writeFile,
  writeJsonSync: Pr.writeFileSync
};
const yp = De.fromCallback, Un = $e, Oc = se, Rc = ot, Ep = Yt.pathExists;
function vp(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = Oc.dirname(e);
  Ep(i, (o, a) => {
    if (o) return r(o);
    if (a) return Un.writeFile(e, t, n, r);
    Rc.mkdirs(i, (s) => {
      if (s) return r(s);
      Un.writeFile(e, t, n, r);
    });
  });
}
function _p(e, ...t) {
  const n = Oc.dirname(e);
  if (Un.existsSync(n))
    return Un.writeFileSync(e, ...t);
  Rc.mkdirsSync(n), Un.writeFileSync(e, ...t);
}
var Xo = {
  outputFile: yp(vp),
  outputFileSync: _p
};
const { stringify: Ap } = zo, { outputFile: Tp } = Xo;
async function Sp(e, t, n = {}) {
  const r = Ap(t, n);
  await Tp(e, r, n);
}
var Cp = Sp;
const { stringify: bp } = zo, { outputFileSync: Pp } = Xo;
function Op(e, t, n) {
  const r = bp(t, n);
  Pp(e, r, n);
}
var Rp = Op;
const Ip = De.fromPromise, Ne = wp;
Ne.outputJson = Ip(Cp);
Ne.outputJsonSync = Rp;
Ne.outputJSON = Ne.outputJson;
Ne.outputJSONSync = Ne.outputJsonSync;
Ne.writeJSON = Ne.writeJson;
Ne.writeJSONSync = Ne.writeJsonSync;
Ne.readJSON = Ne.readJson;
Ne.readJSONSync = Ne.readJsonSync;
var Np = Ne;
const Dp = $e, To = se, $p = Vo.copy, Ic = ui.remove, Fp = ot.mkdirp, xp = Yt.pathExists, ss = mn;
function Lp(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  ss.checkPaths(e, t, "move", n, (o, a) => {
    if (o) return r(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    ss.checkParentPaths(e, s, t, "move", (m) => {
      if (m) return r(m);
      if (Up(t)) return ls(e, t, i, l, r);
      Fp(To.dirname(t), (c) => c ? r(c) : ls(e, t, i, l, r));
    });
  });
}
function Up(e) {
  const t = To.dirname(e);
  return To.parse(t).root === t;
}
function ls(e, t, n, r, i) {
  if (r) return Hi(e, t, n, i);
  if (n)
    return Ic(t, (o) => o ? i(o) : Hi(e, t, n, i));
  xp(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : Hi(e, t, n, i));
}
function Hi(e, t, n, r) {
  Dp.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : kp(e, t, n, r) : r());
}
function kp(e, t, n, r) {
  $p(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : Ic(e, r));
}
var Mp = Lp;
const Nc = $e, So = se, Bp = Vo.copySync, Dc = ui.removeSync, jp = ot.mkdirpSync, cs = mn;
function Hp(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = cs.checkPathsSync(e, t, "move", n);
  return cs.checkParentPathsSync(e, i, t, "move"), qp(t) || jp(So.dirname(t)), Gp(e, t, r, o);
}
function qp(e) {
  const t = So.dirname(e);
  return So.parse(t).root === t;
}
function Gp(e, t, n, r) {
  if (r) return qi(e, t, n);
  if (n)
    return Dc(t), qi(e, t, n);
  if (Nc.existsSync(t)) throw new Error("dest already exists.");
  return qi(e, t, n);
}
function qi(e, t, n) {
  try {
    Nc.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return Wp(e, t, n);
  }
}
function Wp(e, t, n) {
  return Bp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), Dc(e);
}
var Vp = Hp;
const Yp = De.fromCallback;
var zp = {
  move: Yp(Mp),
  moveSync: Vp
}, Pt = {
  // Export promiseified graceful-fs:
  ...Vt,
  // Export extra methods:
  ...Vo,
  ...$h,
  ...sp,
  ...Np,
  ...ot,
  ...zp,
  ...Xo,
  ...Yt,
  ...ui
}, zt = {}, vt = {}, me = {}, _t = {};
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.CancellationError = _t.CancellationToken = void 0;
const Xp = Hl;
class Kp extends Xp.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new Co());
    const n = () => {
      if (r != null)
        try {
          this.removeListener("cancel", r), r = null;
        } catch {
        }
    };
    let r = null;
    return new Promise((i, o) => {
      let a = null;
      if (r = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          o(new Co());
        }
      }, this.cancelled) {
        r();
        return;
      }
      this.onCancel(r), t(i, o, (s) => {
        a = s;
      });
    }).then((i) => (n(), i)).catch((i) => {
      throw n(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
_t.CancellationToken = Kp;
class Co extends Error {
  constructor() {
    super("cancelled");
  }
}
_t.CancellationError = Co;
var gn = {};
Object.defineProperty(gn, "__esModule", { value: !0 });
gn.newError = Jp;
function Jp(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var Ie = {}, bo = { exports: {} }, Or = { exports: {} }, Gi, us;
function Qp() {
  if (us) return Gi;
  us = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  Gi = function(c, f) {
    f = f || {};
    var d = typeof c;
    if (d === "string" && c.length > 0)
      return a(c);
    if (d === "number" && isFinite(c))
      return f.long ? l(c) : s(c);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(c)
    );
  };
  function a(c) {
    if (c = String(c), !(c.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        c
      );
      if (f) {
        var d = parseFloat(f[1]), g = (f[2] || "ms").toLowerCase();
        switch (g) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * o;
          case "weeks":
          case "week":
          case "w":
            return d * i;
          case "days":
          case "day":
          case "d":
            return d * r;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
          default:
            return;
        }
      }
    }
  }
  function s(c) {
    var f = Math.abs(c);
    return f >= r ? Math.round(c / r) + "d" : f >= n ? Math.round(c / n) + "h" : f >= t ? Math.round(c / t) + "m" : f >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var f = Math.abs(c);
    return f >= r ? m(c, f, r, "day") : f >= n ? m(c, f, n, "hour") : f >= t ? m(c, f, t, "minute") : f >= e ? m(c, f, e, "second") : c + " ms";
  }
  function m(c, f, d, g) {
    var E = f >= d * 1.5;
    return Math.round(c / d) + " " + g + (E ? "s" : "");
  }
  return Gi;
}
var Wi, fs;
function $c() {
  if (fs) return Wi;
  fs = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = m, r.disable = s, r.enable = o, r.enabled = l, r.humanize = Qp(), r.destroy = c, Object.keys(t).forEach((f) => {
      r[f] = t[f];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(f) {
      let d = 0;
      for (let g = 0; g < f.length; g++)
        d = (d << 5) - d + f.charCodeAt(g), d |= 0;
      return r.colors[Math.abs(d) % r.colors.length];
    }
    r.selectColor = n;
    function r(f) {
      let d, g = null, E, y;
      function A(...S) {
        if (!A.enabled)
          return;
        const T = A, D = Number(/* @__PURE__ */ new Date()), x = D - (d || D);
        T.diff = x, T.prev = d, T.curr = D, d = D, S[0] = r.coerce(S[0]), typeof S[0] != "string" && S.unshift("%O");
        let re = 0;
        S[0] = S[0].replace(/%([a-zA-Z%])/g, (X, ke) => {
          if (X === "%%")
            return "%";
          re++;
          const w = r.formatters[ke];
          if (typeof w == "function") {
            const W = S[re];
            X = w.call(T, W), S.splice(re, 1), re--;
          }
          return X;
        }), r.formatArgs.call(T, S), (T.log || r.log).apply(T, S);
      }
      return A.namespace = f, A.useColors = r.useColors(), A.color = r.selectColor(f), A.extend = i, A.destroy = r.destroy, Object.defineProperty(A, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => g !== null ? g : (E !== r.namespaces && (E = r.namespaces, y = r.enabled(f)), y),
        set: (S) => {
          g = S;
        }
      }), typeof r.init == "function" && r.init(A), A;
    }
    function i(f, d) {
      const g = r(this.namespace + (typeof d > "u" ? ":" : d) + f);
      return g.log = this.log, g;
    }
    function o(f) {
      r.save(f), r.namespaces = f, r.names = [], r.skips = [];
      const d = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const g of d)
        g[0] === "-" ? r.skips.push(g.slice(1)) : r.names.push(g);
    }
    function a(f, d) {
      let g = 0, E = 0, y = -1, A = 0;
      for (; g < f.length; )
        if (E < d.length && (d[E] === f[g] || d[E] === "*"))
          d[E] === "*" ? (y = E, A = g, E++) : (g++, E++);
        else if (y !== -1)
          E = y + 1, A++, g = A;
        else
          return !1;
      for (; E < d.length && d[E] === "*"; )
        E++;
      return E === d.length;
    }
    function s() {
      const f = [
        ...r.names,
        ...r.skips.map((d) => "-" + d)
      ].join(",");
      return r.enable(""), f;
    }
    function l(f) {
      for (const d of r.skips)
        if (a(f, d))
          return !1;
      for (const d of r.names)
        if (a(f, d))
          return !0;
      return !1;
    }
    function m(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return Wi = e, Wi;
}
var ds;
function Zp() {
  return ds || (ds = 1, function(e, t) {
    t.formatArgs = r, t.save = i, t.load = o, t.useColors = n, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let l = !1;
      return () => {
        l || (l = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let l;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (l = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(l[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function r(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const m = "color: " + this.color;
      l.splice(1, 0, m, "color: inherit");
      let c = 0, f = 0;
      l[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (c++, d === "%c" && (f = c));
      }), l.splice(f, 0, m);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(l) {
      try {
        l ? t.storage.setItem("debug", l) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let l;
      try {
        l = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = $c()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (m) {
        return "[UnexpectedJSONParseError]: " + m.message;
      }
    };
  }(Or, Or.exports)), Or.exports;
}
var Rr = { exports: {} }, Vi, hs;
function em() {
  return hs || (hs = 1, Vi = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), Vi;
}
var Yi, ps;
function tm() {
  if (ps) return Yi;
  ps = 1;
  const e = si, t = ql, n = em(), { env: r } = process;
  let i;
  n("no-color") || n("no-colors") || n("color=false") || n("color=never") ? i = 0 : (n("color") || n("colors") || n("color=true") || n("color=always")) && (i = 1), "FORCE_COLOR" in r && (r.FORCE_COLOR === "true" ? i = 1 : r.FORCE_COLOR === "false" ? i = 0 : i = r.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(r.FORCE_COLOR, 10), 3));
  function o(l) {
    return l === 0 ? !1 : {
      level: l,
      hasBasic: !0,
      has256: l >= 2,
      has16m: l >= 3
    };
  }
  function a(l, m) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (l && !m && i === void 0)
      return 0;
    const c = i || 0;
    if (r.TERM === "dumb")
      return c;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in r)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in r) || r.CI_NAME === "codeship" ? 1 : c;
    if ("TEAMCITY_VERSION" in r)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(r.TEAMCITY_VERSION) ? 1 : 0;
    if (r.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in r) {
      const f = parseInt((r.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (r.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(r.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(r.TERM) || "COLORTERM" in r ? 1 : c;
  }
  function s(l) {
    const m = a(l, l && l.isTTY);
    return o(m);
  }
  return Yi = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, Yi;
}
var ms;
function nm() {
  return ms || (ms = 1, function(e, t) {
    const n = ql, r = Bo;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = m, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = tm();
      d && (d.stderr || d).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, g) => {
      const E = g.substring(6).toLowerCase().replace(/_([a-z])/g, (A, S) => S.toUpperCase());
      let y = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), d[E] = y, d;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(d) {
      const { namespace: g, useColors: E } = this;
      if (E) {
        const y = this.color, A = "\x1B[3" + (y < 8 ? y : "8;5;" + y), S = `  ${A};1m${g} \x1B[0m`;
        d[0] = S + d[0].split(`
`).join(`
` + S), d.push(A + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = a() + g + " " + d[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...d) {
      return process.stderr.write(r.formatWithOptions(t.inspectOpts, ...d) + `
`);
    }
    function l(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function m() {
      return process.env.DEBUG;
    }
    function c(d) {
      d.inspectOpts = {};
      const g = Object.keys(t.inspectOpts);
      for (let E = 0; E < g.length; E++)
        d.inspectOpts[g[E]] = t.inspectOpts[g[E]];
    }
    e.exports = $c()(t);
    const { formatters: f } = e.exports;
    f.o = function(d) {
      return this.inspectOpts.colors = this.useColors, r.inspect(d, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, f.O = function(d) {
      return this.inspectOpts.colors = this.useColors, r.inspect(d, this.inspectOpts);
    };
  }(Rr, Rr.exports)), Rr.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? bo.exports = Zp() : bo.exports = nm();
var rm = bo.exports, ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.ProgressCallbackTransform = void 0;
const im = tr;
class om extends im.Transform {
  constructor(t, n, r) {
    super(), this.total = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
ir.ProgressCallbackTransform = om;
Object.defineProperty(Ie, "__esModule", { value: !0 });
Ie.DigestTransform = Ie.HttpExecutor = Ie.HttpError = void 0;
Ie.createHttpError = Oo;
Ie.parseJson = hm;
Ie.configureRequestOptionsFromUrl = xc;
Ie.configureRequestUrl = Jo;
Ie.safeGetHeader = un;
Ie.configureRequestOptions = Xr;
Ie.safeStringifyJson = Kr;
const am = nr, sm = rm, lm = Ct, cm = tr, Po = bt, um = _t, gs = gn, fm = ir, Ft = (0, sm.default)("electron-builder");
function Oo(e, t = null) {
  return new Ko(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Kr(e.headers), t);
}
const dm = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class Ko extends Error {
  constructor(t, n = `HTTP error: ${dm.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Ie.HttpError = Ko;
function hm(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class rn {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new um.CancellationToken(), r) {
    Xr(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      Ft(i);
      const { headers: a, ...s } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...a
        },
        ...s
      };
    }
    return this.doApiRequest(t, n, (a) => a.end(o));
  }
  doApiRequest(t, n, r, i = 0) {
    return Ft.enabled && Ft(`Request: ${Kr(t)}`), n.createPromise((o, a, s) => {
      const l = this.createRequest(t, (m) => {
        try {
          this.handleResponse(m, t, n, o, a, i, r);
        } catch (c) {
          a(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, a, t.timeout), this.addRedirectHandlers(l, t, a, i, (m) => {
        this.doApiRequest(m, n, r, i).then(o).catch(a);
      }), r(l, a), s(() => l.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, n, r, i, o) {
  }
  addErrorAndTimeoutHandlers(t, n, r = 60 * 1e3) {
    this.addTimeOutHandler(t, n, r), t.on("error", n), t.on("aborted", () => {
      n(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, n, r, i, o, a, s) {
    var l;
    if (Ft.enabled && Ft(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Kr(n)}`), t.statusCode === 404) {
      o(Oo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const m = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = m >= 300 && m < 400, f = un(t, "location");
    if (c && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(rn.prepareRedirectUrlOptions(f, n), r, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let d = "";
    t.on("error", o), t.on("data", (g) => d += g), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const g = un(t, "content-type"), E = g != null && (Array.isArray(g) ? g.find((y) => y.includes("json")) != null : g.includes("json"));
          o(Oo(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${E ? JSON.stringify(JSON.parse(d)) : d}
          `));
        } else
          i(d.length === 0 ? null : d);
      } catch (g) {
        o(g);
      }
    });
  }
  async downloadToBuffer(t, n) {
    return await n.cancellationToken.createPromise((r, i, o) => {
      const a = [], s = {
        headers: n.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      Jo(t, s), Xr(s), this.doDownload(s, {
        destination: null,
        options: n,
        onCancel: o,
        callback: (l) => {
          l == null ? r(Buffer.concat(a)) : i(l);
        },
        responseHandler: (l, m) => {
          let c = 0;
          l.on("data", (f) => {
            if (c += f.length, c > 524288e3) {
              m(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(f);
          }), l.on("end", () => {
            m(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, n, r) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        n.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", n.callback);
      const a = un(o, "location");
      if (a != null) {
        r < this.maxRedirects ? this.doDownload(rn.prepareRedirectUrlOptions(a, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? mm(n, o) : n.responseHandler(o, n.callback);
    });
    this.addErrorAndTimeoutHandlers(i, n.callback, t.timeout), this.addRedirectHandlers(i, t, n.callback, r, (o) => {
      this.doDownload(o, n, r++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, n, r) {
    t.on("socket", (i) => {
      i.setTimeout(r, () => {
        t.abort(), n(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, n) {
    const r = xc(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = rn.reconstructOriginalUrl(n), a = Fc(t, n);
      rn.isCrossOriginRedirect(o, a) && (Ft.enabled && Ft(`Given the cross-origin redirect (from ${o.host} to ${a.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return r;
  }
  static reconstructOriginalUrl(t) {
    const n = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const r = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new Po.URL(`${n}//${r}${i}${o}`);
  }
  static isCrossOriginRedirect(t, n) {
    if (t.hostname.toLowerCase() !== n.hostname.toLowerCase())
      return !0;
    if (t.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
    ["80", ""].includes(t.port) && n.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
    ["443", ""].includes(n.port))
      return !1;
    if (t.protocol !== n.protocol)
      return !0;
    const r = t.port, i = n.port;
    return r !== i;
  }
  static retryOnServerError(t, n = 3) {
    for (let r = 0; ; r++)
      try {
        return t();
      } catch (i) {
        if (r < n && (i instanceof Ko && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Ie.HttpExecutor = rn;
function Fc(e, t) {
  try {
    return new Po.URL(e);
  } catch {
    const n = t.hostname, r = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${r}//${n}${i}`;
    return new Po.URL(e, o);
  }
}
function xc(e, t) {
  const n = Xr(t), r = Fc(e, t);
  return Jo(r, n), n;
}
function Jo(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Ro extends cm.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, am.createHash)(n);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, n, r) {
    this.digester.update(t), r(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (n) {
        t(n);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, gs.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, gs.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Ie.DigestTransform = Ro;
function pm(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function un(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function mm(e, t) {
  if (!pm(un(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const a = un(t, "content-length");
    a != null && n.push(new fm.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new Ro(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new Ro(e.options.sha2, "sha256", "hex"));
  const i = (0, lm.createWriteStream)(e.destination);
  n.push(i);
  let o = t;
  for (const a of n)
    a.on("error", (s) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(s);
    }), o = o.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Xr(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Kr(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
di.MemoLazy = void 0;
class gm {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Lc(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
di.MemoLazy = gm;
function Lc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => Lc(e[a], t[a]));
  }
  return e === t;
}
var or = {};
Object.defineProperty(or, "__esModule", { value: !0 });
or.githubUrl = wm;
or.githubTagPrefix = ym;
or.getS3LikeProviderBaseUrl = Em;
function wm(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function ym(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function Em(e) {
  const t = e.provider;
  if (t === "s3")
    return vm(e);
  if (t === "spaces")
    return _m(e);
  throw new Error(`Not supported provider: ${t}`);
}
function vm(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return Uc(t, e.path);
}
function Uc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function _m(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Uc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
Qo.retry = kc;
const Am = _t;
async function kc(e, t) {
  var n;
  const { retries: r, interval: i, backoff: o = 0, attempt: a = 0, shouldRetry: s, cancellationToken: l = new Am.CancellationToken() } = t;
  try {
    return await e();
  } catch (m) {
    if (await Promise.resolve((n = s == null ? void 0 : s(m)) !== null && n !== void 0 ? n : !0) && r > 0 && !l.cancelled)
      return await new Promise((c) => setTimeout(c, i + o * a)), await kc(e, { ...t, retries: r - 1, attempt: a + 1 });
    throw m;
  }
}
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
Zo.parseDn = Tm;
function Tm(e) {
  let t = !1, n = null, r = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      n !== null && o.set(n, r);
      break;
    }
    const s = e[a];
    if (t) {
      if (s === '"') {
        t = !1;
        continue;
      }
    } else {
      if (s === '"') {
        t = !0;
        continue;
      }
      if (s === "\\") {
        a++;
        const l = parseInt(e.slice(a, a + 2), 16);
        Number.isNaN(l) ? r += e[a] : (a++, r += String.fromCharCode(l));
        continue;
      }
      if (n === null && s === "=") {
        n = r, r = "";
        continue;
      }
      if (s === "," || s === ";" || s === "+") {
        n !== null && o.set(n, r), n = null, r = "";
        continue;
      }
    }
    if (s === " " && !t) {
      if (r.length === 0)
        continue;
      if (a > i) {
        let l = a;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || n === null && e[i] === "=" || n !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    r += s;
  }
  return o;
}
var hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.nil = hn.UUID = void 0;
const Mc = nr, Bc = gn, Sm = "options.name must be either a string or a Buffer", ws = (0, Mc.randomBytes)(16);
ws[0] = ws[0] | 1;
const Wr = {}, z = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Wr[t] = e, z[e] = t;
}
class Gt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = Gt.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return Cm(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = bm(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Wr[t[14] + t[15]] & 240) >> 4,
        variant: ys((Wr[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < n + 16)
        return !1;
      let r = 0;
      for (; r < 16 && t[n + r] === 0; r++)
        ;
      return r === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[n + 6] & 240) >> 4,
        variant: ys((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, Bc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = Wr[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
hn.UUID = Gt;
Gt.OID = Gt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function ys(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var kn;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(kn || (kn = {}));
function Cm(e, t, n, r, i = kn.ASCII) {
  const o = (0, Mc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Bc.newError)(Sm, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case kn.BINARY:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = s;
      break;
    case kn.OBJECT:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = new Gt(s);
      break;
    default:
      l = z[s[0]] + z[s[1]] + z[s[2]] + z[s[3]] + "-" + z[s[4]] + z[s[5]] + "-" + z[s[6] & 15 | n] + z[s[7]] + "-" + z[s[8] & 63 | 128] + z[s[9]] + "-" + z[s[10]] + z[s[11]] + z[s[12]] + z[s[13]] + z[s[14]] + z[s[15]];
      break;
  }
  return l;
}
function bm(e) {
  return z[e[0]] + z[e[1]] + z[e[2]] + z[e[3]] + "-" + z[e[4]] + z[e[5]] + "-" + z[e[6]] + z[e[7]] + "-" + z[e[8]] + z[e[9]] + "-" + z[e[10]] + z[e[11]] + z[e[12]] + z[e[13]] + z[e[14]] + z[e[15]];
}
hn.nil = new Gt("00000000-0000-0000-0000-000000000000");
var ar = {}, jc = {};
(function(e) {
  (function(t) {
    t.parser = function(h, u) {
      return new r(h, u);
    }, t.SAXParser = r, t.SAXStream = c, t.createStream = m, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var n = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function r(h, u) {
      if (!(this instanceof r))
        return new r(h, u);
      var C = this;
      o(C), C.q = C.c = "", C.bufferCheckPosition = t.MAX_BUFFER_LENGTH, C.opt = u || {}, C.opt.lowercase = C.opt.lowercase || C.opt.lowercasetags, C.looseCase = C.opt.lowercase ? "toLowerCase" : "toUpperCase", C.tags = [], C.closed = C.closedRoot = C.sawRoot = !1, C.tag = C.error = null, C.strict = !!h, C.noscript = !!(h || C.opt.noscript), C.state = w.BEGIN, C.strictEntities = C.opt.strictEntities, C.ENTITIES = C.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), C.attribList = [], C.opt.xmlns && (C.ns = Object.create(y)), C.opt.unquotedAttributeValues === void 0 && (C.opt.unquotedAttributeValues = !h), C.trackPosition = C.opt.position !== !1, C.trackPosition && (C.position = C.line = C.column = 0), H(C, "onready");
    }
    Object.create || (Object.create = function(h) {
      function u() {
      }
      u.prototype = h;
      var C = new u();
      return C;
    }), Object.keys || (Object.keys = function(h) {
      var u = [];
      for (var C in h) h.hasOwnProperty(C) && u.push(C);
      return u;
    });
    function i(h) {
      for (var u = Math.max(t.MAX_BUFFER_LENGTH, 10), C = 0, _ = 0, K = n.length; _ < K; _++) {
        var te = h[n[_]].length;
        if (te > u)
          switch (n[_]) {
            case "textNode":
              J(h);
              break;
            case "cdata":
              j(h, "oncdata", h.cdata), h.cdata = "";
              break;
            case "script":
              j(h, "onscript", h.script), h.script = "";
              break;
            default:
              P(h, "Max buffer length exceeded: " + n[_]);
          }
        C = Math.max(C, te);
      }
      var le = t.MAX_BUFFER_LENGTH - C;
      h.bufferCheckPosition = le + h.position;
    }
    function o(h) {
      for (var u = 0, C = n.length; u < C; u++)
        h[n[u]] = "";
    }
    function a(h) {
      J(h), h.cdata !== "" && (j(h, "oncdata", h.cdata), h.cdata = ""), h.script !== "" && (j(h, "onscript", h.script), h.script = "");
    }
    r.prototype = {
      end: function() {
        N(this);
      },
      write: et,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        a(this);
      }
    };
    var s;
    try {
      s = require("stream").Stream;
    } catch {
      s = function() {
      };
    }
    s || (s = function() {
    });
    var l = t.EVENTS.filter(function(h) {
      return h !== "error" && h !== "end";
    });
    function m(h, u) {
      return new c(h, u);
    }
    function c(h, u) {
      if (!(this instanceof c))
        return new c(h, u);
      s.apply(this), this._parser = new r(h, u), this.writable = !0, this.readable = !0;
      var C = this;
      this._parser.onend = function() {
        C.emit("end");
      }, this._parser.onerror = function(_) {
        C.emit("error", _), C._parser.error = null;
      }, this._decoder = null, l.forEach(function(_) {
        Object.defineProperty(C, "on" + _, {
          get: function() {
            return C._parser["on" + _];
          },
          set: function(K) {
            if (!K)
              return C.removeAllListeners(_), C._parser["on" + _] = K, K;
            C.on(_, K);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    c.prototype = Object.create(s.prototype, {
      constructor: {
        value: c
      }
    }), c.prototype.write = function(h) {
      return typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(h) && (this._decoder || (this._decoder = new TextDecoder("utf8")), h = this._decoder.decode(h, { stream: !0 })), this._parser.write(h.toString()), this.emit("data", h), !0;
    }, c.prototype.end = function(h) {
      if (h && h.length && this.write(h), this._decoder) {
        var u = this._decoder.decode();
        u && (this._parser.write(u), this.emit("data", u));
      }
      return this._parser.end(), !0;
    }, c.prototype.on = function(h, u) {
      var C = this;
      return !C._parser["on" + h] && l.indexOf(h) !== -1 && (C._parser["on" + h] = function() {
        var _ = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        _.splice(0, 0, h), C.emit.apply(C, _);
      }), s.prototype.on.call(C, h, u);
    };
    var f = "[CDATA[", d = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", E = "http://www.w3.org/2000/xmlns/", y = { xml: g, xmlns: E }, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, S = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, T = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function x(h) {
      return h === " " || h === `
` || h === "\r" || h === "	";
    }
    function re(h) {
      return h === '"' || h === "'";
    }
    function ue(h) {
      return h === ">" || x(h);
    }
    function X(h, u) {
      return h.test(u);
    }
    function ke(h, u) {
      return !X(h, u);
    }
    var w = 0;
    t.STATE = {
      BEGIN: w++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: w++,
      // leading whitespace
      TEXT: w++,
      // general stuff
      TEXT_ENTITY: w++,
      // &amp and such.
      OPEN_WAKA: w++,
      // <
      SGML_DECL: w++,
      // <!BLARG
      SGML_DECL_QUOTED: w++,
      // <!BLARG foo "bar
      DOCTYPE: w++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: w++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: w++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: w++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: w++,
      // <!-
      COMMENT: w++,
      // <!--
      COMMENT_ENDING: w++,
      // <!-- blah -
      COMMENT_ENDED: w++,
      // <!-- blah --
      CDATA: w++,
      // <![CDATA[ something
      CDATA_ENDING: w++,
      // ]
      CDATA_ENDING_2: w++,
      // ]]
      PROC_INST: w++,
      // <?hi
      PROC_INST_BODY: w++,
      // <?hi there
      PROC_INST_ENDING: w++,
      // <?hi "there" ?
      OPEN_TAG: w++,
      // <strong
      OPEN_TAG_SLASH: w++,
      // <strong /
      ATTRIB: w++,
      // <a
      ATTRIB_NAME: w++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: w++,
      // <a foo _
      ATTRIB_VALUE: w++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: w++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: w++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: w++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: w++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: w++,
      // <foo bar=&quot
      CLOSE_TAG: w++,
      // </a
      CLOSE_TAG_SAW_WHITE: w++,
      // </a   >
      SCRIPT: w++,
      // <script> ...
      SCRIPT_ENDING: w++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(h) {
      var u = t.ENTITIES[h], C = typeof u == "number" ? String.fromCharCode(u) : u;
      t.ENTITIES[h] = C;
    });
    for (var W in t.STATE)
      t.STATE[t.STATE[W]] = W;
    w = t.STATE;
    function H(h, u, C) {
      h[u] && h[u](C);
    }
    function j(h, u, C) {
      h.textNode && J(h), H(h, u, C);
    }
    function J(h) {
      h.textNode = R(h.opt, h.textNode), h.textNode && H(h, "ontext", h.textNode), h.textNode = "";
    }
    function R(h, u) {
      return h.trim && (u = u.trim()), h.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function P(h, u) {
      return J(h), h.trackPosition && (u += `
Line: ` + h.line + `
Column: ` + h.column + `
Char: ` + h.c), u = new Error(u), h.error = u, H(h, "onerror", u), h;
    }
    function N(h) {
      return h.sawRoot && !h.closedRoot && b(h, "Unclosed root tag"), h.state !== w.BEGIN && h.state !== w.BEGIN_WHITESPACE && h.state !== w.TEXT && P(h, "Unexpected end"), J(h), h.c = "", h.closed = !0, H(h, "onend"), r.call(h, h.strict, h.opt), h;
    }
    function b(h, u) {
      if (typeof h != "object" || !(h instanceof r))
        throw new Error("bad call to strictFail");
      h.strict && P(h, u);
    }
    function $(h) {
      h.strict || (h.tagName = h.tagName[h.looseCase]());
      var u = h.tags[h.tags.length - 1] || h, C = h.tag = { name: h.tagName, attributes: {} };
      h.opt.xmlns && (C.ns = u.ns), h.attribList.length = 0, j(h, "onopentagstart", C);
    }
    function I(h, u) {
      var C = h.indexOf(":"), _ = C < 0 ? ["", h] : h.split(":"), K = _[0], te = _[1];
      return u && h === "xmlns" && (K = "xmlns", te = ""), { prefix: K, local: te };
    }
    function M(h) {
      if (h.strict || (h.attribName = h.attribName[h.looseCase]()), h.attribList.indexOf(h.attribName) !== -1 || h.tag.attributes.hasOwnProperty(h.attribName)) {
        h.attribName = h.attribValue = "";
        return;
      }
      if (h.opt.xmlns) {
        var u = I(h.attribName, !0), C = u.prefix, _ = u.local;
        if (C === "xmlns")
          if (_ === "xml" && h.attribValue !== g)
            b(
              h,
              "xml: prefix must be bound to " + g + `
Actual: ` + h.attribValue
            );
          else if (_ === "xmlns" && h.attribValue !== E)
            b(
              h,
              "xmlns: prefix must be bound to " + E + `
Actual: ` + h.attribValue
            );
          else {
            var K = h.tag, te = h.tags[h.tags.length - 1] || h;
            K.ns === te.ns && (K.ns = Object.create(te.ns)), K.ns[_] = h.attribValue;
          }
        h.attribList.push([h.attribName, h.attribValue]);
      } else
        h.tag.attributes[h.attribName] = h.attribValue, j(h, "onattribute", {
          name: h.attribName,
          value: h.attribValue
        });
      h.attribName = h.attribValue = "";
    }
    function Y(h, u) {
      if (h.opt.xmlns) {
        var C = h.tag, _ = I(h.tagName);
        C.prefix = _.prefix, C.local = _.local, C.uri = C.ns[_.prefix] || "", C.prefix && !C.uri && (b(
          h,
          "Unbound namespace prefix: " + JSON.stringify(h.tagName)
        ), C.uri = _.prefix);
        var K = h.tags[h.tags.length - 1] || h;
        C.ns && K.ns !== C.ns && Object.keys(C.ns).forEach(function(gr) {
          j(h, "onopennamespace", {
            prefix: gr,
            uri: C.ns[gr]
          });
        });
        for (var te = 0, le = h.attribList.length; te < le; te++) {
          var Ee = h.attribList[te], Te = Ee[0], ut = Ee[1], pe = I(Te, !0), qe = pe.prefix, Ni = pe.local, mr = qe === "" ? "" : C.ns[qe] || "", _n = {
            name: Te,
            value: ut,
            prefix: qe,
            local: Ni,
            uri: mr
          };
          qe && qe !== "xmlns" && !mr && (b(
            h,
            "Unbound namespace prefix: " + JSON.stringify(qe)
          ), _n.uri = qe), h.tag.attributes[Te] = _n, j(h, "onattribute", _n);
        }
        h.attribList.length = 0;
      }
      h.tag.isSelfClosing = !!u, h.sawRoot = !0, h.tags.push(h.tag), j(h, "onopentag", h.tag), u || (!h.noscript && h.tagName.toLowerCase() === "script" ? h.state = w.SCRIPT : h.state = w.TEXT, h.tag = null, h.tagName = ""), h.attribName = h.attribValue = "", h.attribList.length = 0;
    }
    function q(h) {
      if (!h.tagName) {
        b(h, "Weird empty close tag."), h.textNode += "</>", h.state = w.TEXT;
        return;
      }
      if (h.script) {
        if (h.tagName !== "script") {
          h.script += "</" + h.tagName + ">", h.tagName = "", h.state = w.SCRIPT;
          return;
        }
        j(h, "onscript", h.script), h.script = "";
      }
      var u = h.tags.length, C = h.tagName;
      h.strict || (C = C[h.looseCase]());
      for (var _ = C; u--; ) {
        var K = h.tags[u];
        if (K.name !== _)
          b(h, "Unexpected close tag");
        else
          break;
      }
      if (u < 0) {
        b(h, "Unmatched closing tag: " + h.tagName), h.textNode += "</" + h.tagName + ">", h.state = w.TEXT;
        return;
      }
      h.tagName = C;
      for (var te = h.tags.length; te-- > u; ) {
        var le = h.tag = h.tags.pop();
        h.tagName = h.tag.name, j(h, "onclosetag", h.tagName);
        var Ee = {};
        for (var Te in le.ns)
          Ee[Te] = le.ns[Te];
        var ut = h.tags[h.tags.length - 1] || h;
        h.opt.xmlns && le.ns !== ut.ns && Object.keys(le.ns).forEach(function(pe) {
          var qe = le.ns[pe];
          j(h, "onclosenamespace", { prefix: pe, uri: qe });
        });
      }
      u === 0 && (h.closedRoot = !0), h.tagName = h.attribValue = h.attribName = "", h.attribList.length = 0, h.state = w.TEXT;
    }
    function Q(h) {
      var u = h.entity, C = u.toLowerCase(), _, K = "";
      return h.ENTITIES[u] ? h.ENTITIES[u] : h.ENTITIES[C] ? h.ENTITIES[C] : (u = C, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), _ = parseInt(u, 16), K = _.toString(16)) : (u = u.slice(1), _ = parseInt(u, 10), K = _.toString(10))), u = u.replace(/^0+/, ""), isNaN(_) || K.toLowerCase() !== u || _ < 0 || _ > 1114111 ? (b(h, "Invalid character entity"), "&" + h.entity + ";") : String.fromCodePoint(_));
    }
    function ge(h, u) {
      u === "<" ? (h.state = w.OPEN_WAKA, h.startTagPosition = h.position) : x(u) || (b(h, "Non-whitespace before first tag."), h.textNode = u, h.state = w.TEXT);
    }
    function U(h, u) {
      var C = "";
      return u < h.length && (C = h.charAt(u)), C;
    }
    function et(h) {
      var u = this;
      if (this.error)
        throw this.error;
      if (u.closed)
        return P(
          u,
          "Cannot write after close. Assign an onready handler."
        );
      if (h === null)
        return N(u);
      typeof h == "object" && (h = h.toString());
      for (var C = 0, _ = ""; _ = U(h, C++), u.c = _, !!_; )
        switch (u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++), u.state) {
          case w.BEGIN:
            if (u.state = w.BEGIN_WHITESPACE, _ === "\uFEFF")
              continue;
            ge(u, _);
            continue;
          case w.BEGIN_WHITESPACE:
            ge(u, _);
            continue;
          case w.TEXT:
            if (u.sawRoot && !u.closedRoot) {
              for (var te = C - 1; _ && _ !== "<" && _ !== "&"; )
                _ = U(h, C++), _ && u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += h.substring(te, C - 1);
            }
            _ === "<" && !(u.sawRoot && u.closedRoot && !u.strict) ? (u.state = w.OPEN_WAKA, u.startTagPosition = u.position) : (!x(_) && (!u.sawRoot || u.closedRoot) && b(u, "Text data outside of root node."), _ === "&" ? u.state = w.TEXT_ENTITY : u.textNode += _);
            continue;
          case w.SCRIPT:
            _ === "<" ? u.state = w.SCRIPT_ENDING : u.script += _;
            continue;
          case w.SCRIPT_ENDING:
            _ === "/" ? u.state = w.CLOSE_TAG : (u.script += "<" + _, u.state = w.SCRIPT);
            continue;
          case w.OPEN_WAKA:
            if (_ === "!")
              u.state = w.SGML_DECL, u.sgmlDecl = "";
            else if (!x(_)) if (X(A, _))
              u.state = w.OPEN_TAG, u.tagName = _;
            else if (_ === "/")
              u.state = w.CLOSE_TAG, u.tagName = "";
            else if (_ === "?")
              u.state = w.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (b(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var K = u.position - u.startTagPosition;
                _ = new Array(K).join(" ") + _;
              }
              u.textNode += "<" + _, u.state = w.TEXT;
            }
            continue;
          case w.SGML_DECL:
            if (u.sgmlDecl + _ === "--") {
              u.state = w.COMMENT, u.comment = "", u.sgmlDecl = "";
              continue;
            }
            u.doctype && u.doctype !== !0 && u.sgmlDecl ? (u.state = w.DOCTYPE_DTD, u.doctype += "<!" + u.sgmlDecl + _, u.sgmlDecl = "") : (u.sgmlDecl + _).toUpperCase() === f ? (j(u, "onopencdata"), u.state = w.CDATA, u.sgmlDecl = "", u.cdata = "") : (u.sgmlDecl + _).toUpperCase() === d ? (u.state = w.DOCTYPE, (u.doctype || u.sawRoot) && b(
              u,
              "Inappropriately located doctype declaration"
            ), u.doctype = "", u.sgmlDecl = "") : _ === ">" ? (j(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = w.TEXT) : (re(_) && (u.state = w.SGML_DECL_QUOTED), u.sgmlDecl += _);
            continue;
          case w.SGML_DECL_QUOTED:
            _ === u.q && (u.state = w.SGML_DECL, u.q = ""), u.sgmlDecl += _;
            continue;
          case w.DOCTYPE:
            _ === ">" ? (u.state = w.TEXT, j(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += _, _ === "[" ? u.state = w.DOCTYPE_DTD : re(_) && (u.state = w.DOCTYPE_QUOTED, u.q = _));
            continue;
          case w.DOCTYPE_QUOTED:
            u.doctype += _, _ === u.q && (u.q = "", u.state = w.DOCTYPE);
            continue;
          case w.DOCTYPE_DTD:
            _ === "]" ? (u.doctype += _, u.state = w.DOCTYPE) : _ === "<" ? (u.state = w.OPEN_WAKA, u.startTagPosition = u.position) : re(_) ? (u.doctype += _, u.state = w.DOCTYPE_DTD_QUOTED, u.q = _) : u.doctype += _;
            continue;
          case w.DOCTYPE_DTD_QUOTED:
            u.doctype += _, _ === u.q && (u.state = w.DOCTYPE_DTD, u.q = "");
            continue;
          case w.COMMENT:
            _ === "-" ? u.state = w.COMMENT_ENDING : u.comment += _;
            continue;
          case w.COMMENT_ENDING:
            _ === "-" ? (u.state = w.COMMENT_ENDED, u.comment = R(u.opt, u.comment), u.comment && j(u, "oncomment", u.comment), u.comment = "") : (u.comment += "-" + _, u.state = w.COMMENT);
            continue;
          case w.COMMENT_ENDED:
            _ !== ">" ? (b(u, "Malformed comment"), u.comment += "--" + _, u.state = w.COMMENT) : u.doctype && u.doctype !== !0 ? u.state = w.DOCTYPE_DTD : u.state = w.TEXT;
            continue;
          case w.CDATA:
            for (var te = C - 1; _ && _ !== "]"; )
              _ = U(h, C++), _ && u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++);
            u.cdata += h.substring(te, C - 1), _ === "]" && (u.state = w.CDATA_ENDING);
            continue;
          case w.CDATA_ENDING:
            _ === "]" ? u.state = w.CDATA_ENDING_2 : (u.cdata += "]" + _, u.state = w.CDATA);
            continue;
          case w.CDATA_ENDING_2:
            _ === ">" ? (u.cdata && j(u, "oncdata", u.cdata), j(u, "onclosecdata"), u.cdata = "", u.state = w.TEXT) : _ === "]" ? u.cdata += "]" : (u.cdata += "]]" + _, u.state = w.CDATA);
            continue;
          case w.PROC_INST:
            _ === "?" ? u.state = w.PROC_INST_ENDING : x(_) ? u.state = w.PROC_INST_BODY : u.procInstName += _;
            continue;
          case w.PROC_INST_BODY:
            if (!u.procInstBody && x(_))
              continue;
            _ === "?" ? u.state = w.PROC_INST_ENDING : u.procInstBody += _;
            continue;
          case w.PROC_INST_ENDING:
            _ === ">" ? (j(u, "onprocessinginstruction", {
              name: u.procInstName,
              body: u.procInstBody
            }), u.procInstName = u.procInstBody = "", u.state = w.TEXT) : (u.procInstBody += "?" + _, u.state = w.PROC_INST_BODY);
            continue;
          case w.OPEN_TAG:
            X(S, _) ? u.tagName += _ : ($(u), _ === ">" ? Y(u) : _ === "/" ? u.state = w.OPEN_TAG_SLASH : (x(_) || b(u, "Invalid character in tag name"), u.state = w.ATTRIB));
            continue;
          case w.OPEN_TAG_SLASH:
            _ === ">" ? (Y(u, !0), q(u)) : (b(
              u,
              "Forward-slash in opening tag not followed by >"
            ), u.state = w.ATTRIB);
            continue;
          case w.ATTRIB:
            if (x(_))
              continue;
            _ === ">" ? Y(u) : _ === "/" ? u.state = w.OPEN_TAG_SLASH : X(A, _) ? (u.attribName = _, u.attribValue = "", u.state = w.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case w.ATTRIB_NAME:
            _ === "=" ? u.state = w.ATTRIB_VALUE : _ === ">" ? (b(u, "Attribute without value"), u.attribValue = u.attribName, M(u), Y(u)) : x(_) ? u.state = w.ATTRIB_NAME_SAW_WHITE : X(S, _) ? u.attribName += _ : b(u, "Invalid attribute name");
            continue;
          case w.ATTRIB_NAME_SAW_WHITE:
            if (_ === "=")
              u.state = w.ATTRIB_VALUE;
            else {
              if (x(_))
                continue;
              b(u, "Attribute without value"), u.tag.attributes[u.attribName] = "", u.attribValue = "", j(u, "onattribute", {
                name: u.attribName,
                value: ""
              }), u.attribName = "", _ === ">" ? Y(u) : X(A, _) ? (u.attribName = _, u.state = w.ATTRIB_NAME) : (b(u, "Invalid attribute name"), u.state = w.ATTRIB);
            }
            continue;
          case w.ATTRIB_VALUE:
            if (x(_))
              continue;
            re(_) ? (u.q = _, u.state = w.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || P(u, "Unquoted attribute value"), u.state = w.ATTRIB_VALUE_UNQUOTED, u.attribValue = _);
            continue;
          case w.ATTRIB_VALUE_QUOTED:
            if (_ !== u.q) {
              _ === "&" ? u.state = w.ATTRIB_VALUE_ENTITY_Q : u.attribValue += _;
              continue;
            }
            M(u), u.q = "", u.state = w.ATTRIB_VALUE_CLOSED;
            continue;
          case w.ATTRIB_VALUE_CLOSED:
            x(_) ? u.state = w.ATTRIB : _ === ">" ? Y(u) : _ === "/" ? u.state = w.OPEN_TAG_SLASH : X(A, _) ? (b(u, "No whitespace between attributes"), u.attribName = _, u.attribValue = "", u.state = w.ATTRIB_NAME) : b(u, "Invalid attribute name");
            continue;
          case w.ATTRIB_VALUE_UNQUOTED:
            if (!ue(_)) {
              _ === "&" ? u.state = w.ATTRIB_VALUE_ENTITY_U : u.attribValue += _;
              continue;
            }
            M(u), _ === ">" ? Y(u) : u.state = w.ATTRIB;
            continue;
          case w.CLOSE_TAG:
            if (u.tagName)
              _ === ">" ? q(u) : X(S, _) ? u.tagName += _ : u.script ? (u.script += "</" + u.tagName + _, u.tagName = "", u.state = w.SCRIPT) : (x(_) || b(u, "Invalid tagname in closing tag"), u.state = w.CLOSE_TAG_SAW_WHITE);
            else {
              if (x(_))
                continue;
              ke(A, _) ? u.script ? (u.script += "</" + _, u.state = w.SCRIPT) : b(u, "Invalid tagname in closing tag.") : u.tagName = _;
            }
            continue;
          case w.CLOSE_TAG_SAW_WHITE:
            if (x(_))
              continue;
            _ === ">" ? q(u) : b(u, "Invalid characters in closing tag");
            continue;
          case w.TEXT_ENTITY:
          case w.ATTRIB_VALUE_ENTITY_Q:
          case w.ATTRIB_VALUE_ENTITY_U:
            var le, Ee;
            switch (u.state) {
              case w.TEXT_ENTITY:
                le = w.TEXT, Ee = "textNode";
                break;
              case w.ATTRIB_VALUE_ENTITY_Q:
                le = w.ATTRIB_VALUE_QUOTED, Ee = "attribValue";
                break;
              case w.ATTRIB_VALUE_ENTITY_U:
                le = w.ATTRIB_VALUE_UNQUOTED, Ee = "attribValue";
                break;
            }
            if (_ === ";") {
              var Te = Q(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Te) ? (u.entity = "", u.state = le, u.write(Te)) : (u[Ee] += Te, u.entity = "", u.state = le);
            } else X(u.entity.length ? D : T, _) ? u.entity += _ : (b(u, "Invalid character in entity name"), u[Ee] += "&" + u.entity + _, u.entity = "", u.state = le);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var h = String.fromCharCode, u = Math.floor, C = function() {
        var _ = 16384, K = [], te, le, Ee = -1, Te = arguments.length;
        if (!Te)
          return "";
        for (var ut = ""; ++Ee < Te; ) {
          var pe = Number(arguments[Ee]);
          if (!isFinite(pe) || // `NaN`, `+Infinity`, or `-Infinity`
          pe < 0 || // not a valid Unicode code point
          pe > 1114111 || // not a valid Unicode code point
          u(pe) !== pe)
            throw RangeError("Invalid code point: " + pe);
          pe <= 65535 ? K.push(pe) : (pe -= 65536, te = (pe >> 10) + 55296, le = pe % 1024 + 56320, K.push(te, le)), (Ee + 1 === Te || K.length > _) && (ut += h.apply(null, K), K.length = 0);
        }
        return ut;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: C,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = C;
    }();
  })(e);
})(jc);
Object.defineProperty(ar, "__esModule", { value: !0 });
ar.XElement = void 0;
ar.parseXml = Im;
const Pm = jc, Ir = gn;
class Hc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Ir.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Rm(t))
      throw (0, Ir.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, Ir.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, Ir.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (Es(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => Es(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
ar.XElement = Hc;
const Om = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Rm(e) {
  return Om.test(e);
}
function Es(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function Im(e) {
  let t = null;
  const n = Pm.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new Hc(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const a = r[r.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(o);
    }
    r.push(o);
  }, n.onclosetag = () => {
    r.pop();
  }, n.ontext = (i) => {
    r.length > 0 && (r[r.length - 1].value = i);
  }, n.oncdata = (i) => {
    const o = r[r.length - 1];
    o.value = i, o.isCData = !0;
  }, n.onerror = (i) => {
    throw i;
  }, n.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = _t;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = gn;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return n.newError;
  } });
  var r = Ie;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return r.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return r.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return r.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return r.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return r.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return r.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return r.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return r.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return r.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return r.safeStringifyJson;
  } });
  var i = di;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = ir;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var a = or;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return a.githubTagPrefix;
  } });
  var s = Qo;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = Zo;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var m = hn;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return m.UUID;
  } });
  var c = ar;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(d) {
    return d == null ? [] : Array.isArray(d) ? d : [d];
  }
})(me);
var Ae = {}, ea = {}, Ke = {};
function qc(e) {
  return typeof e > "u" || e === null;
}
function Nm(e) {
  return typeof e == "object" && e !== null;
}
function Dm(e) {
  return Array.isArray(e) ? e : qc(e) ? [] : [e];
}
function $m(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function Fm(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function xm(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ke.isNothing = qc;
Ke.isObject = Nm;
Ke.toArray = Dm;
Ke.repeat = Fm;
Ke.isNegativeZero = xm;
Ke.extend = $m;
function Gc(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function Wn(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Gc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Wn.prototype = Object.create(Error.prototype);
Wn.prototype.constructor = Wn;
Wn.prototype.toString = function(t) {
  return this.name + ": " + Gc(this, t);
};
var sr = Wn, Fn = Ke;
function zi(e, t, n, r, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return r - t > s && (o = " ... ", t = r - s + o.length), n - r > s && (a = " ...", n = r + s - a.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + a,
    pos: r - t + o.length
    // relative position
  };
}
function Xi(e, t) {
  return Fn.repeat(" ", t - e.length) + e;
}
function Lm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, a = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = r.length - 2);
  a < 0 && (a = r.length - 1);
  var s = "", l, m, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    m = zi(
      e.buffer,
      r[a - l],
      i[a - l],
      e.position - (r[a] - r[a - l]),
      f
    ), s = Fn.repeat(" ", t.indent) + Xi((e.line - l + 1).toString(), c) + " | " + m.str + `
` + s;
  for (m = zi(e.buffer, r[a], i[a], e.position, f), s += Fn.repeat(" ", t.indent) + Xi((e.line + 1).toString(), c) + " | " + m.str + `
`, s += Fn.repeat("-", t.indent + c + 3 + m.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    m = zi(
      e.buffer,
      r[a + l],
      i[a + l],
      e.position - (r[a] - r[a + l]),
      f
    ), s += Fn.repeat(" ", t.indent) + Xi((e.line + l + 1).toString(), c) + " | " + m.str + `
`;
  return s.replace(/\n$/, "");
}
var Um = Lm, vs = sr, km = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], Mm = [
  "scalar",
  "sequence",
  "mapping"
];
function Bm(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function jm(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (km.indexOf(n) === -1)
      throw new vs('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Bm(t.styleAliases || null), Mm.indexOf(this.kind) === -1)
    throw new vs('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Fe = jm, Pn = sr, Ki = Fe;
function _s(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, a) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = a);
    }), n[i] = r;
  }), n;
}
function Hm() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, n;
  function r(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, n = arguments.length; t < n; t += 1)
    arguments[t].forEach(r);
  return e;
}
function Io(e) {
  return this.extend(e);
}
Io.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof Ki)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new Pn("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof Ki))
      throw new Pn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Pn("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Pn("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof Ki))
      throw new Pn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Io.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = _s(i, "implicit"), i.compiledExplicit = _s(i, "explicit"), i.compiledTypeMap = Hm(i.compiledImplicit, i.compiledExplicit), i;
};
var Wc = Io, qm = Fe, Vc = new qm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Gm = Fe, Yc = new Gm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Wm = Fe, zc = new Wm("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Vm = Wc, Xc = new Vm({
  explicit: [
    Vc,
    Yc,
    zc
  ]
}), Ym = Fe;
function zm(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Xm() {
  return null;
}
function Km(e) {
  return e === null;
}
var Kc = new Ym("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: zm,
  construct: Xm,
  predicate: Km,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), Jm = Fe;
function Qm(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Zm(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function eg(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Jc = new Jm("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Qm,
  construct: Zm,
  predicate: eg,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), tg = Ke, ng = Fe;
function rg(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function ig(e) {
  return 48 <= e && e <= 55;
}
function og(e) {
  return 48 <= e && e <= 57;
}
function ag(e) {
  if (e === null) return !1;
  var t = e.length, n = 0, r = !1, i;
  if (!t) return !1;
  if (i = e[n], (i === "-" || i === "+") && (i = e[++n]), i === "0") {
    if (n + 1 === t) return !0;
    if (i = e[++n], i === "b") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "x") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!rg(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!ig(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!og(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function sg(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function lg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !tg.isNegativeZero(e);
}
var Qc = new ng("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: ag,
  construct: sg,
  predicate: lg,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), Zc = Ke, cg = Fe, ug = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function fg(e) {
  return !(e === null || !ug.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function dg(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var hg = /^[-+]?[0-9]+e/;
function pg(e, t) {
  var n;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (Zc.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), hg.test(n) ? n.replace("e", ".e") : n;
}
function mg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Zc.isNegativeZero(e));
}
var eu = new cg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: fg,
  construct: dg,
  predicate: mg,
  represent: pg,
  defaultStyle: "lowercase"
}), tu = Xc.extend({
  implicit: [
    Kc,
    Jc,
    Qc,
    eu
  ]
}), nu = tu, gg = Fe, ru = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), iu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function wg(e) {
  return e === null ? !1 : ru.exec(e) !== null || iu.exec(e) !== null;
}
function yg(e) {
  var t, n, r, i, o, a, s, l = 0, m = null, c, f, d;
  if (t = ru.exec(e), t === null && (t = iu.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), m = (c * 60 + f) * 6e4, t[9] === "-" && (m = -m)), d = new Date(Date.UTC(n, r, i, o, a, s, l)), m && d.setTime(d.getTime() - m), d;
}
function Eg(e) {
  return e.toISOString();
}
var ou = new gg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: wg,
  construct: yg,
  instanceOf: Date,
  represent: Eg
}), vg = Fe;
function _g(e) {
  return e === "<<" || e === null;
}
var au = new vg("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: _g
}), Ag = Fe, ta = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Tg(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = ta;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function Sg(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = ta, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : n === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : n === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function Cg(e) {
  var t = "", n = 0, r, i, o = e.length, a = ta;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]) : i === 2 ? (t += a[n >> 10 & 63], t += a[n >> 4 & 63], t += a[n << 2 & 63], t += a[64]) : i === 1 && (t += a[n >> 2 & 63], t += a[n << 4 & 63], t += a[64], t += a[64]), t;
}
function bg(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var su = new Ag("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Tg,
  construct: Sg,
  predicate: bg,
  represent: Cg
}), Pg = Fe, Og = Object.prototype.hasOwnProperty, Rg = Object.prototype.toString;
function Ig(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, a, s = e;
  for (n = 0, r = s.length; n < r; n += 1) {
    if (i = s[n], a = !1, Rg.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Og.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function Ng(e) {
  return e !== null ? e : [];
}
var lu = new Pg("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Ig,
  construct: Ng
}), Dg = Fe, $g = Object.prototype.toString;
function Fg(e) {
  if (e === null) return !0;
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1) {
    if (r = a[t], $g.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function xg(e) {
  if (e === null) return [];
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1)
    r = a[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var cu = new Dg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Fg,
  construct: xg
}), Lg = Fe, Ug = Object.prototype.hasOwnProperty;
function kg(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (Ug.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function Mg(e) {
  return e !== null ? e : {};
}
var uu = new Lg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: kg,
  construct: Mg
}), na = nu.extend({
  implicit: [
    ou,
    au
  ],
  explicit: [
    su,
    lu,
    cu,
    uu
  ]
}), Ut = Ke, fu = sr, Bg = Um, jg = na, At = Object.prototype.hasOwnProperty, Jr = 1, du = 2, hu = 3, Qr = 4, Ji = 1, Hg = 2, As = 3, qg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Gg = /[\x85\u2028\u2029]/, Wg = /[,\[\]\{\}]/, pu = /^(?:!|!!|![a-z\-]+!)$/i, mu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Ts(e) {
  return Object.prototype.toString.call(e);
}
function it(e) {
  return e === 10 || e === 13;
}
function Ht(e) {
  return e === 9 || e === 32;
}
function Ue(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function on(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function Vg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Yg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function zg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Ss(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Xg(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function gu(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
var wu = new Array(256), yu = new Array(256);
for (var Qt = 0; Qt < 256; Qt++)
  wu[Qt] = Ss(Qt) ? 1 : 0, yu[Qt] = Ss(Qt);
function Kg(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || jg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Eu(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = Bg(n), new fu(t, n);
}
function L(e, t) {
  throw Eu(e, t);
}
function Zr(e, t) {
  e.onWarning && e.onWarning.call(null, Eu(e, t));
}
var Cs = {
  YAML: function(t, n, r) {
    var i, o, a;
    t.version !== null && L(t, "duplication of %YAML directive"), r.length !== 1 && L(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && L(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && L(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && Zr(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && L(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], pu.test(i) || L(t, "ill-formed tag handle (first argument) of the TAG directive"), At.call(t.tagMap, i) && L(t, 'there is a previously declared suffix for "' + i + '" tag handle'), mu.test(o) || L(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      L(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function Et(e, t, n, r) {
  var i, o, a, s;
  if (t < n) {
    if (s = e.input.slice(t, n), r)
      for (i = 0, o = s.length; i < o; i += 1)
        a = s.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || L(e, "expected valid JSON character");
    else qg.test(s) && L(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function bs(e, t, n, r) {
  var i, o, a, s;
  for (Ut.isObject(n) || L(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), a = 0, s = i.length; a < s; a += 1)
    o = i[a], At.call(t, o) || (gu(t, o, n[o]), r[o] = !0);
}
function an(e, t, n, r, i, o, a, s, l) {
  var m, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), m = 0, c = i.length; m < c; m += 1)
      Array.isArray(i[m]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && Ts(i[m]) === "[object Object]" && (i[m] = "[object Object]");
  if (typeof i == "object" && Ts(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (m = 0, c = o.length; m < c; m += 1)
        bs(e, t, o[m], n);
    else
      bs(e, t, o, n);
  else
    !e.json && !At.call(n, i) && At.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, L(e, "duplicated mapping key")), gu(t, i, o), delete n[i];
  return t;
}
function ra(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : L(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function de(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Ht(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (it(i))
      for (ra(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && Zr(e, "deficient indentation"), r;
}
function hi(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || Ue(n)));
}
function ia(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Ut.repeat(`
`, t - 1));
}
function Jg(e, t, n) {
  var r, i, o, a, s, l, m, c, f = e.kind, d = e.result, g;
  if (g = e.input.charCodeAt(e.position), Ue(g) || on(g) || g === 35 || g === 38 || g === 42 || g === 33 || g === 124 || g === 62 || g === 39 || g === 34 || g === 37 || g === 64 || g === 96 || (g === 63 || g === 45) && (i = e.input.charCodeAt(e.position + 1), Ue(i) || n && on(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; g !== 0; ) {
    if (g === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ue(i) || n && on(i))
        break;
    } else if (g === 35) {
      if (r = e.input.charCodeAt(e.position - 1), Ue(r))
        break;
    } else {
      if (e.position === e.lineStart && hi(e) || n && on(g))
        break;
      if (it(g))
        if (l = e.line, m = e.lineStart, c = e.lineIndent, de(e, !1, -1), e.lineIndent >= t) {
          s = !0, g = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = m, e.lineIndent = c;
          break;
        }
    }
    s && (Et(e, o, a, !1), ia(e, e.line - l), o = a = e.position, s = !1), Ht(g) || (a = e.position + 1), g = e.input.charCodeAt(++e.position);
  }
  return Et(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = d, !1);
}
function Qg(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (Et(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else it(n) ? (Et(e, r, i, !0), ia(e, de(e, !1, t)), r = i = e.position) : e.position === e.lineStart && hi(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function Zg(e, t) {
  var n, r, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return Et(e, n, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (Et(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), it(s))
        de(e, !1, t);
      else if (s < 256 && wu[s])
        e.result += yu[s], e.position++;
      else if ((a = Yg(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = Vg(s)) >= 0 ? o = (o << 4) + a : L(e, "expected hexadecimal character");
        e.result += Xg(o), e.position++;
      } else
        L(e, "unknown escape sequence");
      n = r = e.position;
    } else it(s) ? (Et(e, n, r, !0), ia(e, de(e, !1, t)), n = r = e.position) : e.position === e.lineStart && hi(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function e0(e, t) {
  var n = !0, r, i, o, a = e.tag, s, l = e.anchor, m, c, f, d, g, E = /* @__PURE__ */ Object.create(null), y, A, S, T;
  if (T = e.input.charCodeAt(e.position), T === 91)
    c = 93, g = !1, s = [];
  else if (T === 123)
    c = 125, g = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), T = e.input.charCodeAt(++e.position); T !== 0; ) {
    if (de(e, !0, t), T = e.input.charCodeAt(e.position), T === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = g ? "mapping" : "sequence", e.result = s, !0;
    n ? T === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), A = y = S = null, f = d = !1, T === 63 && (m = e.input.charCodeAt(e.position + 1), Ue(m) && (f = d = !0, e.position++, de(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, pn(e, t, Jr, !1, !0), A = e.tag, y = e.result, de(e, !0, t), T = e.input.charCodeAt(e.position), (d || e.line === r) && T === 58 && (f = !0, T = e.input.charCodeAt(++e.position), de(e, !0, t), pn(e, t, Jr, !1, !0), S = e.result), g ? an(e, s, E, A, y, S, r, i, o) : f ? s.push(an(e, null, E, A, y, S, r, i, o)) : s.push(y), de(e, !0, t), T = e.input.charCodeAt(e.position), T === 44 ? (n = !0, T = e.input.charCodeAt(++e.position)) : n = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function t0(e, t) {
  var n, r, i = Ji, o = !1, a = !1, s = t, l = 0, m = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    r = !1;
  else if (f === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      Ji === i ? i = f === 43 ? As : Hg : L(e, "repeat of a chomping mode identifier");
    else if ((c = zg(f)) >= 0)
      c === 0 ? L(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? L(e, "repeat of an indentation width identifier") : (s = t + c - 1, a = !0);
    else
      break;
  if (Ht(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Ht(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!it(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (ra(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), it(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === As ? e.result += Ut.repeat(`
`, o ? 1 + l : l) : i === Ji && o && (e.result += `
`);
      break;
    }
    for (r ? Ht(f) ? (m = !0, e.result += Ut.repeat(`
`, o ? 1 + l : l)) : m ? (m = !1, e.result += Ut.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += Ut.repeat(`
`, l) : e.result += Ut.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, n = e.position; !it(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    Et(e, n, e.position, !1);
  }
  return !0;
}
function Ps(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !Ue(a)))); ) {
    if (s = !0, e.position++, de(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, pn(e, t, hu, !1, !0), o.push(e.result), de(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && l !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function n0(e, t, n) {
  var r, i, o, a, s, l, m = e.tag, c = e.anchor, f = {}, d = /* @__PURE__ */ Object.create(null), g = null, E = null, y = null, A = !1, S = !1, T;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), T = e.input.charCodeAt(e.position); T !== 0; ) {
    if (!A && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (T === 63 || T === 58) && Ue(r))
      T === 63 ? (A && (an(e, f, d, g, E, null, a, s, l), g = E = y = null), S = !0, A = !0, i = !0) : A ? (A = !1, i = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, T = r;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !pn(e, n, du, !1, !0))
        break;
      if (e.line === o) {
        for (T = e.input.charCodeAt(e.position); Ht(T); )
          T = e.input.charCodeAt(++e.position);
        if (T === 58)
          T = e.input.charCodeAt(++e.position), Ue(T) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), A && (an(e, f, d, g, E, null, a, s, l), g = E = y = null), S = !0, A = !1, i = !1, g = e.tag, E = e.result;
        else if (S)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = m, e.anchor = c, !0;
      } else if (S)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = m, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (A && (a = e.line, s = e.lineStart, l = e.position), pn(e, t, Qr, !0, i) && (A ? E = e.result : y = e.result), A || (an(e, f, d, g, E, y, a, s, l), g = E = y = null), de(e, !0, -1), T = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && T !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return A && an(e, f, d, g, E, null, a, s, l), S && (e.tag = m, e.anchor = c, e.kind = "mapping", e.result = f), S;
}
function r0(e) {
  var t, n = !1, r = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && L(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (n = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (r = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : L(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !Ue(a); )
      a === 33 && (r ? L(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), pu.test(i) || L(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), Wg.test(o) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !mu.test(o) && L(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    L(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : At.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : L(e, 'undeclared tag handle "' + i + '"'), !0;
}
function i0(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && L(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ue(n) && !on(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function o0(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ue(r) && !on(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), At.call(e.anchorMap, n) || L(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], de(e, !0, -1), !0;
}
function pn(e, t, n, r, i) {
  var o, a, s, l = 1, m = !1, c = !1, f, d, g, E, y, A;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = Qr === n || hu === n, r && de(e, !0, -1) && (m = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; r0(e) || i0(e); )
      de(e, !0, -1) ? (m = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = m || i), (l === 1 || Qr === n) && (Jr === n || du === n ? y = t : y = t + 1, A = e.position - e.lineStart, l === 1 ? s && (Ps(e, A) || n0(e, A, y)) || e0(e, y) ? c = !0 : (a && t0(e, y) || Qg(e, y) || Zg(e, y) ? c = !0 : o0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : Jg(e, y, Jr === n) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && Ps(e, A))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && L(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, d = e.implicitTypes.length; f < d; f += 1)
      if (E = e.implicitTypes[f], E.resolve(e.result)) {
        e.result = E.construct(e.result), e.tag = E.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (At.call(e.typeMap[e.kind || "fallback"], e.tag))
      E = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (E = null, g = e.typeMap.multi[e.kind || "fallback"], f = 0, d = g.length; f < d; f += 1)
        if (e.tag.slice(0, g[f].tag.length) === g[f].tag) {
          E = g[f];
          break;
        }
    E || L(e, "unknown tag !<" + e.tag + ">"), e.result !== null && E.kind !== e.kind && L(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + E.kind + '", not "' + e.kind + '"'), E.resolve(e.result, e.tag) ? (e.result = E.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : L(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function a0(e) {
  var t = e.position, n, r, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (de(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), n = e.position; a !== 0 && !Ue(a); )
      a = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && L(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; Ht(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !it(a));
        break;
      }
      if (it(a)) break;
      for (n = e.position; a !== 0 && !Ue(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    a !== 0 && ra(e), At.call(Cs, r) ? Cs[r](e, r, i) : Zr(e, 'unknown document directive "' + r + '"');
  }
  if (de(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, de(e, !0, -1)) : o && L(e, "directives end mark is expected"), pn(e, e.lineIndent - 1, Qr, !1, !0), de(e, !0, -1), e.checkLineBreaks && Gg.test(e.input.slice(t, e.position)) && Zr(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && hi(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, de(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    L(e, "end of the stream or a document separator is expected");
  else
    return;
}
function vu(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new Kg(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, L(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    a0(n);
  return n.documents;
}
function s0(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = vu(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function l0(e, t) {
  var n = vu(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new fu("expected a single document in the stream, but found more");
  }
}
ea.loadAll = s0;
ea.load = l0;
var _u = {}, pi = Ke, lr = sr, c0 = na, Au = Object.prototype.toString, Tu = Object.prototype.hasOwnProperty, oa = 65279, u0 = 9, Vn = 10, f0 = 13, d0 = 32, h0 = 33, p0 = 34, No = 35, m0 = 37, g0 = 38, w0 = 39, y0 = 42, Su = 44, E0 = 45, ei = 58, v0 = 61, _0 = 62, A0 = 63, T0 = 64, Cu = 91, bu = 93, S0 = 96, Pu = 123, C0 = 124, Ou = 125, be = {};
be[0] = "\\0";
be[7] = "\\a";
be[8] = "\\b";
be[9] = "\\t";
be[10] = "\\n";
be[11] = "\\v";
be[12] = "\\f";
be[13] = "\\r";
be[27] = "\\e";
be[34] = '\\"';
be[92] = "\\\\";
be[133] = "\\N";
be[160] = "\\_";
be[8232] = "\\L";
be[8233] = "\\P";
var b0 = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], P0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function O0(e, t) {
  var n, r, i, o, a, s, l;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    a = r[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Tu.call(l.styleAliases, s) && (s = l.styleAliases[s]), n[a] = s;
  return n;
}
function R0(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new lr("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + pi.repeat("0", r - t.length) + t;
}
var I0 = 1, Yn = 2;
function N0(e) {
  this.schema = e.schema || c0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = pi.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = O0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Yn : I0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Os(e, t) {
  for (var n = pi.repeat(" ", t), r = 0, i = -1, o = "", a, s = e.length; r < s; )
    i = e.indexOf(`
`, r), i === -1 ? (a = e.slice(r), r = s) : (a = e.slice(r, i + 1), r = i + 1), a.length && a !== `
` && (o += n), o += a;
  return o;
}
function Do(e, t) {
  return `
` + pi.repeat(" ", e.indent * t);
}
function D0(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function ti(e) {
  return e === d0 || e === u0;
}
function zn(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== oa || 65536 <= e && e <= 1114111;
}
function Rs(e) {
  return zn(e) && e !== oa && e !== f0 && e !== Vn;
}
function Is(e, t, n) {
  var r = Rs(e), i = r && !ti(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== Su && e !== Cu && e !== bu && e !== Pu && e !== Ou) && e !== No && !(t === ei && !i) || Rs(t) && !ti(t) && e === No || t === ei && i
  );
}
function $0(e) {
  return zn(e) && e !== oa && !ti(e) && e !== E0 && e !== A0 && e !== ei && e !== Su && e !== Cu && e !== bu && e !== Pu && e !== Ou && e !== No && e !== g0 && e !== y0 && e !== h0 && e !== C0 && e !== v0 && e !== _0 && e !== w0 && e !== p0 && e !== m0 && e !== T0 && e !== S0;
}
function F0(e) {
  return !ti(e) && e !== ei;
}
function xn(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function Ru(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Iu = 1, $o = 2, Nu = 3, Du = 4, nn = 5;
function x0(e, t, n, r, i, o, a, s) {
  var l, m = 0, c = null, f = !1, d = !1, g = r !== -1, E = -1, y = $0(xn(e, 0)) && F0(xn(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; m >= 65536 ? l += 2 : l++) {
      if (m = xn(e, l), !zn(m))
        return nn;
      y = y && Is(m, c, s), c = m;
    }
  else {
    for (l = 0; l < e.length; m >= 65536 ? l += 2 : l++) {
      if (m = xn(e, l), m === Vn)
        f = !0, g && (d = d || // Foldable line = too long, and not more-indented.
        l - E - 1 > r && e[E + 1] !== " ", E = l);
      else if (!zn(m))
        return nn;
      y = y && Is(m, c, s), c = m;
    }
    d = d || g && l - E - 1 > r && e[E + 1] !== " ";
  }
  return !f && !d ? y && !a && !i(e) ? Iu : o === Yn ? nn : $o : n > 9 && Ru(e) ? nn : a ? o === Yn ? nn : $o : d ? Du : Nu;
}
function L0(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Yn ? '""' : "''";
    if (!e.noCompatMode && (b0.indexOf(t) !== -1 || P0.test(t)))
      return e.quotingType === Yn ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = r || e.flowLevel > -1 && n >= e.flowLevel;
    function l(m) {
      return D0(e, m);
    }
    switch (x0(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case Iu:
        return t;
      case $o:
        return "'" + t.replace(/'/g, "''") + "'";
      case Nu:
        return "|" + Ns(t, e.indent) + Ds(Os(t, o));
      case Du:
        return ">" + Ns(t, e.indent) + Ds(Os(U0(t, a), o));
      case nn:
        return '"' + k0(t) + '"';
      default:
        throw new lr("impossible error: invalid scalar style");
    }
  }();
}
function Ns(e, t) {
  var n = Ru(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function Ds(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function U0(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var m = e.indexOf(`
`);
    return m = m !== -1 ? m : e.length, n.lastIndex = m, $s(e.slice(0, m), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = n.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", r += s + (!i && !o && l !== "" ? `
` : "") + $s(l, t), i = o;
  }
  return r;
}
function $s(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, a = 0, s = 0, l = ""; r = n.exec(e); )
    s = r.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function k0(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = xn(e, i), r = be[n], !r && zn(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || R0(n);
  return t;
}
function M0(e, t, n) {
  var r = "", i = e.tag, o, a, s;
  for (o = 0, a = n.length; o < a; o += 1)
    s = n[o], e.replacer && (s = e.replacer.call(n, String(o), s)), (ct(e, t, s, !1, !1) || typeof s > "u" && ct(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function Fs(e, t, n, r) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = n.length; a < s; a += 1)
    l = n[a], e.replacer && (l = e.replacer.call(n, String(a), l)), (ct(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && ct(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += Do(e, t)), e.dump && Vn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function B0(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), a, s, l, m, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", r !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], m = n[l], e.replacer && (m = e.replacer.call(n, l, m)), ct(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), ct(e, t, m, !1, !1) && (c += e.dump, r += c));
  e.tag = i, e.dump = "{" + r + "}";
}
function j0(e, t, n, r) {
  var i = "", o = e.tag, a = Object.keys(n), s, l, m, c, f, d;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new lr("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    d = "", (!r || i !== "") && (d += Do(e, t)), m = a[s], c = n[m], e.replacer && (c = e.replacer.call(n, m, c)), ct(e, t + 1, m, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Vn === e.dump.charCodeAt(0) ? d += "?" : d += "? "), d += e.dump, f && (d += Do(e, t)), ct(e, t + 1, c, !0, f) && (e.dump && Vn === e.dump.charCodeAt(0) ? d += ":" : d += ": ", d += e.dump, i += d));
  e.tag = o, e.dump = i || "{}";
}
function xs(e, t, n) {
  var r, i, o, a, s, l;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, Au.call(s.represent) === "[object Function]")
          r = s.represent(t, l);
        else if (Tu.call(s.represent, l))
          r = s.represent[l](t, l);
        else
          throw new lr("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function ct(e, t, n, r, i, o, a) {
  e.tag = null, e.dump = n, xs(e, n, !1) || xs(e, n, !0);
  var s = Au.call(e.dump), l = r, m;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, d;
  if (c && (f = e.duplicates.indexOf(n), d = f !== -1), (e.tag !== null && e.tag !== "?" || d || e.indent !== 2 && t > 0) && (i = !1), d && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && d && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (j0(e, t, e.dump, i), d && (e.dump = "&ref_" + f + e.dump)) : (B0(e, t, e.dump), d && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? Fs(e, t - 1, e.dump, i) : Fs(e, t, e.dump, i), d && (e.dump = "&ref_" + f + e.dump)) : (M0(e, t, e.dump), d && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && L0(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new lr("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (m = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? m = "!" + m : m.slice(0, 18) === "tag:yaml.org,2002:" ? m = "!!" + m.slice(18) : m = "!<" + m + ">", e.dump = m + " " + e.dump);
  }
  return !0;
}
function H0(e, t) {
  var n = [], r = [], i, o;
  for (Fo(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function Fo(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        Fo(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        Fo(e[r[i]], t, n);
}
function q0(e, t) {
  t = t || {};
  var n = new N0(t);
  n.noRefs || H0(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), ct(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
_u.dump = q0;
var $u = ea, G0 = _u;
function aa(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Ae.Type = Fe;
Ae.Schema = Wc;
Ae.FAILSAFE_SCHEMA = Xc;
Ae.JSON_SCHEMA = tu;
Ae.CORE_SCHEMA = nu;
Ae.DEFAULT_SCHEMA = na;
Ae.load = $u.load;
Ae.loadAll = $u.loadAll;
Ae.dump = G0.dump;
Ae.YAMLException = sr;
Ae.types = {
  binary: su,
  float: eu,
  map: zc,
  null: Kc,
  pairs: cu,
  set: uu,
  timestamp: ou,
  bool: Jc,
  int: Qc,
  merge: au,
  omap: lu,
  seq: Yc,
  str: Vc
};
Ae.safeLoad = aa("safeLoad", "load");
Ae.safeLoadAll = aa("safeLoadAll", "loadAll");
Ae.safeDump = aa("safeDump", "dump");
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.Lazy = void 0;
class W0 {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
mi.Lazy = W0;
var xo = { exports: {} };
const V0 = "2.0.0", Fu = 256, Y0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, z0 = 16, X0 = Fu - 6, K0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var gi = {
  MAX_LENGTH: Fu,
  MAX_SAFE_COMPONENT_LENGTH: z0,
  MAX_SAFE_BUILD_LENGTH: X0,
  MAX_SAFE_INTEGER: Y0,
  RELEASE_TYPES: K0,
  SEMVER_SPEC_VERSION: V0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const J0 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var wi = J0;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = gi, o = wi;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], m = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const d = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", i],
    [d, r]
  ], E = (A) => {
    for (const [S, T] of g)
      A = A.split(`${S}*`).join(`${S}{0,${T}}`).split(`${S}+`).join(`${S}{1,${T}}`);
    return A;
  }, y = (A, S, T) => {
    const D = E(S), x = f++;
    o(A, x, S), c[A] = x, l[x] = S, m[x] = D, a[x] = new RegExp(S, T ? "g" : void 0), s[x] = new RegExp(D, T ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), y("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${d}+`), y("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), y("FULL", `^${l[c.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), y("LOOSE", `^${l[c.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), y("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), y("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", l[c.COERCE], !0), y("COERCERTLFULL", l[c.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(xo, xo.exports);
var cr = xo.exports;
const Q0 = Object.freeze({ loose: !0 }), Z0 = Object.freeze({}), ew = (e) => e ? typeof e != "object" ? Q0 : e : Z0;
var sa = ew;
const Ls = /^[0-9]+$/, xu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = Ls.test(e), r = Ls.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, tw = (e, t) => xu(t, e);
var Lu = {
  compareIdentifiers: xu,
  rcompareIdentifiers: tw
};
const Nr = wi, { MAX_LENGTH: Us, MAX_SAFE_INTEGER: Dr } = gi, { safeRe: $r, t: Fr } = cr, nw = sa, { compareIdentifiers: Qi } = Lu;
let rw = class nt {
  constructor(t, n) {
    if (n = nw(n), t instanceof nt) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Us)
      throw new TypeError(
        `version is longer than ${Us} characters`
      );
    Nr("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? $r[Fr.LOOSE] : $r[Fr.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > Dr || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Dr || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Dr || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < Dr)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = r[5] ? r[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Nr("SemVer.compare", this.version, this.options, t), !(t instanceof nt)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new nt(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof nt || (t = new nt(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof nt || (t = new nt(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (Nr("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return Qi(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof nt || (t = new nt(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (Nr("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return Qi(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? $r[Fr.PRERELEASELOOSE] : $r[Fr.PRERELEASE]);
        if (!i || i[1] !== n)
          throw new Error(`invalid identifier: ${n}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", n, r);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", n, r);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(r) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (n === this.prerelease.join(".") && r === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (n) {
          let o = [n, i];
          r === !1 && (o = [n]), Qi(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var xe = rw;
const ks = xe, iw = (e, t, n = !1) => {
  if (e instanceof ks)
    return e;
  try {
    return new ks(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var wn = iw;
const ow = wn, aw = (e, t) => {
  const n = ow(e, t);
  return n ? n.version : null;
};
var sw = aw;
const lw = wn, cw = (e, t) => {
  const n = lw(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var uw = cw;
const Ms = xe, fw = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new Ms(
      e instanceof Ms ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var dw = fw;
const Bs = wn, hw = (e, t) => {
  const n = Bs(e, null, !0), r = Bs(t, null, !0), i = n.compare(r);
  if (i === 0)
    return null;
  const o = i > 0, a = o ? n : r, s = o ? r : n, l = !!a.prerelease.length;
  if (!!s.prerelease.length && !l) {
    if (!s.patch && !s.minor)
      return "major";
    if (s.compareMain(a) === 0)
      return s.minor && !s.patch ? "minor" : "patch";
  }
  const c = l ? "pre" : "";
  return n.major !== r.major ? c + "major" : n.minor !== r.minor ? c + "minor" : n.patch !== r.patch ? c + "patch" : "prerelease";
};
var pw = hw;
const mw = xe, gw = (e, t) => new mw(e, t).major;
var ww = gw;
const yw = xe, Ew = (e, t) => new yw(e, t).minor;
var vw = Ew;
const _w = xe, Aw = (e, t) => new _w(e, t).patch;
var Tw = Aw;
const Sw = wn, Cw = (e, t) => {
  const n = Sw(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var bw = Cw;
const js = xe, Pw = (e, t, n) => new js(e, n).compare(new js(t, n));
var Je = Pw;
const Ow = Je, Rw = (e, t, n) => Ow(t, e, n);
var Iw = Rw;
const Nw = Je, Dw = (e, t) => Nw(e, t, !0);
var $w = Dw;
const Hs = xe, Fw = (e, t, n) => {
  const r = new Hs(e, n), i = new Hs(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var la = Fw;
const xw = la, Lw = (e, t) => e.sort((n, r) => xw(n, r, t));
var Uw = Lw;
const kw = la, Mw = (e, t) => e.sort((n, r) => kw(r, n, t));
var Bw = Mw;
const jw = Je, Hw = (e, t, n) => jw(e, t, n) > 0;
var yi = Hw;
const qw = Je, Gw = (e, t, n) => qw(e, t, n) < 0;
var ca = Gw;
const Ww = Je, Vw = (e, t, n) => Ww(e, t, n) === 0;
var Uu = Vw;
const Yw = Je, zw = (e, t, n) => Yw(e, t, n) !== 0;
var ku = zw;
const Xw = Je, Kw = (e, t, n) => Xw(e, t, n) >= 0;
var ua = Kw;
const Jw = Je, Qw = (e, t, n) => Jw(e, t, n) <= 0;
var fa = Qw;
const Zw = Uu, ey = ku, ty = yi, ny = ua, ry = ca, iy = fa, oy = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return Zw(e, n, r);
    case "!=":
      return ey(e, n, r);
    case ">":
      return ty(e, n, r);
    case ">=":
      return ny(e, n, r);
    case "<":
      return ry(e, n, r);
    case "<=":
      return iy(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Mu = oy;
const ay = xe, sy = wn, { safeRe: xr, t: Lr } = cr, ly = (e, t) => {
  if (e instanceof ay)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? xr[Lr.COERCEFULL] : xr[Lr.COERCE]);
  else {
    const l = t.includePrerelease ? xr[Lr.COERCERTLFULL] : xr[Lr.COERCERTL];
    let m;
    for (; (m = l.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || m.index + m[0].length !== n.index + n[0].length) && (n = m), l.lastIndex = m.index + m[1].length + m[2].length;
    l.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", a = t.includePrerelease && n[5] ? `-${n[5]}` : "", s = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return sy(`${r}.${i}.${o}${a}${s}`, t);
};
var cy = ly;
class uy {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const n = this.map.get(t);
    if (n !== void 0)
      return this.map.delete(t), this.map.set(t, n), n;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, n) {
    if (!this.delete(t) && n !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, n);
    }
    return this;
  }
}
var fy = uy, Zi, qs;
function Qe() {
  if (qs) return Zi;
  qs = 1;
  const e = /\s+/g;
  class t {
    constructor(P, N) {
      if (N = i(N), P instanceof t)
        return P.loose === !!N.loose && P.includePrerelease === !!N.includePrerelease ? P : new t(P.raw, N);
      if (P instanceof o)
        return this.raw = P.value, this.set = [[P]], this.formatted = void 0, this;
      if (this.options = N, this.loose = !!N.loose, this.includePrerelease = !!N.includePrerelease, this.raw = P.trim().replace(e, " "), this.set = this.raw.split("||").map((b) => this.parseRange(b.trim())).filter((b) => b.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const b = this.set[0];
        if (this.set = this.set.filter(($) => !y($[0])), this.set.length === 0)
          this.set = [b];
        else if (this.set.length > 1) {
          for (const $ of this.set)
            if ($.length === 1 && A($[0])) {
              this.set = [$];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let P = 0; P < this.set.length; P++) {
          P > 0 && (this.formatted += "||");
          const N = this.set[P];
          for (let b = 0; b < N.length; b++)
            b > 0 && (this.formatted += " "), this.formatted += N[b].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(P) {
      const b = ((this.options.includePrerelease && g) | (this.options.loose && E)) + ":" + P, $ = r.get(b);
      if ($)
        return $;
      const I = this.options.loose, M = I ? l[m.HYPHENRANGELOOSE] : l[m.HYPHENRANGE];
      P = P.replace(M, j(this.options.includePrerelease)), a("hyphen replace", P), P = P.replace(l[m.COMPARATORTRIM], c), a("comparator trim", P), P = P.replace(l[m.TILDETRIM], f), a("tilde trim", P), P = P.replace(l[m.CARETTRIM], d), a("caret trim", P);
      let Y = P.split(" ").map((U) => T(U, this.options)).join(" ").split(/\s+/).map((U) => H(U, this.options));
      I && (Y = Y.filter((U) => (a("loose invalid filter", U, this.options), !!U.match(l[m.COMPARATORLOOSE])))), a("range list", Y);
      const q = /* @__PURE__ */ new Map(), Q = Y.map((U) => new o(U, this.options));
      for (const U of Q) {
        if (y(U))
          return [U];
        q.set(U.value, U);
      }
      q.size > 1 && q.has("") && q.delete("");
      const ge = [...q.values()];
      return r.set(b, ge), ge;
    }
    intersects(P, N) {
      if (!(P instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((b) => S(b, N) && P.set.some(($) => S($, N) && b.every((I) => $.every((M) => I.intersects(M, N)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(P) {
      if (!P)
        return !1;
      if (typeof P == "string")
        try {
          P = new s(P, this.options);
        } catch {
          return !1;
        }
      for (let N = 0; N < this.set.length; N++)
        if (J(this.set[N], P, this.options))
          return !0;
      return !1;
    }
  }
  Zi = t;
  const n = fy, r = new n(), i = sa, o = Ei(), a = wi, s = xe, {
    safeRe: l,
    t: m,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: d
  } = cr, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: E } = gi, y = (R) => R.value === "<0.0.0-0", A = (R) => R.value === "", S = (R, P) => {
    let N = !0;
    const b = R.slice();
    let $ = b.pop();
    for (; N && b.length; )
      N = b.every((I) => $.intersects(I, P)), $ = b.pop();
    return N;
  }, T = (R, P) => (R = R.replace(l[m.BUILD], ""), a("comp", R, P), R = ue(R, P), a("caret", R), R = x(R, P), a("tildes", R), R = ke(R, P), a("xrange", R), R = W(R, P), a("stars", R), R), D = (R) => !R || R.toLowerCase() === "x" || R === "*", x = (R, P) => R.trim().split(/\s+/).map((N) => re(N, P)).join(" "), re = (R, P) => {
    const N = P.loose ? l[m.TILDELOOSE] : l[m.TILDE];
    return R.replace(N, (b, $, I, M, Y) => {
      a("tilde", R, b, $, I, M, Y);
      let q;
      return D($) ? q = "" : D(I) ? q = `>=${$}.0.0 <${+$ + 1}.0.0-0` : D(M) ? q = `>=${$}.${I}.0 <${$}.${+I + 1}.0-0` : Y ? (a("replaceTilde pr", Y), q = `>=${$}.${I}.${M}-${Y} <${$}.${+I + 1}.0-0`) : q = `>=${$}.${I}.${M} <${$}.${+I + 1}.0-0`, a("tilde return", q), q;
    });
  }, ue = (R, P) => R.trim().split(/\s+/).map((N) => X(N, P)).join(" "), X = (R, P) => {
    a("caret", R, P);
    const N = P.loose ? l[m.CARETLOOSE] : l[m.CARET], b = P.includePrerelease ? "-0" : "";
    return R.replace(N, ($, I, M, Y, q) => {
      a("caret", R, $, I, M, Y, q);
      let Q;
      return D(I) ? Q = "" : D(M) ? Q = `>=${I}.0.0${b} <${+I + 1}.0.0-0` : D(Y) ? I === "0" ? Q = `>=${I}.${M}.0${b} <${I}.${+M + 1}.0-0` : Q = `>=${I}.${M}.0${b} <${+I + 1}.0.0-0` : q ? (a("replaceCaret pr", q), I === "0" ? M === "0" ? Q = `>=${I}.${M}.${Y}-${q} <${I}.${M}.${+Y + 1}-0` : Q = `>=${I}.${M}.${Y}-${q} <${I}.${+M + 1}.0-0` : Q = `>=${I}.${M}.${Y}-${q} <${+I + 1}.0.0-0`) : (a("no pr"), I === "0" ? M === "0" ? Q = `>=${I}.${M}.${Y}${b} <${I}.${M}.${+Y + 1}-0` : Q = `>=${I}.${M}.${Y}${b} <${I}.${+M + 1}.0-0` : Q = `>=${I}.${M}.${Y} <${+I + 1}.0.0-0`), a("caret return", Q), Q;
    });
  }, ke = (R, P) => (a("replaceXRanges", R, P), R.split(/\s+/).map((N) => w(N, P)).join(" ")), w = (R, P) => {
    R = R.trim();
    const N = P.loose ? l[m.XRANGELOOSE] : l[m.XRANGE];
    return R.replace(N, (b, $, I, M, Y, q) => {
      a("xRange", R, b, $, I, M, Y, q);
      const Q = D(I), ge = Q || D(M), U = ge || D(Y), et = U;
      return $ === "=" && et && ($ = ""), q = P.includePrerelease ? "-0" : "", Q ? $ === ">" || $ === "<" ? b = "<0.0.0-0" : b = "*" : $ && et ? (ge && (M = 0), Y = 0, $ === ">" ? ($ = ">=", ge ? (I = +I + 1, M = 0, Y = 0) : (M = +M + 1, Y = 0)) : $ === "<=" && ($ = "<", ge ? I = +I + 1 : M = +M + 1), $ === "<" && (q = "-0"), b = `${$ + I}.${M}.${Y}${q}`) : ge ? b = `>=${I}.0.0${q} <${+I + 1}.0.0-0` : U && (b = `>=${I}.${M}.0${q} <${I}.${+M + 1}.0-0`), a("xRange return", b), b;
    });
  }, W = (R, P) => (a("replaceStars", R, P), R.trim().replace(l[m.STAR], "")), H = (R, P) => (a("replaceGTE0", R, P), R.trim().replace(l[P.includePrerelease ? m.GTE0PRE : m.GTE0], "")), j = (R) => (P, N, b, $, I, M, Y, q, Q, ge, U, et) => (D(b) ? N = "" : D($) ? N = `>=${b}.0.0${R ? "-0" : ""}` : D(I) ? N = `>=${b}.${$}.0${R ? "-0" : ""}` : M ? N = `>=${N}` : N = `>=${N}${R ? "-0" : ""}`, D(Q) ? q = "" : D(ge) ? q = `<${+Q + 1}.0.0-0` : D(U) ? q = `<${Q}.${+ge + 1}.0-0` : et ? q = `<=${Q}.${ge}.${U}-${et}` : R ? q = `<${Q}.${ge}.${+U + 1}-0` : q = `<=${q}`, `${N} ${q}`.trim()), J = (R, P, N) => {
    for (let b = 0; b < R.length; b++)
      if (!R[b].test(P))
        return !1;
    if (P.prerelease.length && !N.includePrerelease) {
      for (let b = 0; b < R.length; b++)
        if (a(R[b].semver), R[b].semver !== o.ANY && R[b].semver.prerelease.length > 0) {
          const $ = R[b].semver;
          if ($.major === P.major && $.minor === P.minor && $.patch === P.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Zi;
}
var eo, Gs;
function Ei() {
  if (Gs) return eo;
  Gs = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, f) {
      if (f = n(f), c instanceof t) {
        if (c.loose === !!f.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), a("comparator", c, f), this.options = f, this.loose = !!f.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(c) {
      const f = this.options.loose ? r[i.COMPARATORLOOSE] : r[i.COMPARATOR], d = c.match(f);
      if (!d)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = d[1] !== void 0 ? d[1] : "", this.operator === "=" && (this.operator = ""), d[2] ? this.semver = new s(d[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (a("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new s(c, this.options);
        } catch {
          return !1;
        }
      return o(c, this.operator, this.semver, this.options);
    }
    intersects(c, f) {
      if (!(c instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(c.value, f).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new l(this.value, f).test(c.semver) : (f = n(f), f.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || o(this.semver, "<", c.semver, f) && this.operator.startsWith(">") && c.operator.startsWith("<") || o(this.semver, ">", c.semver, f) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  eo = t;
  const n = sa, { safeRe: r, t: i } = cr, o = Mu, a = wi, s = xe, l = Qe();
  return eo;
}
const dy = Qe(), hy = (e, t, n) => {
  try {
    t = new dy(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var vi = hy;
const py = Qe(), my = (e, t) => new py(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var gy = my;
const wy = xe, yy = Qe(), Ey = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new yy(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === -1) && (r = a, i = new wy(r, n));
  }), r;
};
var vy = Ey;
const _y = xe, Ay = Qe(), Ty = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new Ay(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === 1) && (r = a, i = new _y(r, n));
  }), r;
};
var Sy = Ty;
const to = xe, Cy = Qe(), Ws = yi, by = (e, t) => {
  e = new Cy(e, t);
  let n = new to("0.0.0");
  if (e.test(n) || (n = new to("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((a) => {
      const s = new to(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || Ws(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!n || Ws(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var Py = by;
const Oy = Qe(), Ry = (e, t) => {
  try {
    return new Oy(e, t).range || "*";
  } catch {
    return null;
  }
};
var Iy = Ry;
const Ny = xe, Bu = Ei(), { ANY: Dy } = Bu, $y = Qe(), Fy = vi, Vs = yi, Ys = ca, xy = fa, Ly = ua, Uy = (e, t, n, r) => {
  e = new Ny(e, r), t = new $y(t, r);
  let i, o, a, s, l;
  switch (n) {
    case ">":
      i = Vs, o = xy, a = Ys, s = ">", l = ">=";
      break;
    case "<":
      i = Ys, o = Ly, a = Vs, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Fy(e, t, r))
    return !1;
  for (let m = 0; m < t.set.length; ++m) {
    const c = t.set[m];
    let f = null, d = null;
    if (c.forEach((g) => {
      g.semver === Dy && (g = new Bu(">=0.0.0")), f = f || g, d = d || g, i(g.semver, f.semver, r) ? f = g : a(g.semver, d.semver, r) && (d = g);
    }), f.operator === s || f.operator === l || (!d.operator || d.operator === s) && o(e, d.semver))
      return !1;
    if (d.operator === l && a(e, d.semver))
      return !1;
  }
  return !0;
};
var da = Uy;
const ky = da, My = (e, t, n) => ky(e, t, ">", n);
var By = My;
const jy = da, Hy = (e, t, n) => jy(e, t, "<", n);
var qy = Hy;
const zs = Qe(), Gy = (e, t, n) => (e = new zs(e, n), t = new zs(t, n), e.intersects(t, n));
var Wy = Gy;
const Vy = vi, Yy = Je;
var zy = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const a = e.sort((c, f) => Yy(c, f, n));
  for (const c of a)
    Vy(c, t, n) ? (o = c, i || (i = c)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const s = [];
  for (const [c, f] of r)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), m = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < m.length ? l : t;
};
const Xs = Qe(), ha = Ei(), { ANY: no } = ha, On = vi, pa = Je, Xy = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new Xs(e, n), t = new Xs(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = Jy(i, o, n);
      if (r = r || a !== null, a)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, Ky = [new ha(">=0.0.0-0")], Ks = [new ha(">=0.0.0")], Jy = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === no) {
    if (t.length === 1 && t[0].semver === no)
      return !0;
    n.includePrerelease ? e = Ky : e = Ks;
  }
  if (t.length === 1 && t[0].semver === no) {
    if (n.includePrerelease)
      return !0;
    t = Ks;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = Js(i, g, n) : g.operator === "<" || g.operator === "<=" ? o = Qs(o, g, n) : r.add(g.semver);
  if (r.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = pa(i.semver, o.semver, n), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const g of r) {
    if (i && !On(g, String(i), n) || o && !On(g, String(o), n))
      return null;
    for (const E of t)
      if (!On(g, String(E), n))
        return !1;
    return !0;
  }
  let s, l, m, c, f = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, d = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const g of t) {
    if (c = c || g.operator === ">" || g.operator === ">=", m = m || g.operator === "<" || g.operator === "<=", i) {
      if (d && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === d.major && g.semver.minor === d.minor && g.semver.patch === d.patch && (d = !1), g.operator === ">" || g.operator === ">=") {
        if (s = Js(i, g, n), s === g && s !== i)
          return !1;
      } else if (i.operator === ">=" && !On(i.semver, String(g), n))
        return !1;
    }
    if (o) {
      if (f && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === f.major && g.semver.minor === f.minor && g.semver.patch === f.patch && (f = !1), g.operator === "<" || g.operator === "<=") {
        if (l = Qs(o, g, n), l === g && l !== o)
          return !1;
      } else if (o.operator === "<=" && !On(o.semver, String(g), n))
        return !1;
    }
    if (!g.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && m && !o && a !== 0 || o && c && !i && a !== 0 || d || f);
}, Js = (e, t, n) => {
  if (!e)
    return t;
  const r = pa(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Qs = (e, t, n) => {
  if (!e)
    return t;
  const r = pa(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Qy = Xy;
const ro = cr, Zs = gi, Zy = xe, el = Lu, eE = wn, tE = sw, nE = uw, rE = dw, iE = pw, oE = ww, aE = vw, sE = Tw, lE = bw, cE = Je, uE = Iw, fE = $w, dE = la, hE = Uw, pE = Bw, mE = yi, gE = ca, wE = Uu, yE = ku, EE = ua, vE = fa, _E = Mu, AE = cy, TE = Ei(), SE = Qe(), CE = vi, bE = gy, PE = vy, OE = Sy, RE = Py, IE = Iy, NE = da, DE = By, $E = qy, FE = Wy, xE = zy, LE = Qy;
var ju = {
  parse: eE,
  valid: tE,
  clean: nE,
  inc: rE,
  diff: iE,
  major: oE,
  minor: aE,
  patch: sE,
  prerelease: lE,
  compare: cE,
  rcompare: uE,
  compareLoose: fE,
  compareBuild: dE,
  sort: hE,
  rsort: pE,
  gt: mE,
  lt: gE,
  eq: wE,
  neq: yE,
  gte: EE,
  lte: vE,
  cmp: _E,
  coerce: AE,
  Comparator: TE,
  Range: SE,
  satisfies: CE,
  toComparators: bE,
  maxSatisfying: PE,
  minSatisfying: OE,
  minVersion: RE,
  validRange: IE,
  outside: NE,
  gtr: DE,
  ltr: $E,
  intersects: FE,
  simplifyRange: xE,
  subset: LE,
  SemVer: Zy,
  re: ro.re,
  src: ro.src,
  tokens: ro.t,
  SEMVER_SPEC_VERSION: Zs.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Zs.RELEASE_TYPES,
  compareIdentifiers: el.compareIdentifiers,
  rcompareIdentifiers: el.rcompareIdentifiers
}, ur = {}, ni = { exports: {} };
ni.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", m = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", d = "[object Error]", g = "[object Function]", E = "[object GeneratorFunction]", y = "[object Map]", A = "[object Number]", S = "[object Null]", T = "[object Object]", D = "[object Promise]", x = "[object Proxy]", re = "[object RegExp]", ue = "[object Set]", X = "[object String]", ke = "[object Symbol]", w = "[object Undefined]", W = "[object WeakMap]", H = "[object ArrayBuffer]", j = "[object DataView]", J = "[object Float32Array]", R = "[object Float64Array]", P = "[object Int8Array]", N = "[object Int16Array]", b = "[object Int32Array]", $ = "[object Uint8Array]", I = "[object Uint8ClampedArray]", M = "[object Uint16Array]", Y = "[object Uint32Array]", q = /[\\^$.*+?()[\]{}|]/g, Q = /^\[object .+?Constructor\]$/, ge = /^(?:0|[1-9]\d*)$/, U = {};
  U[J] = U[R] = U[P] = U[N] = U[b] = U[$] = U[I] = U[M] = U[Y] = !0, U[s] = U[l] = U[H] = U[c] = U[j] = U[f] = U[d] = U[g] = U[y] = U[A] = U[T] = U[re] = U[ue] = U[X] = U[W] = !1;
  var et = typeof Re == "object" && Re && Re.Object === Object && Re, h = typeof self == "object" && self && self.Object === Object && self, u = et || h || Function("return this")(), C = t && !t.nodeType && t, _ = C && !0 && e && !e.nodeType && e, K = _ && _.exports === C, te = K && et.process, le = function() {
    try {
      return te && te.binding && te.binding("util");
    } catch {
    }
  }(), Ee = le && le.isTypedArray;
  function Te(p, v) {
    for (var O = -1, F = p == null ? 0 : p.length, ne = 0, G = []; ++O < F; ) {
      var ce = p[O];
      v(ce, O, p) && (G[ne++] = ce);
    }
    return G;
  }
  function ut(p, v) {
    for (var O = -1, F = v.length, ne = p.length; ++O < F; )
      p[ne + O] = v[O];
    return p;
  }
  function pe(p, v) {
    for (var O = -1, F = p == null ? 0 : p.length; ++O < F; )
      if (v(p[O], O, p))
        return !0;
    return !1;
  }
  function qe(p, v) {
    for (var O = -1, F = Array(p); ++O < p; )
      F[O] = v(O);
    return F;
  }
  function Ni(p) {
    return function(v) {
      return p(v);
    };
  }
  function mr(p, v) {
    return p.has(v);
  }
  function _n(p, v) {
    return p == null ? void 0 : p[v];
  }
  function gr(p) {
    var v = -1, O = Array(p.size);
    return p.forEach(function(F, ne) {
      O[++v] = [ne, F];
    }), O;
  }
  function lf(p, v) {
    return function(O) {
      return p(v(O));
    };
  }
  function cf(p) {
    var v = -1, O = Array(p.size);
    return p.forEach(function(F) {
      O[++v] = F;
    }), O;
  }
  var uf = Array.prototype, ff = Function.prototype, wr = Object.prototype, Di = u["__core-js_shared__"], Sa = ff.toString, tt = wr.hasOwnProperty, Ca = function() {
    var p = /[^.]+$/.exec(Di && Di.keys && Di.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), ba = wr.toString, df = RegExp(
    "^" + Sa.call(tt).replace(q, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Pa = K ? u.Buffer : void 0, yr = u.Symbol, Oa = u.Uint8Array, Ra = wr.propertyIsEnumerable, hf = uf.splice, Rt = yr ? yr.toStringTag : void 0, Ia = Object.getOwnPropertySymbols, pf = Pa ? Pa.isBuffer : void 0, mf = lf(Object.keys, Object), $i = Kt(u, "DataView"), An = Kt(u, "Map"), Fi = Kt(u, "Promise"), xi = Kt(u, "Set"), Li = Kt(u, "WeakMap"), Tn = Kt(Object, "create"), gf = Dt($i), wf = Dt(An), yf = Dt(Fi), Ef = Dt(xi), vf = Dt(Li), Na = yr ? yr.prototype : void 0, Ui = Na ? Na.valueOf : void 0;
  function It(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.clear(); ++v < O; ) {
      var F = p[v];
      this.set(F[0], F[1]);
    }
  }
  function _f() {
    this.__data__ = Tn ? Tn(null) : {}, this.size = 0;
  }
  function Af(p) {
    var v = this.has(p) && delete this.__data__[p];
    return this.size -= v ? 1 : 0, v;
  }
  function Tf(p) {
    var v = this.__data__;
    if (Tn) {
      var O = v[p];
      return O === r ? void 0 : O;
    }
    return tt.call(v, p) ? v[p] : void 0;
  }
  function Sf(p) {
    var v = this.__data__;
    return Tn ? v[p] !== void 0 : tt.call(v, p);
  }
  function Cf(p, v) {
    var O = this.__data__;
    return this.size += this.has(p) ? 0 : 1, O[p] = Tn && v === void 0 ? r : v, this;
  }
  It.prototype.clear = _f, It.prototype.delete = Af, It.prototype.get = Tf, It.prototype.has = Sf, It.prototype.set = Cf;
  function at(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.clear(); ++v < O; ) {
      var F = p[v];
      this.set(F[0], F[1]);
    }
  }
  function bf() {
    this.__data__ = [], this.size = 0;
  }
  function Pf(p) {
    var v = this.__data__, O = vr(v, p);
    if (O < 0)
      return !1;
    var F = v.length - 1;
    return O == F ? v.pop() : hf.call(v, O, 1), --this.size, !0;
  }
  function Of(p) {
    var v = this.__data__, O = vr(v, p);
    return O < 0 ? void 0 : v[O][1];
  }
  function Rf(p) {
    return vr(this.__data__, p) > -1;
  }
  function If(p, v) {
    var O = this.__data__, F = vr(O, p);
    return F < 0 ? (++this.size, O.push([p, v])) : O[F][1] = v, this;
  }
  at.prototype.clear = bf, at.prototype.delete = Pf, at.prototype.get = Of, at.prototype.has = Rf, at.prototype.set = If;
  function Nt(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.clear(); ++v < O; ) {
      var F = p[v];
      this.set(F[0], F[1]);
    }
  }
  function Nf() {
    this.size = 0, this.__data__ = {
      hash: new It(),
      map: new (An || at)(),
      string: new It()
    };
  }
  function Df(p) {
    var v = _r(this, p).delete(p);
    return this.size -= v ? 1 : 0, v;
  }
  function $f(p) {
    return _r(this, p).get(p);
  }
  function Ff(p) {
    return _r(this, p).has(p);
  }
  function xf(p, v) {
    var O = _r(this, p), F = O.size;
    return O.set(p, v), this.size += O.size == F ? 0 : 1, this;
  }
  Nt.prototype.clear = Nf, Nt.prototype.delete = Df, Nt.prototype.get = $f, Nt.prototype.has = Ff, Nt.prototype.set = xf;
  function Er(p) {
    var v = -1, O = p == null ? 0 : p.length;
    for (this.__data__ = new Nt(); ++v < O; )
      this.add(p[v]);
  }
  function Lf(p) {
    return this.__data__.set(p, r), this;
  }
  function Uf(p) {
    return this.__data__.has(p);
  }
  Er.prototype.add = Er.prototype.push = Lf, Er.prototype.has = Uf;
  function ft(p) {
    var v = this.__data__ = new at(p);
    this.size = v.size;
  }
  function kf() {
    this.__data__ = new at(), this.size = 0;
  }
  function Mf(p) {
    var v = this.__data__, O = v.delete(p);
    return this.size = v.size, O;
  }
  function Bf(p) {
    return this.__data__.get(p);
  }
  function jf(p) {
    return this.__data__.has(p);
  }
  function Hf(p, v) {
    var O = this.__data__;
    if (O instanceof at) {
      var F = O.__data__;
      if (!An || F.length < n - 1)
        return F.push([p, v]), this.size = ++O.size, this;
      O = this.__data__ = new Nt(F);
    }
    return O.set(p, v), this.size = O.size, this;
  }
  ft.prototype.clear = kf, ft.prototype.delete = Mf, ft.prototype.get = Bf, ft.prototype.has = jf, ft.prototype.set = Hf;
  function qf(p, v) {
    var O = Ar(p), F = !O && id(p), ne = !O && !F && ki(p), G = !O && !F && !ne && Ba(p), ce = O || F || ne || G, we = ce ? qe(p.length, String) : [], ve = we.length;
    for (var ie in p)
      tt.call(p, ie) && !(ce && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ie == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      ne && (ie == "offset" || ie == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      G && (ie == "buffer" || ie == "byteLength" || ie == "byteOffset") || // Skip index properties.
      Zf(ie, ve))) && we.push(ie);
    return we;
  }
  function vr(p, v) {
    for (var O = p.length; O--; )
      if (La(p[O][0], v))
        return O;
    return -1;
  }
  function Gf(p, v, O) {
    var F = v(p);
    return Ar(p) ? F : ut(F, O(p));
  }
  function Sn(p) {
    return p == null ? p === void 0 ? w : S : Rt && Rt in Object(p) ? Jf(p) : rd(p);
  }
  function Da(p) {
    return Cn(p) && Sn(p) == s;
  }
  function $a(p, v, O, F, ne) {
    return p === v ? !0 : p == null || v == null || !Cn(p) && !Cn(v) ? p !== p && v !== v : Wf(p, v, O, F, $a, ne);
  }
  function Wf(p, v, O, F, ne, G) {
    var ce = Ar(p), we = Ar(v), ve = ce ? l : dt(p), ie = we ? l : dt(v);
    ve = ve == s ? T : ve, ie = ie == s ? T : ie;
    var Me = ve == T, Ge = ie == T, Se = ve == ie;
    if (Se && ki(p)) {
      if (!ki(v))
        return !1;
      ce = !0, Me = !1;
    }
    if (Se && !Me)
      return G || (G = new ft()), ce || Ba(p) ? Fa(p, v, O, F, ne, G) : Xf(p, v, ve, O, F, ne, G);
    if (!(O & i)) {
      var je = Me && tt.call(p, "__wrapped__"), He = Ge && tt.call(v, "__wrapped__");
      if (je || He) {
        var ht = je ? p.value() : p, st = He ? v.value() : v;
        return G || (G = new ft()), ne(ht, st, O, F, G);
      }
    }
    return Se ? (G || (G = new ft()), Kf(p, v, O, F, ne, G)) : !1;
  }
  function Vf(p) {
    if (!Ma(p) || td(p))
      return !1;
    var v = Ua(p) ? df : Q;
    return v.test(Dt(p));
  }
  function Yf(p) {
    return Cn(p) && ka(p.length) && !!U[Sn(p)];
  }
  function zf(p) {
    if (!nd(p))
      return mf(p);
    var v = [];
    for (var O in Object(p))
      tt.call(p, O) && O != "constructor" && v.push(O);
    return v;
  }
  function Fa(p, v, O, F, ne, G) {
    var ce = O & i, we = p.length, ve = v.length;
    if (we != ve && !(ce && ve > we))
      return !1;
    var ie = G.get(p);
    if (ie && G.get(v))
      return ie == v;
    var Me = -1, Ge = !0, Se = O & o ? new Er() : void 0;
    for (G.set(p, v), G.set(v, p); ++Me < we; ) {
      var je = p[Me], He = v[Me];
      if (F)
        var ht = ce ? F(He, je, Me, v, p, G) : F(je, He, Me, p, v, G);
      if (ht !== void 0) {
        if (ht)
          continue;
        Ge = !1;
        break;
      }
      if (Se) {
        if (!pe(v, function(st, $t) {
          if (!mr(Se, $t) && (je === st || ne(je, st, O, F, G)))
            return Se.push($t);
        })) {
          Ge = !1;
          break;
        }
      } else if (!(je === He || ne(je, He, O, F, G))) {
        Ge = !1;
        break;
      }
    }
    return G.delete(p), G.delete(v), Ge;
  }
  function Xf(p, v, O, F, ne, G, ce) {
    switch (O) {
      case j:
        if (p.byteLength != v.byteLength || p.byteOffset != v.byteOffset)
          return !1;
        p = p.buffer, v = v.buffer;
      case H:
        return !(p.byteLength != v.byteLength || !G(new Oa(p), new Oa(v)));
      case c:
      case f:
      case A:
        return La(+p, +v);
      case d:
        return p.name == v.name && p.message == v.message;
      case re:
      case X:
        return p == v + "";
      case y:
        var we = gr;
      case ue:
        var ve = F & i;
        if (we || (we = cf), p.size != v.size && !ve)
          return !1;
        var ie = ce.get(p);
        if (ie)
          return ie == v;
        F |= o, ce.set(p, v);
        var Me = Fa(we(p), we(v), F, ne, G, ce);
        return ce.delete(p), Me;
      case ke:
        if (Ui)
          return Ui.call(p) == Ui.call(v);
    }
    return !1;
  }
  function Kf(p, v, O, F, ne, G) {
    var ce = O & i, we = xa(p), ve = we.length, ie = xa(v), Me = ie.length;
    if (ve != Me && !ce)
      return !1;
    for (var Ge = ve; Ge--; ) {
      var Se = we[Ge];
      if (!(ce ? Se in v : tt.call(v, Se)))
        return !1;
    }
    var je = G.get(p);
    if (je && G.get(v))
      return je == v;
    var He = !0;
    G.set(p, v), G.set(v, p);
    for (var ht = ce; ++Ge < ve; ) {
      Se = we[Ge];
      var st = p[Se], $t = v[Se];
      if (F)
        var ja = ce ? F($t, st, Se, v, p, G) : F(st, $t, Se, p, v, G);
      if (!(ja === void 0 ? st === $t || ne(st, $t, O, F, G) : ja)) {
        He = !1;
        break;
      }
      ht || (ht = Se == "constructor");
    }
    if (He && !ht) {
      var Tr = p.constructor, Sr = v.constructor;
      Tr != Sr && "constructor" in p && "constructor" in v && !(typeof Tr == "function" && Tr instanceof Tr && typeof Sr == "function" && Sr instanceof Sr) && (He = !1);
    }
    return G.delete(p), G.delete(v), He;
  }
  function xa(p) {
    return Gf(p, sd, Qf);
  }
  function _r(p, v) {
    var O = p.__data__;
    return ed(v) ? O[typeof v == "string" ? "string" : "hash"] : O.map;
  }
  function Kt(p, v) {
    var O = _n(p, v);
    return Vf(O) ? O : void 0;
  }
  function Jf(p) {
    var v = tt.call(p, Rt), O = p[Rt];
    try {
      p[Rt] = void 0;
      var F = !0;
    } catch {
    }
    var ne = ba.call(p);
    return F && (v ? p[Rt] = O : delete p[Rt]), ne;
  }
  var Qf = Ia ? function(p) {
    return p == null ? [] : (p = Object(p), Te(Ia(p), function(v) {
      return Ra.call(p, v);
    }));
  } : ld, dt = Sn;
  ($i && dt(new $i(new ArrayBuffer(1))) != j || An && dt(new An()) != y || Fi && dt(Fi.resolve()) != D || xi && dt(new xi()) != ue || Li && dt(new Li()) != W) && (dt = function(p) {
    var v = Sn(p), O = v == T ? p.constructor : void 0, F = O ? Dt(O) : "";
    if (F)
      switch (F) {
        case gf:
          return j;
        case wf:
          return y;
        case yf:
          return D;
        case Ef:
          return ue;
        case vf:
          return W;
      }
    return v;
  });
  function Zf(p, v) {
    return v = v ?? a, !!v && (typeof p == "number" || ge.test(p)) && p > -1 && p % 1 == 0 && p < v;
  }
  function ed(p) {
    var v = typeof p;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? p !== "__proto__" : p === null;
  }
  function td(p) {
    return !!Ca && Ca in p;
  }
  function nd(p) {
    var v = p && p.constructor, O = typeof v == "function" && v.prototype || wr;
    return p === O;
  }
  function rd(p) {
    return ba.call(p);
  }
  function Dt(p) {
    if (p != null) {
      try {
        return Sa.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function La(p, v) {
    return p === v || p !== p && v !== v;
  }
  var id = Da(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Da : function(p) {
    return Cn(p) && tt.call(p, "callee") && !Ra.call(p, "callee");
  }, Ar = Array.isArray;
  function od(p) {
    return p != null && ka(p.length) && !Ua(p);
  }
  var ki = pf || cd;
  function ad(p, v) {
    return $a(p, v);
  }
  function Ua(p) {
    if (!Ma(p))
      return !1;
    var v = Sn(p);
    return v == g || v == E || v == m || v == x;
  }
  function ka(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= a;
  }
  function Ma(p) {
    var v = typeof p;
    return p != null && (v == "object" || v == "function");
  }
  function Cn(p) {
    return p != null && typeof p == "object";
  }
  var Ba = Ee ? Ni(Ee) : Yf;
  function sd(p) {
    return od(p) ? qf(p) : zf(p);
  }
  function ld() {
    return [];
  }
  function cd() {
    return !1;
  }
  e.exports = ad;
})(ni, ni.exports);
var UE = ni.exports;
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.DownloadedUpdateHelper = void 0;
ur.createTempUpdateFile = HE;
const kE = nr, ME = Ct, tl = UE, xt = Pt, Mn = se;
class BE {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Mn.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return tl(this.versionInfo, n) && tl(this.fileInfo.info, r.info) && await (0, xt.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, a) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, xt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, xt.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, n) {
    const r = this.getUpdateInfoFile();
    if (!await (0, xt.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, xt.readJson)(r);
    } catch (m) {
      let c = "No cached update info available";
      return m.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${m.message})`), n.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Mn.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, xt.pathExists)(s))
      return n.info("Cached update file doesn't exist"), null;
    const l = await jE(s);
    return t.info.sha512 !== l ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Mn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
ur.DownloadedUpdateHelper = BE;
function jE(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const a = (0, kE.createHash)(t);
    a.on("error", o).setEncoding(n), (0, ME.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function HE(e, t, n) {
  let r = 0, i = Mn.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, xt.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${a}`), i = Mn.join(t, `${r++}-${e}`);
    }
  return i;
}
var _i = {}, ma = {};
Object.defineProperty(ma, "__esModule", { value: !0 });
ma.getAppCacheDir = GE;
const io = se, qE = si;
function GE() {
  const e = (0, qE.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || io.join(e, "AppData", "Local") : process.platform === "darwin" ? t = io.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || io.join(e, ".cache"), t;
}
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.ElectronAppAdapter = void 0;
const nl = se, WE = ma;
class VE {
  constructor(t = qt.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? nl.join(process.resourcesPath, "app-update.yml") : nl.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, WE.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (n, r) => t(r));
  }
}
_i.ElectronAppAdapter = VE;
var Hu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = me;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return qt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class r extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, a, s) {
      return await s.cancellationToken.createPromise((l, m, c) => {
        const f = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: a,
          options: s,
          onCancel: c,
          callback: (d) => {
            d == null ? l(a) : m(d);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, a) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = n());
      const s = qt.net.request({
        ...o,
        session: this.cachedSession
      });
      return s.on("response", a), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(o, a, s, l, m) {
      o.on("redirect", (c, f, d) => {
        o.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : m(t.HttpExecutor.prepareRedirectUrlOptions(d, a));
      });
    }
  }
  e.ElectronHttpExecutor = r;
})(Hu);
var fr = {}, Ze = {};
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.newBaseUrl = YE;
Ze.newUrlFromBase = zE;
Ze.getChannelFilename = XE;
const qu = bt;
function YE(e) {
  const t = new qu.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function zE(e, t, n = !1) {
  const r = new qu.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function XE(e) {
  return `${e}.yml`;
}
var he = {}, KE = "[object Symbol]", Gu = /[\\^$.*+?()[\]{}|]/g, JE = RegExp(Gu.source), QE = typeof Re == "object" && Re && Re.Object === Object && Re, ZE = typeof self == "object" && self && self.Object === Object && self, ev = QE || ZE || Function("return this")(), tv = Object.prototype, nv = tv.toString, rl = ev.Symbol, il = rl ? rl.prototype : void 0, ol = il ? il.toString : void 0;
function rv(e) {
  if (typeof e == "string")
    return e;
  if (ov(e))
    return ol ? ol.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function iv(e) {
  return !!e && typeof e == "object";
}
function ov(e) {
  return typeof e == "symbol" || iv(e) && nv.call(e) == KE;
}
function av(e) {
  return e == null ? "" : rv(e);
}
function sv(e) {
  return e = av(e), e && JE.test(e) ? e.replace(Gu, "\\$&") : e;
}
var Wu = sv;
Object.defineProperty(he, "__esModule", { value: !0 });
he.Provider = void 0;
he.findFile = dv;
he.parseUpdateInfo = hv;
he.getFileList = Vu;
he.resolveFiles = pv;
const Tt = me, lv = Ae, cv = bt, ri = Ze, uv = Wu;
class fv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, n, r, i = null) {
    const o = (0, ri.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, ri.newUrlFromBase)(`${t.pathname.replace(new RegExp(uv(r), "g"), n)}.blockmap`, i ? new cv.URL(i) : t), o];
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, n, r) {
    return this.executor.request(this.createRequestOptions(t, n), r);
  }
  createRequestOptions(t, n) {
    const r = {};
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, Tt.configureRequestUrl)(t, r), r;
  }
}
he.Provider = fv;
function dv(e, t, n) {
  var r;
  if (e.length === 0)
    throw (0, Tt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((a) => a.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (r = i.find((a) => [a.url.pathname, a.info.url].some((s) => s.includes(process.arch)))) !== null && r !== void 0 ? r : i.shift();
  return o || (n == null ? e[0] : e.find((a) => !n.some((s) => a.url.pathname.toLowerCase().endsWith(`.${s.toLowerCase()}`))));
}
function hv(e, t, n) {
  if (e == null)
    throw (0, Tt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, lv.load)(e);
  } catch (i) {
    throw (0, Tt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function Vu(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, Tt.newError)(`No files provided: ${(0, Tt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function pv(e, t, n = (r) => r) {
  const i = Vu(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, Tt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Tt.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, ri.newUrlFromBase)(n(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, ri.newUrlFromBase)(n(a.path), t).href
  }), i;
}
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.GenericProvider = void 0;
const al = me, oo = Ze, ao = he;
class mv extends ao.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, oo.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, oo.getChannelFilename)(this.channel), n = (0, oo.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, ao.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof al.HttpError && i.statusCode === 404)
          throw (0, al.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && r < 3) {
          await new Promise((o, a) => {
            try {
              setTimeout(o, 1e3 * r);
            } catch (s) {
              a(s);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, ao.resolveFiles)(t, this.baseUrl);
  }
}
fr.GenericProvider = mv;
var Ai = {}, Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.BitbucketProvider = void 0;
const sl = me, so = Ze, lo = he;
class gv extends lo.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, so.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new sl.CancellationToken(), n = (0, so.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, so.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, lo.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, sl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, lo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
Ti.BitbucketProvider = gv;
var St = {};
Object.defineProperty(St, "__esModule", { value: !0 });
St.GitHubProvider = St.BaseGitHubProvider = void 0;
St.computeReleaseNotes = zu;
const lt = me, kt = ju, wv = bt, sn = Ze, Lo = he, co = /\/tag\/([^/]+)$/;
class Yu extends Lo.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, sn.newBaseUrl)((0, lt.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, sn.newBaseUrl)((0, lt.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
St.BaseGitHubProvider = Yu;
class yv extends Yu {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const a = new lt.CancellationToken(), s = await this.httpRequest((0, sn.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), l = (0, lt.parseXml)(s);
    let m = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const A = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = kt.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (A === null)
          c = co.exec(m.element("link").attribute("href"))[1];
        else
          for (const S of l.getElements("entry")) {
            const T = co.exec(S.element("link").attribute("href"));
            if (T === null)
              continue;
            const D = T[1], x = ((r = kt.prerelease(D)) === null || r === void 0 ? void 0 : r[0]) || null, re = !A || ["alpha", "beta"].includes(A), ue = x !== null && !["alpha", "beta"].includes(String(x));
            if (re && !ue && !(A === "beta" && x === "alpha")) {
              c = D;
              break;
            }
            if (x && x === A) {
              c = D;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(a);
        for (const A of l.getElements("entry"))
          if (co.exec(A.element("link").attribute("href"))[1] === c) {
            m = A;
            break;
          }
      }
    } catch (A) {
      throw (0, lt.newError)(`Cannot parse releases feed: ${A.stack || A.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, lt.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, d = "", g = "";
    const E = async (A) => {
      d = (0, sn.getChannelFilename)(A), g = (0, sn.newUrlFromBase)(this.getBaseDownloadPath(String(c), d), this.baseUrl);
      const S = this.createRequestOptions(g);
      try {
        return await this.executor.request(S, a);
      } catch (T) {
        throw T instanceof lt.HttpError && T.statusCode === 404 ? (0, lt.newError)(`Cannot find ${d} in the latest release artifacts (${g}): ${T.stack || T.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : T;
      }
    };
    try {
      let A = this.channel;
      this.updater.allowPrerelease && (!((i = kt.prerelease(c)) === null || i === void 0) && i[0]) && (A = this.getCustomChannelName(String((o = kt.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), f = await E(A);
    } catch (A) {
      if (this.updater.allowPrerelease)
        f = await E(this.getDefaultChannelName());
      else
        throw A;
    }
    const y = (0, Lo.parseUpdateInfo)(f, d, g);
    return y.releaseName == null && (y.releaseName = m.elementValueOrEmpty("title")), y.releaseNotes == null && (y.releaseNotes = zu(this.updater.currentVersion, this.updater.fullChangelog, l, m)), {
      tag: c,
      ...y
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, sn.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new wv.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, lt.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Lo.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
St.GitHubProvider = yv;
function ll(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function zu(e, t, n, r) {
  if (!t)
    return ll(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    kt.valid(a) && kt.lt(e, a) && i.push({
      version: a,
      note: ll(o)
    });
  }
  return i.sort((o, a) => kt.rcompare(o.version, a.version));
}
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.GitLabProvider = void 0;
const Pe = me, uo = bt, Ev = Wu, Ur = Ze, fo = he;
class vv extends fo.Provider {
  /**
   * Normalizes filenames by replacing spaces and underscores with dashes.
   *
   * This is a workaround to handle filename formatting differences between tools:
   * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
   * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
   *
   * Because of this mismatch, we can't reliably extract the correct filename from
   * the asset path without normalization. This function ensures consistent matching
   * across different filename formats by converting all spaces and underscores to dashes.
   *
   * @param filename The filename to normalize
   * @returns The normalized filename with spaces and underscores replaced by dashes
   */
  normalizeFilename(t) {
    return t.replace(/ |_/g, "-");
  }
  constructor(t, n, r) {
    super({
      ...r,
      // GitLab might not support multiple range requests efficiently
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.updater = n, this.cachedLatestVersion = null;
    const o = t.host || "gitlab.com";
    this.baseApiUrl = (0, Ur.newBaseUrl)(`https://${o}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new Pe.CancellationToken(), n = (0, Ur.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let r;
    try {
      const d = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, g = await this.httpRequest(n, d, t);
      if (!g)
        throw (0, Pe.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      r = JSON.parse(g);
    } catch (d) {
      throw (0, Pe.newError)(`Unable to find latest release on GitLab (${n}): ${d.stack || d.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = r.tag_name;
    let o = null, a = "", s = null;
    const l = async (d) => {
      a = (0, Ur.getChannelFilename)(d);
      const g = r.assets.links.find((y) => y.name === a);
      if (!g)
        throw (0, Pe.newError)(`Cannot find ${a} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      s = new uo.URL(g.direct_asset_url);
      const E = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const y = await this.httpRequest(s, E, t);
        if (!y)
          throw (0, Pe.newError)(`Empty response from ${s}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return y;
      } catch (y) {
        throw y instanceof Pe.HttpError && y.statusCode === 404 ? (0, Pe.newError)(`Cannot find ${a} in the latest release artifacts (${s}): ${y.stack || y.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : y;
      }
    };
    try {
      o = await l(this.channel);
    } catch (d) {
      if (this.channel !== this.getDefaultChannelName())
        o = await l(this.getDefaultChannelName());
      else
        throw d;
    }
    if (!o)
      throw (0, Pe.newError)(`Unable to parse channel data from ${a}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const m = (0, fo.parseUpdateInfo)(o, a, s);
    m.releaseName == null && (m.releaseName = r.name), m.releaseNotes == null && (m.releaseNotes = r.description || null);
    const c = /* @__PURE__ */ new Map();
    for (const d of r.assets.links)
      c.set(this.normalizeFilename(d.name), d.direct_asset_url);
    const f = {
      tag: i,
      assets: c,
      ...m
    };
    return this.cachedLatestVersion = f, f;
  }
  /**
   * Utility function to convert GitlabReleaseAsset to Map<string, string>
   * Maps asset names to their download URLs
   */
  convertAssetsToMap(t) {
    const n = /* @__PURE__ */ new Map();
    for (const r of t.links)
      n.set(this.normalizeFilename(r.name), r.direct_asset_url);
    return n;
  }
  /**
   * Find blockmap file URL in assets map for a specific filename
   */
  findBlockMapInAssets(t, n) {
    const r = [`${n}.blockmap`, `${this.normalizeFilename(n)}.blockmap`];
    for (const i of r) {
      const o = t.get(i);
      if (o)
        return new uo.URL(o);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const n = new Pe.CancellationToken(), r = [`v${t}`, t];
    for (const i of r) {
      const o = (0, Ur.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const a = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, s = await this.httpRequest(o, a, n);
        if (s)
          return JSON.parse(s);
      } catch (a) {
        if (a instanceof Pe.HttpError && a.statusCode === 404)
          continue;
        throw (0, Pe.newError)(`Unable to find release ${i} on GitLab (${o}): ${a.stack || a.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, Pe.newError)(`Unable to find release with version ${t} (tried: ${r.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
  }
  setAuthHeaderForToken(t) {
    const n = {};
    return t != null && (t.startsWith("Bearer") ? n.authorization = t : n["PRIVATE-TOKEN"] = t), n;
  }
  /**
   * Get version info for blockmap files, using cache when possible
   */
  async getVersionInfoForBlockMap(t) {
    if (this.cachedLatestVersion && this.cachedLatestVersion.version === t)
      return this.cachedLatestVersion.assets;
    const n = await this.fetchReleaseInfoByVersion(t);
    return n && n.assets ? this.convertAssetsToMap(n.assets) : null;
  }
  /**
   * Find blockmap URLs from version assets
   */
  async findBlockMapUrlsFromAssets(t, n, r) {
    let i = null, o = null;
    const a = await this.getVersionInfoForBlockMap(n);
    a && (i = this.findBlockMapInAssets(a, r));
    const s = await this.getVersionInfoForBlockMap(t);
    if (s) {
      const l = r.replace(new RegExp(Ev(n), "g"), t);
      o = this.findBlockMapInAssets(s, l);
    }
    return [o, i];
  }
  async getBlockMapFiles(t, n, r, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const o = t.pathname.split("/").pop() || "", [a, s] = await this.findBlockMapUrlsFromAssets(n, r, o);
      if (!s)
        throw (0, Pe.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!a)
        throw (0, Pe.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [a, s];
    } else
      return super.getBlockMapFiles(t, n, r, i);
  }
  resolveFiles(t) {
    return (0, fo.getFileList)(t).map((n) => {
      const i = [
        n.url,
        // Original filename
        this.normalizeFilename(n.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((a) => t.assets.has(a)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, Pe.newError)(`Cannot find asset "${n.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new uo.URL(o),
        info: n
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
Si.GitLabProvider = vv;
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.KeygenProvider = void 0;
const cl = me, ho = Ze, po = he;
class _v extends po.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, ho.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new cl.CancellationToken(), n = (0, ho.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, ho.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, po.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, cl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, po.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
Ci.KeygenProvider = _v;
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.PrivateGitHubProvider = void 0;
const Zt = me, Av = Ae, Tv = se, ul = bt, fl = Ze, Sv = St, Cv = he;
class bv extends Sv.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new Zt.CancellationToken(), n = (0, fl.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((s) => s.name === n);
    if (i == null)
      throw (0, Zt.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new ul.URL(i.url);
    let a;
    try {
      a = (0, Av.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof Zt.HttpError && s.statusCode === 404 ? (0, Zt.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
    }
    return a.assets = r.assets, a;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const n = this.updater.allowPrerelease;
    let r = this.basePath;
    n || (r = `${r}/latest`);
    const i = (0, fl.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return n ? o.find((a) => a.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, Zt.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Cv.getFileList)(t).map((n) => {
      const r = Tv.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, Zt.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ul.URL(i.url),
        info: n
      };
    });
  }
}
bi.PrivateGitHubProvider = bv;
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.isUrlProbablySupportMultiRangeRequests = Xu;
Ai.createClient = Dv;
const kr = me, Pv = Ti, dl = fr, Ov = St, Rv = Si, Iv = Ci, Nv = bi;
function Xu(e) {
  return !e.includes("s3.amazonaws.com");
}
function Dv(e, t, n) {
  if (typeof e == "string")
    throw (0, kr.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Ov.GitHubProvider(i, t, n) : new Nv.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new Pv.BitbucketProvider(e, t, n);
    case "gitlab":
      return new Rv.GitLabProvider(e, t, n);
    case "keygen":
      return new Iv.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new dl.GenericProvider({
        provider: "generic",
        url: (0, kr.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new dl.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Xu(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, kr.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, kr.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Pi = {}, dr = {}, yn = {}, Xt = {};
Object.defineProperty(Xt, "__esModule", { value: !0 });
Xt.OperationKind = void 0;
Xt.computeOperations = $v;
var Mt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Mt || (Xt.OperationKind = Mt = {}));
function $v(e, t, n) {
  const r = pl(e.files), i = pl(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, m = r.get(l);
  if (m == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: d, checksumToOldSize: g } = xv(r.get(l), m.offset, n);
  let E = a.offset;
  for (let y = 0; y < c.checksums.length; E += c.sizes[y], y++) {
    const A = c.sizes[y], S = c.checksums[y];
    let T = d.get(S);
    T != null && g.get(S) !== A && (n.warn(`Checksum ("${S}") matches, but size differs (old: ${g.get(S)}, new: ${A})`), T = void 0), T === void 0 ? (f++, o != null && o.kind === Mt.DOWNLOAD && o.end === E ? o.end += A : (o = {
      kind: Mt.DOWNLOAD,
      start: E,
      end: E + A
      // oldBlocks: null,
    }, hl(o, s, S, y))) : o != null && o.kind === Mt.COPY && o.end === T ? o.end += A : (o = {
      kind: Mt.COPY,
      start: T,
      end: T + A
      // oldBlocks: [checksum]
    }, hl(o, s, S, y));
  }
  return f > 0 && n.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const Fv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function hl(e, t, n, r) {
  if (Fv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${Mt[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function xv(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], l = e.sizes[a], m = i.get(s);
    if (m === void 0)
      r.set(s, o), i.set(s, l);
    else if (n.debug != null) {
      const c = m === l ? "(same size)" : `(size: ${m}, this size: ${l})`;
      n.debug(`${s} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: r, checksumToOldSize: i };
}
function pl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(yn, "__esModule", { value: !0 });
yn.DataSplitter = void 0;
yn.copyData = Ku;
const Mr = me, Lv = Ct, Uv = tr, kv = Xt, ml = Buffer.from(`\r
\r
`);
var mt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(mt || (mt = {}));
function Ku(e, t, n, r, i) {
  const o = (0, Lv.createReadStream)("", {
    fd: n,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", r), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class Mv extends Uv.Writable {
  constructor(t, n, r, i, o, a, s, l) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = a, this.grandTotalBytes = s, this.onProgress = l, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = mt.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, n, r) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(() => {
      if (this.onProgress) {
        const i = Date.now();
        (i >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (i - this.start) / 1e3 && (this.nextUpdate = i + 1e3, this.onProgress({
          total: this.grandTotalBytes,
          delta: this.delta,
          transferred: this.transferred,
          percent: this.transferred / this.grandTotalBytes * 100,
          bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
        }), this.delta = 0);
      }
      r();
    }).catch(r);
  }
  async handleData(t) {
    let n = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Mr.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === mt.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = mt.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === mt.BODY)
          this.readState = mt.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, Mr.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, Mr.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = mt.HEADER;
            return;
          }
        }
        const r = this.partIndexToLength[this.partIndex], i = n + r, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, n, o), this.remainingPartDataCount = r - (o - n), this.remainingPartDataCount > 0)
          return;
        if (n = i + this.boundaryLength, n >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, n) {
    return new Promise((r, i) => {
      const o = () => {
        if (t === n) {
          r();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== kv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Ku(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(ml, n);
    if (r !== -1)
      return r + ml.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Mr.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, n, r) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, n, r);
  }
  processPartData(t, n, r) {
    this.actualPartLength += r - n, this.transferred += r - n, this.delta += r - n;
    const i = this.out;
    return i.write(n === 0 && t.length === r ? t : t.slice(n, r)) ? Promise.resolve() : new Promise((o, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), o();
      });
    });
  }
}
yn.DataSplitter = Mv;
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.executeTasksUsingMultipleRangeRequests = Bv;
Oi.checkIsRangesSupported = ko;
const Uo = me, gl = yn, wl = Xt;
function Bv(e, t, n, r, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const s = a + 1e3;
    jv(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: r
    }, n, () => o(s), i);
  };
  return o;
}
function jv(e, t, n, r, i) {
  let o = "bytes=", a = 0, s = 0;
  const l = /* @__PURE__ */ new Map(), m = [];
  for (let d = t.start; d < t.end; d++) {
    const g = t.tasks[d];
    g.kind === wl.OperationKind.DOWNLOAD && (o += `${g.start}-${g.end - 1}, `, l.set(a, d), a++, m.push(g.end - g.start), s += g.end - g.start);
  }
  if (a <= 1) {
    const d = (g) => {
      if (g >= t.end) {
        r();
        return;
      }
      const E = t.tasks[g++];
      if (E.kind === wl.OperationKind.COPY)
        (0, gl.copyData)(E, n, t.oldFileFd, i, () => d(g));
      else {
        const y = e.createRequestOptions();
        y.headers.Range = `bytes=${E.start}-${E.end - 1}`;
        const A = e.httpExecutor.createRequest(y, (S) => {
          S.on("error", i), ko(S, i) && (S.pipe(n, {
            end: !1
          }), S.once("end", () => d(g)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(A, i), A.end();
      }
    };
    d(t.start);
    return;
  }
  const c = e.createRequestOptions();
  c.headers.Range = o.substring(0, o.length - 2);
  const f = e.httpExecutor.createRequest(c, (d) => {
    if (!ko(d, i))
      return;
    const g = (0, Uo.safeGetHeader)(d, "content-type"), E = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(g);
    if (E == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${g}"`));
      return;
    }
    const y = new gl.DataSplitter(n, t, l, E[1] || E[2], m, r, s, e.options.onProgress);
    y.on("error", i), d.pipe(y), d.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function ko(e, t) {
  if (e.statusCode >= 400)
    return t((0, Uo.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, Uo.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.ProgressDifferentialDownloadCallbackTransform = void 0;
const Hv = tr;
var ln;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(ln || (ln = {}));
class qv extends Hv.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = ln.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == ln.COPY) {
      r(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  beginFileCopy() {
    this.operationType = ln.COPY;
  }
  beginRangeDownload() {
    this.operationType = ln.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
Ri.ProgressDifferentialDownloadCallbackTransform = qv;
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.DifferentialDownloader = void 0;
const Rn = me, mo = Pt, Gv = Ct, Wv = yn, Vv = bt, Br = Xt, yl = Oi, Yv = Ri;
class zv {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, n, r) {
    this.blockAwareFileInfo = t, this.httpExecutor = n, this.options = r, this.fileMetadataBuffer = null, this.logger = r.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, Rn.configureRequestUrl)(this.options.newUrl, t), (0, Rn.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, Br.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const l of i) {
      const m = l.end - l.start;
      l.kind === Br.OperationKind.DOWNLOAD ? o += m : a += m;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return r.info(`Full: ${El(s)}, To download: ${El(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, mo.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, n).then(r).catch((i) => r().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (a) {
        try {
          console.error(a);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, n) {
    const r = await (0, mo.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, mo.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, Gv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let m;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const S = [];
        let T = 0;
        for (const x of t)
          x.kind === Br.OperationKind.DOWNLOAD && (S.push(x.end - x.start), T += x.end - x.start);
        const D = {
          expectedByteCounts: S,
          grandTotal: T
        };
        m = new Yv.ProgressDifferentialDownloadCallbackTransform(D, this.options.cancellationToken, this.options.onProgress), l.push(m);
      }
      const c = new Rn.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), o.on("finish", () => {
        o.close(() => {
          n.splice(1, 1);
          try {
            c.validate();
          } catch (S) {
            s(S);
            return;
          }
          a(void 0);
        });
      }), l.push(o);
      let f = null;
      for (const S of l)
        S.on("error", s), f == null ? f = S : f = f.pipe(S);
      const d = l[0];
      let g;
      if (this.options.isUseMultipleRangeRequest) {
        g = (0, yl.executeTasksUsingMultipleRangeRequests)(this, t, d, r, s), g(0);
        return;
      }
      let E = 0, y = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const A = this.createRequestOptions();
      A.redirect = "manual", g = (S) => {
        var T, D;
        if (S >= t.length) {
          this.fileMetadataBuffer != null && d.write(this.fileMetadataBuffer), d.end();
          return;
        }
        const x = t[S++];
        if (x.kind === Br.OperationKind.COPY) {
          m && m.beginFileCopy(), (0, Wv.copyData)(x, d, r, s, () => g(S));
          return;
        }
        const re = `bytes=${x.start}-${x.end - 1}`;
        A.headers.range = re, (D = (T = this.logger) === null || T === void 0 ? void 0 : T.debug) === null || D === void 0 || D.call(T, `download range: ${re}`), m && m.beginRangeDownload();
        const ue = this.httpExecutor.createRequest(A, (X) => {
          X.on("error", s), X.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), X.statusCode >= 400 && s((0, Rn.createHttpError)(X)), X.pipe(d, {
            end: !1
          }), X.once("end", () => {
            m && m.endRangeDownload(), ++E === 100 ? (E = 0, setTimeout(() => g(S), 1e3)) : g(S);
          });
        });
        ue.on("redirect", (X, ke, w) => {
          this.logger.info(`Redirect to ${Xv(w)}`), y = w, (0, Rn.configureRequestUrl)(new Vv.URL(y), A), ue.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(ue, s), ue.end();
      }, g(0);
    });
  }
  async readRemoteBytes(t, n) {
    const r = Buffer.allocUnsafe(n + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${n}`;
    let o = 0;
    if (await this.request(i, (a) => {
      a.copy(r, o), o += a.length;
    }), o !== r.length)
      throw new Error(`Received data length ${o} is not equal to expected ${r.length}`);
    return r;
  }
  request(t, n) {
    return new Promise((r, i) => {
      const o = this.httpExecutor.createRequest(t, (a) => {
        (0, yl.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", n), a.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
dr.DifferentialDownloader = zv;
function El(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Xv(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.GenericDifferentialDownloader = void 0;
const Kv = dr;
class Jv extends Kv.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
Pi.GenericDifferentialDownloader = Jv;
var Ot = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = r;
  const t = me;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class n {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      r(this.emitter, "login", o);
    }
    progress(o) {
      r(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      r(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      r(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = n;
  function r(i, o, a) {
    i.on(o, a);
  }
})(Ot);
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.NoOpLogger = vt.AppUpdater = void 0;
const Oe = me, Qv = nr, Zv = si, e_ = Hl, We = Pt, t_ = Ae, go = mi, Ve = se, Lt = ju, vl = ur, n_ = _i, _l = Hu, r_ = fr, wo = Ai, yo = Gl, i_ = Pi, en = Ot;
class ga extends e_.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, Oe.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Oe.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, _l.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Ju();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new go.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  /**
   * Allows developer to override default logic for determining if the user is below the rollout threshold.
   * The default logic compares the staging percentage with numerical representation of user ID.
   * An override can define custom logic, or bypass it if needed.
   */
  get isUserWithinRollout() {
    return this._isUserWithinRollout;
  }
  set isUserWithinRollout(t) {
    t && (this._isUserWithinRollout = t);
  }
  constructor(t, n) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new en.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new go.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new go.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new n_.ElectronAppAdapter(), this.httpExecutor = new _l.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, Lt.parse)(r);
    if (i == null)
      throw (0, Oe.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = o_(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const n = this.createProviderRuntimeOptions();
    let r;
    typeof t == "string" ? r = new r_.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, wo.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, wo.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const n = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((r) => (n(), r)).catch((r) => {
      throw n(), this.emit("error", r, `Cannot check for updates: ${(r.stack || r).toString()}`), r;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((n) => n != null && n.downloadPromise ? (n.downloadPromise.then(() => {
      const r = ga.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
      new qt.Notification(r).show();
    }), n) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), n));
  }
  static formatDownloadNotification(t, n, r) {
    return r == null && (r = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), r = {
      title: r.title.replace("{appName}", n).replace("{version}", t),
      body: r.body.replace("{appName}", n).replace("{version}", t)
    }, r;
  }
  async isStagingMatch(t) {
    const n = t.stagingPercentage;
    let r = n;
    if (r == null)
      return !0;
    if (r = parseInt(r, 10), isNaN(r))
      return this._logger.warn(`Staging percentage is NaN: ${n}`), !0;
    r = r / 100;
    const i = await this.stagingUserIdPromise.value, a = Oe.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${a}, user id: ${i}`), a < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, Lt.parse)(t.version);
    if (n == null)
      throw (0, Oe.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, Lt.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, Lt.gt)(n, r), a = (0, Lt.lt)(n, r);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, Zv.release)();
    if (n)
      try {
        if ((0, Lt.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, wo.createClient)(r, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, n = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": n })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), n = t.info;
    if (!await this.isUpdateAvailable(n))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${n.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", n), {
        isUpdateAvailable: !1,
        versionInfo: n,
        updateInfo: n
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(n);
    const r = new Oe.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: n,
      updateInfo: n,
      cancellationToken: r,
      downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Oe.asArray)(t.files).map((n) => n.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Oe.CancellationToken()) {
    const n = this.updateInfoAndProvider;
    if (n == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Oe.asArray)(n.info.files).map((i) => i.url).join(", ")}`);
    const r = (i) => {
      if (!(i instanceof Oe.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: n,
      requestHeaders: this.computeRequestHeaders(n.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw r(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(en.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, t_.load)(await (0, We.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const n = t.fileExtraDownloadHeaders;
    if (n != null) {
      const r = this.requestHeaders;
      return r == null ? n : {
        ...n,
        ...r
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = Ve.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, We.readFile)(t, "utf-8");
      if (Oe.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = Oe.UUID.v5((0, Qv.randomBytes)(4096), Oe.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, We.outputFile)(t, n);
    } catch (r) {
      this._logger.warn(`Couldn't write out staging user ID: ${r}`);
    }
    return n;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const n of Object.keys(t)) {
      const r = n.toLowerCase();
      if (r === "authorization" || r === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const n = (await this.configOnDisk.value).updaterCacheDirName, r = this._logger;
      n == null && r.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = Ve.join(this.app.baseCachePath, n || this.app.name);
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new vl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const n = t.fileInfo, r = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: n.info.sha2,
      sha512: n.info.sha512
    };
    this.listenerCount(en.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (T) => this.emit(en.DOWNLOAD_PROGRESS, T));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = n.packageInfo;
    function s() {
      const T = decodeURIComponent(t.fileInfo.url.pathname);
      return T.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Ve.basename(T) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), m = l.cacheDirForPendingUpdate;
    await (0, We.mkdir)(m, { recursive: !0 });
    const c = s();
    let f = Ve.join(m, c);
    const d = a == null ? null : Ve.join(m, `package-${o}${Ve.extname(a.path) || ".7z"}`), g = async (T) => {
      await l.setDownloadedFile(f, d, i, n, c, T), await t.done({
        ...i,
        downloadedFile: f
      });
      const D = Ve.join(m, "current.blockmap");
      return await (0, We.pathExists)(D) && await (0, We.copyFile)(D, Ve.join(l.cacheDir, "current.blockmap")), d == null ? [f] : [f, d];
    }, E = this._logger, y = await l.validateDownloadedPath(f, i, n, E);
    if (y != null)
      return f = y, await g(!1);
    const A = async () => (await l.clear().catch(() => {
    }), await (0, We.unlink)(f).catch(() => {
    })), S = await (0, vl.createTempUpdateFile)(`temp-${c}`, m, E);
    try {
      await t.task(S, r, d, A), await (0, Oe.retry)(() => (0, We.rename)(S, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (T) => T instanceof Error && /^EBUSY:/.test(T.message) ? !0 : (E.warn(`Cannot rename temp file to final file: ${T.message || T.stack}`), !1)
      });
    } catch (T) {
      throw await A(), T instanceof Oe.CancellationError && (E.info("cancelled"), this.emit("update-cancelled", i)), T;
    }
    return E.info(`New version ${o} has been downloaded to ${f}`), await g(!0);
  }
  async differentialDownloadInstaller(t, n, r, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = n.updateInfoAndProvider.provider, s = await a.getBlockMapFiles(t.url, this.app.version, n.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const l = async (E) => {
        const y = await this.httpExecutor.downloadToBuffer(E, {
          headers: n.requestHeaders,
          cancellationToken: n.cancellationToken
        });
        if (y == null || y.length === 0)
          throw new Error(`Blockmap "${E.href}" is empty`);
        try {
          return JSON.parse((0, yo.gunzipSync)(y).toString());
        } catch (A) {
          throw new Error(`Cannot parse blockmap "${E.href}", error: ${A}`);
        }
      }, m = {
        newUrl: t.url,
        oldFile: Ve.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: a.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(en.DOWNLOAD_PROGRESS) > 0 && (m.onProgress = (E) => this.emit(en.DOWNLOAD_PROGRESS, E));
      const c = async (E, y) => {
        const A = Ve.join(y, "current.blockmap");
        await (0, We.outputFile)(A, (0, yo.gzipSync)(JSON.stringify(E)));
      }, f = async (E) => {
        const y = Ve.join(E, "current.blockmap");
        try {
          if (await (0, We.pathExists)(y))
            return JSON.parse((0, yo.gunzipSync)(await (0, We.readFile)(y)).toString());
        } catch (A) {
          this._logger.warn(`Cannot parse blockmap "${y}", error: ${A}`);
        }
        return null;
      }, d = await l(s[1]);
      await c(d, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let g = await f(this.downloadedUpdateHelper.cacheDir);
      return g == null && (g = await l(s[0])), await new i_.GenericDifferentialDownloader(t.info, this.httpExecutor, m).download(g, d), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
vt.AppUpdater = ga;
function o_(e) {
  const t = (0, Lt.prerelease)(e);
  return t != null && t.length > 0;
}
class Ju {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
vt.NoOpLogger = Ju;
Object.defineProperty(zt, "__esModule", { value: !0 });
zt.BaseUpdater = void 0;
const Al = ai, a_ = vt;
class s_ extends a_.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      qt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (n) => (this.dispatchUpdateDownloaded(n), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, n = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const r = this.downloadedUpdateHelper, i = this.installerPath, o = r == null ? null : r.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${n}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: n,
        isAdminRightsRequired: o.isAdminRightsRequired
      });
    } catch (a) {
      return this.dispatchError(a), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  spawnSyncLog(t, n = [], r = {}) {
    this._logger.info(`Executing: ${t} with args: ${n}`);
    const i = (0, Al.spawnSync)(t, n, {
      env: { ...process.env, ...r },
      encoding: "utf-8",
      shell: !0
    }), { error: o, status: a, stdout: s, stderr: l } = i;
    if (o != null)
      throw this._logger.error(l), o;
    if (a != null && a !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${a}`);
    return s.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, n = [], r = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${n}`), new Promise((o, a) => {
      try {
        const s = { stdio: i, env: r, detached: !0 }, l = (0, Al.spawn)(t, n, s);
        l.on("error", (m) => {
          a(m);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
zt.BaseUpdater = s_;
var Xn = {}, hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const tn = Pt, l_ = dr, c_ = Gl;
class u_ extends l_.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = Qu(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await f_(this.options.oldFile), i);
  }
}
hr.FileWithEmbeddedBlockMapDifferentialDownloader = u_;
function Qu(e) {
  return JSON.parse((0, c_.inflateRawSync)(e).toString());
}
async function f_(e) {
  const t = await (0, tn.open)(e, "r");
  try {
    const n = (await (0, tn.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, tn.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, tn.read)(t, i, 0, i.length, n - r.length - i.length), await (0, tn.close)(t), Qu(i);
  } catch (n) {
    throw await (0, tn.close)(t), n;
  }
}
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.AppImageUpdater = void 0;
const Tl = me, Sl = ai, d_ = Pt, h_ = Ct, In = se, p_ = zt, m_ = hr, g_ = he, Cl = Ot;
class w_ extends p_.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, g_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, Tl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, a, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, d_.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, n, r, i, o) {
    try {
      const a = {
        newUrl: t.url,
        oldFile: n,
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(Cl.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(Cl.DOWNLOAD_PROGRESS, s)), await new m_.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, Tl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, h_.unlinkSync)(n);
    let r;
    const i = In.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    In.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = In.join(In.dirname(n), In.basename(o)), (0, Sl.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Sl.execFileSync)(r, [], { env: a })), !0;
  }
}
Xn.AppImageUpdater = w_;
var Kn = {}, En = {};
Object.defineProperty(En, "__esModule", { value: !0 });
En.LinuxUpdater = void 0;
const y_ = zt;
class E_ extends y_.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /**
   * Returns true if the current process is running as root.
   */
  isRunningAsRoot() {
    var t;
    return ((t = process.getuid) === null || t === void 0 ? void 0 : t.call(process)) === 0;
  }
  /**
   * Sanitizies the installer path for using with command line tools.
   */
  get installerPath() {
    var t, n;
    return (n = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
  }
  runCommandWithSudoIfNeeded(t) {
    if (this.isRunningAsRoot())
      return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(t[0], t.slice(1));
    const { name: n } = this.app, r = `"${n} would like to update"`, i = this.sudoWithArgs(r);
    this._logger.info(`Running as non-root user, using sudo to install: ${i}`);
    let o = '"';
    return (/pkexec/i.test(i[0]) || i[0] === "sudo") && (o = ""), this.spawnSyncLog(i[0], [...i.length > 1 ? i.slice(1) : [], `${o}/bin/bash`, "-c", `'${t.join(" ")}'${o}`]);
  }
  sudoWithArgs(t) {
    const n = this.determineSudoCommand(), r = [n];
    return /kdesudo/i.test(n) ? (r.push("--comment", t), r.push("-c")) : /gksudo/i.test(n) ? r.push("--message", t) : /pkexec/i.test(n) && r.push("--disable-internal-agent"), r;
  }
  hasCommand(t) {
    try {
      return this.spawnSyncLog("command", ["-v", t]), !0;
    } catch {
      return !1;
    }
  }
  determineSudoCommand() {
    const t = ["gksudo", "kdesudo", "pkexec", "beesu"];
    for (const n of t)
      if (this.hasCommand(n))
        return n;
    return "sudo";
  }
  /**
   * Detects the package manager to use based on the available commands.
   * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
   * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
   * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
   * @param pms - An array of package manager commands to check for, in priority order.
   * @returns The detected package manager command or "unknown" if none are found.
   */
  detectPackageManager(t) {
    var n;
    const r = (n = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || n === void 0 ? void 0 : n.trim();
    if (r)
      return r;
    for (const i of t)
      if (this.hasCommand(i))
        return i;
    return this._logger.warn(`No package manager found in the list: ${t.join(", ")}. Defaulting to the first one: ${t[0]}`), t[0];
  }
}
En.LinuxUpdater = E_;
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.DebUpdater = void 0;
const v_ = he, bl = Ot, __ = En;
class wa extends __.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, v_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(bl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(bl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const r = ["dpkg", "apt"], i = this.detectPackageManager(r);
    try {
      wa.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r, i) {
    var o;
    if (t === "dpkg")
      try {
        r(["dpkg", "-i", n]);
      } catch (a) {
        i.warn((o = a.message) !== null && o !== void 0 ? o : a), i.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), r(["apt-get", "install", "-f", "-y"]);
      }
    else if (t === "apt")
      i.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), r([
        "apt",
        "install",
        "-y",
        "--allow-unauthenticated",
        // needed for unsigned .debs
        "--allow-downgrades",
        // allow lower version installs
        "--allow-change-held-packages",
        n
      ]);
    else
      throw new Error(`Package manager ${t} not supported`);
  }
}
Kn.DebUpdater = wa;
var Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
Jn.PacmanUpdater = void 0;
const Pl = Ot, A_ = he, T_ = En;
class ya extends T_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, A_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Pl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Pl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      ya.installWithCommandRunner(n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (r) {
      return this.dispatchError(r), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r) {
    var i;
    try {
      n(["pacman", "-U", "--noconfirm", t]);
    } catch (o) {
      r.warn((i = o.message) !== null && i !== void 0 ? i : o), r.warn("pacman installation failed, attempting to update package database and retry");
      try {
        n(["pacman", "-Sy", "--noconfirm"]), n(["pacman", "-U", "--noconfirm", t]);
      } catch (a) {
        throw r.error("Retry after pacman -Sy failed"), a;
      }
    }
  }
}
Jn.PacmanUpdater = ya;
var Qn = {};
Object.defineProperty(Qn, "__esModule", { value: !0 });
Qn.RpmUpdater = void 0;
const Ol = Ot, S_ = he, C_ = En;
class Ea extends C_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, S_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Ol.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Ol.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const r = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(r);
    try {
      Ea.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r, i) {
    if (t === "zypper")
      return r(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", n]);
    if (t === "dnf")
      return r(["dnf", "install", "--nogpgcheck", "-y", n]);
    if (t === "yum")
      return r(["yum", "install", "--nogpgcheck", "-y", n]);
    if (t === "rpm")
      return i.warn("Installing with rpm only (no dependency resolution)."), r(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", n]);
    throw new Error(`Package manager ${t} not supported`);
  }
}
Qn.RpmUpdater = Ea;
var Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.MacUpdater = void 0;
const Rl = me, Eo = Pt, b_ = Ct, Il = se, P_ = gd, O_ = vt, R_ = he, Nl = ai, Dl = nr;
class I_ extends O_.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = qt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
      this._logger.warn(r), this.emit("error", r);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let n = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const r = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, Nl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const d = (0, Nl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      r.info(`Checked 'uname -a': arm64=${d}`), a = a || d;
    } catch (f) {
      r.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    a = a || process.arch === "arm64" || o;
    const s = (f) => {
      var d;
      return f.url.pathname.includes("arm64") || ((d = f.info.url) === null || d === void 0 ? void 0 : d.includes("arm64"));
    };
    a && n.some(s) ? n = n.filter((f) => a === s(f)) : n = n.filter((f) => !s(f));
    const l = (0, R_.findFile)(n, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, Rl.newError)(`ZIP file not provided: ${(0, Rl.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const m = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, d) => {
        const g = Il.join(this.downloadedUpdateHelper.cacheDir, c), E = () => (0, Eo.pathExistsSync)(g) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let y = !0;
        E() && (y = await this.differentialDownloadInstaller(l, t, f, m, c)), y && await this.httpExecutor.download(l.url, f, d);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const d = Il.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, Eo.copyFile)(f.downloadedFile, d);
          } catch (d) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${d.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, Eo.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, P_.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (m) => {
      const c = m.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((m, c) => {
      const f = (0, Dl.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), d = Buffer.from(`autoupdater:${f}`, "ascii"), g = `/${(0, Dl.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (E, y) => {
        const A = E.url;
        if (a.info(`${A} requested`), A === "/") {
          if (!E.headers.authorization || E.headers.authorization.indexOf("Basic ") === -1) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("No authenthication info");
            return;
          }
          const D = E.headers.authorization.split(" ")[1], x = Buffer.from(D, "base64").toString("ascii"), [re, ue] = x.split(":");
          if (re !== "autoupdater" || ue !== f) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const X = Buffer.from(`{ "url": "${l(this.server)}${g}" }`);
          y.writeHead(200, { "Content-Type": "application/json", "Content-Length": X.length }), y.end(X);
          return;
        }
        if (!A.startsWith(g)) {
          a.warn(`${A} requested, but not supported`), y.writeHead(404), y.end();
          return;
        }
        a.info(`${g} requested by Squirrel.Mac, pipe ${i}`);
        let S = !1;
        y.on("finish", () => {
          S || (this.nativeUpdater.removeListener("error", c), m([]));
        });
        const T = (0, b_.createReadStream)(i);
        T.on("error", (D) => {
          try {
            y.end();
          } catch (x) {
            a.warn(`cannot end response: ${x}`);
          }
          S = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${D}`));
        }), y.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), T.pipe(y);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${s})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${s})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${d.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(n), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : m([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
Zn.MacUpdater = I_;
var er = {}, va = {};
Object.defineProperty(va, "__esModule", { value: !0 });
va.verifySignature = D_;
const $l = me, Zu = ai, N_ = si, Fl = se;
function ef(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function D_(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, Zu.execFile)(...ef(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (a, s, l) => {
      var m;
      try {
        if (a != null || l) {
          vo(n, a, l, i), r(null);
          return;
        }
        const c = $_(s);
        if (c.Status === 0) {
          try {
            const E = Fl.normalize(c.Path), y = Fl.normalize(t);
            if (n.info(`LiteralPath: ${E}. Update Path: ${y}`), E !== y) {
              vo(n, new Error(`LiteralPath of ${E} is different than ${y}`), l, i), r(null);
              return;
            }
          } catch (E) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(m = E.message) !== null && m !== void 0 ? m : E.stack}`);
          }
          const d = (0, $l.parseDn)(c.SignerCertificate.Subject);
          let g = !1;
          for (const E of e) {
            const y = (0, $l.parseDn)(E);
            if (y.size ? g = Array.from(y.keys()).every((S) => y.get(S) === d.get(S)) : E === d.get("CN") && (n.warn(`Signature validated using only CN ${E}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              r(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (d, g) => d === "RawData" ? void 0 : g, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), r(f);
      } catch (c) {
        vo(n, c, null, i), r(null);
        return;
      }
    });
  });
}
function $_(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function vo(e, t, n, r) {
  if (F_()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Zu.execFileSync)(...ef("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function F_() {
  const e = N_.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(er, "__esModule", { value: !0 });
er.NsisUpdater = void 0;
const jr = me, xl = se, x_ = zt, L_ = hr, Ll = Ot, U_ = he, k_ = Pt, M_ = va, Ul = bt;
class B_ extends x_.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, M_.verifySignature)(r, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, U_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, a, s) => {
        const l = r.packageInfo, m = l != null && a != null;
        if (m && t.disableWebInstaller)
          throw (0, jr.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !m && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (m || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, jr.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, jr.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (m && await this.differentialDownloadWebPackage(t, l, a, n))
          try {
            await this.httpExecutor.download(new Ul.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, k_.unlink)(a);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let n;
    try {
      if (n = (await this.configOnDisk.value).publisherName, n == null)
        return null;
    } catch (r) {
      if (r.code === "ENOENT")
        return null;
      throw r;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(n) ? n : [n], t);
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const r = ["--updated"];
    t.isSilent && r.push("/S"), t.isForceRunAfter && r.push("--force-run"), this.installDirectory && r.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && r.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(xl.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, r).catch((a) => {
      const s = a.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? o() : s === "ENOENT" ? qt.shell.openPath(n).catch((l) => this.dispatchError(l)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, n, r, i) {
    if (n.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new Ul.URL(n.path),
        oldFile: xl.join(this.downloadedUpdateHelper.cacheDir, jr.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Ll.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Ll.DOWNLOAD_PROGRESS, a)), await new L_.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
er.NsisUpdater = B_;
(function(e) {
  var t = Re && Re.__createBinding || (Object.create ? function(A, S, T, D) {
    D === void 0 && (D = T);
    var x = Object.getOwnPropertyDescriptor(S, T);
    (!x || ("get" in x ? !S.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return S[T];
    } }), Object.defineProperty(A, D, x);
  } : function(A, S, T, D) {
    D === void 0 && (D = T), A[D] = S[T];
  }), n = Re && Re.__exportStar || function(A, S) {
    for (var T in A) T !== "default" && !Object.prototype.hasOwnProperty.call(S, T) && t(S, A, T);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = Pt, i = se;
  var o = zt;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var a = vt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var s = he;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var l = Xn;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var m = Kn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return m.DebUpdater;
  } });
  var c = Jn;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var f = Qn;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var d = Zn;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return d.MacUpdater;
  } });
  var g = er;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return g.NsisUpdater;
  } }), n(Ot, e);
  let E;
  function y() {
    if (process.platform === "win32")
      E = new er.NsisUpdater();
    else if (process.platform === "darwin")
      E = new Zn.MacUpdater();
    else {
      E = new Xn.AppImageUpdater();
      try {
        const A = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(A))
          return E;
        switch ((0, r.readFileSync)(A).toString().trim()) {
          case "deb":
            E = new Kn.DebUpdater();
            break;
          case "rpm":
            E = new Qn.RpmUpdater();
            break;
          case "pacman":
            E = new Jn.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (A) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", A.message);
      }
    }
    return E;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => E || y()
  });
})(Be);
class j_ {
  constructor(t) {
    Mi(this, "mainConfig");
    this.mainConfig = t.mainConfig;
  }
}
class H_ {
  constructor(t) {
    Mi(this, "setting");
    this.setting = t.setting;
  }
}
const q_ = 1, G_ = 2, W_ = 16, V_ = q_ | G_ | W_;
function Y_(e) {
  const t = e.getNativeWindowHandle(), r = [
    'Add-Type @"',
    "using System;",
    "using System.Runtime.InteropServices;",
    "public class Z {",
    '[DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f);',
    "}",
    '"@',
    `[Z]::SetWindowPos([IntPtr]${t.length >= 8 ? Number(t.readBigUInt64LE(0)) : t.readUInt32LE(0)}, [IntPtr]1, 0, 0, 0, 0, ${V_})`
  ].join(`\r
`), i = Buffer.from(r, "utf16le").toString("base64");
  wd("powershell.exe", ["-NoProfile", "-WindowStyle", "Hidden", "-EncodedCommand", i], {
    windowsHide: !0,
    timeout: 1e4,
    stdio: "ignore"
  });
}
function Mo() {
  ee && (ee.showInactive(), process.platform === "win32" && setImmediate(() => {
    if (ee != null && ee.isVisible())
      try {
        Y_(ee);
      } catch (e) {
        console.error("sendWin32ClockWindowToBack:", e);
      }
  }));
}
const tf = V.dirname(yd(import.meta.url)), ze = "data", z_ = "todo", X_ = "timeTable";
process.env.APP_ROOT = V.join(tf, "..");
const Wt = process.env.VITE_DEV_SERVER_URL, _a = V.join(process.env.APP_ROOT, "dist-electron"), Ii = V.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Wt ? V.join(process.env.APP_ROOT, "public") : Ii;
let rt = process.env.NODE_ENV === "development", ee, B, Nn = null, Dn = !1, _o = !1, $n, ii = !1, kl = !1;
function K_() {
  kl || (kl = !0, Be.autoUpdater.autoDownload = !1, Be.autoUpdater.autoInstallOnAppQuit = !0, Be.autoUpdater.on("update-available", (e) => {
    !B || B.isDestroyed() || B.webContents.send("updater:update-available", {
      version: e.version,
      releaseNotes: e.releaseNotes
    });
  }), Be.autoUpdater.on("update-not-available", () => {
    !B || B.isDestroyed() || B.webContents.send("updater:update-not-available");
  }), Be.autoUpdater.on("download-progress", (e) => {
    !B || B.isDestroyed() || B.webContents.send("updater:download-progress", {
      percent: e.percent
    });
  }), Be.autoUpdater.on("update-downloaded", (e) => {
    !B || B.isDestroyed() || B.webContents.send("updater:update-downloaded", {
      version: e.version
    });
  }), Be.autoUpdater.on("error", (e) => {
    console.error("autoUpdater:", e), !(!B || B.isDestroyed()) && B.webContents.send("updater:error", { message: e.message });
  }));
}
function J_() {
  !ae.isPackaged || !ii || setTimeout(() => {
    Be.autoUpdater.checkForUpdates().catch((e) => console.warn("checkForUpdates:", e));
  }, 4500);
}
const Q_ = ae.requestSingleInstanceLock();
Q_ || ae.quit();
async function nf() {
  if (ee) return;
  let e = "";
  rt || (e = V.join(Xe(), "config.json"));
  const t = await nA(), n = await rA(e), r = n ? n[0] : 800, i = n ? n[1] : 500;
  ee = new Bt({
    icon: V.join(process.env.VITE_PUBLIC, "water.ico"),
    frame: !1,
    width: r,
    height: i,
    resizable: !1,
    transparent: !0,
    show: !1,
    skipTaskbar: !0,
    focusable: !1,
    webPreferences: {
      preload: V.join(_a, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), !t || !t[0] || !t[1] ? ee.center() : ee.setPosition(t[0], t[1]), k.handle("window:set-position", (o, a, s) => {
    ee && ee.setPosition(a, s, !0), _o || (_o = !0, setTimeout(() => {
      tA(e), _o = !1;
    }, 500));
  }), k.handle("window:get-position", () => ee ? ee.getPosition() : [0, 0]), k.handle("window:create-note-window", () => {
    if (B) {
      B.show();
      return;
    }
    Aa();
  }), Wt ? ee.loadURL(Wt) : ee.loadFile(V.join(Ii, "index.html")), ee.on("ready-to-show", () => {
    Mo();
  });
}
async function Aa() {
  if (B) {
    B.show();
    return;
  }
  B = new Bt({
    icon: V.join(process.env.VITE_PUBLIC, "water.ico"),
    frame: !1,
    width: 1400,
    height: 1e3,
    resizable: !1,
    show: !1,
    webPreferences: {
      preload: V.join(_a, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      spellcheck: !1
    }
  }), Wt ? B.loadURL(Wt + "/note") : B.loadFile(V.join(Ii, "note.html"));
  const e = () => {
    B && !B.isDestroyed() && B.webContents.setZoomFactor(1);
  };
  B.webContents.on("did-finish-load", e), B.webContents.on("zoom-changed", e), k.removeHandler("window:close-note-window"), k.removeHandler("window:max-note-window"), k.removeHandler("window:min-note-window"), k.removeHandler("window:restore-note-window"), k.removeHandler("file:save"), k.removeHandler("file:open"), k.removeHandler("file:open-all"), k.removeHandler("file:delete"), k.removeHandler("file:rename"), k.removeHandler("shell:open-terminal-at"), k.removeHandler("dialog:open-directory"), k.removeHandler("dialog:open-file"), k.removeHandler("sticky:get-last-workspace"), k.removeHandler("sticky:set-last-workspace"), k.removeHandler("setting:get"), k.removeHandler("config:get"), k.removeHandler("setting:set"), k.removeHandler("config:set"), k.handle("window:close-note-window", () => {
    B && (B.close(), B = null, Nn = null, Dn = !1);
  }), k.handle("window:max-note-window", () => {
    if (!B || Dn) return;
    Nn = B.getBounds();
    const { workArea: t } = pd.getDisplayMatching(B.getBounds());
    B.setBounds({ ...t }), Dn = !0;
  }), k.handle("window:min-note-window", () => {
    B && B.minimize();
  }), k.handle("window:restore-note-window", () => {
    !B || !Dn || (Nn && B.setBounds(Nn), Nn = null, Dn = !1);
  }), k.handle("file:save", (t, n, r, i, o = ze) => cA(n, r, i, o)), k.handle("file:open", async (t, n, r = ze) => await uA(n, r)), k.handle("file:open-all", async (t, n = ze) => await fA(n)), k.handle("file:delete", async (t, n, r = ze) => await dA(n, r)), k.handle(
    "file:rename",
    async (t, n, r, i, o = ze) => await pA(o, n, r, i)
  ), k.handle("shell:open-terminal-at", async (t, n) => {
    const r = vn(n);
    return await Ta(r) ? (mA(r), !0) : !1;
  }), k.handle("dialog:open-directory", async (t) => {
    const n = Bt.fromWebContents(t.sender);
    if (!n) return null;
    const { canceled: r, filePaths: i } = await Ha.showOpenDialog(n, {
      properties: ["openDirectory", "createDirectory"]
    });
    return r || !i[0] ? null : i[0];
  }), k.handle("dialog:open-file", async (t) => {
    const n = Bt.fromWebContents(t.sender);
    if (!n) return null;
    const { canceled: r, filePaths: i } = await Ha.showOpenDialog(n, {
      properties: ["openFile"]
    });
    if (r || !i[0]) return null;
    const o = i[0], a = V.parse(o), l = (a.ext ? a.ext.slice(1) : "") || "txt";
    return {
      fullPath: o,
      dir: a.dir,
      name: a.name,
      type: l
    };
  }), k.handle("sticky:get-last-workspace", async () => await sA()), k.handle("sticky:set-last-workspace", async (t, n) => {
    await lA(n);
  }), k.handle("setting:get", async (t, n) => (rt || (n = V.join(Xe(), "setting.json")), await rf(n))), k.handle("config:get", async (t, n) => (rt || (n = V.join(Xe(), "config.json")), await pr(n))), k.handle("config:set", async (t, n, r) => (rt || (n = V.join(Xe(), "config.json")), of(n, r))), k.handle("setting:set", async (t, n, r) => {
    rt || (n = V.join(Xe(), "setting.json"));
    const i = await iA(n, r);
    return i && ae.isPackaged && (r != null && r.setting) && (ii = !!r.setting.checkForUpdates, ii && setTimeout(() => {
      Be.autoUpdater.checkForUpdates().catch(() => {
      });
    }, 1200)), i;
  }), B.on("ready-to-show", () => {
    B == null || B.show();
  });
}
ae.on("window-all-closed", () => {
  process.platform !== "darwin" && (ae.quit(), ee = null, B = null);
});
ae.on("activate", () => {
  Bt.getAllWindows().length === 0 && (nf(), Aa());
});
ae.commandLine.appendSwitch("no-default-window");
const Ml = "CommandOrControl+Shift+N";
function Z_() {
  const e = new Bt({
    width: 750,
    height: 800,
    show: !1,
    frame: !1,
    icon: V.join(process.env.VITE_PUBLIC, "water.ico"),
    webPreferences: {
      preload: V.join(_a, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  Wt ? e.loadURL(`${Wt}/scratch.html`) : e.loadFile(V.join(Ii, "scratch.html"));
  const t = () => {
    e.isDestroyed() || e.webContents.setZoomFactor(1);
  };
  e.webContents.on("did-finish-load", t), e.webContents.on("zoom-changed", t), e.once("ready-to-show", () => {
    e.show();
  });
}
function eA() {
  Bl.register(Ml, () => {
    Z_();
  }) || console.error("全局快捷键注册失败:", Ml);
}
ae.whenReady().then(async () => {
  var r;
  await Ao(), await Ao(z_), await Ao(X_), await oA(), await aA(), gA();
  const e = rt ? "" : V.join(Xe(), "setting.json"), t = await rf(e), n = t == null ? void 0 : t.setting;
  ii = !!(n && n.checkForUpdates), ae.isPackaged && (K_(), J_()), rt || ae.setLoginItemSettings({
    openAtLogin: !!(t != null && t.setting.autostart),
    openAsHidden: !0
  }), k.removeHandler("updater:download"), k.removeHandler("updater:quit-and-install"), k.removeHandler("updater:check-now"), k.removeHandler("app:get-packaged-info"), k.handle("updater:download", async () => ae.isPackaged ? (await Be.autoUpdater.downloadUpdate(), !0) : !1), k.handle("updater:quit-and-install", () => (ae.isPackaged && Be.autoUpdater.quitAndInstall(!1, !0), Promise.resolve())), k.handle("updater:check-now", async () => ae.isPackaged ? (await Be.autoUpdater.checkForUpdates(), { ok: !0 }) : { ok: !1, reason: "not-packaged" }), k.handle("app:get-packaged-info", () => ({
    isPackaged: ae.isPackaged,
    version: ae.getVersion()
  })), k.handle("window:close-scratch", (i) => {
    const o = Bt.fromWebContents(i.sender);
    o && !o.isDestroyed() && o.close();
  }), Aa(), eA(), (r = t == null ? void 0 : t.setting) != null && r.showClock && (nf(), B == null || B.hide());
});
ae.on("will-quit", () => {
  Bl.unregisterAll();
});
async function tA(e) {
  const t = await pr(e);
  if (!t || !ee) return;
  const n = ee.getPosition();
  t.mainConfig.position.x = n[0], t.mainConfig.position.y = n[1], await of("", t);
}
async function nA() {
  const e = await pr("");
  return !e || !e.mainConfig.position ? Promise.resolve(null) : Promise.resolve([e.mainConfig.position.x, e.mainConfig.position.y]);
}
async function rA(e) {
  const t = await pr(e);
  if (!t) return Promise.resolve(null);
  const n = t.mainConfig.time.fontSize, r = 5, i = t.mainConfig.date.fontSize, o = t.mainConfig.date.content.length ? t.mainConfig.date.content.length : 12, a = 30, s = Math.max(n * r + a, i * o + a), l = n + i + a * 2;
  return Promise.resolve([s + 100, l + 50]);
}
async function pr(e) {
  try {
    e === "" && (e = process.env.APP_ROOT + "/config.json"), await fe.access(e);
    const t = await fe.readFile(e, "utf-8"), n = JSON.parse(t);
    return new j_(n);
  } catch (t) {
    return console.error(t), null;
  }
}
async function rf(e) {
  try {
    e === "" && (e = process.env.APP_ROOT + "/setting.json"), await fe.access(e);
    const t = await fe.readFile(e, "utf-8"), r = {
      setting: {
        autostart: !1,
        dark: !1,
        showClock: !0,
        checkForUpdates: !1,
        ...JSON.parse(t).setting ?? {}
      }
    };
    return new H_(r);
  } catch (t) {
    return console.error(t), null;
  }
}
async function of(e, t) {
  try {
    e === "" && (e = process.env.APP_ROOT + "/config.json");
    const n = await pr(e);
    if (n === null)
      await fe.writeFile(e, JSON.stringify(t, null, 2), "utf-8");
    else {
      const r = af(n, t);
      await fe.writeFile(e, JSON.stringify(r, null, 2), "utf-8");
    }
    return !0;
  } catch (n) {
    return console.error(n), !1;
  }
}
async function iA(e, t) {
  try {
    return e === "" && (e = process.env.APP_ROOT + "/setting.json"), await fe.writeFile(e, JSON.stringify(t, null, 2), "utf-8"), !0;
  } catch (n) {
    return console.error(n), !1;
  }
}
function af(e, t) {
  const n = { ...e };
  for (const r in t)
    if (t.hasOwnProperty(r)) {
      const i = e[r], o = t[r];
      if (o === void 0) continue;
      o !== null && typeof o == "object" && !Array.isArray(o) && i !== null && typeof i == "object" && !Array.isArray(i) ? n[r] = af(i, o) : n[r] = o;
    }
  return n;
}
function Xe() {
  try {
    if (rt)
      return V.resolve(tf, "../");
    const e = ae.getPath("exe");
    return V.dirname(e);
  } catch (e) {
    return console.error("解析安装目录失败：", e), ae.getPath("documents");
  }
}
async function Ta(e) {
  try {
    return await fe.access(e, 0), (await fe.stat(e)).isDirectory();
  } catch {
    return !1;
  }
}
async function oi(e) {
  try {
    return await fe.access(e, 0), (await fe.stat(e)).isFile();
  } catch {
    return !1;
  }
}
async function oA() {
  if (rt) return;
  const e = V.join(Xe(), "config.json");
  if (await oi(e)) return;
  await fe.writeFile(e, `
{
  "mainConfig": {
    "time": {
      "fontSize": 50,
      "fontColor": "#000000",
      "fontFamily": "Arial"
    },
    "date": {
      "fontSize": 50,
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
async function aA() {
  if (rt) return;
  const e = V.join(Xe(), "setting.json");
  if (await oi(e)) return;
  await fe.writeFile(e, `
	{
		"setting": {
			"autostart": false,
			"dark": false,
			"showClock": true,
			"checkForUpdates": false
		}
	}`, "utf-8");
}
async function Ao(e = ze) {
  const t = V.join(Xe(), e);
  await Ta(t) || await fe.mkdir(t, { recursive: !0 });
}
function vn(e) {
  return e ? V.isAbsolute(e) ? e : V.join(Xe(), e) : V.join(Xe(), ze);
}
function sf() {
  return V.join(ae.getPath("userData"), "sticky-workspace.json");
}
async function sA() {
  try {
    const e = await fe.readFile(sf(), "utf-8"), t = JSON.parse(e);
    return typeof t.folder == "string" && t.folder.length > 0 && await Ta(t.folder) ? t.folder : null;
  } catch {
    return null;
  }
}
async function lA(e) {
  const t = JSON.stringify({ folder: e ?? null }, null, 2);
  await fe.writeFile(sf(), t, "utf-8");
}
function cA(e, t, n, r = ze) {
  return new Promise(async (i, o) => {
    try {
      const a = vn(r), s = t ? `${e}.${t}` : e, l = V.join(a, s);
      await fe.writeFile(l, n, { encoding: "utf8" }), i(!0);
    } catch (a) {
      const s = `保存文件失败：${a.message}`;
      o(new Error(s));
    }
  });
}
function uA(e, t = ze) {
  return new Promise(async (n, r) => {
    try {
      const i = vn(t), o = V.join(i, e), a = await fe.readFile(o, "utf-8");
      n(a);
    } catch {
      r("");
    }
  });
}
function fA(e = ze) {
  return new Promise(async (t, n) => {
    try {
      const r = vn(e), o = (await fe.readdir(r, { withFileTypes: !0 })).filter((a) => a.isFile()).map((a) => {
        const s = V.parse(a.name), l = s.ext ? s.ext.slice(1) : "";
        return {
          name: s.name,
          type: l
        };
      });
      t(o);
    } catch {
      n([]);
    }
  });
}
function dA(e, t = ze) {
  return new Promise(async (n, r) => {
    try {
      const i = vn(t), o = V.join(i, e);
      await fe.unlink(o), n(!0);
    } catch {
      r(!1);
    }
  });
}
const hA = /[\\/:*?"<>|]/;
async function pA(e, t, n, r) {
  try {
    const i = vn(e), o = n.trim();
    if (!o || hA.test(o)) return !1;
    const a = r.trim(), s = a ? `${o}.${a}` : o, l = V.join(i, t), m = V.join(i, s);
    return V.normalize(l) === V.normalize(m) ? !0 : !await oi(l) || await oi(m) ? !1 : (await fe.rename(l, m), !0);
  } catch {
    return !1;
  }
}
function mA(e) {
  if (process.platform === "win32") {
    const n = e.replace(/"/g, '""'), r = e.replace(/'/g, "''"), i = { detached: !0, stdio: "ignore", windowsHide: !1 }, o = () => bn("cmd.exe", ["/c", "start", "", "cmd", "/k", `cd /d "${n}"`], i).unref(), a = bn("wt.exe", ["-d", e], i);
    a.on("error", () => {
      const s = bn(
        "cmd.exe",
        [
          "/c",
          "start",
          "",
          "powershell.exe",
          "-NoExit",
          "-NoProfile",
          "-Command",
          `Set-Location -LiteralPath '${r}'`
        ],
        i
      );
      s.on("error", () => o()), s.unref();
    }), a.unref();
    return;
  }
  if (process.platform === "darwin") {
    bn("open", ["-a", "Terminal", e], { detached: !0, stdio: "ignore" }).unref();
    return;
  }
  bn("gnome-terminal", ["--working-directory", e], {
    detached: !0,
    stdio: "ignore"
  }).unref();
}
const gA = () => {
  if ($n) return;
  const e = V.join(process.env.VITE_PUBLIC, "water.ico");
  $n = new dd(e);
  const t = hd.buildFromTemplate([
    {
      label: "显示/隐藏",
      click: () => {
        ee && (ee.isVisible() ? ee.hide() : Mo());
      }
    },
    {
      label: "退出",
      click: () => {
        ae.quit();
      }
    }
  ]);
  $n.setToolTip("Salvation lies within"), $n.setContextMenu(t), $n.on("click", () => {
    ee && (ee.isVisible() ? ee.hide() : Mo());
  });
};
process.platform === "win32" && (ae.commandLine.appendSwitch("high-dpi-support", "true"), ae.commandLine.appendSwitch("force-device-scale-factor", "1"));
export {
  _a as MAIN_DIST,
  Ii as RENDERER_DIST,
  Wt as VITE_DEV_SERVER_URL
};
