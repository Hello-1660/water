var fd = Object.defineProperty;
var dd = (e, t, n) => t in e ? fd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Bi = (e, t, n) => dd(e, typeof t != "symbol" ? t + "" : t, n);
import Gt, { app as ae, BrowserWindow as jt, ipcMain as U, shell as hd, globalShortcut as Bl, Tray as pd, Menu as md, screen as gd, dialog as Ha } from "electron";
import Ct from "fs";
import wd from "constants";
import tr from "stream";
import jo from "util";
import jl from "assert";
import le from "path";
import ai from "child_process";
import Hl from "events";
import nr from "crypto";
import ql from "tty";
import si from "os";
import bt from "url";
import Gl from "zlib";
import yd from "http";
import { spawn as bn, execFileSync as Ed } from "node:child_process";
import { fileURLToPath as vd } from "node:url";
import H from "node:path";
import se from "node:fs/promises";
var Re = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Be = {}, Yt = {}, De = {};
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
var pt = wd, _d = process.cwd, Hr = null, Ad = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Hr || (Hr = _d.call(process)), Hr;
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
var Td = Sd;
function Sd(e) {
  pt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, d) {
    d && process.nextTick(d);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, d, m) {
    m && process.nextTick(m);
  }, e.lchownSync = function() {
  }), Ad === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function f(d, m, E) {
      var y = Date.now(), A = 0;
      c(d, m, function S(T) {
        if (T && (T.code === "EACCES" || T.code === "EPERM" || T.code === "EBUSY") && Date.now() - y < 6e4) {
          setTimeout(function() {
            e.stat(m, function(D, x) {
              D && D.code === "ENOENT" ? c(d, m, S) : E(T);
            });
          }, A), A < 100 && (A += 10);
          return;
        }
        E && E(T);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function f(d, m, E, y, A, S) {
      var T;
      if (S && typeof S == "function") {
        var D = 0;
        T = function(x, re, fe) {
          if (x && x.code === "EAGAIN" && D < 10)
            return D++, c.call(e, d, m, E, y, A, T);
          S.apply(this, arguments);
        };
      }
      return c.call(e, d, m, E, y, A, T);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(f, d, m, E, y) {
      for (var A = 0; ; )
        try {
          return c.call(e, f, d, m, E, y);
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
    c.lchmod = function(f, d, m) {
      c.open(
        f,
        pt.O_WRONLY | pt.O_SYMLINK,
        d,
        function(E, y) {
          if (E) {
            m && m(E);
            return;
          }
          c.fchmod(y, d, function(A) {
            c.close(y, function(S) {
              m && m(A || S);
            });
          });
        }
      );
    }, c.lchmodSync = function(f, d) {
      var m = c.openSync(f, pt.O_WRONLY | pt.O_SYMLINK, d), E = !0, y;
      try {
        y = c.fchmodSync(m, d), E = !1;
      } finally {
        if (E)
          try {
            c.closeSync(m);
          } catch {
          }
        else
          c.closeSync(m);
      }
      return y;
    };
  }
  function n(c) {
    pt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, d, m, E) {
      c.open(f, pt.O_SYMLINK, function(y, A) {
        if (y) {
          E && E(y);
          return;
        }
        c.futimes(A, d, m, function(S) {
          c.close(A, function(T) {
            E && E(S || T);
          });
        });
      });
    }, c.lutimesSync = function(f, d, m) {
      var E = c.openSync(f, pt.O_SYMLINK), y, A = !0;
      try {
        y = c.futimesSync(E, d, m), A = !1;
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
    }) : c.futimes && (c.lutimes = function(f, d, m, E) {
      E && process.nextTick(E);
    }, c.lutimesSync = function() {
    });
  }
  function r(c) {
    return c && function(f, d, m) {
      return c.call(e, f, d, function(E) {
        p(E) && (E = null), m && m.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(f, d) {
      try {
        return c.call(e, f, d);
      } catch (m) {
        if (!p(m)) throw m;
      }
    };
  }
  function o(c) {
    return c && function(f, d, m, E) {
      return c.call(e, f, d, m, function(y) {
        p(y) && (y = null), E && E.apply(this, arguments);
      });
    };
  }
  function a(c) {
    return c && function(f, d, m) {
      try {
        return c.call(e, f, d, m);
      } catch (E) {
        if (!p(E)) throw E;
      }
    };
  }
  function s(c) {
    return c && function(f, d, m) {
      typeof d == "function" && (m = d, d = null);
      function E(y, A) {
        A && (A.uid < 0 && (A.uid += 4294967296), A.gid < 0 && (A.gid += 4294967296)), m && m.apply(this, arguments);
      }
      return d ? c.call(e, f, d, E) : c.call(e, f, E);
    };
  }
  function l(c) {
    return c && function(f, d) {
      var m = d ? c.call(e, f, d) : c.call(e, f);
      return m && (m.uid < 0 && (m.uid += 4294967296), m.gid < 0 && (m.gid += 4294967296)), m;
    };
  }
  function p(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var Ga = tr.Stream, Cd = bd;
function bd(e) {
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
      var p = a[s];
      this[p] = i[p];
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
var Pd = Rd, Od = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Rd(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Od(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var oe = Ct, Id = Td, Nd = Cd, Dd = Pd, Cr = jo, _e, Vr;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (_e = Symbol.for("graceful-fs.queue"), Vr = Symbol.for("graceful-fs.previous")) : (_e = "___graceful-fs.queue", Vr = "___graceful-fs.previous");
function $d() {
}
function Wl(e, t) {
  Object.defineProperty(e, _e, {
    get: function() {
      return t;
    }
  });
}
var Ht = $d;
Cr.debuglog ? Ht = Cr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Ht = function() {
  var e = Cr.format.apply(Cr, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!oe[_e]) {
  var Fd = Re[_e] || [];
  Wl(oe, Fd), oe.close = function(e) {
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
    Ht(oe[_e]), jl.equal(oe[_e].length, 0);
  });
}
Re[_e] || Wl(Re, oe[_e]);
var $e = Ho(Dd(oe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !oe.__patched && ($e = Ho(oe), oe.__patched = !0);
function Ho(e) {
  Id(e), e.gracefulify = Ho, e.createReadStream = re, e.createWriteStream = fe;
  var t = e.readFile;
  e.readFile = n;
  function n(w, V, q) {
    return typeof V == "function" && (q = V, V = null), j(w, V, q);
    function j(J, R, P, N) {
      return t(J, R, function(b) {
        b && (b.code === "EMFILE" || b.code === "ENFILE") ? Qt([j, [J, R, P], b, N || Date.now(), Date.now()]) : typeof P == "function" && P.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(w, V, q, j) {
    return typeof q == "function" && (j = q, q = null), J(w, V, q, j);
    function J(R, P, N, b, $) {
      return r(R, P, N, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? Qt([J, [R, P, N, b], I, $ || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(w, V, q, j) {
    return typeof q == "function" && (j = q, q = null), J(w, V, q, j);
    function J(R, P, N, b, $) {
      return o(R, P, N, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? Qt([J, [R, P, N, b], I, $ || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(w, V, q, j) {
    return typeof q == "function" && (j = q, q = 0), J(w, V, q, j);
    function J(R, P, N, b, $) {
      return s(R, P, N, function(I) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? Qt([J, [R, P, N, b], I, $ || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var p = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(w, V, q) {
    typeof V == "function" && (q = V, V = null);
    var j = c.test(process.version) ? function(P, N, b, $) {
      return p(P, J(
        P,
        N,
        b,
        $
      ));
    } : function(P, N, b, $) {
      return p(P, N, J(
        P,
        N,
        b,
        $
      ));
    };
    return j(w, V, q);
    function J(R, P, N, b) {
      return function($, I) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Qt([
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
    var d = Nd(e);
    S = d.ReadStream, D = d.WriteStream;
  }
  var m = e.ReadStream;
  m && (S.prototype = Object.create(m.prototype), S.prototype.open = T);
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
  function S(w, V) {
    return this instanceof S ? (m.apply(this, arguments), this) : S.apply(Object.create(S.prototype), arguments);
  }
  function T() {
    var w = this;
    ke(w.path, w.flags, w.mode, function(V, q) {
      V ? (w.autoClose && w.destroy(), w.emit("error", V)) : (w.fd = q, w.emit("open", q), w.read());
    });
  }
  function D(w, V) {
    return this instanceof D ? (E.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
  }
  function x() {
    var w = this;
    ke(w.path, w.flags, w.mode, function(V, q) {
      V ? (w.destroy(), w.emit("error", V)) : (w.fd = q, w.emit("open", q));
    });
  }
  function re(w, V) {
    return new e.ReadStream(w, V);
  }
  function fe(w, V) {
    return new e.WriteStream(w, V);
  }
  var X = e.open;
  e.open = ke;
  function ke(w, V, q, j) {
    return typeof q == "function" && (j = q, q = null), J(w, V, q, j);
    function J(R, P, N, b, $) {
      return X(R, P, N, function(I, M) {
        I && (I.code === "EMFILE" || I.code === "ENFILE") ? Qt([J, [R, P, N, b], I, $ || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  return e;
}
function Qt(e) {
  Ht("ENQUEUE", e[0].name, e[1]), oe[_e].push(e), qo();
}
var br;
function Wa() {
  for (var e = Date.now(), t = 0; t < oe[_e].length; ++t)
    oe[_e][t].length > 2 && (oe[_e][t][3] = e, oe[_e][t][4] = e);
  qo();
}
function qo() {
  if (clearTimeout(br), br = void 0, oe[_e].length !== 0) {
    var e = oe[_e].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Ht("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Ht("TIMEOUT", t.name, n);
      var a = n.pop();
      typeof a == "function" && a.call(null, r);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), p = Math.min(l * 1.2, 100);
      s >= p ? (Ht("RETRY", t.name, n), t.apply(null, n.concat([i]))) : oe[_e].push(e);
    }
    br === void 0 && (br = setTimeout(qo, 0));
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
  }, e.read = function(i, o, a, s, l, p) {
    return typeof p == "function" ? n.read(i, o, a, s, l, p) : new Promise((c, f) => {
      n.read(i, o, a, s, l, (d, m, E) => {
        if (d) return f(d);
        c({ bytesRead: m, buffer: E });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.write(i, o, ...a) : new Promise((s, l) => {
      n.write(i, o, ...a, (p, c, f) => {
        if (p) return l(p);
        s({ bytesWritten: c, buffer: f });
      });
    });
  }, typeof n.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? n.writev(i, o, ...a) : new Promise((s, l) => {
      n.writev(i, o, ...a, (p, c, f) => {
        if (p) return l(p);
        s({ bytesWritten: c, buffers: f });
      });
    });
  }), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Yt);
var Go = {}, Vl = {};
const xd = le;
Vl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(xd.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const Yl = Yt, { checkPath: zl } = Vl, Xl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Go.makeDir = async (e, t) => (zl(e), Yl.mkdir(e, {
  mode: Xl(t),
  recursive: !0
}));
Go.makeDirSync = (e, t) => (zl(e), Yl.mkdirSync(e, {
  mode: Xl(t),
  recursive: !0
}));
const Ld = De.fromPromise, { makeDir: Ud, makeDirSync: ji } = Go, Hi = Ld(Ud);
var ot = {
  mkdirs: Hi,
  mkdirsSync: ji,
  // alias
  mkdirp: Hi,
  mkdirpSync: ji,
  ensureDir: Hi,
  ensureDirSync: ji
};
const kd = De.fromPromise, Kl = Yt;
function Md(e) {
  return Kl.access(e).then(() => !0).catch(() => !1);
}
var zt = {
  pathExists: kd(Md),
  pathExistsSync: Kl.existsSync
};
const un = $e;
function Bd(e, t, n, r) {
  un.open(e, "r+", (i, o) => {
    if (i) return r(i);
    un.futimes(o, t, n, (a) => {
      un.close(o, (s) => {
        r && r(a || s);
      });
    });
  });
}
function jd(e, t, n) {
  const r = un.openSync(e, "r+");
  return un.futimesSync(r, t, n), un.closeSync(r);
}
var Jl = {
  utimesMillis: Bd,
  utimesMillisSync: jd
};
const dn = Yt, ye = le, Hd = jo;
function qd(e, t, n) {
  const r = n.dereference ? (i) => dn.stat(i, { bigint: !0 }) : (i) => dn.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function Gd(e, t, n) {
  let r;
  const i = n.dereference ? (a) => dn.statSync(a, { bigint: !0 }) : (a) => dn.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: r };
}
function Wd(e, t, n, r, i) {
  Hd.callbackify(qd)(e, t, r, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (rr(s, l)) {
        const p = ye.basename(e), c = ye.basename(t);
        return n === "move" && p !== c && p.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && Wo(e, t) ? i(new Error(li(e, t, n))) : i(null, { srcStat: s, destStat: l });
  });
}
function Vd(e, t, n, r) {
  const { srcStat: i, destStat: o } = Gd(e, t, r);
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
  if (i.isDirectory() && Wo(e, t))
    throw new Error(li(e, t, n));
  return { srcStat: i, destStat: o };
}
function Ql(e, t, n, r, i) {
  const o = ye.resolve(ye.dirname(e)), a = ye.resolve(ye.dirname(n));
  if (a === o || a === ye.parse(a).root) return i();
  dn.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : rr(t, l) ? i(new Error(li(e, n, r))) : Ql(e, t, a, r, i));
}
function Zl(e, t, n, r) {
  const i = ye.resolve(ye.dirname(e)), o = ye.resolve(ye.dirname(n));
  if (o === i || o === ye.parse(o).root) return;
  let a;
  try {
    a = dn.statSync(o, { bigint: !0 });
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
function Wo(e, t) {
  const n = ye.resolve(e).split(ye.sep).filter((i) => i), r = ye.resolve(t).split(ye.sep).filter((i) => i);
  return n.reduce((i, o, a) => i && r[a] === o, !0);
}
function li(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var gn = {
  checkPaths: Wd,
  checkPathsSync: Vd,
  checkParentPaths: Ql,
  checkParentPathsSync: Zl,
  isSrcSubdir: Wo,
  areIdentical: rr
};
const Le = $e, Bn = le, Yd = ot.mkdirs, zd = zt.pathExists, Xd = Jl.utimesMillis, jn = gn;
function Kd(e, t, n, r) {
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
  zd(o, (a, s) => {
    if (a) return i(a);
    if (s) return Yr(e, t, n, r, i);
    Yd(o, (l) => l ? i(l) : Yr(e, t, n, r, i));
  });
}
function ec(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((a) => a ? e(t, n, r, i, o) : o(), (a) => o(a));
}
function Jd(e, t, n, r, i) {
  return r.filter ? ec(Yr, e, t, n, r, i) : Yr(e, t, n, r, i);
}
function Yr(e, t, n, r, i) {
  (r.dereference ? Le.stat : Le.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? ih(s, e, t, n, r, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? Qd(s, e, t, n, r, i) : s.isSymbolicLink() ? sh(e, t, n, r, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Qd(e, t, n, r, i, o) {
  return t ? Zd(e, n, r, i, o) : tc(e, n, r, i, o);
}
function Zd(e, t, n, r, i) {
  if (r.overwrite)
    Le.unlink(n, (o) => o ? i(o) : tc(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function tc(e, t, n, r, i) {
  Le.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? eh(e.mode, t, n, i) : ci(n, e.mode, i));
}
function eh(e, t, n, r) {
  return th(e) ? nh(n, e, (i) => i ? r(i) : Ya(e, t, n, r)) : Ya(e, t, n, r);
}
function th(e) {
  return (e & 128) === 0;
}
function nh(e, t, n) {
  return ci(e, t | 128, n);
}
function Ya(e, t, n, r) {
  rh(t, n, (i) => i ? r(i) : ci(n, e, r));
}
function ci(e, t, n) {
  return Le.chmod(e, t, n);
}
function rh(e, t, n) {
  Le.stat(e, (r, i) => r ? n(r) : Xd(t, i.atime, i.mtime, n));
}
function ih(e, t, n, r, i, o) {
  return t ? nc(n, r, i, o) : oh(e.mode, n, r, i, o);
}
function oh(e, t, n, r, i) {
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
  return o ? ah(e, o, t, n, r, i) : i();
}
function ah(e, t, n, r, i, o) {
  const a = Bn.join(n, t), s = Bn.join(r, t);
  jn.checkPaths(a, s, "copy", i, (l, p) => {
    if (l) return o(l);
    const { destStat: c } = p;
    Jd(c, a, s, i, (f) => f ? o(f) : rc(e, n, r, i, o));
  });
}
function sh(e, t, n, r, i) {
  Le.readlink(t, (o, a) => {
    if (o) return i(o);
    if (r.dereference && (a = Bn.resolve(process.cwd(), a)), e)
      Le.readlink(n, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? Le.symlink(a, n, i) : i(s) : (r.dereference && (l = Bn.resolve(process.cwd(), l)), jn.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && jn.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : lh(a, n, i)));
    else
      return Le.symlink(a, n, i);
  });
}
function lh(e, t, n) {
  Le.unlink(t, (r) => r ? n(r) : Le.symlink(e, t, n));
}
var ch = Kd;
const Ce = $e, Hn = le, uh = ot.mkdirsSync, fh = Jl.utimesMillisSync, qn = gn;
function dh(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = qn.checkPathsSync(e, t, "copy", n);
  return qn.checkParentPathsSync(e, r, t, "copy"), hh(i, e, t, n);
}
function hh(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = Hn.dirname(n);
  return Ce.existsSync(i) || uh(i), ic(e, t, n, r);
}
function ph(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return ic(e, t, n, r);
}
function ic(e, t, n, r) {
  const o = (r.dereference ? Ce.statSync : Ce.lstatSync)(t);
  if (o.isDirectory()) return _h(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return mh(o, e, t, n, r);
  if (o.isSymbolicLink()) return Sh(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function mh(e, t, n, r, i) {
  return t ? gh(e, n, r, i) : oc(e, n, r, i);
}
function gh(e, t, n, r) {
  if (r.overwrite)
    return Ce.unlinkSync(n), oc(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function oc(e, t, n, r) {
  return Ce.copyFileSync(t, n), r.preserveTimestamps && wh(e.mode, t, n), Vo(n, e.mode);
}
function wh(e, t, n) {
  return yh(e) && Eh(n, e), vh(t, n);
}
function yh(e) {
  return (e & 128) === 0;
}
function Eh(e, t) {
  return Vo(e, t | 128);
}
function Vo(e, t) {
  return Ce.chmodSync(e, t);
}
function vh(e, t) {
  const n = Ce.statSync(e);
  return fh(t, n.atime, n.mtime);
}
function _h(e, t, n, r, i) {
  return t ? ac(n, r, i) : Ah(e.mode, n, r, i);
}
function Ah(e, t, n, r) {
  return Ce.mkdirSync(n), ac(t, n, r), Vo(n, e);
}
function ac(e, t, n) {
  Ce.readdirSync(e).forEach((r) => Th(r, e, t, n));
}
function Th(e, t, n, r) {
  const i = Hn.join(t, e), o = Hn.join(n, e), { destStat: a } = qn.checkPathsSync(i, o, "copy", r);
  return ph(a, i, o, r);
}
function Sh(e, t, n, r) {
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
    return Ch(i, n);
  } else
    return Ce.symlinkSync(i, n);
}
function Ch(e, t) {
  return Ce.unlinkSync(t), Ce.symlinkSync(e, t);
}
var bh = dh;
const Ph = De.fromCallback;
var Yo = {
  copy: Ph(ch),
  copySync: bh
};
const za = $e, sc = le, Z = jl, Gn = process.platform === "win32";
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
function zo(e, t, n) {
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
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Oh(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function Oh(e, t, n) {
  Z(e), Z(t), Z(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((s) => {
      zo(sc.join(e, s), t, (l) => {
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
      Rh(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function Rh(e, t) {
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
var Ih = zo;
zo.sync = cc;
const zr = $e, Nh = De.fromCallback, uc = Ih;
function Dh(e, t) {
  if (zr.rm) return zr.rm(e, { recursive: !0, force: !0 }, t);
  uc(e, t);
}
function $h(e) {
  if (zr.rmSync) return zr.rmSync(e, { recursive: !0, force: !0 });
  uc.sync(e);
}
var ui = {
  remove: Nh(Dh),
  removeSync: $h
};
const Fh = De.fromPromise, fc = Yt, dc = le, hc = ot, pc = ui, Qa = Fh(async function(t) {
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
var xh = {
  emptyDirSync: Za,
  emptydirSync: Za,
  emptyDir: Qa,
  emptydir: Qa
};
const Lh = De.fromCallback, mc = le, wt = $e, gc = ot;
function Uh(e, t) {
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
function kh(e) {
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
var Mh = {
  createFile: Lh(Uh),
  createFileSync: kh
};
const Bh = De.fromCallback, wc = le, gt = $e, yc = ot, jh = zt.pathExists, { areIdentical: Ec } = gn;
function Hh(e, t, n) {
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
      jh(l, (p, c) => {
        if (p) return n(p);
        if (c) return r(e, t);
        yc.mkdirs(l, (f) => {
          if (f) return n(f);
          r(e, t);
        });
      });
    });
  });
}
function qh(e, t) {
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
var Gh = {
  createLink: Bh(Hh),
  createLinkSync: qh
};
const yt = le, Ln = $e, Wh = zt.pathExists;
function Vh(e, t, n) {
  if (yt.isAbsolute(e))
    return Ln.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = yt.dirname(t), i = yt.join(r, e);
    return Wh(i, (o, a) => o ? n(o) : a ? n(null, {
      toCwd: i,
      toDst: e
    }) : Ln.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), n(s)) : n(null, {
      toCwd: e,
      toDst: yt.relative(r, e)
    })));
  }
}
function Yh(e, t) {
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
var zh = {
  symlinkPaths: Vh,
  symlinkPathsSync: Yh
};
const vc = $e;
function Xh(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  vc.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function Kh(e, t) {
  let n;
  if (t) return t;
  try {
    n = vc.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var Jh = {
  symlinkType: Xh,
  symlinkTypeSync: Kh
};
const Qh = De.fromCallback, _c = le, ze = Yt, Ac = ot, Zh = Ac.mkdirs, ep = Ac.mkdirsSync, Tc = zh, tp = Tc.symlinkPaths, np = Tc.symlinkPathsSync, Sc = Jh, rp = Sc.symlinkType, ip = Sc.symlinkTypeSync, op = zt.pathExists, { areIdentical: Cc } = gn;
function ap(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, ze.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      ze.stat(e),
      ze.stat(t)
    ]).then(([a, s]) => {
      if (Cc(a, s)) return r(null);
      es(e, t, n, r);
    }) : es(e, t, n, r);
  });
}
function es(e, t, n, r) {
  tp(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, rp(o.toCwd, n, (a, s) => {
      if (a) return r(a);
      const l = _c.dirname(t);
      op(l, (p, c) => {
        if (p) return r(p);
        if (c) return ze.symlink(e, t, s, r);
        Zh(l, (f) => {
          if (f) return r(f);
          ze.symlink(e, t, s, r);
        });
      });
    });
  });
}
function sp(e, t, n) {
  let r;
  try {
    r = ze.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const s = ze.statSync(e), l = ze.statSync(t);
    if (Cc(s, l)) return;
  }
  const i = np(e, t);
  e = i.toDst, n = ip(i.toCwd, n);
  const o = _c.dirname(t);
  return ze.existsSync(o) || ep(o), ze.symlinkSync(e, t, n);
}
var lp = {
  createSymlink: Qh(ap),
  createSymlinkSync: sp
};
const { createFile: ts, createFileSync: ns } = Mh, { createLink: rs, createLinkSync: is } = Gh, { createSymlink: os, createSymlinkSync: as } = lp;
var cp = {
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
function up(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "";
  return JSON.stringify(e, r, i).replace(/\n/g, t) + o;
}
function fp(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Xo = { stringify: up, stripBom: fp };
let hn;
try {
  hn = $e;
} catch {
  hn = Ct;
}
const fi = De, { stringify: bc, stripBom: Pc } = Xo;
async function dp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || hn, r = "throws" in t ? t.throws : !0;
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
const hp = fi.fromPromise(dp);
function pp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || hn, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = Pc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function mp(e, t, n = {}) {
  const r = n.fs || hn, i = bc(t, n);
  await fi.fromCallback(r.writeFile)(e, i, n);
}
const gp = fi.fromPromise(mp);
function wp(e, t, n = {}) {
  const r = n.fs || hn, i = bc(t, n);
  return r.writeFileSync(e, i, n);
}
var yp = {
  readFile: hp,
  readFileSync: pp,
  writeFile: gp,
  writeFileSync: wp
};
const Pr = yp;
var Ep = {
  // jsonfile exports
  readJson: Pr.readFile,
  readJsonSync: Pr.readFileSync,
  writeJson: Pr.writeFile,
  writeJsonSync: Pr.writeFileSync
};
const vp = De.fromCallback, Un = $e, Oc = le, Rc = ot, _p = zt.pathExists;
function Ap(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = Oc.dirname(e);
  _p(i, (o, a) => {
    if (o) return r(o);
    if (a) return Un.writeFile(e, t, n, r);
    Rc.mkdirs(i, (s) => {
      if (s) return r(s);
      Un.writeFile(e, t, n, r);
    });
  });
}
function Tp(e, ...t) {
  const n = Oc.dirname(e);
  if (Un.existsSync(n))
    return Un.writeFileSync(e, ...t);
  Rc.mkdirsSync(n), Un.writeFileSync(e, ...t);
}
var Ko = {
  outputFile: vp(Ap),
  outputFileSync: Tp
};
const { stringify: Sp } = Xo, { outputFile: Cp } = Ko;
async function bp(e, t, n = {}) {
  const r = Sp(t, n);
  await Cp(e, r, n);
}
var Pp = bp;
const { stringify: Op } = Xo, { outputFileSync: Rp } = Ko;
function Ip(e, t, n) {
  const r = Op(t, n);
  Rp(e, r, n);
}
var Np = Ip;
const Dp = De.fromPromise, Ne = Ep;
Ne.outputJson = Dp(Pp);
Ne.outputJsonSync = Np;
Ne.outputJSON = Ne.outputJson;
Ne.outputJSONSync = Ne.outputJsonSync;
Ne.writeJSON = Ne.writeJson;
Ne.writeJSONSync = Ne.writeJsonSync;
Ne.readJSON = Ne.readJson;
Ne.readJSONSync = Ne.readJsonSync;
var $p = Ne;
const Fp = $e, So = le, xp = Yo.copy, Ic = ui.remove, Lp = ot.mkdirp, Up = zt.pathExists, ss = gn;
function kp(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  ss.checkPaths(e, t, "move", n, (o, a) => {
    if (o) return r(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    ss.checkParentPaths(e, s, t, "move", (p) => {
      if (p) return r(p);
      if (Mp(t)) return ls(e, t, i, l, r);
      Lp(So.dirname(t), (c) => c ? r(c) : ls(e, t, i, l, r));
    });
  });
}
function Mp(e) {
  const t = So.dirname(e);
  return So.parse(t).root === t;
}
function ls(e, t, n, r, i) {
  if (r) return qi(e, t, n, i);
  if (n)
    return Ic(t, (o) => o ? i(o) : qi(e, t, n, i));
  Up(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : qi(e, t, n, i));
}
function qi(e, t, n, r) {
  Fp.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : Bp(e, t, n, r) : r());
}
function Bp(e, t, n, r) {
  xp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : Ic(e, r));
}
var jp = kp;
const Nc = $e, Co = le, Hp = Yo.copySync, Dc = ui.removeSync, qp = ot.mkdirpSync, cs = gn;
function Gp(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = cs.checkPathsSync(e, t, "move", n);
  return cs.checkParentPathsSync(e, i, t, "move"), Wp(t) || qp(Co.dirname(t)), Vp(e, t, r, o);
}
function Wp(e) {
  const t = Co.dirname(e);
  return Co.parse(t).root === t;
}
function Vp(e, t, n, r) {
  if (r) return Gi(e, t, n);
  if (n)
    return Dc(t), Gi(e, t, n);
  if (Nc.existsSync(t)) throw new Error("dest already exists.");
  return Gi(e, t, n);
}
function Gi(e, t, n) {
  try {
    Nc.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return Yp(e, t, n);
  }
}
function Yp(e, t, n) {
  return Hp(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), Dc(e);
}
var zp = Gp;
const Xp = De.fromCallback;
var Kp = {
  move: Xp(jp),
  moveSync: zp
}, Pt = {
  // Export promiseified graceful-fs:
  ...Yt,
  // Export extra methods:
  ...Yo,
  ...xh,
  ...cp,
  ...$p,
  ...ot,
  ...Kp,
  ...Ko,
  ...zt,
  ...ui
}, Xt = {}, vt = {}, me = {}, _t = {};
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.CancellationError = _t.CancellationToken = void 0;
const Jp = Hl;
class Qp extends Jp.EventEmitter {
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
      return Promise.reject(new bo());
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
          o(new bo());
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
_t.CancellationToken = Qp;
class bo extends Error {
  constructor() {
    super("cancelled");
  }
}
_t.CancellationError = bo;
var wn = {};
Object.defineProperty(wn, "__esModule", { value: !0 });
wn.newError = Zp;
function Zp(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var Ie = {}, Po = { exports: {} }, Or = { exports: {} }, Wi, us;
function em() {
  if (us) return Wi;
  us = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  Wi = function(c, f) {
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
        var d = parseFloat(f[1]), m = (f[2] || "ms").toLowerCase();
        switch (m) {
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
    return f >= r ? p(c, f, r, "day") : f >= n ? p(c, f, n, "hour") : f >= t ? p(c, f, t, "minute") : f >= e ? p(c, f, e, "second") : c + " ms";
  }
  function p(c, f, d, m) {
    var E = f >= d * 1.5;
    return Math.round(c / d) + " " + m + (E ? "s" : "");
  }
  return Wi;
}
var Vi, fs;
function $c() {
  if (fs) return Vi;
  fs = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = p, r.disable = s, r.enable = o, r.enabled = l, r.humanize = em(), r.destroy = c, Object.keys(t).forEach((f) => {
      r[f] = t[f];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(f) {
      let d = 0;
      for (let m = 0; m < f.length; m++)
        d = (d << 5) - d + f.charCodeAt(m), d |= 0;
      return r.colors[Math.abs(d) % r.colors.length];
    }
    r.selectColor = n;
    function r(f) {
      let d, m = null, E, y;
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
            const V = S[re];
            X = w.call(T, V), S.splice(re, 1), re--;
          }
          return X;
        }), r.formatArgs.call(T, S), (T.log || r.log).apply(T, S);
      }
      return A.namespace = f, A.useColors = r.useColors(), A.color = r.selectColor(f), A.extend = i, A.destroy = r.destroy, Object.defineProperty(A, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => m !== null ? m : (E !== r.namespaces && (E = r.namespaces, y = r.enabled(f)), y),
        set: (S) => {
          m = S;
        }
      }), typeof r.init == "function" && r.init(A), A;
    }
    function i(f, d) {
      const m = r(this.namespace + (typeof d > "u" ? ":" : d) + f);
      return m.log = this.log, m;
    }
    function o(f) {
      r.save(f), r.namespaces = f, r.names = [], r.skips = [];
      const d = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const m of d)
        m[0] === "-" ? r.skips.push(m.slice(1)) : r.names.push(m);
    }
    function a(f, d) {
      let m = 0, E = 0, y = -1, A = 0;
      for (; m < f.length; )
        if (E < d.length && (d[E] === f[m] || d[E] === "*"))
          d[E] === "*" ? (y = E, A = m, E++) : (m++, E++);
        else if (y !== -1)
          E = y + 1, A++, m = A;
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
    function p(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return Vi = e, Vi;
}
var ds;
function tm() {
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
      const p = "color: " + this.color;
      l.splice(1, 0, p, "color: inherit");
      let c = 0, f = 0;
      l[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (c++, d === "%c" && (f = c));
      }), l.splice(f, 0, p);
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
      } catch (p) {
        return "[UnexpectedJSONParseError]: " + p.message;
      }
    };
  }(Or, Or.exports)), Or.exports;
}
var Rr = { exports: {} }, Yi, hs;
function nm() {
  return hs || (hs = 1, Yi = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), Yi;
}
var zi, ps;
function rm() {
  if (ps) return zi;
  ps = 1;
  const e = si, t = ql, n = nm(), { env: r } = process;
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
  function a(l, p) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (l && !p && i === void 0)
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
    const p = a(l, l && l.isTTY);
    return o(p);
  }
  return zi = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, zi;
}
var ms;
function im() {
  return ms || (ms = 1, function(e, t) {
    const n = ql, r = jo;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = p, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = rm();
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
    t.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, m) => {
      const E = m.substring(6).toLowerCase().replace(/_([a-z])/g, (A, S) => S.toUpperCase());
      let y = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(y) ? y = !0 : /^(no|off|false|disabled)$/i.test(y) ? y = !1 : y === "null" ? y = null : y = Number(y), d[E] = y, d;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(d) {
      const { namespace: m, useColors: E } = this;
      if (E) {
        const y = this.color, A = "\x1B[3" + (y < 8 ? y : "8;5;" + y), S = `  ${A};1m${m} \x1B[0m`;
        d[0] = S + d[0].split(`
`).join(`
` + S), d.push(A + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = a() + m + " " + d[0];
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
    function p() {
      return process.env.DEBUG;
    }
    function c(d) {
      d.inspectOpts = {};
      const m = Object.keys(t.inspectOpts);
      for (let E = 0; E < m.length; E++)
        d.inspectOpts[m[E]] = t.inspectOpts[m[E]];
    }
    e.exports = $c()(t);
    const { formatters: f } = e.exports;
    f.o = function(d) {
      return this.inspectOpts.colors = this.useColors, r.inspect(d, this.inspectOpts).split(`
`).map((m) => m.trim()).join(" ");
    }, f.O = function(d) {
      return this.inspectOpts.colors = this.useColors, r.inspect(d, this.inspectOpts);
    };
  }(Rr, Rr.exports)), Rr.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Po.exports = tm() : Po.exports = im();
var om = Po.exports, ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.ProgressCallbackTransform = void 0;
const am = tr;
class sm extends am.Transform {
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
ir.ProgressCallbackTransform = sm;
Object.defineProperty(Ie, "__esModule", { value: !0 });
Ie.DigestTransform = Ie.HttpExecutor = Ie.HttpError = void 0;
Ie.createHttpError = Ro;
Ie.parseJson = mm;
Ie.configureRequestOptionsFromUrl = xc;
Ie.configureRequestUrl = Qo;
Ie.safeGetHeader = fn;
Ie.configureRequestOptions = Xr;
Ie.safeStringifyJson = Kr;
const lm = nr, cm = om, um = Ct, fm = tr, Oo = bt, dm = _t, gs = wn, hm = ir, xt = (0, cm.default)("electron-builder");
function Ro(e, t = null) {
  return new Jo(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Kr(e.headers), t);
}
const pm = /* @__PURE__ */ new Map([
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
class Jo extends Error {
  constructor(t, n = `HTTP error: ${pm.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Ie.HttpError = Jo;
function mm(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class on {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new dm.CancellationToken(), r) {
    Xr(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      xt(i);
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
    return xt.enabled && xt(`Request: ${Kr(t)}`), n.createPromise((o, a, s) => {
      const l = this.createRequest(t, (p) => {
        try {
          this.handleResponse(p, t, n, o, a, i, r);
        } catch (c) {
          a(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, a, t.timeout), this.addRedirectHandlers(l, t, a, i, (p) => {
        this.doApiRequest(p, n, r, i).then(o).catch(a);
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
    if (xt.enabled && xt(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Kr(n)}`), t.statusCode === 404) {
      o(Ro(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const p = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = p >= 300 && p < 400, f = fn(t, "location");
    if (c && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(on.prepareRedirectUrlOptions(f, n), r, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let d = "";
    t.on("error", o), t.on("data", (m) => d += m), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const m = fn(t, "content-type"), E = m != null && (Array.isArray(m) ? m.find((y) => y.includes("json")) != null : m.includes("json"));
          o(Ro(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${E ? JSON.stringify(JSON.parse(d)) : d}
          `));
        } else
          i(d.length === 0 ? null : d);
      } catch (m) {
        o(m);
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
      Qo(t, s), Xr(s), this.doDownload(s, {
        destination: null,
        options: n,
        onCancel: o,
        callback: (l) => {
          l == null ? r(Buffer.concat(a)) : i(l);
        },
        responseHandler: (l, p) => {
          let c = 0;
          l.on("data", (f) => {
            if (c += f.length, c > 524288e3) {
              p(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(f);
          }), l.on("end", () => {
            p(null);
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
      const a = fn(o, "location");
      if (a != null) {
        r < this.maxRedirects ? this.doDownload(on.prepareRedirectUrlOptions(a, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? wm(n, o) : n.responseHandler(o, n.callback);
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
      const o = on.reconstructOriginalUrl(n), a = Fc(t, n);
      on.isCrossOriginRedirect(o, a) && (xt.enabled && xt(`Given the cross-origin redirect (from ${o.host} to ${a.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return r;
  }
  static reconstructOriginalUrl(t) {
    const n = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const r = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new Oo.URL(`${n}//${r}${i}${o}`);
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
        if (r < n && (i instanceof Jo && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Ie.HttpExecutor = on;
function Fc(e, t) {
  try {
    return new Oo.URL(e);
  } catch {
    const n = t.hostname, r = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${r}//${n}${i}`;
    return new Oo.URL(e, o);
  }
}
function xc(e, t) {
  const n = Xr(t), r = Fc(e, t);
  return Qo(r, n), n;
}
function Qo(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Io extends fm.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, lm.createHash)(n);
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
Ie.DigestTransform = Io;
function gm(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function fn(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function wm(e, t) {
  if (!gm(fn(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const a = fn(t, "content-length");
    a != null && n.push(new hm.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new Io(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new Io(e.options.sha2, "sha256", "hex"));
  const i = (0, um.createWriteStream)(e.destination);
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
class ym {
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
di.MemoLazy = ym;
function Lc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => Lc(e[a], t[a]));
  }
  return e === t;
}
var or = {};
Object.defineProperty(or, "__esModule", { value: !0 });
or.githubUrl = Em;
or.githubTagPrefix = vm;
or.getS3LikeProviderBaseUrl = _m;
function Em(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function vm(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function _m(e) {
  const t = e.provider;
  if (t === "s3")
    return Am(e);
  if (t === "spaces")
    return Tm(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Am(e) {
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
function Tm(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Uc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
Zo.retry = kc;
const Sm = _t;
async function kc(e, t) {
  var n;
  const { retries: r, interval: i, backoff: o = 0, attempt: a = 0, shouldRetry: s, cancellationToken: l = new Sm.CancellationToken() } = t;
  try {
    return await e();
  } catch (p) {
    if (await Promise.resolve((n = s == null ? void 0 : s(p)) !== null && n !== void 0 ? n : !0) && r > 0 && !l.cancelled)
      return await new Promise((c) => setTimeout(c, i + o * a)), await kc(e, { ...t, retries: r - 1, attempt: a + 1 });
    throw p;
  }
}
var ea = {};
Object.defineProperty(ea, "__esModule", { value: !0 });
ea.parseDn = Cm;
function Cm(e) {
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
var pn = {};
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.nil = pn.UUID = void 0;
const Mc = nr, Bc = wn, bm = "options.name must be either a string or a Buffer", ws = (0, Mc.randomBytes)(16);
ws[0] = ws[0] | 1;
const Wr = {}, z = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Wr[t] = e, z[e] = t;
}
class Wt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = Wt.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return Pm(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = Om(this.binary)), this.ascii;
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
pn.UUID = Wt;
Wt.OID = Wt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
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
function Pm(e, t, n, r, i = kn.ASCII) {
  const o = (0, Mc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Bc.newError)(bm, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case kn.BINARY:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = s;
      break;
    case kn.OBJECT:
      s[6] = s[6] & 15 | n, s[8] = s[8] & 63 | 128, l = new Wt(s);
      break;
    default:
      l = z[s[0]] + z[s[1]] + z[s[2]] + z[s[3]] + "-" + z[s[4]] + z[s[5]] + "-" + z[s[6] & 15 | n] + z[s[7]] + "-" + z[s[8] & 63 | 128] + z[s[9]] + "-" + z[s[10]] + z[s[11]] + z[s[12]] + z[s[13]] + z[s[14]] + z[s[15]];
      break;
  }
  return l;
}
function Om(e) {
  return z[e[0]] + z[e[1]] + z[e[2]] + z[e[3]] + "-" + z[e[4]] + z[e[5]] + "-" + z[e[6]] + z[e[7]] + "-" + z[e[8]] + z[e[9]] + "-" + z[e[10]] + z[e[11]] + z[e[12]] + z[e[13]] + z[e[14]] + z[e[15]];
}
pn.nil = new Wt("00000000-0000-0000-0000-000000000000");
var ar = {}, jc = {};
(function(e) {
  (function(t) {
    t.parser = function(h, u) {
      return new r(h, u);
    }, t.SAXParser = r, t.SAXStream = c, t.createStream = p, t.MAX_BUFFER_LENGTH = 64 * 1024;
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
      o(C), C.q = C.c = "", C.bufferCheckPosition = t.MAX_BUFFER_LENGTH, C.opt = u || {}, C.opt.lowercase = C.opt.lowercase || C.opt.lowercasetags, C.looseCase = C.opt.lowercase ? "toLowerCase" : "toUpperCase", C.tags = [], C.closed = C.closedRoot = C.sawRoot = !1, C.tag = C.error = null, C.strict = !!h, C.noscript = !!(h || C.opt.noscript), C.state = w.BEGIN, C.strictEntities = C.opt.strictEntities, C.ENTITIES = C.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), C.attribList = [], C.opt.xmlns && (C.ns = Object.create(y)), C.opt.unquotedAttributeValues === void 0 && (C.opt.unquotedAttributeValues = !h), C.trackPosition = C.opt.position !== !1, C.trackPosition && (C.position = C.line = C.column = 0), q(C, "onready");
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
      var ce = t.MAX_BUFFER_LENGTH - C;
      h.bufferCheckPosition = ce + h.position;
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
    function p(h, u) {
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
    var f = "[CDATA[", d = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", E = "http://www.w3.org/2000/xmlns/", y = { xml: m, xmlns: E }, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, S = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, T = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, D = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function x(h) {
      return h === " " || h === `
` || h === "\r" || h === "	";
    }
    function re(h) {
      return h === '"' || h === "'";
    }
    function fe(h) {
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
    for (var V in t.STATE)
      t.STATE[t.STATE[V]] = V;
    w = t.STATE;
    function q(h, u, C) {
      h[u] && h[u](C);
    }
    function j(h, u, C) {
      h.textNode && J(h), q(h, u, C);
    }
    function J(h) {
      h.textNode = R(h.opt, h.textNode), h.textNode && q(h, "ontext", h.textNode), h.textNode = "";
    }
    function R(h, u) {
      return h.trim && (u = u.trim()), h.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function P(h, u) {
      return J(h), h.trackPosition && (u += `
Line: ` + h.line + `
Column: ` + h.column + `
Char: ` + h.c), u = new Error(u), h.error = u, q(h, "onerror", u), h;
    }
    function N(h) {
      return h.sawRoot && !h.closedRoot && b(h, "Unclosed root tag"), h.state !== w.BEGIN && h.state !== w.BEGIN_WHITESPACE && h.state !== w.TEXT && P(h, "Unexpected end"), J(h), h.c = "", h.closed = !0, q(h, "onend"), r.call(h, h.strict, h.opt), h;
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
          if (_ === "xml" && h.attribValue !== m)
            b(
              h,
              "xml: prefix must be bound to " + m + `
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
        for (var te = 0, ce = h.attribList.length; te < ce; te++) {
          var Ee = h.attribList[te], Te = Ee[0], ut = Ee[1], pe = I(Te, !0), Ge = pe.prefix, Di = pe.local, mr = Ge === "" ? "" : C.ns[Ge] || "", _n = {
            name: Te,
            value: ut,
            prefix: Ge,
            local: Di,
            uri: mr
          };
          Ge && Ge !== "xmlns" && !mr && (b(
            h,
            "Unbound namespace prefix: " + JSON.stringify(Ge)
          ), _n.uri = Ge), h.tag.attributes[Te] = _n, j(h, "onattribute", _n);
        }
        h.attribList.length = 0;
      }
      h.tag.isSelfClosing = !!u, h.sawRoot = !0, h.tags.push(h.tag), j(h, "onopentag", h.tag), u || (!h.noscript && h.tagName.toLowerCase() === "script" ? h.state = w.SCRIPT : h.state = w.TEXT, h.tag = null, h.tagName = ""), h.attribName = h.attribValue = "", h.attribList.length = 0;
    }
    function G(h) {
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
        var ce = h.tag = h.tags.pop();
        h.tagName = h.tag.name, j(h, "onclosetag", h.tagName);
        var Ee = {};
        for (var Te in ce.ns)
          Ee[Te] = ce.ns[Te];
        var ut = h.tags[h.tags.length - 1] || h;
        h.opt.xmlns && ce.ns !== ut.ns && Object.keys(ce.ns).forEach(function(pe) {
          var Ge = ce.ns[pe];
          j(h, "onclosenamespace", { prefix: pe, uri: Ge });
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
    function k(h, u) {
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
      for (var C = 0, _ = ""; _ = k(h, C++), u.c = _, !!_; )
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
                _ = k(h, C++), _ && u.trackPosition && (u.position++, _ === `
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
              _ = k(h, C++), _ && u.trackPosition && (u.position++, _ === `
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
            _ === ">" ? (Y(u, !0), G(u)) : (b(
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
            if (!fe(_)) {
              _ === "&" ? u.state = w.ATTRIB_VALUE_ENTITY_U : u.attribValue += _;
              continue;
            }
            M(u), _ === ">" ? Y(u) : u.state = w.ATTRIB;
            continue;
          case w.CLOSE_TAG:
            if (u.tagName)
              _ === ">" ? G(u) : X(S, _) ? u.tagName += _ : u.script ? (u.script += "</" + u.tagName + _, u.tagName = "", u.state = w.SCRIPT) : (x(_) || b(u, "Invalid tagname in closing tag"), u.state = w.CLOSE_TAG_SAW_WHITE);
            else {
              if (x(_))
                continue;
              ke(A, _) ? u.script ? (u.script += "</" + _, u.state = w.SCRIPT) : b(u, "Invalid tagname in closing tag.") : u.tagName = _;
            }
            continue;
          case w.CLOSE_TAG_SAW_WHITE:
            if (x(_))
              continue;
            _ === ">" ? G(u) : b(u, "Invalid characters in closing tag");
            continue;
          case w.TEXT_ENTITY:
          case w.ATTRIB_VALUE_ENTITY_Q:
          case w.ATTRIB_VALUE_ENTITY_U:
            var ce, Ee;
            switch (u.state) {
              case w.TEXT_ENTITY:
                ce = w.TEXT, Ee = "textNode";
                break;
              case w.ATTRIB_VALUE_ENTITY_Q:
                ce = w.ATTRIB_VALUE_QUOTED, Ee = "attribValue";
                break;
              case w.ATTRIB_VALUE_ENTITY_U:
                ce = w.ATTRIB_VALUE_UNQUOTED, Ee = "attribValue";
                break;
            }
            if (_ === ";") {
              var Te = Q(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Te) ? (u.entity = "", u.state = ce, u.write(Te)) : (u[Ee] += Te, u.entity = "", u.state = ce);
            } else X(u.entity.length ? D : T, _) ? u.entity += _ : (b(u, "Invalid character in entity name"), u[Ee] += "&" + u.entity + _, u.entity = "", u.state = ce);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var h = String.fromCharCode, u = Math.floor, C = function() {
        var _ = 16384, K = [], te, ce, Ee = -1, Te = arguments.length;
        if (!Te)
          return "";
        for (var ut = ""; ++Ee < Te; ) {
          var pe = Number(arguments[Ee]);
          if (!isFinite(pe) || // `NaN`, `+Infinity`, or `-Infinity`
          pe < 0 || // not a valid Unicode code point
          pe > 1114111 || // not a valid Unicode code point
          u(pe) !== pe)
            throw RangeError("Invalid code point: " + pe);
          pe <= 65535 ? K.push(pe) : (pe -= 65536, te = (pe >> 10) + 55296, ce = pe % 1024 + 56320, K.push(te, ce)), (Ee + 1 === Te || K.length > _) && (ut += h.apply(null, K), K.length = 0);
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
ar.parseXml = Dm;
const Rm = jc, Ir = wn;
class Hc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Ir.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Nm(t))
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
const Im = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Nm(e) {
  return Im.test(e);
}
function Es(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function Dm(e) {
  let t = null;
  const n = Rm.parser(!0, {}), r = [];
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
  var n = wn;
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
  var s = Zo;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = ea;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var p = pn;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return p.UUID;
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
var Ae = {}, ta = {}, Ke = {};
function qc(e) {
  return typeof e > "u" || e === null;
}
function $m(e) {
  return typeof e == "object" && e !== null;
}
function Fm(e) {
  return Array.isArray(e) ? e : qc(e) ? [] : [e];
}
function xm(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function Lm(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function Um(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ke.isNothing = qc;
Ke.isObject = $m;
Ke.toArray = Fm;
Ke.repeat = Lm;
Ke.isNegativeZero = Um;
Ke.extend = xm;
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
function Xi(e, t, n, r, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return r - t > s && (o = " ... ", t = r - s + o.length), n - r > s && (a = " ...", n = r + s - a.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + a,
    pos: r - t + o.length
    // relative position
  };
}
function Ki(e, t) {
  return Fn.repeat(" ", t - e.length) + e;
}
function km(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, a = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = r.length - 2);
  a < 0 && (a = r.length - 1);
  var s = "", l, p, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    p = Xi(
      e.buffer,
      r[a - l],
      i[a - l],
      e.position - (r[a] - r[a - l]),
      f
    ), s = Fn.repeat(" ", t.indent) + Ki((e.line - l + 1).toString(), c) + " | " + p.str + `
` + s;
  for (p = Xi(e.buffer, r[a], i[a], e.position, f), s += Fn.repeat(" ", t.indent) + Ki((e.line + 1).toString(), c) + " | " + p.str + `
`, s += Fn.repeat("-", t.indent + c + 3 + p.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    p = Xi(
      e.buffer,
      r[a + l],
      i[a + l],
      e.position - (r[a] - r[a + l]),
      f
    ), s += Fn.repeat(" ", t.indent) + Ki((e.line + l + 1).toString(), c) + " | " + p.str + `
`;
  return s.replace(/\n$/, "");
}
var Mm = km, vs = sr, Bm = [
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
], jm = [
  "scalar",
  "sequence",
  "mapping"
];
function Hm(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function qm(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (Bm.indexOf(n) === -1)
      throw new vs('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Hm(t.styleAliases || null), jm.indexOf(this.kind) === -1)
    throw new vs('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Fe = qm, Pn = sr, Ji = Fe;
function _s(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, a) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = a);
    }), n[i] = r;
  }), n;
}
function Gm() {
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
function No(e) {
  return this.extend(e);
}
No.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof Ji)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new Pn("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof Ji))
      throw new Pn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Pn("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Pn("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof Ji))
      throw new Pn("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(No.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = _s(i, "implicit"), i.compiledExplicit = _s(i, "explicit"), i.compiledTypeMap = Gm(i.compiledImplicit, i.compiledExplicit), i;
};
var Wc = No, Wm = Fe, Vc = new Wm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Vm = Fe, Yc = new Vm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Ym = Fe, zc = new Ym("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), zm = Wc, Xc = new zm({
  explicit: [
    Vc,
    Yc,
    zc
  ]
}), Xm = Fe;
function Km(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Jm() {
  return null;
}
function Qm(e) {
  return e === null;
}
var Kc = new Xm("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Km,
  construct: Jm,
  predicate: Qm,
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
}), Zm = Fe;
function eg(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function tg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function ng(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Jc = new Zm("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: eg,
  construct: tg,
  predicate: ng,
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
}), rg = Ke, ig = Fe;
function og(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function ag(e) {
  return 48 <= e && e <= 55;
}
function sg(e) {
  return 48 <= e && e <= 57;
}
function lg(e) {
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
          if (!og(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!ag(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!sg(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function cg(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function ug(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !rg.isNegativeZero(e);
}
var Qc = new ig("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: lg,
  construct: cg,
  predicate: ug,
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
}), Zc = Ke, fg = Fe, dg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function hg(e) {
  return !(e === null || !dg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function pg(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var mg = /^[-+]?[0-9]+e/;
function gg(e, t) {
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
  return n = e.toString(10), mg.test(n) ? n.replace("e", ".e") : n;
}
function wg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Zc.isNegativeZero(e));
}
var eu = new fg("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: hg,
  construct: pg,
  predicate: wg,
  represent: gg,
  defaultStyle: "lowercase"
}), tu = Xc.extend({
  implicit: [
    Kc,
    Jc,
    Qc,
    eu
  ]
}), nu = tu, yg = Fe, ru = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), iu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function Eg(e) {
  return e === null ? !1 : ru.exec(e) !== null || iu.exec(e) !== null;
}
function vg(e) {
  var t, n, r, i, o, a, s, l = 0, p = null, c, f, d;
  if (t = ru.exec(e), t === null && (t = iu.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), p = (c * 60 + f) * 6e4, t[9] === "-" && (p = -p)), d = new Date(Date.UTC(n, r, i, o, a, s, l)), p && d.setTime(d.getTime() - p), d;
}
function _g(e) {
  return e.toISOString();
}
var ou = new yg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: Eg,
  construct: vg,
  instanceOf: Date,
  represent: _g
}), Ag = Fe;
function Tg(e) {
  return e === "<<" || e === null;
}
var au = new Ag("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Tg
}), Sg = Fe, na = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Cg(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = na;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function bg(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = na, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : n === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : n === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function Pg(e) {
  var t = "", n = 0, r, i, o = e.length, a = na;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]) : i === 2 ? (t += a[n >> 10 & 63], t += a[n >> 4 & 63], t += a[n << 2 & 63], t += a[64]) : i === 1 && (t += a[n >> 2 & 63], t += a[n << 4 & 63], t += a[64], t += a[64]), t;
}
function Og(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var su = new Sg("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Cg,
  construct: bg,
  predicate: Og,
  represent: Pg
}), Rg = Fe, Ig = Object.prototype.hasOwnProperty, Ng = Object.prototype.toString;
function Dg(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, a, s = e;
  for (n = 0, r = s.length; n < r; n += 1) {
    if (i = s[n], a = !1, Ng.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Ig.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function $g(e) {
  return e !== null ? e : [];
}
var lu = new Rg("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Dg,
  construct: $g
}), Fg = Fe, xg = Object.prototype.toString;
function Lg(e) {
  if (e === null) return !0;
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1) {
    if (r = a[t], xg.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function Ug(e) {
  if (e === null) return [];
  var t, n, r, i, o, a = e;
  for (o = new Array(a.length), t = 0, n = a.length; t < n; t += 1)
    r = a[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var cu = new Fg("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Lg,
  construct: Ug
}), kg = Fe, Mg = Object.prototype.hasOwnProperty;
function Bg(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (Mg.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function jg(e) {
  return e !== null ? e : {};
}
var uu = new kg("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Bg,
  construct: jg
}), ra = nu.extend({
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
}), kt = Ke, fu = sr, Hg = Mm, qg = ra, At = Object.prototype.hasOwnProperty, Jr = 1, du = 2, hu = 3, Qr = 4, Qi = 1, Gg = 2, As = 3, Wg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Vg = /[\x85\u2028\u2029]/, Yg = /[,\[\]\{\}]/, pu = /^(?:!|!!|![a-z\-]+!)$/i, mu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Ts(e) {
  return Object.prototype.toString.call(e);
}
function it(e) {
  return e === 10 || e === 13;
}
function qt(e) {
  return e === 9 || e === 32;
}
function Ue(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function an(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function zg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Xg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Kg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Ss(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Jg(e) {
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
for (var Zt = 0; Zt < 256; Zt++)
  wu[Zt] = Ss(Zt) ? 1 : 0, yu[Zt] = Ss(Zt);
function Qg(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || qg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
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
  return n.snippet = Hg(n), new fu(t, n);
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
    else Wg.test(s) && L(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function bs(e, t, n, r) {
  var i, o, a, s;
  for (kt.isObject(n) || L(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), a = 0, s = i.length; a < s; a += 1)
    o = i[a], At.call(t, o) || (gu(t, o, n[o]), r[o] = !0);
}
function sn(e, t, n, r, i, o, a, s, l) {
  var p, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), p = 0, c = i.length; p < c; p += 1)
      Array.isArray(i[p]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && Ts(i[p]) === "[object Object]" && (i[p] = "[object Object]");
  if (typeof i == "object" && Ts(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (p = 0, c = o.length; p < c; p += 1)
        bs(e, t, o[p], n);
    else
      bs(e, t, o, n);
  else
    !e.json && !At.call(n, i) && At.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, L(e, "duplicated mapping key")), gu(t, i, o), delete n[i];
  return t;
}
function ia(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : L(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function de(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; qt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (it(i))
      for (ia(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
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
function oa(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += kt.repeat(`
`, t - 1));
}
function Zg(e, t, n) {
  var r, i, o, a, s, l, p, c, f = e.kind, d = e.result, m;
  if (m = e.input.charCodeAt(e.position), Ue(m) || an(m) || m === 35 || m === 38 || m === 42 || m === 33 || m === 124 || m === 62 || m === 39 || m === 34 || m === 37 || m === 64 || m === 96 || (m === 63 || m === 45) && (i = e.input.charCodeAt(e.position + 1), Ue(i) || n && an(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; m !== 0; ) {
    if (m === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ue(i) || n && an(i))
        break;
    } else if (m === 35) {
      if (r = e.input.charCodeAt(e.position - 1), Ue(r))
        break;
    } else {
      if (e.position === e.lineStart && hi(e) || n && an(m))
        break;
      if (it(m))
        if (l = e.line, p = e.lineStart, c = e.lineIndent, de(e, !1, -1), e.lineIndent >= t) {
          s = !0, m = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = p, e.lineIndent = c;
          break;
        }
    }
    s && (Et(e, o, a, !1), oa(e, e.line - l), o = a = e.position, s = !1), qt(m) || (a = e.position + 1), m = e.input.charCodeAt(++e.position);
  }
  return Et(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = d, !1);
}
function e0(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (Et(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else it(n) ? (Et(e, r, i, !0), oa(e, de(e, !1, t)), r = i = e.position) : e.position === e.lineStart && hi(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function t0(e, t) {
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
      else if ((a = Xg(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = zg(s)) >= 0 ? o = (o << 4) + a : L(e, "expected hexadecimal character");
        e.result += Jg(o), e.position++;
      } else
        L(e, "unknown escape sequence");
      n = r = e.position;
    } else it(s) ? (Et(e, n, r, !0), oa(e, de(e, !1, t)), n = r = e.position) : e.position === e.lineStart && hi(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function n0(e, t) {
  var n = !0, r, i, o, a = e.tag, s, l = e.anchor, p, c, f, d, m, E = /* @__PURE__ */ Object.create(null), y, A, S, T;
  if (T = e.input.charCodeAt(e.position), T === 91)
    c = 93, m = !1, s = [];
  else if (T === 123)
    c = 125, m = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), T = e.input.charCodeAt(++e.position); T !== 0; ) {
    if (de(e, !0, t), T = e.input.charCodeAt(e.position), T === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = m ? "mapping" : "sequence", e.result = s, !0;
    n ? T === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), A = y = S = null, f = d = !1, T === 63 && (p = e.input.charCodeAt(e.position + 1), Ue(p) && (f = d = !0, e.position++, de(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, mn(e, t, Jr, !1, !0), A = e.tag, y = e.result, de(e, !0, t), T = e.input.charCodeAt(e.position), (d || e.line === r) && T === 58 && (f = !0, T = e.input.charCodeAt(++e.position), de(e, !0, t), mn(e, t, Jr, !1, !0), S = e.result), m ? sn(e, s, E, A, y, S, r, i, o) : f ? s.push(sn(e, null, E, A, y, S, r, i, o)) : s.push(y), de(e, !0, t), T = e.input.charCodeAt(e.position), T === 44 ? (n = !0, T = e.input.charCodeAt(++e.position)) : n = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function r0(e, t) {
  var n, r, i = Qi, o = !1, a = !1, s = t, l = 0, p = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    r = !1;
  else if (f === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      Qi === i ? i = f === 43 ? As : Gg : L(e, "repeat of a chomping mode identifier");
    else if ((c = Kg(f)) >= 0)
      c === 0 ? L(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? L(e, "repeat of an indentation width identifier") : (s = t + c - 1, a = !0);
    else
      break;
  if (qt(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (qt(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!it(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (ia(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), it(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === As ? e.result += kt.repeat(`
`, o ? 1 + l : l) : i === Qi && o && (e.result += `
`);
      break;
    }
    for (r ? qt(f) ? (p = !0, e.result += kt.repeat(`
`, o ? 1 + l : l)) : p ? (p = !1, e.result += kt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += kt.repeat(`
`, l) : e.result += kt.repeat(`
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
    if (n = e.line, mn(e, t, hu, !1, !0), o.push(e.result), de(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && l !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function i0(e, t, n) {
  var r, i, o, a, s, l, p = e.tag, c = e.anchor, f = {}, d = /* @__PURE__ */ Object.create(null), m = null, E = null, y = null, A = !1, S = !1, T;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), T = e.input.charCodeAt(e.position); T !== 0; ) {
    if (!A && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (T === 63 || T === 58) && Ue(r))
      T === 63 ? (A && (sn(e, f, d, m, E, null, a, s, l), m = E = y = null), S = !0, A = !0, i = !0) : A ? (A = !1, i = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, T = r;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !mn(e, n, du, !1, !0))
        break;
      if (e.line === o) {
        for (T = e.input.charCodeAt(e.position); qt(T); )
          T = e.input.charCodeAt(++e.position);
        if (T === 58)
          T = e.input.charCodeAt(++e.position), Ue(T) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), A && (sn(e, f, d, m, E, null, a, s, l), m = E = y = null), S = !0, A = !1, i = !1, m = e.tag, E = e.result;
        else if (S)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = p, e.anchor = c, !0;
      } else if (S)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = p, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (A && (a = e.line, s = e.lineStart, l = e.position), mn(e, t, Qr, !0, i) && (A ? E = e.result : y = e.result), A || (sn(e, f, d, m, E, y, a, s, l), m = E = y = null), de(e, !0, -1), T = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && T !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return A && sn(e, f, d, m, E, null, a, s, l), S && (e.tag = p, e.anchor = c, e.kind = "mapping", e.result = f), S;
}
function o0(e) {
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
    o = e.input.slice(t, e.position), Yg.test(o) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !mu.test(o) && L(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    L(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : At.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : L(e, 'undeclared tag handle "' + i + '"'), !0;
}
function a0(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && L(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ue(n) && !an(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function s0(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ue(r) && !an(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), At.call(e.anchorMap, n) || L(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], de(e, !0, -1), !0;
}
function mn(e, t, n, r, i) {
  var o, a, s, l = 1, p = !1, c = !1, f, d, m, E, y, A;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = Qr === n || hu === n, r && de(e, !0, -1) && (p = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; o0(e) || a0(e); )
      de(e, !0, -1) ? (p = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = p || i), (l === 1 || Qr === n) && (Jr === n || du === n ? y = t : y = t + 1, A = e.position - e.lineStart, l === 1 ? s && (Ps(e, A) || i0(e, A, y)) || n0(e, y) ? c = !0 : (a && r0(e, y) || e0(e, y) || t0(e, y) ? c = !0 : s0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : Zg(e, y, Jr === n) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && Ps(e, A))), e.tag === null)
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
      for (E = null, m = e.typeMap.multi[e.kind || "fallback"], f = 0, d = m.length; f < d; f += 1)
        if (e.tag.slice(0, m[f].tag.length) === m[f].tag) {
          E = m[f];
          break;
        }
    E || L(e, "unknown tag !<" + e.tag + ">"), e.result !== null && E.kind !== e.kind && L(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + E.kind + '", not "' + e.kind + '"'), E.resolve(e.result, e.tag) ? (e.result = E.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : L(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function l0(e) {
  var t = e.position, n, r, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (de(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), n = e.position; a !== 0 && !Ue(a); )
      a = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && L(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; qt(a); )
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
    a !== 0 && ia(e), At.call(Cs, r) ? Cs[r](e, r, i) : Zr(e, 'unknown document directive "' + r + '"');
  }
  if (de(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, de(e, !0, -1)) : o && L(e, "directives end mark is expected"), mn(e, e.lineIndent - 1, Qr, !1, !0), de(e, !0, -1), e.checkLineBreaks && Vg.test(e.input.slice(t, e.position)) && Zr(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && hi(e)) {
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
  var n = new Qg(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, L(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    l0(n);
  return n.documents;
}
function c0(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = vu(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function u0(e, t) {
  var n = vu(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new fu("expected a single document in the stream, but found more");
  }
}
ta.loadAll = c0;
ta.load = u0;
var _u = {}, pi = Ke, lr = sr, f0 = ra, Au = Object.prototype.toString, Tu = Object.prototype.hasOwnProperty, aa = 65279, d0 = 9, Vn = 10, h0 = 13, p0 = 32, m0 = 33, g0 = 34, Do = 35, w0 = 37, y0 = 38, E0 = 39, v0 = 42, Su = 44, _0 = 45, ei = 58, A0 = 61, T0 = 62, S0 = 63, C0 = 64, Cu = 91, bu = 93, b0 = 96, Pu = 123, P0 = 124, Ou = 125, be = {};
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
var O0 = [
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
], R0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function I0(e, t) {
  var n, r, i, o, a, s, l;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    a = r[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Tu.call(l.styleAliases, s) && (s = l.styleAliases[s]), n[a] = s;
  return n;
}
function N0(e) {
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
var D0 = 1, Yn = 2;
function $0(e) {
  this.schema = e.schema || f0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = pi.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = I0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Yn : D0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Os(e, t) {
  for (var n = pi.repeat(" ", t), r = 0, i = -1, o = "", a, s = e.length; r < s; )
    i = e.indexOf(`
`, r), i === -1 ? (a = e.slice(r), r = s) : (a = e.slice(r, i + 1), r = i + 1), a.length && a !== `
` && (o += n), o += a;
  return o;
}
function $o(e, t) {
  return `
` + pi.repeat(" ", e.indent * t);
}
function F0(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function ti(e) {
  return e === p0 || e === d0;
}
function zn(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== aa || 65536 <= e && e <= 1114111;
}
function Rs(e) {
  return zn(e) && e !== aa && e !== h0 && e !== Vn;
}
function Is(e, t, n) {
  var r = Rs(e), i = r && !ti(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== Su && e !== Cu && e !== bu && e !== Pu && e !== Ou) && e !== Do && !(t === ei && !i) || Rs(t) && !ti(t) && e === Do || t === ei && i
  );
}
function x0(e) {
  return zn(e) && e !== aa && !ti(e) && e !== _0 && e !== S0 && e !== ei && e !== Su && e !== Cu && e !== bu && e !== Pu && e !== Ou && e !== Do && e !== y0 && e !== v0 && e !== m0 && e !== P0 && e !== A0 && e !== T0 && e !== E0 && e !== g0 && e !== w0 && e !== C0 && e !== b0;
}
function L0(e) {
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
var Iu = 1, Fo = 2, Nu = 3, Du = 4, rn = 5;
function U0(e, t, n, r, i, o, a, s) {
  var l, p = 0, c = null, f = !1, d = !1, m = r !== -1, E = -1, y = x0(xn(e, 0)) && L0(xn(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; p >= 65536 ? l += 2 : l++) {
      if (p = xn(e, l), !zn(p))
        return rn;
      y = y && Is(p, c, s), c = p;
    }
  else {
    for (l = 0; l < e.length; p >= 65536 ? l += 2 : l++) {
      if (p = xn(e, l), p === Vn)
        f = !0, m && (d = d || // Foldable line = too long, and not more-indented.
        l - E - 1 > r && e[E + 1] !== " ", E = l);
      else if (!zn(p))
        return rn;
      y = y && Is(p, c, s), c = p;
    }
    d = d || m && l - E - 1 > r && e[E + 1] !== " ";
  }
  return !f && !d ? y && !a && !i(e) ? Iu : o === Yn ? rn : Fo : n > 9 && Ru(e) ? rn : a ? o === Yn ? rn : Fo : d ? Du : Nu;
}
function k0(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Yn ? '""' : "''";
    if (!e.noCompatMode && (O0.indexOf(t) !== -1 || R0.test(t)))
      return e.quotingType === Yn ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = r || e.flowLevel > -1 && n >= e.flowLevel;
    function l(p) {
      return F0(e, p);
    }
    switch (U0(
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
      case Fo:
        return "'" + t.replace(/'/g, "''") + "'";
      case Nu:
        return "|" + Ns(t, e.indent) + Ds(Os(t, o));
      case Du:
        return ">" + Ns(t, e.indent) + Ds(Os(M0(t, a), o));
      case rn:
        return '"' + B0(t) + '"';
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
function M0(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var p = e.indexOf(`
`);
    return p = p !== -1 ? p : e.length, n.lastIndex = p, $s(e.slice(0, p), t);
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
function B0(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = xn(e, i), r = be[n], !r && zn(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || N0(n);
  return t;
}
function j0(e, t, n) {
  var r = "", i = e.tag, o, a, s;
  for (o = 0, a = n.length; o < a; o += 1)
    s = n[o], e.replacer && (s = e.replacer.call(n, String(o), s)), (ct(e, t, s, !1, !1) || typeof s > "u" && ct(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function Fs(e, t, n, r) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = n.length; a < s; a += 1)
    l = n[a], e.replacer && (l = e.replacer.call(n, String(a), l)), (ct(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && ct(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += $o(e, t)), e.dump && Vn === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function H0(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), a, s, l, p, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", r !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], p = n[l], e.replacer && (p = e.replacer.call(n, l, p)), ct(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), ct(e, t, p, !1, !1) && (c += e.dump, r += c));
  e.tag = i, e.dump = "{" + r + "}";
}
function q0(e, t, n, r) {
  var i = "", o = e.tag, a = Object.keys(n), s, l, p, c, f, d;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new lr("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    d = "", (!r || i !== "") && (d += $o(e, t)), p = a[s], c = n[p], e.replacer && (c = e.replacer.call(n, p, c)), ct(e, t + 1, p, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Vn === e.dump.charCodeAt(0) ? d += "?" : d += "? "), d += e.dump, f && (d += $o(e, t)), ct(e, t + 1, c, !0, f) && (e.dump && Vn === e.dump.charCodeAt(0) ? d += ":" : d += ": ", d += e.dump, i += d));
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
  var s = Au.call(e.dump), l = r, p;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, d;
  if (c && (f = e.duplicates.indexOf(n), d = f !== -1), (e.tag !== null && e.tag !== "?" || d || e.indent !== 2 && t > 0) && (i = !1), d && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && d && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (q0(e, t, e.dump, i), d && (e.dump = "&ref_" + f + e.dump)) : (H0(e, t, e.dump), d && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? Fs(e, t - 1, e.dump, i) : Fs(e, t, e.dump, i), d && (e.dump = "&ref_" + f + e.dump)) : (j0(e, t, e.dump), d && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && k0(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new lr("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (p = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? p = "!" + p : p.slice(0, 18) === "tag:yaml.org,2002:" ? p = "!!" + p.slice(18) : p = "!<" + p + ">", e.dump = p + " " + e.dump);
  }
  return !0;
}
function G0(e, t) {
  var n = [], r = [], i, o;
  for (xo(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function xo(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        xo(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        xo(e[r[i]], t, n);
}
function W0(e, t) {
  t = t || {};
  var n = new $0(t);
  n.noRefs || G0(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), ct(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
_u.dump = W0;
var $u = ta, V0 = _u;
function sa(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Ae.Type = Fe;
Ae.Schema = Wc;
Ae.FAILSAFE_SCHEMA = Xc;
Ae.JSON_SCHEMA = tu;
Ae.CORE_SCHEMA = nu;
Ae.DEFAULT_SCHEMA = ra;
Ae.load = $u.load;
Ae.loadAll = $u.loadAll;
Ae.dump = V0.dump;
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
Ae.safeLoad = sa("safeLoad", "load");
Ae.safeLoadAll = sa("safeLoadAll", "loadAll");
Ae.safeDump = sa("safeDump", "dump");
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.Lazy = void 0;
class Y0 {
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
mi.Lazy = Y0;
var Lo = { exports: {} };
const z0 = "2.0.0", Fu = 256, X0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, K0 = 16, J0 = Fu - 6, Q0 = [
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
  MAX_SAFE_COMPONENT_LENGTH: K0,
  MAX_SAFE_BUILD_LENGTH: J0,
  MAX_SAFE_INTEGER: X0,
  RELEASE_TYPES: Q0,
  SEMVER_SPEC_VERSION: z0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Z0 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var wi = Z0;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = gi, o = wi;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], p = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const d = "[a-zA-Z0-9-]", m = [
    ["\\s", 1],
    ["\\d", i],
    [d, r]
  ], E = (A) => {
    for (const [S, T] of m)
      A = A.split(`${S}*`).join(`${S}{0,${T}}`).split(`${S}+`).join(`${S}{1,${T}}`);
    return A;
  }, y = (A, S, T) => {
    const D = E(S), x = f++;
    o(A, x, S), c[A] = x, l[x] = S, p[x] = D, a[x] = new RegExp(S, T ? "g" : void 0), s[x] = new RegExp(D, T ? "g" : void 0);
  };
  y("NUMERICIDENTIFIER", "0|[1-9]\\d*"), y("NUMERICIDENTIFIERLOOSE", "\\d+"), y("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), y("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), y("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), y("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), y("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), y("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), y("BUILDIDENTIFIER", `${d}+`), y("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), y("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), y("FULL", `^${l[c.FULLPLAIN]}$`), y("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), y("LOOSE", `^${l[c.LOOSEPLAIN]}$`), y("GTLT", "((?:<|>)?=?)"), y("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), y("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), y("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), y("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), y("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), y("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), y("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), y("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), y("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), y("COERCERTL", l[c.COERCE], !0), y("COERCERTLFULL", l[c.COERCEFULL], !0), y("LONETILDE", "(?:~>?)"), y("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", y("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), y("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), y("LONECARET", "(?:\\^)"), y("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", y("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), y("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), y("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), y("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), y("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", y("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), y("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), y("STAR", "(<|>)?=?\\s*\\*"), y("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), y("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Lo, Lo.exports);
var cr = Lo.exports;
const ew = Object.freeze({ loose: !0 }), tw = Object.freeze({}), nw = (e) => e ? typeof e != "object" ? ew : e : tw;
var la = nw;
const Ls = /^[0-9]+$/, xu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = Ls.test(e), r = Ls.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, rw = (e, t) => xu(t, e);
var Lu = {
  compareIdentifiers: xu,
  rcompareIdentifiers: rw
};
const Nr = wi, { MAX_LENGTH: Us, MAX_SAFE_INTEGER: Dr } = gi, { safeRe: $r, t: Fr } = cr, iw = la, { compareIdentifiers: Zi } = Lu;
let ow = class nt {
  constructor(t, n) {
    if (n = iw(n), t instanceof nt) {
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
      return Zi(r, i);
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
      return Zi(r, i);
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
          r === !1 && (o = [n]), Zi(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var xe = ow;
const ks = xe, aw = (e, t, n = !1) => {
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
var yn = aw;
const sw = yn, lw = (e, t) => {
  const n = sw(e, t);
  return n ? n.version : null;
};
var cw = lw;
const uw = yn, fw = (e, t) => {
  const n = uw(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var dw = fw;
const Ms = xe, hw = (e, t, n, r, i) => {
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
var pw = hw;
const Bs = yn, mw = (e, t) => {
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
var gw = mw;
const ww = xe, yw = (e, t) => new ww(e, t).major;
var Ew = yw;
const vw = xe, _w = (e, t) => new vw(e, t).minor;
var Aw = _w;
const Tw = xe, Sw = (e, t) => new Tw(e, t).patch;
var Cw = Sw;
const bw = yn, Pw = (e, t) => {
  const n = bw(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var Ow = Pw;
const js = xe, Rw = (e, t, n) => new js(e, n).compare(new js(t, n));
var Je = Rw;
const Iw = Je, Nw = (e, t, n) => Iw(t, e, n);
var Dw = Nw;
const $w = Je, Fw = (e, t) => $w(e, t, !0);
var xw = Fw;
const Hs = xe, Lw = (e, t, n) => {
  const r = new Hs(e, n), i = new Hs(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var ca = Lw;
const Uw = ca, kw = (e, t) => e.sort((n, r) => Uw(n, r, t));
var Mw = kw;
const Bw = ca, jw = (e, t) => e.sort((n, r) => Bw(r, n, t));
var Hw = jw;
const qw = Je, Gw = (e, t, n) => qw(e, t, n) > 0;
var yi = Gw;
const Ww = Je, Vw = (e, t, n) => Ww(e, t, n) < 0;
var ua = Vw;
const Yw = Je, zw = (e, t, n) => Yw(e, t, n) === 0;
var Uu = zw;
const Xw = Je, Kw = (e, t, n) => Xw(e, t, n) !== 0;
var ku = Kw;
const Jw = Je, Qw = (e, t, n) => Jw(e, t, n) >= 0;
var fa = Qw;
const Zw = Je, ey = (e, t, n) => Zw(e, t, n) <= 0;
var da = ey;
const ty = Uu, ny = ku, ry = yi, iy = fa, oy = ua, ay = da, sy = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return ty(e, n, r);
    case "!=":
      return ny(e, n, r);
    case ">":
      return ry(e, n, r);
    case ">=":
      return iy(e, n, r);
    case "<":
      return oy(e, n, r);
    case "<=":
      return ay(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Mu = sy;
const ly = xe, cy = yn, { safeRe: xr, t: Lr } = cr, uy = (e, t) => {
  if (e instanceof ly)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? xr[Lr.COERCEFULL] : xr[Lr.COERCE]);
  else {
    const l = t.includePrerelease ? xr[Lr.COERCERTLFULL] : xr[Lr.COERCERTL];
    let p;
    for (; (p = l.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || p.index + p[0].length !== n.index + n[0].length) && (n = p), l.lastIndex = p.index + p[1].length + p[2].length;
    l.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", a = t.includePrerelease && n[5] ? `-${n[5]}` : "", s = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return cy(`${r}.${i}.${o}${a}${s}`, t);
};
var fy = uy;
class dy {
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
var hy = dy, eo, qs;
function Qe() {
  if (qs) return eo;
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
      const b = ((this.options.includePrerelease && m) | (this.options.loose && E)) + ":" + P, $ = r.get(b);
      if ($)
        return $;
      const I = this.options.loose, M = I ? l[p.HYPHENRANGELOOSE] : l[p.HYPHENRANGE];
      P = P.replace(M, j(this.options.includePrerelease)), a("hyphen replace", P), P = P.replace(l[p.COMPARATORTRIM], c), a("comparator trim", P), P = P.replace(l[p.TILDETRIM], f), a("tilde trim", P), P = P.replace(l[p.CARETTRIM], d), a("caret trim", P);
      let Y = P.split(" ").map((k) => T(k, this.options)).join(" ").split(/\s+/).map((k) => q(k, this.options));
      I && (Y = Y.filter((k) => (a("loose invalid filter", k, this.options), !!k.match(l[p.COMPARATORLOOSE])))), a("range list", Y);
      const G = /* @__PURE__ */ new Map(), Q = Y.map((k) => new o(k, this.options));
      for (const k of Q) {
        if (y(k))
          return [k];
        G.set(k.value, k);
      }
      G.size > 1 && G.has("") && G.delete("");
      const ge = [...G.values()];
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
  eo = t;
  const n = hy, r = new n(), i = la, o = Ei(), a = wi, s = xe, {
    safeRe: l,
    t: p,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: d
  } = cr, { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: E } = gi, y = (R) => R.value === "<0.0.0-0", A = (R) => R.value === "", S = (R, P) => {
    let N = !0;
    const b = R.slice();
    let $ = b.pop();
    for (; N && b.length; )
      N = b.every((I) => $.intersects(I, P)), $ = b.pop();
    return N;
  }, T = (R, P) => (R = R.replace(l[p.BUILD], ""), a("comp", R, P), R = fe(R, P), a("caret", R), R = x(R, P), a("tildes", R), R = ke(R, P), a("xrange", R), R = V(R, P), a("stars", R), R), D = (R) => !R || R.toLowerCase() === "x" || R === "*", x = (R, P) => R.trim().split(/\s+/).map((N) => re(N, P)).join(" "), re = (R, P) => {
    const N = P.loose ? l[p.TILDELOOSE] : l[p.TILDE];
    return R.replace(N, (b, $, I, M, Y) => {
      a("tilde", R, b, $, I, M, Y);
      let G;
      return D($) ? G = "" : D(I) ? G = `>=${$}.0.0 <${+$ + 1}.0.0-0` : D(M) ? G = `>=${$}.${I}.0 <${$}.${+I + 1}.0-0` : Y ? (a("replaceTilde pr", Y), G = `>=${$}.${I}.${M}-${Y} <${$}.${+I + 1}.0-0`) : G = `>=${$}.${I}.${M} <${$}.${+I + 1}.0-0`, a("tilde return", G), G;
    });
  }, fe = (R, P) => R.trim().split(/\s+/).map((N) => X(N, P)).join(" "), X = (R, P) => {
    a("caret", R, P);
    const N = P.loose ? l[p.CARETLOOSE] : l[p.CARET], b = P.includePrerelease ? "-0" : "";
    return R.replace(N, ($, I, M, Y, G) => {
      a("caret", R, $, I, M, Y, G);
      let Q;
      return D(I) ? Q = "" : D(M) ? Q = `>=${I}.0.0${b} <${+I + 1}.0.0-0` : D(Y) ? I === "0" ? Q = `>=${I}.${M}.0${b} <${I}.${+M + 1}.0-0` : Q = `>=${I}.${M}.0${b} <${+I + 1}.0.0-0` : G ? (a("replaceCaret pr", G), I === "0" ? M === "0" ? Q = `>=${I}.${M}.${Y}-${G} <${I}.${M}.${+Y + 1}-0` : Q = `>=${I}.${M}.${Y}-${G} <${I}.${+M + 1}.0-0` : Q = `>=${I}.${M}.${Y}-${G} <${+I + 1}.0.0-0`) : (a("no pr"), I === "0" ? M === "0" ? Q = `>=${I}.${M}.${Y}${b} <${I}.${M}.${+Y + 1}-0` : Q = `>=${I}.${M}.${Y}${b} <${I}.${+M + 1}.0-0` : Q = `>=${I}.${M}.${Y} <${+I + 1}.0.0-0`), a("caret return", Q), Q;
    });
  }, ke = (R, P) => (a("replaceXRanges", R, P), R.split(/\s+/).map((N) => w(N, P)).join(" ")), w = (R, P) => {
    R = R.trim();
    const N = P.loose ? l[p.XRANGELOOSE] : l[p.XRANGE];
    return R.replace(N, (b, $, I, M, Y, G) => {
      a("xRange", R, b, $, I, M, Y, G);
      const Q = D(I), ge = Q || D(M), k = ge || D(Y), et = k;
      return $ === "=" && et && ($ = ""), G = P.includePrerelease ? "-0" : "", Q ? $ === ">" || $ === "<" ? b = "<0.0.0-0" : b = "*" : $ && et ? (ge && (M = 0), Y = 0, $ === ">" ? ($ = ">=", ge ? (I = +I + 1, M = 0, Y = 0) : (M = +M + 1, Y = 0)) : $ === "<=" && ($ = "<", ge ? I = +I + 1 : M = +M + 1), $ === "<" && (G = "-0"), b = `${$ + I}.${M}.${Y}${G}`) : ge ? b = `>=${I}.0.0${G} <${+I + 1}.0.0-0` : k && (b = `>=${I}.${M}.0${G} <${I}.${+M + 1}.0-0`), a("xRange return", b), b;
    });
  }, V = (R, P) => (a("replaceStars", R, P), R.trim().replace(l[p.STAR], "")), q = (R, P) => (a("replaceGTE0", R, P), R.trim().replace(l[P.includePrerelease ? p.GTE0PRE : p.GTE0], "")), j = (R) => (P, N, b, $, I, M, Y, G, Q, ge, k, et) => (D(b) ? N = "" : D($) ? N = `>=${b}.0.0${R ? "-0" : ""}` : D(I) ? N = `>=${b}.${$}.0${R ? "-0" : ""}` : M ? N = `>=${N}` : N = `>=${N}${R ? "-0" : ""}`, D(Q) ? G = "" : D(ge) ? G = `<${+Q + 1}.0.0-0` : D(k) ? G = `<${Q}.${+ge + 1}.0-0` : et ? G = `<=${Q}.${ge}.${k}-${et}` : R ? G = `<${Q}.${ge}.${+k + 1}-0` : G = `<=${G}`, `${N} ${G}`.trim()), J = (R, P, N) => {
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
  return eo;
}
var to, Gs;
function Ei() {
  if (Gs) return to;
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
  to = t;
  const n = la, { safeRe: r, t: i } = cr, o = Mu, a = wi, s = xe, l = Qe();
  return to;
}
const py = Qe(), my = (e, t, n) => {
  try {
    t = new py(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var vi = my;
const gy = Qe(), wy = (e, t) => new gy(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var yy = wy;
const Ey = xe, vy = Qe(), _y = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new vy(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === -1) && (r = a, i = new Ey(r, n));
  }), r;
};
var Ay = _y;
const Ty = xe, Sy = Qe(), Cy = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new Sy(t, n);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!r || i.compare(a) === 1) && (r = a, i = new Ty(r, n));
  }), r;
};
var by = Cy;
const no = xe, Py = Qe(), Ws = yi, Oy = (e, t) => {
  e = new Py(e, t);
  let n = new no("0.0.0");
  if (e.test(n) || (n = new no("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((a) => {
      const s = new no(a.semver.version);
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
var Ry = Oy;
const Iy = Qe(), Ny = (e, t) => {
  try {
    return new Iy(e, t).range || "*";
  } catch {
    return null;
  }
};
var Dy = Ny;
const $y = xe, Bu = Ei(), { ANY: Fy } = Bu, xy = Qe(), Ly = vi, Vs = yi, Ys = ua, Uy = da, ky = fa, My = (e, t, n, r) => {
  e = new $y(e, r), t = new xy(t, r);
  let i, o, a, s, l;
  switch (n) {
    case ">":
      i = Vs, o = Uy, a = Ys, s = ">", l = ">=";
      break;
    case "<":
      i = Ys, o = ky, a = Vs, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Ly(e, t, r))
    return !1;
  for (let p = 0; p < t.set.length; ++p) {
    const c = t.set[p];
    let f = null, d = null;
    if (c.forEach((m) => {
      m.semver === Fy && (m = new Bu(">=0.0.0")), f = f || m, d = d || m, i(m.semver, f.semver, r) ? f = m : a(m.semver, d.semver, r) && (d = m);
    }), f.operator === s || f.operator === l || (!d.operator || d.operator === s) && o(e, d.semver))
      return !1;
    if (d.operator === l && a(e, d.semver))
      return !1;
  }
  return !0;
};
var ha = My;
const By = ha, jy = (e, t, n) => By(e, t, ">", n);
var Hy = jy;
const qy = ha, Gy = (e, t, n) => qy(e, t, "<", n);
var Wy = Gy;
const zs = Qe(), Vy = (e, t, n) => (e = new zs(e, n), t = new zs(t, n), e.intersects(t, n));
var Yy = Vy;
const zy = vi, Xy = Je;
var Ky = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const a = e.sort((c, f) => Xy(c, f, n));
  for (const c of a)
    zy(c, t, n) ? (o = c, i || (i = c)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const s = [];
  for (const [c, f] of r)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), p = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < p.length ? l : t;
};
const Xs = Qe(), pa = Ei(), { ANY: ro } = pa, On = vi, ma = Je, Jy = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new Xs(e, n), t = new Xs(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = Zy(i, o, n);
      if (r = r || a !== null, a)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, Qy = [new pa(">=0.0.0-0")], Ks = [new pa(">=0.0.0")], Zy = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === ro) {
    if (t.length === 1 && t[0].semver === ro)
      return !0;
    n.includePrerelease ? e = Qy : e = Ks;
  }
  if (t.length === 1 && t[0].semver === ro) {
    if (n.includePrerelease)
      return !0;
    t = Ks;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const m of e)
    m.operator === ">" || m.operator === ">=" ? i = Js(i, m, n) : m.operator === "<" || m.operator === "<=" ? o = Qs(o, m, n) : r.add(m.semver);
  if (r.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = ma(i.semver, o.semver, n), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const m of r) {
    if (i && !On(m, String(i), n) || o && !On(m, String(o), n))
      return null;
    for (const E of t)
      if (!On(m, String(E), n))
        return !1;
    return !0;
  }
  let s, l, p, c, f = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, d = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const m of t) {
    if (c = c || m.operator === ">" || m.operator === ">=", p = p || m.operator === "<" || m.operator === "<=", i) {
      if (d && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === d.major && m.semver.minor === d.minor && m.semver.patch === d.patch && (d = !1), m.operator === ">" || m.operator === ">=") {
        if (s = Js(i, m, n), s === m && s !== i)
          return !1;
      } else if (i.operator === ">=" && !On(i.semver, String(m), n))
        return !1;
    }
    if (o) {
      if (f && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === f.major && m.semver.minor === f.minor && m.semver.patch === f.patch && (f = !1), m.operator === "<" || m.operator === "<=") {
        if (l = Qs(o, m, n), l === m && l !== o)
          return !1;
      } else if (o.operator === "<=" && !On(o.semver, String(m), n))
        return !1;
    }
    if (!m.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && p && !o && a !== 0 || o && c && !i && a !== 0 || d || f);
}, Js = (e, t, n) => {
  if (!e)
    return t;
  const r = ma(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Qs = (e, t, n) => {
  if (!e)
    return t;
  const r = ma(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var eE = Jy;
const io = cr, Zs = gi, tE = xe, el = Lu, nE = yn, rE = cw, iE = dw, oE = pw, aE = gw, sE = Ew, lE = Aw, cE = Cw, uE = Ow, fE = Je, dE = Dw, hE = xw, pE = ca, mE = Mw, gE = Hw, wE = yi, yE = ua, EE = Uu, vE = ku, _E = fa, AE = da, TE = Mu, SE = fy, CE = Ei(), bE = Qe(), PE = vi, OE = yy, RE = Ay, IE = by, NE = Ry, DE = Dy, $E = ha, FE = Hy, xE = Wy, LE = Yy, UE = Ky, kE = eE;
var ju = {
  parse: nE,
  valid: rE,
  clean: iE,
  inc: oE,
  diff: aE,
  major: sE,
  minor: lE,
  patch: cE,
  prerelease: uE,
  compare: fE,
  rcompare: dE,
  compareLoose: hE,
  compareBuild: pE,
  sort: mE,
  rsort: gE,
  gt: wE,
  lt: yE,
  eq: EE,
  neq: vE,
  gte: _E,
  lte: AE,
  cmp: TE,
  coerce: SE,
  Comparator: CE,
  Range: bE,
  satisfies: PE,
  toComparators: OE,
  maxSatisfying: RE,
  minSatisfying: IE,
  minVersion: NE,
  validRange: DE,
  outside: $E,
  gtr: FE,
  ltr: xE,
  intersects: LE,
  simplifyRange: UE,
  subset: kE,
  SemVer: tE,
  re: io.re,
  src: io.src,
  tokens: io.t,
  SEMVER_SPEC_VERSION: Zs.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Zs.RELEASE_TYPES,
  compareIdentifiers: el.compareIdentifiers,
  rcompareIdentifiers: el.rcompareIdentifiers
}, ur = {}, ni = { exports: {} };
ni.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", p = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", d = "[object Error]", m = "[object Function]", E = "[object GeneratorFunction]", y = "[object Map]", A = "[object Number]", S = "[object Null]", T = "[object Object]", D = "[object Promise]", x = "[object Proxy]", re = "[object RegExp]", fe = "[object Set]", X = "[object String]", ke = "[object Symbol]", w = "[object Undefined]", V = "[object WeakMap]", q = "[object ArrayBuffer]", j = "[object DataView]", J = "[object Float32Array]", R = "[object Float64Array]", P = "[object Int8Array]", N = "[object Int16Array]", b = "[object Int32Array]", $ = "[object Uint8Array]", I = "[object Uint8ClampedArray]", M = "[object Uint16Array]", Y = "[object Uint32Array]", G = /[\\^$.*+?()[\]{}|]/g, Q = /^\[object .+?Constructor\]$/, ge = /^(?:0|[1-9]\d*)$/, k = {};
  k[J] = k[R] = k[P] = k[N] = k[b] = k[$] = k[I] = k[M] = k[Y] = !0, k[s] = k[l] = k[q] = k[c] = k[j] = k[f] = k[d] = k[m] = k[y] = k[A] = k[T] = k[re] = k[fe] = k[X] = k[V] = !1;
  var et = typeof Re == "object" && Re && Re.Object === Object && Re, h = typeof self == "object" && self && self.Object === Object && self, u = et || h || Function("return this")(), C = t && !t.nodeType && t, _ = C && !0 && e && !e.nodeType && e, K = _ && _.exports === C, te = K && et.process, ce = function() {
    try {
      return te && te.binding && te.binding("util");
    } catch {
    }
  }(), Ee = ce && ce.isTypedArray;
  function Te(g, v) {
    for (var O = -1, F = g == null ? 0 : g.length, ne = 0, W = []; ++O < F; ) {
      var ue = g[O];
      v(ue, O, g) && (W[ne++] = ue);
    }
    return W;
  }
  function ut(g, v) {
    for (var O = -1, F = v.length, ne = g.length; ++O < F; )
      g[ne + O] = v[O];
    return g;
  }
  function pe(g, v) {
    for (var O = -1, F = g == null ? 0 : g.length; ++O < F; )
      if (v(g[O], O, g))
        return !0;
    return !1;
  }
  function Ge(g, v) {
    for (var O = -1, F = Array(g); ++O < g; )
      F[O] = v(O);
    return F;
  }
  function Di(g) {
    return function(v) {
      return g(v);
    };
  }
  function mr(g, v) {
    return g.has(v);
  }
  function _n(g, v) {
    return g == null ? void 0 : g[v];
  }
  function gr(g) {
    var v = -1, O = Array(g.size);
    return g.forEach(function(F, ne) {
      O[++v] = [ne, F];
    }), O;
  }
  function cf(g, v) {
    return function(O) {
      return g(v(O));
    };
  }
  function uf(g) {
    var v = -1, O = Array(g.size);
    return g.forEach(function(F) {
      O[++v] = F;
    }), O;
  }
  var ff = Array.prototype, df = Function.prototype, wr = Object.prototype, $i = u["__core-js_shared__"], Sa = df.toString, tt = wr.hasOwnProperty, Ca = function() {
    var g = /[^.]+$/.exec($i && $i.keys && $i.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), ba = wr.toString, hf = RegExp(
    "^" + Sa.call(tt).replace(G, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Pa = K ? u.Buffer : void 0, yr = u.Symbol, Oa = u.Uint8Array, Ra = wr.propertyIsEnumerable, pf = ff.splice, It = yr ? yr.toStringTag : void 0, Ia = Object.getOwnPropertySymbols, mf = Pa ? Pa.isBuffer : void 0, gf = cf(Object.keys, Object), Fi = Jt(u, "DataView"), An = Jt(u, "Map"), xi = Jt(u, "Promise"), Li = Jt(u, "Set"), Ui = Jt(u, "WeakMap"), Tn = Jt(Object, "create"), wf = $t(Fi), yf = $t(An), Ef = $t(xi), vf = $t(Li), _f = $t(Ui), Na = yr ? yr.prototype : void 0, ki = Na ? Na.valueOf : void 0;
  function Nt(g) {
    var v = -1, O = g == null ? 0 : g.length;
    for (this.clear(); ++v < O; ) {
      var F = g[v];
      this.set(F[0], F[1]);
    }
  }
  function Af() {
    this.__data__ = Tn ? Tn(null) : {}, this.size = 0;
  }
  function Tf(g) {
    var v = this.has(g) && delete this.__data__[g];
    return this.size -= v ? 1 : 0, v;
  }
  function Sf(g) {
    var v = this.__data__;
    if (Tn) {
      var O = v[g];
      return O === r ? void 0 : O;
    }
    return tt.call(v, g) ? v[g] : void 0;
  }
  function Cf(g) {
    var v = this.__data__;
    return Tn ? v[g] !== void 0 : tt.call(v, g);
  }
  function bf(g, v) {
    var O = this.__data__;
    return this.size += this.has(g) ? 0 : 1, O[g] = Tn && v === void 0 ? r : v, this;
  }
  Nt.prototype.clear = Af, Nt.prototype.delete = Tf, Nt.prototype.get = Sf, Nt.prototype.has = Cf, Nt.prototype.set = bf;
  function at(g) {
    var v = -1, O = g == null ? 0 : g.length;
    for (this.clear(); ++v < O; ) {
      var F = g[v];
      this.set(F[0], F[1]);
    }
  }
  function Pf() {
    this.__data__ = [], this.size = 0;
  }
  function Of(g) {
    var v = this.__data__, O = vr(v, g);
    if (O < 0)
      return !1;
    var F = v.length - 1;
    return O == F ? v.pop() : pf.call(v, O, 1), --this.size, !0;
  }
  function Rf(g) {
    var v = this.__data__, O = vr(v, g);
    return O < 0 ? void 0 : v[O][1];
  }
  function If(g) {
    return vr(this.__data__, g) > -1;
  }
  function Nf(g, v) {
    var O = this.__data__, F = vr(O, g);
    return F < 0 ? (++this.size, O.push([g, v])) : O[F][1] = v, this;
  }
  at.prototype.clear = Pf, at.prototype.delete = Of, at.prototype.get = Rf, at.prototype.has = If, at.prototype.set = Nf;
  function Dt(g) {
    var v = -1, O = g == null ? 0 : g.length;
    for (this.clear(); ++v < O; ) {
      var F = g[v];
      this.set(F[0], F[1]);
    }
  }
  function Df() {
    this.size = 0, this.__data__ = {
      hash: new Nt(),
      map: new (An || at)(),
      string: new Nt()
    };
  }
  function $f(g) {
    var v = _r(this, g).delete(g);
    return this.size -= v ? 1 : 0, v;
  }
  function Ff(g) {
    return _r(this, g).get(g);
  }
  function xf(g) {
    return _r(this, g).has(g);
  }
  function Lf(g, v) {
    var O = _r(this, g), F = O.size;
    return O.set(g, v), this.size += O.size == F ? 0 : 1, this;
  }
  Dt.prototype.clear = Df, Dt.prototype.delete = $f, Dt.prototype.get = Ff, Dt.prototype.has = xf, Dt.prototype.set = Lf;
  function Er(g) {
    var v = -1, O = g == null ? 0 : g.length;
    for (this.__data__ = new Dt(); ++v < O; )
      this.add(g[v]);
  }
  function Uf(g) {
    return this.__data__.set(g, r), this;
  }
  function kf(g) {
    return this.__data__.has(g);
  }
  Er.prototype.add = Er.prototype.push = Uf, Er.prototype.has = kf;
  function ft(g) {
    var v = this.__data__ = new at(g);
    this.size = v.size;
  }
  function Mf() {
    this.__data__ = new at(), this.size = 0;
  }
  function Bf(g) {
    var v = this.__data__, O = v.delete(g);
    return this.size = v.size, O;
  }
  function jf(g) {
    return this.__data__.get(g);
  }
  function Hf(g) {
    return this.__data__.has(g);
  }
  function qf(g, v) {
    var O = this.__data__;
    if (O instanceof at) {
      var F = O.__data__;
      if (!An || F.length < n - 1)
        return F.push([g, v]), this.size = ++O.size, this;
      O = this.__data__ = new Dt(F);
    }
    return O.set(g, v), this.size = O.size, this;
  }
  ft.prototype.clear = Mf, ft.prototype.delete = Bf, ft.prototype.get = jf, ft.prototype.has = Hf, ft.prototype.set = qf;
  function Gf(g, v) {
    var O = Ar(g), F = !O && od(g), ne = !O && !F && Mi(g), W = !O && !F && !ne && Ba(g), ue = O || F || ne || W, we = ue ? Ge(g.length, String) : [], ve = we.length;
    for (var ie in g)
      tt.call(g, ie) && !(ue && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ie == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      ne && (ie == "offset" || ie == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      W && (ie == "buffer" || ie == "byteLength" || ie == "byteOffset") || // Skip index properties.
      ed(ie, ve))) && we.push(ie);
    return we;
  }
  function vr(g, v) {
    for (var O = g.length; O--; )
      if (La(g[O][0], v))
        return O;
    return -1;
  }
  function Wf(g, v, O) {
    var F = v(g);
    return Ar(g) ? F : ut(F, O(g));
  }
  function Sn(g) {
    return g == null ? g === void 0 ? w : S : It && It in Object(g) ? Qf(g) : id(g);
  }
  function Da(g) {
    return Cn(g) && Sn(g) == s;
  }
  function $a(g, v, O, F, ne) {
    return g === v ? !0 : g == null || v == null || !Cn(g) && !Cn(v) ? g !== g && v !== v : Vf(g, v, O, F, $a, ne);
  }
  function Vf(g, v, O, F, ne, W) {
    var ue = Ar(g), we = Ar(v), ve = ue ? l : dt(g), ie = we ? l : dt(v);
    ve = ve == s ? T : ve, ie = ie == s ? T : ie;
    var Me = ve == T, We = ie == T, Se = ve == ie;
    if (Se && Mi(g)) {
      if (!Mi(v))
        return !1;
      ue = !0, Me = !1;
    }
    if (Se && !Me)
      return W || (W = new ft()), ue || Ba(g) ? Fa(g, v, O, F, ne, W) : Kf(g, v, ve, O, F, ne, W);
    if (!(O & i)) {
      var je = Me && tt.call(g, "__wrapped__"), He = We && tt.call(v, "__wrapped__");
      if (je || He) {
        var ht = je ? g.value() : g, st = He ? v.value() : v;
        return W || (W = new ft()), ne(ht, st, O, F, W);
      }
    }
    return Se ? (W || (W = new ft()), Jf(g, v, O, F, ne, W)) : !1;
  }
  function Yf(g) {
    if (!Ma(g) || nd(g))
      return !1;
    var v = Ua(g) ? hf : Q;
    return v.test($t(g));
  }
  function zf(g) {
    return Cn(g) && ka(g.length) && !!k[Sn(g)];
  }
  function Xf(g) {
    if (!rd(g))
      return gf(g);
    var v = [];
    for (var O in Object(g))
      tt.call(g, O) && O != "constructor" && v.push(O);
    return v;
  }
  function Fa(g, v, O, F, ne, W) {
    var ue = O & i, we = g.length, ve = v.length;
    if (we != ve && !(ue && ve > we))
      return !1;
    var ie = W.get(g);
    if (ie && W.get(v))
      return ie == v;
    var Me = -1, We = !0, Se = O & o ? new Er() : void 0;
    for (W.set(g, v), W.set(v, g); ++Me < we; ) {
      var je = g[Me], He = v[Me];
      if (F)
        var ht = ue ? F(He, je, Me, v, g, W) : F(je, He, Me, g, v, W);
      if (ht !== void 0) {
        if (ht)
          continue;
        We = !1;
        break;
      }
      if (Se) {
        if (!pe(v, function(st, Ft) {
          if (!mr(Se, Ft) && (je === st || ne(je, st, O, F, W)))
            return Se.push(Ft);
        })) {
          We = !1;
          break;
        }
      } else if (!(je === He || ne(je, He, O, F, W))) {
        We = !1;
        break;
      }
    }
    return W.delete(g), W.delete(v), We;
  }
  function Kf(g, v, O, F, ne, W, ue) {
    switch (O) {
      case j:
        if (g.byteLength != v.byteLength || g.byteOffset != v.byteOffset)
          return !1;
        g = g.buffer, v = v.buffer;
      case q:
        return !(g.byteLength != v.byteLength || !W(new Oa(g), new Oa(v)));
      case c:
      case f:
      case A:
        return La(+g, +v);
      case d:
        return g.name == v.name && g.message == v.message;
      case re:
      case X:
        return g == v + "";
      case y:
        var we = gr;
      case fe:
        var ve = F & i;
        if (we || (we = uf), g.size != v.size && !ve)
          return !1;
        var ie = ue.get(g);
        if (ie)
          return ie == v;
        F |= o, ue.set(g, v);
        var Me = Fa(we(g), we(v), F, ne, W, ue);
        return ue.delete(g), Me;
      case ke:
        if (ki)
          return ki.call(g) == ki.call(v);
    }
    return !1;
  }
  function Jf(g, v, O, F, ne, W) {
    var ue = O & i, we = xa(g), ve = we.length, ie = xa(v), Me = ie.length;
    if (ve != Me && !ue)
      return !1;
    for (var We = ve; We--; ) {
      var Se = we[We];
      if (!(ue ? Se in v : tt.call(v, Se)))
        return !1;
    }
    var je = W.get(g);
    if (je && W.get(v))
      return je == v;
    var He = !0;
    W.set(g, v), W.set(v, g);
    for (var ht = ue; ++We < ve; ) {
      Se = we[We];
      var st = g[Se], Ft = v[Se];
      if (F)
        var ja = ue ? F(Ft, st, Se, v, g, W) : F(st, Ft, Se, g, v, W);
      if (!(ja === void 0 ? st === Ft || ne(st, Ft, O, F, W) : ja)) {
        He = !1;
        break;
      }
      ht || (ht = Se == "constructor");
    }
    if (He && !ht) {
      var Tr = g.constructor, Sr = v.constructor;
      Tr != Sr && "constructor" in g && "constructor" in v && !(typeof Tr == "function" && Tr instanceof Tr && typeof Sr == "function" && Sr instanceof Sr) && (He = !1);
    }
    return W.delete(g), W.delete(v), He;
  }
  function xa(g) {
    return Wf(g, ld, Zf);
  }
  function _r(g, v) {
    var O = g.__data__;
    return td(v) ? O[typeof v == "string" ? "string" : "hash"] : O.map;
  }
  function Jt(g, v) {
    var O = _n(g, v);
    return Yf(O) ? O : void 0;
  }
  function Qf(g) {
    var v = tt.call(g, It), O = g[It];
    try {
      g[It] = void 0;
      var F = !0;
    } catch {
    }
    var ne = ba.call(g);
    return F && (v ? g[It] = O : delete g[It]), ne;
  }
  var Zf = Ia ? function(g) {
    return g == null ? [] : (g = Object(g), Te(Ia(g), function(v) {
      return Ra.call(g, v);
    }));
  } : cd, dt = Sn;
  (Fi && dt(new Fi(new ArrayBuffer(1))) != j || An && dt(new An()) != y || xi && dt(xi.resolve()) != D || Li && dt(new Li()) != fe || Ui && dt(new Ui()) != V) && (dt = function(g) {
    var v = Sn(g), O = v == T ? g.constructor : void 0, F = O ? $t(O) : "";
    if (F)
      switch (F) {
        case wf:
          return j;
        case yf:
          return y;
        case Ef:
          return D;
        case vf:
          return fe;
        case _f:
          return V;
      }
    return v;
  });
  function ed(g, v) {
    return v = v ?? a, !!v && (typeof g == "number" || ge.test(g)) && g > -1 && g % 1 == 0 && g < v;
  }
  function td(g) {
    var v = typeof g;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? g !== "__proto__" : g === null;
  }
  function nd(g) {
    return !!Ca && Ca in g;
  }
  function rd(g) {
    var v = g && g.constructor, O = typeof v == "function" && v.prototype || wr;
    return g === O;
  }
  function id(g) {
    return ba.call(g);
  }
  function $t(g) {
    if (g != null) {
      try {
        return Sa.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function La(g, v) {
    return g === v || g !== g && v !== v;
  }
  var od = Da(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Da : function(g) {
    return Cn(g) && tt.call(g, "callee") && !Ra.call(g, "callee");
  }, Ar = Array.isArray;
  function ad(g) {
    return g != null && ka(g.length) && !Ua(g);
  }
  var Mi = mf || ud;
  function sd(g, v) {
    return $a(g, v);
  }
  function Ua(g) {
    if (!Ma(g))
      return !1;
    var v = Sn(g);
    return v == m || v == E || v == p || v == x;
  }
  function ka(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= a;
  }
  function Ma(g) {
    var v = typeof g;
    return g != null && (v == "object" || v == "function");
  }
  function Cn(g) {
    return g != null && typeof g == "object";
  }
  var Ba = Ee ? Di(Ee) : zf;
  function ld(g) {
    return ad(g) ? Gf(g) : Xf(g);
  }
  function cd() {
    return [];
  }
  function ud() {
    return !1;
  }
  e.exports = sd;
})(ni, ni.exports);
var ME = ni.exports;
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.DownloadedUpdateHelper = void 0;
ur.createTempUpdateFile = GE;
const BE = nr, jE = Ct, tl = ME, Lt = Pt, Mn = le;
class HE {
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
      return tl(this.versionInfo, n) && tl(this.fileInfo.info, r.info) && await (0, Lt.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, a) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, Lt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Lt.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, Lt.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, Lt.readJson)(r);
    } catch (p) {
      let c = "No cached update info available";
      return p.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${p.message})`), n.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Mn.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Lt.pathExists)(s))
      return n.info("Cached update file doesn't exist"), null;
    const l = await qE(s);
    return t.info.sha512 !== l ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Mn.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
ur.DownloadedUpdateHelper = HE;
function qE(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const a = (0, BE.createHash)(t);
    a.on("error", o).setEncoding(n), (0, jE.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function GE(e, t, n) {
  let r = 0, i = Mn.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Lt.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${a}`), i = Mn.join(t, `${r++}-${e}`);
    }
  return i;
}
var _i = {}, ga = {};
Object.defineProperty(ga, "__esModule", { value: !0 });
ga.getAppCacheDir = VE;
const oo = le, WE = si;
function VE() {
  const e = (0, WE.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || oo.join(e, "AppData", "Local") : process.platform === "darwin" ? t = oo.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || oo.join(e, ".cache"), t;
}
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.ElectronAppAdapter = void 0;
const nl = le, YE = ga;
class zE {
  constructor(t = Gt.app) {
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
    return (0, YE.getAppCacheDir)();
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
_i.ElectronAppAdapter = zE;
var Hu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = me;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return Gt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class r extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, a, s) {
      return await s.cancellationToken.createPromise((l, p, c) => {
        const f = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: a,
          options: s,
          onCancel: c,
          callback: (d) => {
            d == null ? l(a) : p(d);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, a) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = n());
      const s = Gt.net.request({
        ...o,
        session: this.cachedSession
      });
      return s.on("response", a), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(o, a, s, l, p) {
      o.on("redirect", (c, f, d) => {
        o.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : p(t.HttpExecutor.prepareRedirectUrlOptions(d, a));
      });
    }
  }
  e.ElectronHttpExecutor = r;
})(Hu);
var fr = {}, Ze = {};
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.newBaseUrl = XE;
Ze.newUrlFromBase = KE;
Ze.getChannelFilename = JE;
const qu = bt;
function XE(e) {
  const t = new qu.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function KE(e, t, n = !1) {
  const r = new qu.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function JE(e) {
  return `${e}.yml`;
}
var he = {}, QE = "[object Symbol]", Gu = /[\\^$.*+?()[\]{}|]/g, ZE = RegExp(Gu.source), ev = typeof Re == "object" && Re && Re.Object === Object && Re, tv = typeof self == "object" && self && self.Object === Object && self, nv = ev || tv || Function("return this")(), rv = Object.prototype, iv = rv.toString, rl = nv.Symbol, il = rl ? rl.prototype : void 0, ol = il ? il.toString : void 0;
function ov(e) {
  if (typeof e == "string")
    return e;
  if (sv(e))
    return ol ? ol.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function av(e) {
  return !!e && typeof e == "object";
}
function sv(e) {
  return typeof e == "symbol" || av(e) && iv.call(e) == QE;
}
function lv(e) {
  return e == null ? "" : ov(e);
}
function cv(e) {
  return e = lv(e), e && ZE.test(e) ? e.replace(Gu, "\\$&") : e;
}
var Wu = cv;
Object.defineProperty(he, "__esModule", { value: !0 });
he.Provider = void 0;
he.findFile = pv;
he.parseUpdateInfo = mv;
he.getFileList = Vu;
he.resolveFiles = gv;
const Tt = me, uv = Ae, fv = bt, ri = Ze, dv = Wu;
class hv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, n, r, i = null) {
    const o = (0, ri.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, ri.newUrlFromBase)(`${t.pathname.replace(new RegExp(dv(r), "g"), n)}.blockmap`, i ? new fv.URL(i) : t), o];
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
he.Provider = hv;
function pv(e, t, n) {
  var r;
  if (e.length === 0)
    throw (0, Tt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((a) => a.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (r = i.find((a) => [a.url.pathname, a.info.url].some((s) => s.includes(process.arch)))) !== null && r !== void 0 ? r : i.shift();
  return o || (n == null ? e[0] : e.find((a) => !n.some((s) => a.url.pathname.toLowerCase().endsWith(`.${s.toLowerCase()}`))));
}
function mv(e, t, n) {
  if (e == null)
    throw (0, Tt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, uv.load)(e);
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
function gv(e, t, n = (r) => r) {
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
const al = me, ao = Ze, so = he;
class wv extends so.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, ao.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, ao.getChannelFilename)(this.channel), n = (0, ao.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, so.parseUpdateInfo)(await this.httpRequest(n), t, n);
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
    return (0, so.resolveFiles)(t, this.baseUrl);
  }
}
fr.GenericProvider = wv;
var Ai = {}, Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.BitbucketProvider = void 0;
const sl = me, lo = Ze, co = he;
class yv extends co.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, lo.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new sl.CancellationToken(), n = (0, lo.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, lo.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, co.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, sl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, co.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
Ti.BitbucketProvider = yv;
var St = {};
Object.defineProperty(St, "__esModule", { value: !0 });
St.GitHubProvider = St.BaseGitHubProvider = void 0;
St.computeReleaseNotes = zu;
const lt = me, Mt = ju, Ev = bt, ln = Ze, Uo = he, uo = /\/tag\/([^/]+)$/;
class Yu extends Uo.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, ln.newBaseUrl)((0, lt.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, ln.newBaseUrl)((0, lt.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
St.BaseGitHubProvider = Yu;
class vv extends Yu {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const a = new lt.CancellationToken(), s = await this.httpRequest((0, ln.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), l = (0, lt.parseXml)(s);
    let p = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const A = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = Mt.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (A === null)
          c = uo.exec(p.element("link").attribute("href"))[1];
        else
          for (const S of l.getElements("entry")) {
            const T = uo.exec(S.element("link").attribute("href"));
            if (T === null)
              continue;
            const D = T[1], x = ((r = Mt.prerelease(D)) === null || r === void 0 ? void 0 : r[0]) || null, re = !A || ["alpha", "beta"].includes(A), fe = x !== null && !["alpha", "beta"].includes(String(x));
            if (re && !fe && !(A === "beta" && x === "alpha")) {
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
          if (uo.exec(A.element("link").attribute("href"))[1] === c) {
            p = A;
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
    let f, d = "", m = "";
    const E = async (A) => {
      d = (0, ln.getChannelFilename)(A), m = (0, ln.newUrlFromBase)(this.getBaseDownloadPath(String(c), d), this.baseUrl);
      const S = this.createRequestOptions(m);
      try {
        return await this.executor.request(S, a);
      } catch (T) {
        throw T instanceof lt.HttpError && T.statusCode === 404 ? (0, lt.newError)(`Cannot find ${d} in the latest release artifacts (${m}): ${T.stack || T.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : T;
      }
    };
    try {
      let A = this.channel;
      this.updater.allowPrerelease && (!((i = Mt.prerelease(c)) === null || i === void 0) && i[0]) && (A = this.getCustomChannelName(String((o = Mt.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), f = await E(A);
    } catch (A) {
      if (this.updater.allowPrerelease)
        f = await E(this.getDefaultChannelName());
      else
        throw A;
    }
    const y = (0, Uo.parseUpdateInfo)(f, d, m);
    return y.releaseName == null && (y.releaseName = p.elementValueOrEmpty("title")), y.releaseNotes == null && (y.releaseNotes = zu(this.updater.currentVersion, this.updater.fullChangelog, l, p)), {
      tag: c,
      ...y
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, ln.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new Ev.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
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
    return (0, Uo.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
St.GitHubProvider = vv;
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
    Mt.valid(a) && Mt.lt(e, a) && i.push({
      version: a,
      note: ll(o)
    });
  }
  return i.sort((o, a) => Mt.rcompare(o.version, a.version));
}
var Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.GitLabProvider = void 0;
const Pe = me, fo = bt, _v = Wu, Ur = Ze, ho = he;
class Av extends ho.Provider {
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
      const d = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, m = await this.httpRequest(n, d, t);
      if (!m)
        throw (0, Pe.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      r = JSON.parse(m);
    } catch (d) {
      throw (0, Pe.newError)(`Unable to find latest release on GitLab (${n}): ${d.stack || d.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = r.tag_name;
    let o = null, a = "", s = null;
    const l = async (d) => {
      a = (0, Ur.getChannelFilename)(d);
      const m = r.assets.links.find((y) => y.name === a);
      if (!m)
        throw (0, Pe.newError)(`Cannot find ${a} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      s = new fo.URL(m.direct_asset_url);
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
    const p = (0, ho.parseUpdateInfo)(o, a, s);
    p.releaseName == null && (p.releaseName = r.name), p.releaseNotes == null && (p.releaseNotes = r.description || null);
    const c = /* @__PURE__ */ new Map();
    for (const d of r.assets.links)
      c.set(this.normalizeFilename(d.name), d.direct_asset_url);
    const f = {
      tag: i,
      assets: c,
      ...p
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
        return new fo.URL(o);
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
      const l = r.replace(new RegExp(_v(n), "g"), t);
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
    return (0, ho.getFileList)(t).map((n) => {
      const i = [
        n.url,
        // Original filename
        this.normalizeFilename(n.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((a) => t.assets.has(a)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, Pe.newError)(`Cannot find asset "${n.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new fo.URL(o),
        info: n
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
Si.GitLabProvider = Av;
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.KeygenProvider = void 0;
const cl = me, po = Ze, mo = he;
class Tv extends mo.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, po.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new cl.CancellationToken(), n = (0, po.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, po.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, mo.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, cl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, mo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
Ci.KeygenProvider = Tv;
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.PrivateGitHubProvider = void 0;
const en = me, Sv = Ae, Cv = le, ul = bt, fl = Ze, bv = St, Pv = he;
class Ov extends bv.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new en.CancellationToken(), n = (0, fl.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((s) => s.name === n);
    if (i == null)
      throw (0, en.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new ul.URL(i.url);
    let a;
    try {
      a = (0, Sv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof en.HttpError && s.statusCode === 404 ? (0, en.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
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
      throw (0, en.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Pv.getFileList)(t).map((n) => {
      const r = Cv.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, en.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ul.URL(i.url),
        info: n
      };
    });
  }
}
bi.PrivateGitHubProvider = Ov;
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.isUrlProbablySupportMultiRangeRequests = Xu;
Ai.createClient = Fv;
const kr = me, Rv = Ti, dl = fr, Iv = St, Nv = Si, Dv = Ci, $v = bi;
function Xu(e) {
  return !e.includes("s3.amazonaws.com");
}
function Fv(e, t, n) {
  if (typeof e == "string")
    throw (0, kr.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Iv.GitHubProvider(i, t, n) : new $v.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new Rv.BitbucketProvider(e, t, n);
    case "gitlab":
      return new Nv.GitLabProvider(e, t, n);
    case "keygen":
      return new Dv.KeygenProvider(e, t, n);
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
var Pi = {}, dr = {}, En = {}, Kt = {};
Object.defineProperty(Kt, "__esModule", { value: !0 });
Kt.OperationKind = void 0;
Kt.computeOperations = xv;
var Bt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Bt || (Kt.OperationKind = Bt = {}));
function xv(e, t, n) {
  const r = pl(e.files), i = pl(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, p = r.get(l);
  if (p == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: d, checksumToOldSize: m } = Uv(r.get(l), p.offset, n);
  let E = a.offset;
  for (let y = 0; y < c.checksums.length; E += c.sizes[y], y++) {
    const A = c.sizes[y], S = c.checksums[y];
    let T = d.get(S);
    T != null && m.get(S) !== A && (n.warn(`Checksum ("${S}") matches, but size differs (old: ${m.get(S)}, new: ${A})`), T = void 0), T === void 0 ? (f++, o != null && o.kind === Bt.DOWNLOAD && o.end === E ? o.end += A : (o = {
      kind: Bt.DOWNLOAD,
      start: E,
      end: E + A
      // oldBlocks: null,
    }, hl(o, s, S, y))) : o != null && o.kind === Bt.COPY && o.end === T ? o.end += A : (o = {
      kind: Bt.COPY,
      start: T,
      end: T + A
      // oldBlocks: [checksum]
    }, hl(o, s, S, y));
  }
  return f > 0 && n.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const Lv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function hl(e, t, n, r) {
  if (Lv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${Bt[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function Uv(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], l = e.sizes[a], p = i.get(s);
    if (p === void 0)
      r.set(s, o), i.set(s, l);
    else if (n.debug != null) {
      const c = p === l ? "(same size)" : `(size: ${p}, this size: ${l})`;
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
Object.defineProperty(En, "__esModule", { value: !0 });
En.DataSplitter = void 0;
En.copyData = Ku;
const Mr = me, kv = Ct, Mv = tr, Bv = Kt, ml = Buffer.from(`\r
\r
`);
var mt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(mt || (mt = {}));
function Ku(e, t, n, r, i) {
  const o = (0, kv.createReadStream)("", {
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
class jv extends Mv.Writable {
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
        if (a.kind !== Bv.OperationKind.COPY) {
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
En.DataSplitter = jv;
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.executeTasksUsingMultipleRangeRequests = Hv;
Oi.checkIsRangesSupported = Mo;
const ko = me, gl = En, wl = Kt;
function Hv(e, t, n, r, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const s = a + 1e3;
    qv(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: r
    }, n, () => o(s), i);
  };
  return o;
}
function qv(e, t, n, r, i) {
  let o = "bytes=", a = 0, s = 0;
  const l = /* @__PURE__ */ new Map(), p = [];
  for (let d = t.start; d < t.end; d++) {
    const m = t.tasks[d];
    m.kind === wl.OperationKind.DOWNLOAD && (o += `${m.start}-${m.end - 1}, `, l.set(a, d), a++, p.push(m.end - m.start), s += m.end - m.start);
  }
  if (a <= 1) {
    const d = (m) => {
      if (m >= t.end) {
        r();
        return;
      }
      const E = t.tasks[m++];
      if (E.kind === wl.OperationKind.COPY)
        (0, gl.copyData)(E, n, t.oldFileFd, i, () => d(m));
      else {
        const y = e.createRequestOptions();
        y.headers.Range = `bytes=${E.start}-${E.end - 1}`;
        const A = e.httpExecutor.createRequest(y, (S) => {
          S.on("error", i), Mo(S, i) && (S.pipe(n, {
            end: !1
          }), S.once("end", () => d(m)));
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
    if (!Mo(d, i))
      return;
    const m = (0, ko.safeGetHeader)(d, "content-type"), E = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(m);
    if (E == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${m}"`));
      return;
    }
    const y = new gl.DataSplitter(n, t, l, E[1] || E[2], p, r, s, e.options.onProgress);
    y.on("error", i), d.pipe(y), d.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function Mo(e, t) {
  if (e.statusCode >= 400)
    return t((0, ko.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, ko.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.ProgressDifferentialDownloadCallbackTransform = void 0;
const Gv = tr;
var cn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(cn || (cn = {}));
class Wv extends Gv.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = cn.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == cn.COPY) {
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
    this.operationType = cn.COPY;
  }
  beginRangeDownload() {
    this.operationType = cn.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
Ri.ProgressDifferentialDownloadCallbackTransform = Wv;
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.DifferentialDownloader = void 0;
const Rn = me, go = Pt, Vv = Ct, Yv = En, zv = bt, Br = Kt, yl = Oi, Xv = Ri;
class Kv {
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
      const p = l.end - l.start;
      l.kind === Br.OperationKind.DOWNLOAD ? o += p : a += p;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return r.info(`Full: ${El(s)}, To download: ${El(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, go.close)(i.descriptor).catch((o) => {
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
    const r = await (0, go.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, go.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, Vv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let p;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const S = [];
        let T = 0;
        for (const x of t)
          x.kind === Br.OperationKind.DOWNLOAD && (S.push(x.end - x.start), T += x.end - x.start);
        const D = {
          expectedByteCounts: S,
          grandTotal: T
        };
        p = new Xv.ProgressDifferentialDownloadCallbackTransform(D, this.options.cancellationToken, this.options.onProgress), l.push(p);
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
      let m;
      if (this.options.isUseMultipleRangeRequest) {
        m = (0, yl.executeTasksUsingMultipleRangeRequests)(this, t, d, r, s), m(0);
        return;
      }
      let E = 0, y = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const A = this.createRequestOptions();
      A.redirect = "manual", m = (S) => {
        var T, D;
        if (S >= t.length) {
          this.fileMetadataBuffer != null && d.write(this.fileMetadataBuffer), d.end();
          return;
        }
        const x = t[S++];
        if (x.kind === Br.OperationKind.COPY) {
          p && p.beginFileCopy(), (0, Yv.copyData)(x, d, r, s, () => m(S));
          return;
        }
        const re = `bytes=${x.start}-${x.end - 1}`;
        A.headers.range = re, (D = (T = this.logger) === null || T === void 0 ? void 0 : T.debug) === null || D === void 0 || D.call(T, `download range: ${re}`), p && p.beginRangeDownload();
        const fe = this.httpExecutor.createRequest(A, (X) => {
          X.on("error", s), X.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), X.statusCode >= 400 && s((0, Rn.createHttpError)(X)), X.pipe(d, {
            end: !1
          }), X.once("end", () => {
            p && p.endRangeDownload(), ++E === 100 ? (E = 0, setTimeout(() => m(S), 1e3)) : m(S);
          });
        });
        fe.on("redirect", (X, ke, w) => {
          this.logger.info(`Redirect to ${Jv(w)}`), y = w, (0, Rn.configureRequestUrl)(new zv.URL(y), A), fe.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(fe, s), fe.end();
      }, m(0);
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
dr.DifferentialDownloader = Kv;
function El(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Jv(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.GenericDifferentialDownloader = void 0;
const Qv = dr;
class Zv extends Qv.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
Pi.GenericDifferentialDownloader = Zv;
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
const Oe = me, e_ = nr, t_ = si, n_ = Hl, Ve = Pt, r_ = Ae, wo = mi, Ye = le, Ut = ju, vl = ur, i_ = _i, _l = Hu, o_ = fr, yo = Ai, Eo = Gl, a_ = Pi, tn = Ot;
class wa extends n_.EventEmitter {
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
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new wo.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new tn.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new wo.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new wo.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new i_.ElectronAppAdapter(), this.httpExecutor = new _l.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, Ut.parse)(r);
    if (i == null)
      throw (0, Oe.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = s_(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? r = new o_.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, yo.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, yo.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
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
      const r = wa.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
      new Gt.Notification(r).show();
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
    const n = (0, Ut.parse)(t.version);
    if (n == null)
      throw (0, Oe.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, Ut.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, Ut.gt)(n, r), a = (0, Ut.lt)(n, r);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, t_.release)();
    if (n)
      try {
        if ((0, Ut.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, yo.createClient)(r, this, this.createProviderRuntimeOptions())));
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
    this.emit(tn.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, r_.load)(await (0, Ve.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = Ye.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, Ve.readFile)(t, "utf-8");
      if (Oe.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = Oe.UUID.v5((0, e_.randomBytes)(4096), Oe.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, Ve.outputFile)(t, n);
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
      const i = Ye.join(this.app.baseCachePath, n || this.app.name);
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
    this.listenerCount(tn.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (T) => this.emit(tn.DOWNLOAD_PROGRESS, T));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = n.packageInfo;
    function s() {
      const T = decodeURIComponent(t.fileInfo.url.pathname);
      return T.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Ye.basename(T) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), p = l.cacheDirForPendingUpdate;
    await (0, Ve.mkdir)(p, { recursive: !0 });
    const c = s();
    let f = Ye.join(p, c);
    const d = a == null ? null : Ye.join(p, `package-${o}${Ye.extname(a.path) || ".7z"}`), m = async (T) => {
      await l.setDownloadedFile(f, d, i, n, c, T), await t.done({
        ...i,
        downloadedFile: f
      });
      const D = Ye.join(p, "current.blockmap");
      return await (0, Ve.pathExists)(D) && await (0, Ve.copyFile)(D, Ye.join(l.cacheDir, "current.blockmap")), d == null ? [f] : [f, d];
    }, E = this._logger, y = await l.validateDownloadedPath(f, i, n, E);
    if (y != null)
      return f = y, await m(!1);
    const A = async () => (await l.clear().catch(() => {
    }), await (0, Ve.unlink)(f).catch(() => {
    })), S = await (0, vl.createTempUpdateFile)(`temp-${c}`, p, E);
    try {
      await t.task(S, r, d, A), await (0, Oe.retry)(() => (0, Ve.rename)(S, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (T) => T instanceof Error && /^EBUSY:/.test(T.message) ? !0 : (E.warn(`Cannot rename temp file to final file: ${T.message || T.stack}`), !1)
      });
    } catch (T) {
      throw await A(), T instanceof Oe.CancellationError && (E.info("cancelled"), this.emit("update-cancelled", i)), T;
    }
    return E.info(`New version ${o} has been downloaded to ${f}`), await m(!0);
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
          return JSON.parse((0, Eo.gunzipSync)(y).toString());
        } catch (A) {
          throw new Error(`Cannot parse blockmap "${E.href}", error: ${A}`);
        }
      }, p = {
        newUrl: t.url,
        oldFile: Ye.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: a.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(tn.DOWNLOAD_PROGRESS) > 0 && (p.onProgress = (E) => this.emit(tn.DOWNLOAD_PROGRESS, E));
      const c = async (E, y) => {
        const A = Ye.join(y, "current.blockmap");
        await (0, Ve.outputFile)(A, (0, Eo.gzipSync)(JSON.stringify(E)));
      }, f = async (E) => {
        const y = Ye.join(E, "current.blockmap");
        try {
          if (await (0, Ve.pathExists)(y))
            return JSON.parse((0, Eo.gunzipSync)(await (0, Ve.readFile)(y)).toString());
        } catch (A) {
          this._logger.warn(`Cannot parse blockmap "${y}", error: ${A}`);
        }
        return null;
      }, d = await l(s[1]);
      await c(d, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let m = await f(this.downloadedUpdateHelper.cacheDir);
      return m == null && (m = await l(s[0])), await new a_.GenericDifferentialDownloader(t.info, this.httpExecutor, p).download(m, d), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
vt.AppUpdater = wa;
function s_(e) {
  const t = (0, Ut.prerelease)(e);
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
Object.defineProperty(Xt, "__esModule", { value: !0 });
Xt.BaseUpdater = void 0;
const Al = ai, l_ = vt;
class c_ extends l_.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Gt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
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
        l.on("error", (p) => {
          a(p);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
Xt.BaseUpdater = c_;
var Xn = {}, hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const nn = Pt, u_ = dr, f_ = Gl;
class d_ extends u_.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = Qu(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await h_(this.options.oldFile), i);
  }
}
hr.FileWithEmbeddedBlockMapDifferentialDownloader = d_;
function Qu(e) {
  return JSON.parse((0, f_.inflateRawSync)(e).toString());
}
async function h_(e) {
  const t = await (0, nn.open)(e, "r");
  try {
    const n = (await (0, nn.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, nn.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, nn.read)(t, i, 0, i.length, n - r.length - i.length), await (0, nn.close)(t), Qu(i);
  } catch (n) {
    throw await (0, nn.close)(t), n;
  }
}
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.AppImageUpdater = void 0;
const Tl = me, Sl = ai, p_ = Pt, m_ = Ct, In = le, g_ = Xt, w_ = hr, y_ = he, Cl = Ot;
class E_ extends g_.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, y_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, Tl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, a, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, p_.chmod)(i, 493);
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
      return this.listenerCount(Cl.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(Cl.DOWNLOAD_PROGRESS, s)), await new w_.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, Tl.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, m_.unlinkSync)(n);
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
Xn.AppImageUpdater = E_;
var Kn = {}, vn = {};
Object.defineProperty(vn, "__esModule", { value: !0 });
vn.LinuxUpdater = void 0;
const v_ = Xt;
class __ extends v_.BaseUpdater {
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
vn.LinuxUpdater = __;
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.DebUpdater = void 0;
const A_ = he, bl = Ot, T_ = vn;
class ya extends T_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, A_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
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
      ya.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Kn.DebUpdater = ya;
var Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
Jn.PacmanUpdater = void 0;
const Pl = Ot, S_ = he, C_ = vn;
class Ea extends C_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, S_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
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
      Ea.installWithCommandRunner(n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Jn.PacmanUpdater = Ea;
var Qn = {};
Object.defineProperty(Qn, "__esModule", { value: !0 });
Qn.RpmUpdater = void 0;
const Ol = Ot, b_ = he, P_ = vn;
class va extends P_.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, b_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
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
      va.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Qn.RpmUpdater = va;
var Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.MacUpdater = void 0;
const Rl = me, vo = Pt, O_ = Ct, Il = le, R_ = yd, I_ = vt, N_ = he, Nl = ai, Dl = nr;
class D_ extends I_.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = Gt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
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
    const l = (0, N_.findFile)(n, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, Rl.newError)(`ZIP file not provided: ${(0, Rl.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const p = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, d) => {
        const m = Il.join(this.downloadedUpdateHelper.cacheDir, c), E = () => (0, vo.pathExistsSync)(m) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let y = !0;
        E() && (y = await this.differentialDownloadInstaller(l, t, f, p, c)), y && await this.httpExecutor.download(l.url, f, d);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const d = Il.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, vo.copyFile)(f.downloadedFile, d);
          } catch (d) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${d.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, vo.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, R_.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (p) => {
      const c = p.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((p, c) => {
      const f = (0, Dl.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), d = Buffer.from(`autoupdater:${f}`, "ascii"), m = `/${(0, Dl.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (E, y) => {
        const A = E.url;
        if (a.info(`${A} requested`), A === "/") {
          if (!E.headers.authorization || E.headers.authorization.indexOf("Basic ") === -1) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("No authenthication info");
            return;
          }
          const D = E.headers.authorization.split(" ")[1], x = Buffer.from(D, "base64").toString("ascii"), [re, fe] = x.split(":");
          if (re !== "autoupdater" || fe !== f) {
            y.statusCode = 401, y.statusMessage = "Invalid Authentication Credentials", y.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const X = Buffer.from(`{ "url": "${l(this.server)}${m}" }`);
          y.writeHead(200, { "Content-Type": "application/json", "Content-Length": X.length }), y.end(X);
          return;
        }
        if (!A.startsWith(m)) {
          a.warn(`${A} requested, but not supported`), y.writeHead(404), y.end();
          return;
        }
        a.info(`${m} requested by Squirrel.Mac, pipe ${i}`);
        let S = !1;
        y.on("finish", () => {
          S || (this.nativeUpdater.removeListener("error", c), p([]));
        });
        const T = (0, O_.createReadStream)(i);
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
        }), this.dispatchUpdateDownloaded(n), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : p([]);
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
Zn.MacUpdater = D_;
var er = {}, _a = {};
Object.defineProperty(_a, "__esModule", { value: !0 });
_a.verifySignature = F_;
const $l = me, Zu = ai, $_ = si, Fl = le;
function ef(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function F_(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, Zu.execFile)(...ef(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (a, s, l) => {
      var p;
      try {
        if (a != null || l) {
          _o(n, a, l, i), r(null);
          return;
        }
        const c = x_(s);
        if (c.Status === 0) {
          try {
            const E = Fl.normalize(c.Path), y = Fl.normalize(t);
            if (n.info(`LiteralPath: ${E}. Update Path: ${y}`), E !== y) {
              _o(n, new Error(`LiteralPath of ${E} is different than ${y}`), l, i), r(null);
              return;
            }
          } catch (E) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(p = E.message) !== null && p !== void 0 ? p : E.stack}`);
          }
          const d = (0, $l.parseDn)(c.SignerCertificate.Subject);
          let m = !1;
          for (const E of e) {
            const y = (0, $l.parseDn)(E);
            if (y.size ? m = Array.from(y.keys()).every((S) => y.get(S) === d.get(S)) : E === d.get("CN") && (n.warn(`Signature validated using only CN ${E}. Please add your full Distinguished Name (DN) to publisherNames configuration`), m = !0), m) {
              r(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (d, m) => d === "RawData" ? void 0 : m, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), r(f);
      } catch (c) {
        _o(n, c, null, i), r(null);
        return;
      }
    });
  });
}
function x_(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function _o(e, t, n, r) {
  if (L_()) {
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
function L_() {
  const e = $_.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(er, "__esModule", { value: !0 });
er.NsisUpdater = void 0;
const jr = me, xl = le, U_ = Xt, k_ = hr, Ll = Ot, M_ = he, B_ = Pt, j_ = _a, Ul = bt;
class H_ extends U_.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, j_.verifySignature)(r, i, this._logger);
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
    const n = t.updateInfoAndProvider.provider, r = (0, M_.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, a, s) => {
        const l = r.packageInfo, p = l != null && a != null;
        if (p && t.disableWebInstaller)
          throw (0, jr.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !p && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (p || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, jr.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, jr.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (p && await this.differentialDownloadWebPackage(t, l, a, n))
          try {
            await this.httpExecutor.download(new Ul.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, B_.unlink)(a);
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
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? o() : s === "ENOENT" ? Gt.shell.openPath(n).catch((l) => this.dispatchError(l)) : this.dispatchError(a);
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
      this.listenerCount(Ll.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Ll.DOWNLOAD_PROGRESS, a)), await new k_.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
er.NsisUpdater = H_;
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
  const r = Pt, i = le;
  var o = Xt;
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
  var p = Kn;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return p.DebUpdater;
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
  var m = er;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return m.NsisUpdater;
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
class q_ {
  constructor(t) {
    Bi(this, "mainConfig");
    this.mainConfig = t.mainConfig;
  }
}
class G_ {
  constructor(t) {
    Bi(this, "setting");
    this.setting = t.setting;
  }
}
const W_ = 1, V_ = 2, Y_ = 16, z_ = W_ | V_ | Y_;
function X_(e) {
  const t = e.getNativeWindowHandle(), r = [
    'Add-Type @"',
    "using System;",
    "using System.Runtime.InteropServices;",
    "public class Z {",
    '[DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f);',
    "}",
    '"@',
    `[Z]::SetWindowPos([IntPtr]${t.length >= 8 ? Number(t.readBigUInt64LE(0)) : t.readUInt32LE(0)}, [IntPtr]1, 0, 0, 0, 0, ${z_})`
  ].join(`\r
`), i = Buffer.from(r, "utf16le").toString("base64");
  Ed("powershell.exe", ["-NoProfile", "-WindowStyle", "Hidden", "-EncodedCommand", i], {
    windowsHide: !0,
    timeout: 1e4,
    stdio: "ignore"
  });
}
function Bo() {
  ee && (ee.showInactive(), process.platform === "win32" && setImmediate(() => {
    if (ee != null && ee.isVisible())
      try {
        X_(ee);
      } catch (e) {
        console.error("sendWin32ClockWindowToBack:", e);
      }
  }));
}
const tf = H.dirname(vd(import.meta.url)), qe = "data", K_ = "todo", J_ = "timeTable";
process.env.APP_ROOT = H.join(tf, "..");
const Vt = process.env.VITE_DEV_SERVER_URL, Aa = H.join(process.env.APP_ROOT, "dist-electron"), Ii = H.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Vt ? H.join(process.env.APP_ROOT, "public") : Ii;
let rt = process.env.NODE_ENV === "development", ee, B, Nn = null, Dn = !1, Ao = !1, $n, ii = !1, kl = !1;
function Q_() {
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
function Z_() {
  !ae.isPackaged || !ii || setTimeout(() => {
    Be.autoUpdater.checkForUpdates().catch((e) => console.warn("checkForUpdates:", e));
  }, 4500);
}
const eA = ae.requestSingleInstanceLock();
eA || ae.quit();
async function nf() {
  if (ee) return;
  let e = "";
  rt || (e = H.join(Xe(), "config.json"));
  const t = await iA(), n = await oA(e), r = n ? n[0] : 800, i = n ? n[1] : 500;
  ee = new jt({
    icon: H.join(process.env.VITE_PUBLIC, "water.ico"),
    frame: !1,
    width: r,
    height: i,
    resizable: !1,
    transparent: !0,
    show: !1,
    skipTaskbar: !0,
    focusable: !1,
    webPreferences: {
      preload: H.join(Aa, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), !t || !t[0] || !t[1] ? ee.center() : ee.setPosition(t[0], t[1]), U.handle("window:set-position", (o, a, s) => {
    ee && ee.setPosition(a, s, !0), Ao || (Ao = !0, setTimeout(() => {
      rA(e), Ao = !1;
    }, 500));
  }), U.handle("window:get-position", () => ee ? ee.getPosition() : [0, 0]), U.handle("window:create-note-window", () => {
    if (B) {
      B.show();
      return;
    }
    Ta();
  }), Vt ? ee.loadURL(Vt) : ee.loadFile(H.join(Ii, "index.html")), ee.on("ready-to-show", () => {
    Bo();
  });
}
async function Ta() {
  if (B) {
    B.show();
    return;
  }
  B = new jt({
    icon: H.join(process.env.VITE_PUBLIC, "water.ico"),
    frame: !1,
    width: 1400,
    height: 1e3,
    resizable: !1,
    show: !1,
    webPreferences: {
      preload: H.join(Aa, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      spellcheck: !1
    }
  }), Vt ? B.loadURL(Vt + "/note") : B.loadFile(H.join(Ii, "note.html"));
  const e = () => {
    B && !B.isDestroyed() && B.webContents.setZoomFactor(1);
  };
  B.webContents.on("did-finish-load", e), B.webContents.on("zoom-changed", e), U.removeHandler("window:close-note-window"), U.removeHandler("window:max-note-window"), U.removeHandler("window:min-note-window"), U.removeHandler("window:restore-note-window"), U.removeHandler("file:save"), U.removeHandler("file:open"), U.removeHandler("file:open-all"), U.removeHandler("file:open-workspace-tree"), U.removeHandler("file:delete"), U.removeHandler("file:rename"), U.removeHandler("shell:open-terminal-at"), U.removeHandler("dialog:open-directory"), U.removeHandler("dialog:open-file"), U.removeHandler("sticky:get-last-workspace"), U.removeHandler("sticky:set-last-workspace"), U.removeHandler("setting:get"), U.removeHandler("config:get"), U.removeHandler("setting:set"), U.removeHandler("config:set"), U.handle("window:close-note-window", () => {
    B && (B.close(), B = null, Nn = null, Dn = !1);
  }), U.handle("window:max-note-window", () => {
    if (!B || Dn) return;
    Nn = B.getBounds();
    const { workArea: t } = gd.getDisplayMatching(B.getBounds());
    B.setBounds({ ...t }), Dn = !0;
  }), U.handle("window:min-note-window", () => {
    B && B.minimize();
  }), U.handle("window:restore-note-window", () => {
    !B || !Dn || (Nn && B.setBounds(Nn), Nn = null, Dn = !1);
  }), U.handle("file:save", (t, n, r, i, o = qe) => fA(n, r, i, o)), U.handle("file:open", async (t, n, r = qe) => await dA(n, r)), U.handle("file:open-all", async (t, n = qe) => await gA(n)), U.handle("file:open-workspace-tree", async (t, n = qe) => await mA(n)), U.handle("file:delete", async (t, n, r = qe) => await wA(n, r)), U.handle(
    "file:rename",
    async (t, n, r, i, o = qe) => await EA(o, n, r, i)
  ), U.handle("shell:open-terminal-at", async (t, n) => {
    const r = Rt(n);
    return await Ni(r) ? (vA(r), !0) : !1;
  }), U.handle("dialog:open-directory", async (t) => {
    const n = jt.fromWebContents(t.sender);
    if (!n) return null;
    const { canceled: r, filePaths: i } = await Ha.showOpenDialog(n, {
      properties: ["openDirectory", "createDirectory"]
    });
    return r || !i[0] ? null : i[0];
  }), U.handle("dialog:open-file", async (t) => {
    const n = jt.fromWebContents(t.sender);
    if (!n) return null;
    const { canceled: r, filePaths: i } = await Ha.showOpenDialog(n, {
      properties: ["openFile"]
    });
    if (r || !i[0]) return null;
    const o = i[0], a = H.parse(o), l = (a.ext ? a.ext.slice(1) : "") || "txt";
    return {
      fullPath: o,
      dir: a.dir,
      name: a.name,
      type: l
    };
  }), U.handle("sticky:get-last-workspace", async () => await cA()), U.handle("sticky:set-last-workspace", async (t, n) => {
    await uA(n);
  }), U.handle("setting:get", async (t, n) => (rt || (n = H.join(Xe(), "setting.json")), await rf(n))), U.handle("config:get", async (t, n) => (rt || (n = H.join(Xe(), "config.json")), await pr(n))), U.handle("config:set", async (t, n, r) => (rt || (n = H.join(Xe(), "config.json")), of(n, r))), U.handle("setting:set", async (t, n, r) => {
    rt || (n = H.join(Xe(), "setting.json"));
    const i = await aA(n, r);
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
  jt.getAllWindows().length === 0 && (nf(), Ta());
});
ae.commandLine.appendSwitch("no-default-window");
const Ml = "CommandOrControl+Shift+N";
function tA() {
  const e = new jt({
    width: 750,
    height: 800,
    show: !1,
    frame: !1,
    icon: H.join(process.env.VITE_PUBLIC, "water.ico"),
    webPreferences: {
      preload: H.join(Aa, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  Vt ? e.loadURL(`${Vt}/scratch.html`) : e.loadFile(H.join(Ii, "scratch.html"));
  const t = () => {
    e.isDestroyed() || e.webContents.setZoomFactor(1);
  };
  e.webContents.on("did-finish-load", t), e.webContents.on("zoom-changed", t), e.once("ready-to-show", () => {
    e.show();
  });
}
function nA() {
  Bl.register(Ml, () => {
    tA();
  }) || console.error("全局快捷键注册失败:", Ml);
}
ae.whenReady().then(async () => {
  var r;
  await To(), await To(K_), await To(J_), await sA(), await lA(), _A();
  const e = rt ? "" : H.join(Xe(), "setting.json"), t = await rf(e), n = t == null ? void 0 : t.setting;
  ii = !!(n && n.checkForUpdates), ae.isPackaged && (Q_(), Z_()), rt || ae.setLoginItemSettings({
    openAtLogin: !!(t != null && t.setting.autostart),
    openAsHidden: !0
  }), U.removeHandler("updater:download"), U.removeHandler("updater:quit-and-install"), U.removeHandler("updater:check-now"), U.removeHandler("app:get-packaged-info"), U.handle("updater:download", async () => ae.isPackaged ? (await Be.autoUpdater.downloadUpdate(), !0) : !1), U.handle("updater:quit-and-install", () => (ae.isPackaged && Be.autoUpdater.quitAndInstall(!1, !0), Promise.resolve())), U.handle("updater:check-now", async () => ae.isPackaged ? (await Be.autoUpdater.checkForUpdates(), { ok: !0 }) : { ok: !1, reason: "not-packaged" }), U.handle("app:get-packaged-info", () => ({
    isPackaged: ae.isPackaged,
    version: ae.getVersion()
  })), U.removeHandler("shell:open-folder-location"), U.handle(
    "shell:open-folder-location",
    async (i, o, a) => {
      const s = Rt(o), l = a.replace(/\\/g, "/").split("/").filter(Boolean), p = H.join(s, ...l);
      return await Ni(p) ? await hd.openPath(p) === "" : !1;
    }
  ), U.handle("window:close-scratch", (i) => {
    const o = jt.fromWebContents(i.sender);
    o && !o.isDestroyed() && o.close();
  }), Ta(), nA(), (r = t == null ? void 0 : t.setting) != null && r.showClock && (nf(), B == null || B.hide());
});
ae.on("will-quit", () => {
  Bl.unregisterAll();
});
async function rA(e) {
  const t = await pr(e);
  if (!t || !ee) return;
  const n = ee.getPosition();
  t.mainConfig.position.x = n[0], t.mainConfig.position.y = n[1], await of("", t);
}
async function iA() {
  const e = await pr("");
  return !e || !e.mainConfig.position ? Promise.resolve(null) : Promise.resolve([e.mainConfig.position.x, e.mainConfig.position.y]);
}
async function oA(e) {
  const t = await pr(e);
  if (!t) return Promise.resolve(null);
  const n = t.mainConfig.time.fontSize, r = 5, i = t.mainConfig.date.fontSize, o = t.mainConfig.date.content.length ? t.mainConfig.date.content.length : 12, a = 30, s = Math.max(n * r + a, i * o + a), l = n + i + a * 2;
  return Promise.resolve([s + 100, l + 50]);
}
async function pr(e) {
  try {
    e === "" && (e = process.env.APP_ROOT + "/config.json"), await se.access(e);
    const t = await se.readFile(e, "utf-8"), n = JSON.parse(t);
    return new q_(n);
  } catch (t) {
    return console.error(t), null;
  }
}
async function rf(e) {
  try {
    e === "" && (e = process.env.APP_ROOT + "/setting.json"), await se.access(e);
    const t = await se.readFile(e, "utf-8"), r = {
      setting: {
        autostart: !1,
        dark: !1,
        showClock: !0,
        checkForUpdates: !1,
        ...JSON.parse(t).setting ?? {}
      }
    };
    return new G_(r);
  } catch (t) {
    return console.error(t), null;
  }
}
async function of(e, t) {
  try {
    e === "" && (e = process.env.APP_ROOT + "/config.json");
    const n = await pr(e);
    if (n === null)
      await se.writeFile(e, JSON.stringify(t, null, 2), "utf-8");
    else {
      const r = af(n, t);
      await se.writeFile(e, JSON.stringify(r, null, 2), "utf-8");
    }
    return !0;
  } catch (n) {
    return console.error(n), !1;
  }
}
async function aA(e, t) {
  try {
    return e === "" && (e = process.env.APP_ROOT + "/setting.json"), await se.writeFile(e, JSON.stringify(t, null, 2), "utf-8"), !0;
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
      return H.resolve(tf, "../");
    const e = ae.getPath("exe");
    return H.dirname(e);
  } catch (e) {
    return console.error("解析安装目录失败：", e), ae.getPath("documents");
  }
}
async function Ni(e) {
  try {
    return await se.access(e, 0), (await se.stat(e)).isDirectory();
  } catch {
    return !1;
  }
}
async function oi(e) {
  try {
    return await se.access(e, 0), (await se.stat(e)).isFile();
  } catch {
    return !1;
  }
}
async function sA() {
  if (rt) return;
  const e = H.join(Xe(), "config.json");
  if (await oi(e)) return;
  await se.writeFile(e, `
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
async function lA() {
  if (rt) return;
  const e = H.join(Xe(), "setting.json");
  if (await oi(e)) return;
  await se.writeFile(e, `
	{
		"setting": {
			"autostart": false,
			"dark": false,
			"showClock": true,
			"checkForUpdates": false
		}
	}`, "utf-8");
}
async function To(e = qe) {
  const t = H.join(Xe(), e);
  await Ni(t) || await se.mkdir(t, { recursive: !0 });
}
function Rt(e) {
  return e ? H.isAbsolute(e) ? e : H.join(Xe(), e) : H.join(Xe(), qe);
}
function sf() {
  return H.join(ae.getPath("userData"), "sticky-workspace.json");
}
async function cA() {
  try {
    const e = await se.readFile(sf(), "utf-8"), t = JSON.parse(e);
    return typeof t.folder == "string" && t.folder.length > 0 && await Ni(t.folder) ? t.folder : null;
  } catch {
    return null;
  }
}
async function uA(e) {
  const t = JSON.stringify({ folder: e ?? null }, null, 2);
  await se.writeFile(sf(), t, "utf-8");
}
function fA(e, t, n, r = qe) {
  return new Promise(async (i, o) => {
    try {
      const a = Rt(r), s = e.replace(/\\/g, "/"), l = s.lastIndexOf("/"), p = l >= 0 ? s.slice(0, l) : "", c = l >= 0 ? s.slice(l + 1) : s, f = t ? `${c}.${t}` : c, m = (p ? `${p}/${f}` : f).split("/").filter(Boolean), E = H.join(a, ...m);
      await se.mkdir(H.dirname(E), { recursive: !0 }), await se.writeFile(E, n, { encoding: "utf8" }), i(!0);
    } catch (a) {
      const s = `保存文件失败：${a.message}`;
      o(new Error(s));
    }
  });
}
function dA(e, t = qe) {
  return new Promise(async (n, r) => {
    try {
      const i = Rt(t), o = e.replace(/\\/g, "/").split("/").filter(Boolean), a = H.join(i, ...o), s = await se.readFile(a, "utf-8");
      n(s);
    } catch {
      r("");
    }
  });
}
const hA = /* @__PURE__ */ new Set([".git", "node_modules", ".svn", "dist", "dist-electron", "release"]);
function pA(e) {
  return e.join("/");
}
async function lf(e, t) {
  const n = await se.readdir(e, { withFileTypes: !0 }), r = [];
  for (const i of n) {
    if (i.name === "." || i.name === "..") continue;
    const o = [...t, i.name], a = pA(o), s = H.join(e, i.name);
    if (i.isDirectory()) {
      if (hA.has(i.name)) continue;
      const l = await lf(s, o);
      r.push({ kind: "folder", name: i.name, relPath: a, children: l });
    } else if (i.isFile()) {
      const l = H.parse(i.name), p = l.ext ? l.ext.slice(1) : "";
      r.push({ kind: "file", name: l.name, type: p, relPath: a });
    }
  }
  return r.sort((i, o) => i.kind !== o.kind ? i.kind === "folder" ? -1 : 1 : i.name.localeCompare(o.name, void 0, { sensitivity: "base" })), r;
}
function mA(e) {
  return new Promise(async (t) => {
    try {
      const n = Rt(e), r = await lf(n, []);
      t(r);
    } catch {
      t([]);
    }
  });
}
function gA(e = qe) {
  return new Promise(async (t, n) => {
    try {
      const r = Rt(e), o = (await se.readdir(r, { withFileTypes: !0 })).filter((a) => a.isFile()).map((a) => {
        const s = H.parse(a.name), l = s.ext ? s.ext.slice(1) : "";
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
function wA(e, t = qe) {
  return new Promise(async (n, r) => {
    try {
      const i = Rt(t), o = e.replace(/\\/g, "/").split("/").filter(Boolean), a = H.join(i, ...o);
      await se.unlink(a), n(!0);
    } catch {
      r(!1);
    }
  });
}
const yA = /[\\/:*?"<>|]/;
async function EA(e, t, n, r) {
  try {
    const i = Rt(e), o = n.trim();
    if (!o || yA.test(o)) return !1;
    const a = r.trim(), s = a ? `${o}.${a}` : o, l = t.replace(/\\/g, "/"), p = H.posix.dirname(l), c = p === "." ? s : `${p}/${s}`, f = l.split("/").filter(Boolean), d = c.split("/").filter(Boolean), m = H.join(i, ...f), E = H.join(i, ...d);
    return H.normalize(m) === H.normalize(E) ? !0 : !await oi(m) || await oi(E) ? !1 : (await se.rename(m, E), !0);
  } catch {
    return !1;
  }
}
function vA(e) {
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
const _A = () => {
  if ($n) return;
  const e = H.join(process.env.VITE_PUBLIC, "water.ico");
  $n = new pd(e);
  const t = md.buildFromTemplate([
    {
      label: "显示/隐藏",
      click: () => {
        ee && (ee.isVisible() ? ee.hide() : Bo());
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
    ee && (ee.isVisible() ? ee.hide() : Bo());
  });
};
process.platform === "win32" && (ae.commandLine.appendSwitch("high-dpi-support", "true"), ae.commandLine.appendSwitch("force-device-scale-factor", "1"));
export {
  Aa as MAIN_DIST,
  Ii as RENDERER_DIST,
  Vt as VITE_DEV_SERVER_URL
};
