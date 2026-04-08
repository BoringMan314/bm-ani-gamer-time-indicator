(function () {
  'use strict';

  const OFFSET_SEC = 90;
  /** 未自訂擴充功能快捷鍵時啟用；若 chrome://extensions/shortcuts 已改過則停用 */
  const FIXED_SKIP_HOTKEY = 's';
  const MARKER_ID = 'ani-gamer-plus90-marker';

  function findVideo(root) {
    const v =
      root.querySelector('#ani_video_html5_api') ||
      root.querySelector('.videoframe video') ||
      root.querySelector('video');
    return v || null;
  }

  function findProgressHolder(root) {
    return (
      root.querySelector('.vjs-progress-holder') ||
      root.querySelector('.vjs-progress-control .vjs-slider')
    );
  }

  function ensureMarker(doc, holder) {
    let el = holder.querySelector(`#${MARKER_ID}`);
    if (!el) {
      el = doc.createElement('div');
      el.id = MARKER_ID;
      el.setAttribute('aria-hidden', 'true');
      Object.assign(el.style, {
        position: 'absolute',
        top: '0',
        bottom: '0',
        width: '2px',
        marginLeft: '-1px',
        background: '#ffcc00',
        boxShadow: '0 0 2px rgba(0,0,0,0.45)',
        pointerEvents: 'none',
        zIndex: '5',
        display: 'none',
        left: '0%',
      });
      const win = doc.defaultView;
      const pos = win.getComputedStyle(holder).position;
      if (pos === 'static') {
        holder.style.position = 'relative';
      }
      holder.appendChild(el);
    }
    return el;
  }

  function updateMarker(video, marker) {
    const d = video.duration;
    if (!d || !isFinite(d) || d <= 0) {
      marker.style.display = 'none';
      return;
    }
    const t = video.currentTime + OFFSET_SEC;
    if (t > d) {
      marker.style.display = 'none';
      return;
    }
    const pct = (t / d) * 100;
    marker.style.left = `${pct}%`;
    marker.style.display = 'block';
  }

  function attachToDocument(doc) {
    const root = doc.body || doc.documentElement;
    if (!root) return;

    let lastSkipAt = 0;
    const SKIP_DEBOUNCE_MS = 200;

    let video = null;
    let marker = null;
    let raf = 0;
    let vfWatch = null;

    function tick() {
      if (!video || !marker || !video.isConnected) return;
      updateMarker(video, marker);
      if (!video.paused) {
        raf = doc.defaultView.requestAnimationFrame(tick);
      }
    }

    function scheduleTick() {
      if (raf) {
        doc.defaultView.cancelAnimationFrame(raf);
        raf = 0;
      }
      tick();
      if (video && !video.paused) {
        raf = doc.defaultView.requestAnimationFrame(tick);
      }
    }

    function bindVideo(v) {
      if (video === v) return;
      if (video) {
        video.removeEventListener('timeupdate', scheduleTick);
        video.removeEventListener('seeked', scheduleTick);
        video.removeEventListener('loadedmetadata', scheduleTick);
        video.removeEventListener('durationchange', scheduleTick);
        video.removeEventListener('play', onPlay);
        video.removeEventListener('pause', onPause);
      }
      video = v;
      if (!video) return;
      video.addEventListener('timeupdate', scheduleTick);
      video.addEventListener('seeked', scheduleTick);
      video.addEventListener('loadedmetadata', scheduleTick);
      video.addEventListener('durationchange', scheduleTick);
      video.addEventListener('play', onPlay);
      video.addEventListener('pause', onPause);
      scheduleTick();
    }

    function onPlay() {
      scheduleTick();
    }

    function onPause() {
      if (raf) {
        doc.defaultView.cancelAnimationFrame(raf);
        raf = 0;
      }
      scheduleTick();
    }

    function tryMount() {
      const v = findVideo(doc);
      const h = v ? findProgressHolder(doc) : null;
      if (!v || !h) return false;
      marker = ensureMarker(doc, h);
      bindVideo(v);
      return true;
    }

    function watchVideoframe() {
      const vf = doc.querySelector('.videoframe');
      if (!vf || vfWatch) return;
      vfWatch = new MutationObserver(() => {
        const h = findProgressHolder(doc);
        const m = doc.getElementById(MARKER_ID);
        if (h && (!m || !h.contains(m))) {
          tryMount();
        }
      });
      vfWatch.observe(vf, { childList: true, subtree: true });
    }

    if (tryMount()) {
      watchVideoframe();
    } else {
      const obs = new MutationObserver(() => {
        if (tryMount()) {
          obs.disconnect();
          watchVideoframe();
        }
      });
      obs.observe(root, { childList: true, subtree: true });
    }

    doc.defaultView.addEventListener(
      'load',
      () => {
        tryMount();
      },
      { once: true }
    );

    function skip90() {
      const now = Date.now();
      if (now - lastSkipAt < SKIP_DEBOUNCE_MS) return;
      lastSkipAt = now;
      let v = video && video.isConnected ? video : findVideo(doc);
      if (!v || !v.isConnected) return;
      const d = v.duration;
      if (!d || !isFinite(d) || d <= 0) return;
      v.currentTime = Math.min(d, v.currentTime + OFFSET_SEC);
    }

    chrome.runtime.onMessage.addListener((msg) => {
      if (!msg || msg.type !== 'skip90') return;
      skip90();
    });

    let fixedHotkeyHidden = false;

    async function refreshFixedHotkeyState() {
      try {
        const r = await chrome.runtime.sendMessage({ type: 'getSkipCommandState' });
        fixedHotkeyHidden = r?.commandShortcutCustomized === true;
      } catch (_) {
        fixedHotkeyHidden = false;
      }
    }

    refreshFixedHotkeyState();
    doc.addEventListener('visibilitychange', () => {
      if (doc.visibilityState === 'visible') refreshFixedHotkeyState();
    });

    doc.defaultView.addEventListener(
      'keydown',
      (e) => {
        if (fixedHotkeyHidden) return;
        if (e.defaultPrevented) return;
        if (e.key.length !== 1 || e.key.toLowerCase() !== FIXED_SKIP_HOTKEY) return;
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        const el = e.target;
        if (el && el.nodeType === 1) {
          const tag = el.tagName;
          if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable) {
            return;
          }
          if (el.closest && el.closest('input, textarea, select, [contenteditable="true"]')) {
            return;
          }
        }
        e.preventDefault();
        skip90();
      },
      true
    );
  }

  attachToDocument(document);
})();
