
      (function () {
        "use strict";
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
        var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
        var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

        /* ----- split verses into words ----- */
        function splitWords(el, text) {
          text.split(" ").forEach(function (word, i, arr) {
            var s = document.createElement("span");
            s.className = "w";
            s.textContent = word;
            el.appendChild(s);
            if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
          });
          return el.querySelectorAll(".w");
        }
        var heroWords = splitWords(document.getElementById("heroVerse"), "“I am the light of the world.”");

        function paintWords(words, p, start, step) {
          for (var i = 0; i < words.length; i++) {
            var wp = easeOut(seg(p, start + i * step, start + i * step + step * 1.6));
            var w = words[i];
            w.style.opacity = (0.5 + 0.5 * wp).toFixed(3);
            w.style.transform = "translateY(" + (8 * (1 - wp)).toFixed(1) + "px)";
            var lit = wp > 0.85;
            if (w._lit !== lit) { w._lit = lit; w.classList.toggle("lit", lit); }
          }
        }

        /* ----- elements ----- */
        var topbar = document.getElementById("topbar");
        var stickyLive = document.getElementById("stickyLive");
        var heroScrub = document.getElementById("heroScrub");
        var jNebula = document.getElementById("jNebula");
        var jStars = document.getElementById("jStars");
        var jJesus = document.getElementById("jJesus");
        var jGlow = document.getElementById("jGlow");
        var jFlare = document.getElementById("jFlare");
        var jEarth = document.getElementById("jEarth");
        var jNl = document.getElementById("jNl");
        var jClouds = document.getElementById("jClouds");
        var heroRef = document.getElementById("heroRef");
        var heroEyebrow = document.getElementById("heroEyebrow");
        var heroMain = document.getElementById("heroMain");
        var heroContent = document.getElementById("heroContent");
        var heroBarTop = document.getElementById("heroBarTop");
        var heroBarBottom = document.getElementById("heroBarBottom");
        var scrollHint = document.getElementById("scrollHint");
        var heroProgress = document.getElementById("heroProgress");
        var appSection = document.getElementById("app");
        var appPhone = document.getElementById("appPhone");
        var liveSection = document.getElementById("live");
        var finalSection = document.querySelector(".final");
        var parallaxEls = document.querySelectorAll("[data-parallax]");
        var annivScrub = document.getElementById("annivScrub");

        /* ----- cached layout: measured on load/resize only, never in the scroll handler ----- */
        var layout = { vh: window.innerHeight, width: window.innerWidth, mobile: window.innerWidth < 760 };
        var sectionMetrics = {};
        var parallaxCache = [];
        function metricOf(el) {
          var r = el.getBoundingClientRect();
          var top = r.top + window.scrollY;
          return { top: top, bottom: top + r.height, height: r.height };
        }
        function refreshLayout() {
          layout.vh = window.innerHeight;
          layout.width = window.innerWidth;
          layout.mobile = layout.width < 760;
          sectionMetrics.hero = metricOf(heroScrub);
          sectionMetrics.app = metricOf(appSection);
          sectionMetrics.anniv = metricOf(annivScrub);
          sectionMetrics.live = metricOf(liveSection);
          sectionMetrics.final = metricOf(finalSection);
          parallaxCache = [];
          parallaxEls.forEach(function (el) {
            var parentMetric = metricOf(el.parentElement);
            parallaxCache.push({ el: el, top: parentMetric.top, height: parentMetric.height, factor: parseFloat(el.dataset.parallax) });
          });
        }
        function progressFromMetric(metric, y) {
          var total = metric.height - layout.vh;
          if (total <= 0) return 0;
          return clamp((y - metric.top) / total, 0, 1);
        }
        function metricVisible(metric, y, margin) {
          margin = margin || 0;
          return metric.bottom > y - margin && metric.top < y + layout.vh + margin;
        }

        /* ----- cosmic starfield (canvas): points → warp streaks -----
           Two timelines share this canvas: the SCROLL scrub writes the camera
           state (sfWarp / sfZoom / sfAlpha) via render(), while an AMBIENT
           rAF loop (below) keeps redrawing with per-star twinkle and the
           occasional shooting star, so the universe lives even at rest. */
        var sctx = jStars.getContext("2d");
        var stars = [], starW = 0, starH = 0, starsDrawn = false;
        var sfWarp = 0, sfZoom = 1, sfAlpha = 0;
        var starCols = ["#ffffff", "#ffffff", "#ffe9b8", "#cfe4ff", "#fff6e0"];
        sctx.lineCap = "round";
        function sizeStars() {
          var stage = heroScrub.querySelector(".scrub-stage");
          var w = stage.clientWidth, h = stage.clientHeight;
          if (!w || !h) return;
          if (stars.length && Math.abs(w - starW) < 3 && Math.abs(h - starH) < 3) return;
          var dpr = Math.min(window.devicePixelRatio || 1, layout.mobile ? 1.25 : 1.5);
          jStars.width = Math.round(w * dpr);
          jStars.height = Math.round(h * dpr);
          sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          starW = w; starH = h;
          stars = [];
          var n = layout.mobile ? 64 : 150;
          for (var i = 0; i < n; i++) {
            var angle = Math.random() * 6.2832;
            stars.push({
              dx: Math.cos(angle),
              dy: Math.sin(angle),
              r: Math.pow(Math.random(), 0.72),
              s: 0.6 + Math.random() * 1.7,
              b: 0.35 + Math.random() * 0.65,
              tw: Math.random() * 6.2832,
              tws: 0.3 + Math.random() * 0.9,
              c: starCols[Math.floor(Math.random() * starCols.length)]
            });
          }
          starsDrawn = false;
        }
        /* shooting star: one faint streak every ~9–14s while at rest */
        var shoot = { active: false, nextAt: 0, t0: 0, dur: 950, x: 0, y: 0, ux: 0, uy: 0, dist: 0, tail: 90 };
        function drawStars() {
          if (!starW) return;
          var warp = sfWarp, zoom = sfZoom, alpha = sfAlpha;
          if (alpha <= 0.01) {
            if (starsDrawn) { sctx.clearRect(0, 0, starW, starH); starsDrawn = false; }
            return;
          }
          var t = performance.now() / 1000;
          sctx.clearRect(0, 0, starW, starH);
          starsDrawn = true;
          var cx = starW / 2, cy = starH * 0.46, maxR = Math.hypot(starW, starH) * 0.52;
          for (var i = 0; i < stars.length; i++) {
            var st = stars[i];
            var R = st.r * maxR * zoom * (1 + warp * warp * 2.4 * st.r);
            var x = cx + st.dx * R, y = cy + st.dy * R * 0.92;
            var twk = 0.7 + 0.3 * Math.sin(t * st.tws + st.tw);
            sctx.globalAlpha = alpha * st.b * twk;
            var len = warp * st.r * maxR * 0.5;
            if (len > 2.5) {
              var R2 = R - len;
              sctx.strokeStyle = st.c;
              sctx.lineWidth = st.s * (1 + warp * 0.6);
              sctx.beginPath();
              sctx.moveTo(cx + st.dx * R2, cy + st.dy * R2 * 0.92);
              sctx.lineTo(x, y);
              sctx.stroke();
            } else {
              sctx.fillStyle = st.c;
              sctx.beginPath();
              sctx.arc(x, y, st.s * 0.75 * (0.85 + 0.3 * twk), 0, 6.2832);
              sctx.fill();
            }
          }
          /* shooting star (ambient only — never during the warp) */
          if (shoot.active && warp < 0.05) {
            var sp = (performance.now() - shoot.t0) / shoot.dur;
            if (sp >= 1) {
              shoot.active = false;
              shoot.nextAt = performance.now() + 9000 + Math.random() * 5000;
            } else {
              var hx = shoot.x + shoot.ux * shoot.dist * sp;
              var hy = shoot.y + shoot.uy * shoot.dist * sp;
              var grad = sctx.createLinearGradient(hx - shoot.ux * shoot.tail, hy - shoot.uy * shoot.tail, hx, hy);
              var sa = Math.sin(Math.PI * sp) * 0.75 * alpha;
              grad.addColorStop(0, "rgba(255,244,214,0)");
              grad.addColorStop(1, "rgba(255,244,214," + sa.toFixed(3) + ")");
              sctx.globalAlpha = 1;
              sctx.strokeStyle = grad;
              sctx.lineWidth = 1.6;
              sctx.beginPath();
              sctx.moveTo(hx - shoot.ux * shoot.tail, hy - shoot.uy * shoot.tail);
              sctx.lineTo(hx, hy);
              sctx.stroke();
            }
          }
          sctx.globalAlpha = 1;
        }


        function render(y, hp) {
          var vh = layout.vh;

          if (topbar) topbar.classList.toggle("scrolled", y > vh * 0.72);

          /* sticky live button: after hero, hidden while live section or final CTA is on screen */
          var liveVisible = metricVisible(sectionMetrics.live, y);
          var finalVisible = metricVisible(sectionMetrics.final, y);
          stickyLive.classList.toggle("show", y > vh * 0.9 && !liveVisible && !finalVisible);

          /* ----- cosmic journey scrub -----
             0–30 universe + verse · 30–55 warp through Jesus into light ·
             55–80 Earth grows + dive · 80–100 Netherlands dawn + resolve */
          var heroActive = metricVisible(sectionMetrics.hero, y);
          heroScrub.classList.toggle("hero-live", heroActive);
          if (heroActive) {
          var mob = layout.mobile;
          var bars = 1 - seg(hp, 0, 0.07);
          heroBarTop.style.transform = "translateY(" + (-100 * (1 - bars)).toFixed(1) + "%)";
          heroBarBottom.style.transform = "translateY(" + (100 * (1 - bars)).toFixed(1) + "%)";
          /* phase 1 · the universe */
          jNebula.style.transform = "scale(" + (1 + 0.16 * hp).toFixed(3) + ")";
          jNebula.style.opacity = (1 - seg(hp, 0.48, 0.60)).toFixed(3);
          var warp = seg(hp, 0.30, 0.52) * (mob ? 0.7 : 1);
          sfWarp = warp;
          sfZoom = 1 + 0.12 * seg(hp, 0, 0.30) + 0.25 * warp;
          sfAlpha = 1 - seg(hp, 0.55, 0.68);
          drawStars();
          var jScale = 1 + 0.10 * seg(hp, 0, 0.30) + 1.55 * Math.pow(seg(hp, 0.30, 0.55), 2);
          jJesus.style.transform = "translateY(" + (-22 * seg(hp, 0, 0.55)).toFixed(1) + "px) scale(" + jScale.toFixed(3) + ")";
          jJesus.style.opacity = (1 - seg(hp, 0.47, 0.565)).toFixed(3);
          jGlow.style.opacity = ((0.75 + 0.25 * seg(hp, 0.38, 0.52)) * (1 - seg(hp, 0.52, 0.62))).toFixed(3);
          paintWords(heroWords, hp, 0.04, 0.026);
          heroRef.style.opacity = (seg(hp, 0.235, 0.285) * (1 - seg(hp, 0.315, 0.365))).toFixed(3);
          var ebOut = seg(hp, 0.24, 0.32);
          heroEyebrow.style.opacity = (1 - ebOut).toFixed(3);
          heroEyebrow.style.transform = "translateY(" + (-12 * ebOut).toFixed(1) + "px)";
          var verseOut = seg(hp, 0.30, 0.40);
          heroContent.style.opacity = (1 - verseOut).toFixed(3);
          heroContent.style.transform = "translateY(" + (-34 * verseOut).toFixed(1) + "px) scale(" + (1 - 0.03 * verseOut).toFixed(3) + ")";
          /* phase 2 · through Him, into light */
          var flare = seg(hp, 0.47, 0.565) * (1 - 0.85 * seg(hp, 0.60, 0.72)) * (1 - seg(hp, 0.74, 0.84));
          jFlare.style.opacity = flare.toFixed(3);
          jFlare.style.transform = "scale(" + (0.55 + 0.85 * seg(hp, 0.47, 0.66)).toFixed(3) + ")";
          /* phase 3 · Earth resolves full-frame out of the light, then we dive
             toward Europe. The layer is full-bleed, so the zoom starts at 1.0
             (never below — a smaller layer would float as a rectangle) and the
             push-in is a pure camera zoom of the whole frame. */
          var eScale = (1 + 0.38 * easeOut(seg(hp, 0.575, 0.80))) * (1 + 1.15 * Math.pow(seg(hp, 0.80, 0.905), 2));
          jEarth.style.transform = "scale(" + eScale.toFixed(3) + ")";
          jEarth.style.opacity = (seg(hp, 0.555, 0.635) * (1 - seg(hp, 0.865, 0.93))).toFixed(3);
          /* clouds rush past as we break through the atmosphere */
          var cOp = seg(hp, 0.755, 0.825) * (1 - seg(hp, 0.855, 0.925));
          jClouds.style.opacity = cOp.toFixed(3);
          jClouds.style.transform = "scale(" + (0.92 + 0.75 * seg(hp, 0.755, 0.925)).toFixed(3) + ")";
          /* phase 4 · arrival over the Netherlands at golden dawn */
          jNl.style.opacity = seg(hp, 0.85, 0.925).toFixed(3);
          jNl.style.transform = "scale(" + (1.17 - 0.15 * easeOut(seg(hp, 0.85, 1))).toFixed(3) + ")";
          var mainIn = easeOut(seg(hp, 0.895, 0.985));
          heroMain.style.opacity = mainIn.toFixed(3);
          heroMain.style.transform = "translateY(" + (38 * (1 - mainIn)).toFixed(1) + "px)";
          heroMain.style.pointerEvents = mainIn > 0.5 ? "auto" : "none";
          scrollHint.style.opacity = (1 - seg(hp, 0, 0.05)).toFixed(3);
          heroProgress.style.transform = "scaleX(" + hp.toFixed(3) + ")";
          }

          /* ----- app showcase — gentle parallax tilt on the phone ----- */
          if (appPhone && metricVisible(sectionMetrics.app, y, vh * 0.15)) {
            var acMid = sectionMetrics.app.top + sectionMetrics.app.height / 2;
            var vp = clamp((acMid - (y + vh / 2)) / (vh * 0.9), -1, 1);
            appPhone.style.transform =
              "perspective(1250px) rotateY(" + (-11 - vp * 3).toFixed(2) + "deg)" +
              " rotateX(" + (3 + vp * 1.5).toFixed(2) + "deg)" +
              " rotate(" + (16.5 + vp * 1).toFixed(2) + "deg)" +
              " translateY(" + (vp * 16).toFixed(1) + "px)";
          }

          /* ----- gentle parallax (positions cached outside the scroll handler) ----- */
          parallaxCache.forEach(function (item) {
            if (item.top + item.height < y || item.top > y + vh) return;
            var mid = item.top + item.height / 2 - (y + vh / 2);
            item.el.style.transform = "translateY(" + (-mid * item.factor).toFixed(1) + "px)";
          });
        }

        /* ----- decode the three journey stills before the scroll system starts ----- */
        var heroImages = heroScrub.querySelectorAll(".journey-jesus img, .journey-earth img, .journey-nl img");
        function preloadHeroImages() {
          var jobs = [];
          heroImages.forEach(function (img) {
            if (img.decode) {
              jobs.push(img.decode().catch(function () {}));
            } else if (!img.complete) {
              jobs.push(new Promise(function (resolve) {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              }));
            }
          });
          return Promise.all(jobs);
        }

        function initStaticHero() {
          heroScrub.classList.add("static");
          sizeStars();
          sfWarp = 0; sfZoom = 1; sfAlpha = 0.9;
          drawStars();
          jGlow.style.opacity = "0.8";
          heroBarTop.style.display = "none"; heroBarBottom.style.display = "none";
          heroWords.forEach(function (w) { w.style.opacity = 1; w.style.transform = "none"; });
          heroRef.style.opacity = 1;
          heroMain.style.opacity = 1; heroMain.style.transform = "none"; heroMain.style.pointerEvents = "auto";
          scrollHint.style.display = "none";
          heroProgress.style.transform = "scaleX(1)";
          if (topbar) topbar.classList.add("scrolled");
        }

        /* Smoothed scrub: the rendered hero progress eases toward the real
           scroll progress every animation frame, so small wheel/touch deltas
           never land as visible steps. All layout is cached; the frame loop
           below only reads scrollY and writes transforms/opacity. */
        var heroTargetP = 0, heroSmoothP = 0;
        var frameRunning = false, lastFrameTime = 0;
        function renderFrame(now) {
          var y = window.scrollY;
          heroTargetP = progressFromMetric(sectionMetrics.hero, y);
          if (!metricVisible(sectionMetrics.hero, y)) {
            heroSmoothP = heroTargetP;
          } else {
            var dt = lastFrameTime ? Math.min(50, now - lastFrameTime) : 16.7;
            lastFrameTime = now;
            var catchUp = 1 - Math.exp(-dt / 150);
            var delta = heroTargetP - heroSmoothP;
            heroSmoothP = Math.abs(delta) < 0.00035 ? heroTargetP : heroSmoothP + delta * catchUp;
          }
          render(y, heroSmoothP);
          if (Math.abs(heroTargetP - heroSmoothP) >= 0.00035) {
            requestAnimationFrame(renderFrame);
          } else {
            frameRunning = false;
            lastFrameTime = 0;
          }
        }
        function requestRender() {
          if (frameRunning) return;
          frameRunning = true;
          lastFrameTime = 0;
          requestAnimationFrame(renderFrame);
        }

        /* ----- ambient universe loop -----
           Independent of scroll: while the hero is on screen, keep the
           starfield breathing (twinkle + shooting stars) on its own rAF.
           Pauses when the hero leaves the viewport or the tab is hidden,
           so it costs nothing off-screen. The nebula drift and the glow /
           Jesus breathing are pure CSS loops on the same idea. */
        var ambientOn = false;
        function ambientTick(now) {
          if (!ambientOn) return;
          requestAnimationFrame(ambientTick);
          if (document.hidden || !starW || sfAlpha <= 0.01) return;
          if (!shoot.active && sfWarp < 0.05 && now >= shoot.nextAt) {
            shoot.active = true;
            shoot.t0 = now;
            shoot.dur = 850 + Math.random() * 350;
            shoot.x = starW * (0.15 + Math.random() * 0.7);
            shoot.y = starH * (0.08 + Math.random() * 0.3);
            var dir = Math.random() < 0.5 ? -1 : 1;
            var spd = starW * (0.24 + Math.random() * 0.1);
            shoot.ux = dir * 0.86; shoot.uy = 0.5;
            shoot.dist = spd;
            shoot.tail = 70 + Math.random() * 50;
          }
          drawStars();
        }
        function setAmbient(on) {
          if (on === ambientOn) return;
          ambientOn = on;
          if (on) {
            shoot.nextAt = performance.now() + 5000 + Math.random() * 4000;
            requestAnimationFrame(ambientTick);
          }
        }
        function initScrollSystem() {
          refreshLayout();
          sizeStars();
          heroTargetP = progressFromMetric(sectionMetrics.hero, window.scrollY);
          heroSmoothP = heroTargetP;
          window.addEventListener("scroll", requestRender, { passive: true });
          window.addEventListener("resize", function () {
            refreshLayout();
            sizeStars();
            heroSmoothP = progressFromMetric(sectionMetrics.hero, window.scrollY);
            requestRender();
          });
          window.addEventListener("load", function () { refreshLayout(); requestRender(); });
          if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { refreshLayout(); requestRender(); });
          var heroIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { setAmbient(e.isIntersecting); });
          }, { threshold: 0 });
          heroIO.observe(heroScrub);
          requestRender();
        }

        preloadHeroImages().then(function () {
          if (reduced) initStaticHero();
          else initScrollSystem();
        });

        /* ----- reveal on scroll ----- */
        var revealIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); }
          });
        }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
        document.querySelectorAll(".reveal").forEach(function (el) { revealIO.observe(el); });

        /* ----- animated counters ----- */
        function animateCount(el) {
          var target = +el.dataset.target;
          if (reduced) { el.textContent = target; return; }
          var t0 = null, dur = 1500;
          function step(ts) {
            if (!t0) t0 = ts;
            var t = clamp((ts - t0) / dur, 0, 1);
            el.textContent = Math.round(target * easeOut(t));
            if (t < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
        var statsIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.querySelectorAll(".count").forEach(animateCount);
              statsIO.unobserve(e.target);
            }
          });
        }, { threshold: 0.35 });
        statsIO.observe(document.getElementById("statsGrid"));

        /* ----- rail arrows ----- */
        document.querySelectorAll(".rail-btn").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var rail = document.getElementById(btn.dataset.rail);
            if (rail) rail.scrollBy({ left: (+btn.dataset.dir) * Math.min(rail.clientWidth * 0.85, 660), behavior: reduced ? "auto" : "smooth" });
          });
        });

        /* ================================================================
           IN-DEMO THEATER + INFO MODAL — everything plays on this page
           ================================================================ */
        var modal = document.getElementById("theater");
        var theaterFrame = document.getElementById("theaterFrame");
        var theaterTitle = document.getElementById("theaterTitle");
        var modalVideo = document.getElementById("modalVideo");
        var modalInfo = document.getElementById("modalInfo");
        var infoMedia = document.getElementById("infoMedia");
        var infoPoster = document.getElementById("infoPoster");
        var infoTag = document.getElementById("infoTag");
        var infoTitle = document.getElementById("infoTitle");
        var infoDesc = document.getElementById("infoDesc");
        var lastFocus = null;

        function showModal() {
          modal.hidden = false;
          document.body.style.overflow = "hidden";
          var x = modal.querySelector(".modal-x");
          if (x) x.focus();
        }
        function openTheater(title, videoId) {
          lastFocus = document.activeElement;
          theaterTitle.textContent = title;
          modalInfo.hidden = true;
          modalVideo.hidden = false;
          theaterFrame.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0";
          showModal();
        }
        function openInfo(title, poster, desc, tag) {
          lastFocus = document.activeElement;
          theaterTitle.textContent = title;
          theaterFrame.removeAttribute("src");
          modalVideo.hidden = true;
          modalInfo.hidden = false;
          infoTag.textContent = tag || "BTL TV Program";
          infoTitle.textContent = title;
          infoDesc.textContent = desc;
          if (poster) { infoPoster.src = poster; infoMedia.style.display = ""; }
          else infoMedia.style.display = "none";
          showModal();
        }
        function closeModal() {
          modal.hidden = true;
          theaterFrame.removeAttribute("src");
          document.body.style.overflow = "";
          if (lastFocus && lastFocus.focus) lastFocus.focus();
        }
        modal.addEventListener("click", function (e) {
          if (e.target.closest("[data-close]")) closeModal();
        });
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && !modal.hidden) closeModal();
        });
        document.getElementById("infoLiveBtn").addEventListener("click", function () {
          closeModal();
          liveSection.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
          setTimeout(function () {
            startStream();
            video.muted = false;
            var p = video.play();
            if (p && p.catch) p.catch(function () { video.muted = true; video.play().catch(function () {}); });
          }, reduced ? 60 : 650);
        });

        /* ----- program cards, chapters, partners, store button ----- */
        document.querySelectorAll("[data-program], [data-video]").forEach(function (el) {
          el.addEventListener("click", function (e) {
            e.preventDefault();
            var goHref = el.getAttribute("data-href");
            if (goHref) { window.location.href = goHref; return; }
            var vid = el.getAttribute("data-video");
            var title = el.getAttribute("data-title") || "";
            var card = el.closest(".card, .rail-card");
            if (!title && card) {
              var h = card.querySelector("h3");
              title = h ? h.textContent.trim() : "BTL TV Program";
            }
            if (vid) { openTheater(title || "BTL TV Program", vid); return; }
            if (el.closest(".chapter")) { openTheater("Urdu Audio Bible", "6bjIhLSE504"); return; }
            if (card) {
              var img = card.querySelector("img");
              var p = card.querySelector(".card-body p, .card-desc");
              var tag = card.querySelector(".card-tag");
              openInfo(
                title,
                img ? img.getAttribute("src") : "",
                p ? p.textContent.trim() : "This program plays on the BTL TV channel — watch it on the live broadcast, streaming free around the clock.",
                tag ? tag.textContent.trim() : "BTL TV Program"
              );
              return;
            }
            if (el.closest(".partner")) {
              var sp = el.querySelector("span");
              openInfo(sp ? sp.textContent.trim() : "Ministry Partner", "", "BTL TV works together with ministry partners in the Netherlands and beyond to carry the light further.", "Ministry Partner");
              return;
            }
            if (el.closest(".store-btn")) {
              openInfo("The BTL TV App", "data:image/webp;base64,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", "Watch live TV, browse every program and listen to the Urdu Audio Bible — free on Android. 92 MB · Android 8 and above.", "Mobile App");
              return;
            }
            openInfo(title || "BTL TV", "", "Watch on the live broadcast — streaming free, around the clock.", "BTL TV");
          });
        });

        /* ================================================================
           SEE-ALL GRID MODAL — full category grid, still fully in-demo
           ================================================================ */
        var gridModal = document.getElementById("gridModal");
        var gridTitle = document.getElementById("gridTitle");
        var gridList = document.getElementById("gridList");
        var gridLastFocus = null;
        function closeGrid() {
          if (!gridModal || gridModal.hidden) return;
          gridModal.hidden = true;
          document.body.style.overflow = "";
          if (gridLastFocus && gridLastFocus.focus) gridLastFocus.focus();
        }
        function openGrid(railId, title) {
          var rail = document.getElementById(railId);
          if (!rail || !gridModal) return;
          gridLastFocus = document.activeElement;
          gridTitle.textContent = title;
          gridList.innerHTML = "";
          rail.querySelectorAll(".rail-card").forEach(function (card) {
            var img = card.querySelector("img");
            var titleEl = card.querySelector(".card-titlebar span") || card.querySelector("h3");
            var name = titleEl ? titleEl.textContent.trim() : "BTL TV Program";
            var descEl = card.querySelector(".card-desc");
            var tagEl = card.querySelector(".card-tag");
            var item = document.createElement("a");
            item.href = "#";
            item.className = "card";
            var media = document.createElement("div");
            media.className = "card-media";
            if (img) {
              var gi = document.createElement("img");
              gi.src = img.getAttribute("src");
              gi.alt = name + " — program poster";
              gi.loading = "lazy";
              media.appendChild(gi);
            }
            if (tagEl) {
              var gt = document.createElement("span");
              gt.className = "card-tag";
              gt.textContent = tagEl.textContent.trim();
              media.appendChild(gt);
            }
            var body = document.createElement("div");
            body.className = "card-body";
            var h = document.createElement("h3");
            h.textContent = name;
            var p = document.createElement("p");
            p.textContent = descEl ? descEl.textContent.trim() : "";
            body.appendChild(h);
            body.appendChild(p);
            item.appendChild(media);
            item.appendChild(body);
            item.addEventListener("click", function (e) {
              e.preventDefault();
              var goHref2 = card.getAttribute("data-href");
              closeGrid();
              if (goHref2) { window.location.href = goHref2; return; }
              var vid = card.getAttribute("data-video");
              if (vid) { openTheater(name, vid); return; }
              if (!card.hasAttribute("data-program")) {
                liveSection.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
                return;
              }
              openInfo(name, img ? img.getAttribute("src") : "", p.textContent || "This program plays on the BTL TV channel — watch it on the live broadcast, streaming free around the clock.", tagEl ? tagEl.textContent.trim() : "BTL TV Program");
            });
            gridList.appendChild(item);
          });
          gridModal.hidden = false;
          document.body.style.overflow = "hidden";
          var gx = gridModal.querySelector(".modal-x");
          if (gx) gx.focus();
        }
        if (gridModal) {
          gridModal.addEventListener("click", function (e) { if (e.target.closest("[data-grid-close]")) closeGrid(); });
          document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeGrid(); });
          document.querySelectorAll("[data-grid]").forEach(function (btn) {
            btn.addEventListener("click", function () { openGrid(btn.getAttribute("data-grid"), btn.getAttribute("data-grid-title")); });
          });
        }

        /* ================================================================
           AUDIO BIBLE — cinematic player + the COMPLETE Urdu Bible.
           All 66 books with Urdu names and real chapter counts.
           Browsing is fully functional; there are no audio files in this
           demo, so Play gives an honest pointer to btl-tv.com / the app
           instead of faking progress or durations.
           ================================================================ */
        (function () {
          var section = document.getElementById("audio");
          if (!section) return;
          /* [English name, Urdu name, chapters, testament 0=OT 1=NT] */
          var BOOKS = [
            ["Genesis","پیدائش",50,0],["Exodus","خروج",40,0],["Leviticus","احبار",27,0],["Numbers","گنتی",36,0],
            ["Deuteronomy","استثنا",34,0],["Joshua","یشوع",24,0],["Judges","قضاۃ",21,0],["Ruth","روت",4,0],
            ["1 Samuel","1 سموئیل",31,0],["2 Samuel","2 سموئیل",24,0],["1 Kings","1 سلاطین",22,0],["2 Kings","2 سلاطین",25,0],
            ["1 Chronicles","1 تواریخ",29,0],["2 Chronicles","2 تواریخ",36,0],["Ezra","عزرا",10,0],["Nehemiah","نحمیاہ",13,0],
            ["Esther","آستر",10,0],["Job","ایوب",42,0],["Psalms","زبور",150,0],["Proverbs","امثال",31,0],
            ["Ecclesiastes","واعظ",12,0],["Song of Songs","غزل الغزلات",8,0],["Isaiah","یسعیاہ",66,0],["Jeremiah","یرمیاہ",52,0],
            ["Lamentations","نوحہ",5,0],["Ezekiel","حزقی ایل",48,0],["Daniel","دانی ایل",12,0],["Hosea","ہوسیع",14,0],
            ["Joel","یوایل",3,0],["Amos","عاموس",9,0],["Obadiah","عبدیاہ",1,0],["Jonah","یوناہ",4,0],
            ["Micah","میکاہ",7,0],["Nahum","ناحوم",3,0],["Habakkuk","حبقوق",3,0],["Zephaniah","صفنیاہ",3,0],
            ["Haggai","حجی",2,0],["Zechariah","زکریاہ",14,0],["Malachi","ملاکی",4,0],
            ["Matthew","متی",28,1],["Mark","مرقس",16,1],["Luke","لوقا",24,1],["John","یوحنا",21,1],
            ["Acts","اعمال",28,1],["Romans","رومیوں",16,1],["1 Corinthians","1 کرنتھیوں",16,1],["2 Corinthians","2 کرنتھیوں",13,1],
            ["Galatians","گلتیوں",6,1],["Ephesians","افسیوں",6,1],["Philippians","فلپیوں",4,1],["Colossians","کلسیوں",4,1],
            ["1 Thessalonians","1 تھسلنیکیوں",5,1],["2 Thessalonians","2 تھسلنیکیوں",3,1],["1 Timothy","1 تیمتھیس",6,1],["2 Timothy","2 تیمتھیس",4,1],
            ["Titus","ططس",3,1],["Philemon","فلپمون",1,1],["Hebrews","عبرانیوں",13,1],["James","یعقوب",5,1],
            ["1 Peter","1 پطرس",5,1],["2 Peter","2 پطرس",3,1],["1 John","1 یوحنا",5,1],["2 John","2 یوحنا",1,1],
            ["3 John","3 یوحنا",1,1],["Jude","یہوداہ",1,1],["Revelation","مکاشفہ",22,1]
          ];
          var TNAME = ["Old Testament", "New Testament"];
          var cur = { b: 39, c: 1, playing: false }; /* default: Matthew — Chapter 1 */
          var tab = 1; /* New Testament open by default, like the live site */
          var speeds = [1, 1.25, 1.5, 2, 0.75], speedIx = 0;

          var $ = function (id) { return document.getElementById(id); };
          var elTitle = $("abTitle"), elMeta = $("abMeta"), elFill = $("abFill"),
              elPosL = $("abPosL"), elPosR = $("abPosR"), elVis = $("abVisLabel"),
              elWave = $("abWave"), elChList = $("abChList"),
              elChHead = $("abChHeadLbl"), elChMeta = $("abChHeadMeta"),
              elBooks = $("abBooks"), elPills = $("abPills"), elPillsTitle = $("abPillsTitle"),
              elSearch = $("abSearch"), elTabOT = $("abTabOT"), elTabNT = $("abTabNT"),
              elPlay = $("abPlay"), elPlayIcon = $("abPlayIcon"), elPlayLabel = $("abPlayLabel");
          if (!elBooks || !elPills || !elChList || !elWave) return;

          function bookNameHTML(b) {
            return BOOKS[b][0] + " &middot; <span class=\"ur\" dir=\"rtl\">" + BOOKS[b][1] + "</span>";
          }

          /* ----- golden waveform: static bars that breathe gently while "playing" ----- */
          (function buildWave() {
            var N = 56, frag = document.createDocumentFragment();
            for (var i = 0; i < N; i++) {
              var bar = document.createElement("i");
              var t = i / (N - 1);
              var h = 22 + 66 * Math.abs(Math.sin(t * Math.PI * 3.1)) * (0.45 + 0.55 * Math.abs(Math.sin(t * Math.PI * 9.7 + 1.3)));
              bar.style.height = Math.round(h) + "%";
              bar.style.animationDuration = (0.85 + (i % 7) * 0.13).toFixed(2) + "s";
              bar.style.animationDelay = (-(i % 11) * 0.09).toFixed(2) + "s";
              frag.appendChild(bar);
            }
            elWave.appendChild(frag);
          })();

          /* ----- living sparkles over the Bible visual (transform/opacity only) ----- */
          (function buildSparks() {
            var box = $("abSparks");
            if (!box || reduced) return;
            var frag = document.createDocumentFragment(), i, s;
            for (i = 0; i < 34; i++) { /* golden dust drifting upward */
              s = document.createElement("i");
              s.className = "drift";
              var sz = 2 + Math.random() * 4.5;
              s.style.width = sz.toFixed(1) + "px"; s.style.height = sz.toFixed(1) + "px";
              s.style.left = (2 + Math.random() * 95).toFixed(1) + "%";
              s.style.top = (14 + Math.random() * 82).toFixed(1) + "%";
              s.style.setProperty("--x", Math.round(-16 + Math.random() * 34) + "px");
              s.style.setProperty("--o", (0.45 + Math.random() * 0.5).toFixed(2));
              s.style.animationDuration = (9 + Math.random() * 9).toFixed(1) + "s";
              s.style.animationDelay = (-Math.random() * 16).toFixed(1) + "s";
              frag.appendChild(s);
            }
            for (i = 0; i < 16; i++) { /* twinkling stars */
              s = document.createElement("i");
              s.className = "tw";
              var ts = 2 + Math.random() * 2.6;
              s.style.width = ts.toFixed(1) + "px"; s.style.height = ts.toFixed(1) + "px";
              s.style.left = (3 + Math.random() * 94).toFixed(1) + "%";
              s.style.top = (4 + Math.random() * 70).toFixed(1) + "%";
              s.style.animationDuration = (2.6 + Math.random() * 2.2).toFixed(1) + "s";
              s.style.animationDelay = (-Math.random() * 5).toFixed(1) + "s";
              frag.appendChild(s);
            }
            for (i = 0; i < 6; i++) { /* soft bokeh orbs */
              s = document.createElement("i");
              s.className = "orb";
              var os = 22 + Math.random() * 30;
              s.style.width = os.toFixed(0) + "px"; s.style.height = os.toFixed(0) + "px";
              s.style.left = (4 + Math.random() * 88).toFixed(1) + "%";
              s.style.top = (6 + Math.random() * 62).toFixed(1) + "%";
              s.style.animationDuration = (5 + Math.random() * 4).toFixed(1) + "s";
              s.style.animationDelay = (-Math.random() * 6).toFixed(1) + "s";
              frag.appendChild(s);
            }
            box.appendChild(frag);
          })();

          /* ----- render: book grid (tab + search aware) ----- */
          function renderBooks() {
            var q = elSearch ? elSearch.value.trim().toLowerCase() : "";
            elBooks.innerHTML = "";
            var shown = 0;
            BOOKS.forEach(function (bk, ix) {
              if (!q && bk[3] !== tab) return;
              if (q && bk[0].toLowerCase().indexOf(q) === -1 && bk[1].indexOf(elSearch.value.trim()) === -1) return;
              var btn = document.createElement("button");
              btn.type = "button";
              btn.className = "ab-book" + (ix === cur.b ? " on" : "");
              btn.setAttribute("aria-pressed", ix === cur.b ? "true" : "false");
              btn.innerHTML = "<span class=\"en\"></span><span class=\"ur\" dir=\"rtl\"></span><span class=\"ch\"></span>";
              btn.children[0].textContent = bk[0];
              btn.children[1].textContent = bk[1];
              btn.children[2].textContent = bk[2] + (bk[2] === 1 ? " chapter" : " chapters") + (q ? " · " + (bk[3] ? "NT" : "OT") : "");
              btn.addEventListener("click", function () { selectBook(ix, true); });
              elBooks.appendChild(btn);
              shown++;
            });
            if (!shown) {
              var p = document.createElement("p");
              p.className = "ab-empty";
              p.textContent = "No book matches your search — try another name.";
              elBooks.appendChild(p);
            }
          }

          /* ----- render: chapter pills + player chapter list ----- */
          function renderChapters() {
            var bk = BOOKS[cur.b], n = bk[2], i;
            elPills.innerHTML = "";
            elChList.innerHTML = "";
            for (i = 1; i <= n; i++) {
              (function (ch) {
                var pill = document.createElement("button");
                pill.type = "button";
                pill.className = "ab-pill" + (ch === cur.c ? " on" : "");
                pill.textContent = ch;
                pill.setAttribute("aria-label", bk[0] + " chapter " + ch);
                pill.addEventListener("click", function () { selectChapter(ch); });
                elPills.appendChild(pill);

                var row = document.createElement("button");
                row.type = "button";
                row.className = "ab-chrow" + (ch === cur.c ? " now" : "");
                row.innerHTML = "<span class=\"n\"></span><span class=\"lbl\"></span><span class=\"sel\">Selected</span>";
                row.children[0].textContent = ch + ".";
                row.children[1].textContent = bk[0] + " " + ch + " · " + bk[1];
                row.addEventListener("click", function () { selectChapter(ch); });
                elChList.appendChild(row);
              })(i);
            }
            var active = elChList.querySelector(".ab-chrow.now");
            if (active) {
              var delta = active.getBoundingClientRect().top - elChList.getBoundingClientRect().top;
              elChList.scrollTop = Math.max(0, elChList.scrollTop + delta - elChList.clientHeight / 2 + active.offsetHeight / 2);
            }
          }

          /* ----- sync every surface with the current selection ----- */
          function updatePlayer() {
            var bk = BOOKS[cur.b];
            elTitle.innerHTML = bookNameHTML(cur.b) + " &mdash; Chapter " + cur.c;
            elMeta.textContent = "Urdu Audio Bible · " + TNAME[bk[3]] + " · Chapter " + cur.c + " of " + bk[2];
            elFill.style.width = ((cur.c / bk[2]) * 100).toFixed(2) + "%";
            elPosL.textContent = "Chapter " + cur.c + " of " + bk[2];
            elPosR.textContent = bk[0] + " · " + TNAME[bk[3]];
            elVis.innerHTML = bookNameHTML(cur.b) + " &mdash; Chapter " + cur.c;
            elChHead.innerHTML = "Chapters &middot; " + bk[0];
            elChMeta.textContent = bk[2] + (bk[2] === 1 ? " chapter" : " chapters") + " · Urdu";
            elPillsTitle.innerHTML = "Chapters &mdash; " + bk[0] + " &middot; <span dir=\"rtl\">" + bk[1] + "</span>";
          }
          function refresh() { updatePlayer(); renderChapters(); renderBooks(); }

          function selectBook(ix, resetChapter) {
            cur.b = ix;
            if (resetChapter) cur.c = 1;
            if (BOOKS[ix][3] !== tab && !(elSearch && elSearch.value.trim())) setTab(BOOKS[ix][3]);
            refresh();
          }
          function selectChapter(ch) {
            cur.c = Math.min(Math.max(1, ch), BOOKS[cur.b][2]);
            refresh();
          }
          function step(d) {
            var n = BOOKS[cur.b][2];
            if (cur.c + d > n) { selectBook((cur.b + 1) % BOOKS.length, true); }
            else if (cur.c + d < 1) {
              var pb = (cur.b + BOOKS.length - 1) % BOOKS.length;
              cur.b = pb; cur.c = BOOKS[pb][2];
              if (BOOKS[pb][3] !== tab) setTab(BOOKS[pb][3]);
              refresh();
            } else selectChapter(cur.c + d);
          }

          /* ----- testament tabs + search ----- */
          function setTab(t) {
            tab = t;
            elTabOT.classList.toggle("on", t === 0);
            elTabNT.classList.toggle("on", t === 1);
            elTabOT.setAttribute("aria-selected", t === 0 ? "true" : "false");
            elTabNT.setAttribute("aria-selected", t === 1 ? "true" : "false");
            renderBooks();
          }
          elTabOT.addEventListener("click", function () { setTab(0); });
          elTabNT.addEventListener("click", function () { setTab(1); });
          if (elSearch) elSearch.addEventListener("input", renderBooks);

          /* ----- transport controls ----- */
          function setPlaying(v) {
            cur.playing = v;
            elWave.classList.toggle("playing", v);
            section.classList.toggle("is-playing", v);
            elPlayIcon.innerHTML = v ? "<path d=\"M3 2h3.6v12H3zM9.4 2H13v12H9.4z\"/>" : "<path d=\"M3 1.5v13l11-6.5z\"/>";
            elPlayLabel.textContent = v ? "Pause" : "Play";
            elPlay.setAttribute("aria-label", v ? "Pause" : "Play the Urdu Audio Bible");
          }
          elPlay.addEventListener("click", function () {
            var now = !cur.playing;
            setPlaying(now);
            if (now && typeof showToast === "function") showToast("Urdu audio plays on btl-tv.com and the BTL TV app");
          });
          $("abPrev").addEventListener("click", function () { step(-1); });
          $("abNext").addEventListener("click", function () { step(1); });
          var shuffleBtn = $("abShuffle");
          shuffleBtn.addEventListener("click", function () {
            var b, c;
            do { b = Math.floor(Math.random() * BOOKS.length); c = 1 + Math.floor(Math.random() * BOOKS[b][2]); }
            while (b === cur.b && c === cur.c);
            cur.b = b; cur.c = c;
            if (BOOKS[b][3] !== tab) setTab(BOOKS[b][3]);
            refresh();
            shuffleBtn.classList.add("on"); shuffleBtn.setAttribute("aria-pressed", "true");
            setTimeout(function () { shuffleBtn.classList.remove("on"); shuffleBtn.setAttribute("aria-pressed", "false"); }, 1600);
          });
          var repeatBtn = $("abRepeat");
          repeatBtn.addEventListener("click", function () {
            var on = !repeatBtn.classList.contains("on");
            repeatBtn.classList.toggle("on", on);
            repeatBtn.setAttribute("aria-pressed", on ? "true" : "false");
          });
          var speedBtn = $("abSpeed");
          speedBtn.addEventListener("click", function () {
            speedIx = (speedIx + 1) % speeds.length;
            speedBtn.textContent = "Speed " + speeds[speedIx].toFixed(2).replace(/0$/, "") + "x";
          });
          var vol = $("abVol"), volVal = $("abVolVal");
          if (vol && volVal) vol.addEventListener("input", function () { volVal.textContent = vol.value + "%"; });

          /* ----- pause the living Bible off-screen ----- */
          section.classList.add("paused");
          if (!("IntersectionObserver" in window)) section.classList.remove("paused");
          else new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { section.classList.toggle("paused", !e.isIntersecting); });
          }, { threshold: 0.05 }).observe(section);

          refresh();
        })();

        /* ----- anniversary gold dust — a dense twinkling field across the whole frame ----- */
        var dustBox = document.getElementById("annivDust");
        if (dustBox && !reduced) {
          for (var di = 0; di < 118; di++) {
            var dp = document.createElement("i");
            var kind = di % 9;
            var isSpark = kind === 0;
            var isTwinkle = isSpark || kind % 3 === 0;
            var dsz = isSpark ? 8 + Math.random() * 6 : 1.4 + Math.random() * 4.4;
            if (isTwinkle) dp.className = isSpark ? "tw spark" : "tw";
            dp.style.left = (Math.random() * 100).toFixed(1) + "%";
            dp.style.top = (Math.random() * 100).toFixed(1) + "%";
            dp.style.width = dsz.toFixed(1) + "px";
            dp.style.height = dsz.toFixed(1) + "px";
            dp.style.animationDuration = isTwinkle
              ? (3.2 + Math.random() * 3.8).toFixed(1) + "s"
              : (10 + Math.random() * 11).toFixed(1) + "s";
            dp.style.animationDelay = (-Math.random() * 14).toFixed(1) + "s";
            dustBox.appendChild(dp);
          }
        }

        /* ================================================================
           10 YEARS — STATIC GOLDEN "10"
           The number never changes and there is no counter or spark loop.
           Only the ring, beam and particles keep a gentle ambient motion;
           an IntersectionObserver pauses that CSS motion off-screen.
           ================================================================ */
        (function () {
          var section = document.getElementById("annivScrub");
          if (!section) return;
          section.classList.add("paused");
          if (!("IntersectionObserver" in window)) {
            section.classList.remove("paused");
            return;
          }
          new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              section.classList.toggle("paused", !e.isIntersecting);
            });
          }, { threshold: 0.08 }).observe(section);
        })();

        /* ----- app showcase — pause the floating cards off-screen ----- */
        (function () {
          var section = document.getElementById("app");
          if (!section) return;
          section.classList.add("paused");
          if (!("IntersectionObserver" in window)) {
            section.classList.remove("paused");
            return;
          }
          new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              section.classList.toggle("paused", !e.isIntersecting);
            });
          }, { threshold: 0.05 }).observe(section);
        })();

        /* ----- page full screen ----- */
        var pageFsBtn = document.getElementById("pageFsBtn");
        if (pageFsBtn) {
          pageFsBtn.addEventListener("click", function () {
            if (document.fullscreenElement) { document.exitFullscreen().catch(function () {}); }
            else if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen().catch(function () {});
            }
          });
        }

        /* ================================================================
           LIVE TV — the real BTL TV broadcast (HLS via hls.js)
           ================================================================ */
        var STREAM_URL = "https://livecdn.live247stream.com/btl/tv/playlist.m3u8";
        var player = document.getElementById("player");
        var video = document.getElementById("liveVideo");
        var bigPlay = document.getElementById("bigPlay");
        var ppBtn = document.getElementById("ppBtn");
        var muteBtn = document.getElementById("muteBtn");
        var fsBtn = document.getElementById("fsBtn");
        var fallback = document.getElementById("playerFallback");
        var statusEl = document.getElementById("playerStatus");
        var hls = null, hlsStarted = false, netRetries = 0;

        function syncPlayerUI() {
          var playing = !video.paused && !video.ended;
          player.classList.toggle("playing", playing);
          player.classList.toggle("paused", !playing);
          player.classList.toggle("muted", video.muted);
          bigPlay.classList.toggle("hide", playing);
          if (playing) statusEl.textContent = video.muted ? "Live · muted" : "Live · on air";
          else statusEl.textContent = "Live · 24/7";
        }
        function showFallback() {
          fallback.hidden = false;
          bigPlay.classList.add("hide");
          try { video.pause(); } catch (e) {}
        }
        function startStream() {
          if (hlsStarted) return;
          hlsStarted = true;
          try {
            if (window.Hls && window.Hls.isSupported()) {
              hls = new window.Hls({ capLevelToPlayerSize: true, maxBufferLength: 30 });
              hls.loadSource(STREAM_URL);
              hls.attachMedia(video);
              hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) return;
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR && netRetries < 2) {
                  netRetries++;
                  hls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                  hls.recoverMediaError();
                } else {
                  showFallback();
                }
              });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
              video.src = STREAM_URL;
              video.addEventListener("error", showFallback);
            } else {
              showFallback();
              return;
            }
            if (!reduced) {
              var p = video.play();
              if (p && p.catch) p.catch(function () { syncPlayerUI(); });
            }
          } catch (e) {
            showFallback();
          }
        }
        var liveIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) startStream(); });
        }, { threshold: 0.2 });
        liveIO.observe(player);

        bigPlay.addEventListener("click", function () {
          startStream();
          video.muted = false;
          var p = video.play();
          if (p && p.catch) p.catch(function () { video.muted = true; video.play().catch(function () {}); });
        });
        ppBtn.addEventListener("click", function () {
          if (video.paused) { startStream(); video.play().catch(function () {}); }
          else video.pause();
        });
        muteBtn.addEventListener("click", function () {
          video.muted = !video.muted;
          syncPlayerUI();
        });
        fsBtn.addEventListener("click", function () {
          if (document.fullscreenElement) { document.exitFullscreen(); return; }
          if (player.requestFullscreen) player.requestFullscreen().catch(function () {});
          else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
        });
        var metaFsBtn = document.getElementById("metaFsBtn");
        if (metaFsBtn) metaFsBtn.addEventListener("click", function () { fsBtn.click(); });
        var retryBtn = document.getElementById("retryStream");
        if (retryBtn) {
          retryBtn.addEventListener("click", function () {
            fallback.hidden = true;
            netRetries = 0;
            hlsStarted = false;
            if (hls) { try { hls.destroy(); } catch (err) {} hls = null; }
            startStream();
            video.muted = false;
            var rp = video.play();
            if (rp && rp.catch) rp.catch(function () { video.muted = true; video.play().catch(function () {}); });
          });
        }
        video.addEventListener("play", syncPlayerUI);
        video.addEventListener("pause", syncPlayerUI);
        video.addEventListener("volumechange", syncPlayerUI);
        video.addEventListener("playing", syncPlayerUI);
        syncPlayerUI();

        /* ----- viewer count (honest wiring point) -----
           No number is invented here. The pill renders ONLY when a real
           viewer count is supplied — via data-viewer-count on the #live
           section or window.BTL_VIEWER_COUNT — which the owner's developer
           feeds from the Live247Stream provider stats API (needs provider
           credentials). The public site API exposes no viewer counts. */
        (function () {
          var pill = document.getElementById("watchingPill");
          var countEl = document.getElementById("watchingCount");
          if (!pill || !countEl) return;
          var raw = liveSection.getAttribute("data-viewer-count");
          if (raw === null || raw === "") raw = window.BTL_VIEWER_COUNT;
          var num = typeof raw === "string" ? parseInt(raw, 10) : raw;
          if (typeof num === "number" && isFinite(num) && num >= 0) {
            countEl.textContent = num.toLocaleString("en-US") + " watching now";
            pill.hidden = false;
          }
        })();

        /* ----- channel hub: prayer chat, bulletin, share -----
           The channel runs an unscheduled 24/7 rotation, so this section shows
           no program titles or times — only the live broadcast itself. */
        (function () {
          /* ----- hub modal (prayer chat / bulletin) ----- */
          var hubModal = document.getElementById("hubModal");
          var hubTitle = document.getElementById("hubModalTitle");
          var panels = {
            chat: document.getElementById("panelChat"),
            bulletin: document.getElementById("panelBulletin"),
            donate: document.getElementById("panelDonate"),
            story: document.getElementById("panelStory")
          };
          var hubLastFocus = null;
          function openHub(which, title) {
            if (!hubModal) return;
            hubLastFocus = document.activeElement;
            Object.keys(panels).forEach(function (k) { if (panels[k]) panels[k].hidden = k !== which; });
            if (hubTitle) hubTitle.textContent = title;
            hubModal.hidden = false;
            document.body.style.overflow = "hidden";
            var x = hubModal.querySelector(".modal-x");
            if (x) x.focus();
          }
          function closeHub() {
            if (!hubModal || hubModal.hidden) return;
            hubModal.hidden = true;
            document.body.style.overflow = "";
            if (hubLastFocus && hubLastFocus.focus) hubLastFocus.focus();
          }
          if (hubModal) {
            hubModal.addEventListener("click", function (e) { if (e.target.closest("[data-hub-close]")) closeHub(); });
            document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeHub(); });
          }
          var chatBtn = document.getElementById("chatBtn");
          if (chatBtn) chatBtn.addEventListener("click", function () { openHub("chat", "Live Prayer Chat"); });
          var bulletinBtn = document.getElementById("bulletinBtn");
          if (bulletinBtn) bulletinBtn.addEventListener("click", function () { openHub("bulletin", "Weekly Bulletin"); });
          var donateBtn = document.getElementById("donateBtn");
          if (donateBtn) donateBtn.addEventListener("click", function () { openHub("donate", "Donate — Partner With BTL TV"); });
          var footDonate = document.getElementById("footDonate");
          if (footDonate) footDonate.addEventListener("click", function () { openHub("donate", "Donate — Partner With BTL TV"); });
          var storyBtn = document.getElementById("storyBtn");
          if (storyBtn) storyBtn.addEventListener("click", function () { openHub("story", "Our Story — A Decade of Light"); });

          /* ----- prayer chat: posts locally on this page only ----- */
          var chatForm = document.getElementById("chatForm");
          var chatInput = document.getElementById("chatInput");
          var chatList = document.getElementById("chatList");
          if (chatForm && chatInput && chatList) {
            chatForm.addEventListener("submit", function (e) {
              e.preventDefault();
              var text = chatInput.value.trim();
              if (!text) return;
              var msg = document.createElement("div"); msg.className = "chat-msg";
              var ava = document.createElement("span"); ava.className = "chat-ava you"; ava.textContent = "Y";
              var body = document.createElement("div"); body.className = "chat-body";
              var who = document.createElement("div"); who.className = "chat-who"; who.textContent = "You";
              var p = document.createElement("p"); p.className = "chat-text"; p.textContent = text;
              body.appendChild(who); body.appendChild(p);
              msg.appendChild(ava); msg.appendChild(body);
              chatList.appendChild(msg);
              chatInput.value = "";
              chatList.scrollTop = chatList.scrollHeight;
            });
          }

          /* ----- share: copies the live broadcast link, confirms with a toast ----- */
          var toast = document.getElementById("toast");
          var toastTimer = null;
          function showToast(msg) {
            if (!toast) return;
            toast.textContent = msg;
            toast.hidden = false;
            requestAnimationFrame(function () { toast.classList.add("show"); });
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () {
              toast.classList.remove("show");
              setTimeout(function () { toast.hidden = true; }, 350);
            }, 2600);
          }
          var shareBtn = document.getElementById("shareBtn");
          if (shareBtn) shareBtn.addEventListener("click", function () {
            var link = "https://btl-tv.com/live";
            function done() { showToast("Link copied — share the live broadcast"); }
            function fallback() {
              var ta = document.createElement("textarea");
              ta.value = link; ta.style.position = "fixed"; ta.style.opacity = "0";
              document.body.appendChild(ta); ta.select();
              try { document.execCommand("copy"); done(); }
              catch (err) { showToast("Watch live at btl-tv.com/live"); }
              document.body.removeChild(ta);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, fallback);
            else fallback();
          });
        })();
      })();
    