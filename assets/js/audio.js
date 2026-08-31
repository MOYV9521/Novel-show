/* =========================================================
   audio.js — 全站 BGM 系统
   基于 Web Audio API 实时合成，无需任何外部音频文件。
   根据页面 body 主题自动切换音色：
     home      主页   → 温暖氛围 · C 大调
     xuanhuan  玄幻   → 古风五声 · 空灵回响
     kehuan    科幻   → 赛博脉冲 · 低频驱动
     zhexue    游戏   → 八音盒琶音 · 星光梦幻
   右下角悬浮按钮：点击开 / 关音乐。
   ========================================================= */

(function () {
  "use strict";

  var THEMES = {
    home: {
      bpm: 72,
      scale: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25], // C D E G A C5
      melody: [0, 2, 4, 2, 5, 4, 2, 0, 2, 4, 5, 4, 2, 4, 2, -1],
      bass: [130.81, 130.81, 98.0, 98.0],
      wave: "sine",
      vol: 0.2,
      decay: 2.4,
      pad: true
    },
    xuanhuan: {
      bpm: 64,
      scale: [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25], // A 宫五声
      melody: [0, 2, 3, 5, 3, 2, 0, -1, 2, 3, 5, 6, 5, 3, 2, -1],
      bass: [110.0, 110.0, 82.41, 82.41],
      wave: "triangle",
      vol: 0.19,
      decay: 3.0,
      pad: false
    },
    kehuan: {
      bpm: 100,
      scale: [293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 659.26], // Dm 色彩
      melody: [0, 3, 5, 6, 5, 3, 0, -1, 3, 5, 6, 5, 3, 1, 0, -1],
      bass: [110.0, 110.0, 146.83, 146.83],
      wave: "sawtooth",
      vol: 0.11,
      decay: 0.8,
      pad: false,
      kick: true
    },
    zhexue: {
      bpm: 88,
      scale: [523.25, 587.33, 659.26, 783.99, 880.0, 1046.5], // C5 高音区
      melody: [0, 2, 4, 5, 4, 2, 0, -1, 2, 4, 5, 4, 2, 0, -1, -1],
      bass: [130.81, 130.81, 196.0, 196.0],
      wave: "sine",
      vol: 0.18,
      decay: 1.8,
      pad: true
    }
  };

  var ctx = null;
  var master = null;
  var delay = null;
  var theme = null;
  var playing = false;
  var step = 0;
  var nextNoteTime = 0;
  var stepDur = 0.4;
  var timer = null;
  var btn = null;

  /* ---------- 样式注入 ---------- */
  var style = document.createElement("style");
  style.textContent =
    "#bgm-toggle{" +
    "position:fixed;right:22px;bottom:22px;z-index:9999;" +
    "width:48px;height:48px;border-radius:50%;" +
    "border:1px solid rgba(255,255,255,.35);" +
    "background:rgba(10,12,18,.62);backdrop-filter:blur(6px);" +
    "color:#cfc39a;font-size:21px;line-height:1;cursor:pointer;" +
    "display:flex;align-items:center;justify-content:center;" +
    "transition:all .3s ease;box-shadow:0 4px 18px rgba(0,0,0,.35);" +
    "outline:none;}" +
    "#bgm-toggle:hover{transform:scale(1.08);border-color:#fff;color:#fff;}" +
    "#bgm-toggle.playing{color:#d4af37;border-color:#d4af37;animation:bgmFloat 2.6s ease-in-out infinite,bgmPulse 2.6s ease-in-out infinite;}" +
    "#bgm-toggle.off{opacity:.6;}" +
    "#bgm-toggle.off::after{content:'';position:absolute;left:10px;top:22px;width:26px;height:2px;" +
    "background:#ff6b6b;transform:rotate(-45deg);border-radius:2px;}" +
    "#bgm-toggle.playing[data-theme='kehuan']{color:#00e5ff;border-color:#00e5ff;animation:bgmFloat 2.6s ease-in-out infinite,bgmPulseCyan 2.6s ease-in-out infinite;}" +
    "#bgm-toggle.playing[data-theme='zhexue']{color:#e8d9a8;border-color:#e8d9a8;animation:bgmFloat 2.6s ease-in-out infinite,bgmPulseMoon 2.6s ease-in-out infinite;}" +
    "@keyframes bgmFloat{0%,100%{margin-top:0}50%{margin-top:-4px}}" +
    "@keyframes bgmPulse{0%,100%{box-shadow:0 4px 18px rgba(0,0,0,.35),0 0 0 rgba(212,175,55,0)}50%{box-shadow:0 4px 18px rgba(0,0,0,.35),0 0 20px rgba(212,175,55,.55)}}" +
    "@keyframes bgmPulseCyan{0%,100%{box-shadow:0 4px 18px rgba(0,0,0,.35),0 0 0 rgba(0,229,255,0)}50%{box-shadow:0 4px 18px rgba(0,0,0,.35),0 0 20px rgba(0,229,255,.55)}}" +
    "@keyframes bgmPulseMoon{0%,100%{box-shadow:0 4px 18px rgba(0,0,0,.35),0 0 0 rgba(232,217,168,0)}50%{box-shadow:0 4px 18px rgba(0,0,0,.35),0 0 20px rgba(232,217,168,.55)}}" +
    "@media(max-width:600px){#bgm-toggle{right:14px;bottom:14px;width:42px;height:42px;font-size:18px;}}";
  document.head.appendChild(style);

  /* ---------- 主题检测 ---------- */
  function detectTheme() {
    var c = document.body.className || "";
    if (c.indexOf("kehuan") > -1) return "kehuan";
    if (c.indexOf("zhexue") > -1) return "zhexue";
    if (c.indexOf("xuanhuan") > -1) return "xuanhuan";
    return "home";
  }

  /* ---------- 音频图 ---------- */
  function ensureCtx() {
    if (ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);

    delay = ctx.createDelay(1.2);
    delay.delayTime.value = 0.38;
    var fb = ctx.createGain();
    fb.gain.value = 0.32;
    var wet = ctx.createGain();
    wet.gain.value = 0.32;
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(master);
  }

  function playNote(freq, time, dur, vol, type) {
    var o = ctx.createOscillator();
    o.type = type || "sine";
    o.frequency.value = freq;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(vol, time + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(g);
    g.connect(master);
    var send = ctx.createGain();
    send.gain.value = 0.45;
    g.connect(send);
    send.connect(delay);
    o.start(time);
    o.stop(time + dur + 0.2);
  }

  function playKick(time) {
    var o = ctx.createOscillator();
    o.type = "sine";
    var g = ctx.createGain();
    o.frequency.setValueAtTime(160, time);
    o.frequency.exponentialRampToValueAtTime(42, time + 0.12);
    g.gain.setValueAtTime(0.32, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    o.connect(g);
    g.connect(master);
    o.start(time);
    o.stop(time + 0.25);
  }

  function playPad(time) {
    var root = theme.scale[0] / 2;
    [1, 1.5, 2].forEach(function (r) {
      playNote(root * r, time, 7.5, 0.06, "sine");
    });
  }

  /* ---------- 调度器 ---------- */
  function scheduleStep(time, s) {
    var mel = theme.melody;
    var mi = mel[s % mel.length];
    if (mi >= 0) {
      playNote(theme.scale[mi], time, theme.decay, theme.vol, theme.wave);
    }
    if (s % 8 === 0) {
      var bar = Math.floor(s / 8);
      var bf = theme.bass[bar % theme.bass.length];
      playNote(bf, time, 3.2, 0.15, "sine");
    }
    if (theme.pad && s % 16 === 0) playPad(time);
    if (theme.kick && s % 4 === 2) playKick(time);
  }

  function scheduler() {
    while (nextNoteTime < ctx.currentTime + 0.45) {
      scheduleStep(nextNoteTime, step);
      nextNoteTime += stepDur;
      step++;
    }
  }

  /* ---------- 播放控制 ---------- */
  function startMusic() {
    ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    theme = THEMES[detectTheme()] || THEMES.home;
    stepDur = (60 / theme.bpm) * 0.5;
    step = 0;
    nextNoteTime = ctx.currentTime + 0.12;
    if (timer) clearInterval(timer);
    timer = setInterval(scheduler, 90);
    playing = true;
    btn.classList.add("playing");
    btn.classList.remove("off");
    btn.title = "关闭音乐";
    localStorage.setItem("novel_bgm", "1");
  }

  function stopMusic() {
    if (timer) clearInterval(timer);
    timer = null;
    if (ctx && ctx.state === "running") ctx.suspend();
    playing = false;
    btn.classList.remove("playing");
    btn.classList.add("off");
    btn.title = "开启音乐";
    localStorage.setItem("novel_bgm", "0");
  }

  /* ---------- 按钮 ---------- */
  btn = document.createElement("button");
  btn.id = "bgm-toggle";
  btn.type = "button";
  btn.className = "off";
  btn.textContent = "♪";
  btn.dataset.theme = detectTheme();
  btn.title = "开启音乐";
  document.body.appendChild(btn);

  btn.addEventListener("click", function () {
    if (playing) stopMusic();
    else startMusic();
  });

  /* 记住上次偏好：若曾开启，在用户首次交互时自动续播 */
  if (localStorage.getItem("novel_bgm") === "1") {
    var autoStart = function () {
      window.removeEventListener("click", autoStart);
      if (!playing) startMusic();
    };
    window.addEventListener("click", autoStart);
  }
})();
