import { useEffect, useRef, useState } from "react";
import { t } from "./i18n";
import "./portal-wave.css";

const waterVideo = "./assets/portal/natural-water.mp4";
const waterPoster = "./assets/portal/natural-water.jpg";
type Motion = "playing" | "paused" | "static";
type PlaybackControls = { togglePaused: () => void };

/* Real filmed water at its original pace. The poster is a frame from the film. */
export function PortalWave({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<PlaybackControls | null>(null);
  const [paused, setPaused] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const initialPausedRef = useRef(paused);
  const [hasFrame, setHasFrame] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [motion, setMotion] = useState<Motion>(() => paused ? "paused" : "static");

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let disposed = false;
    let failed = false;
    let frameAvailable = false;
    let wantsPlayback = !initialPausedRef.current;
    let inViewport = true;
    let sourceAttached = false;
    let pendingPlay = false;
    let playAttempt = 0;
    let frameCallback: number | null = null;
    let fallbackFrame = 0;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canPlay = () => !disposed && !failed && wantsPlayback && inViewport && !document.hidden;

    const publishFrame = () => {
      if (disposed || failed || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      frameAvailable = true;
      setHasFrame(true);
      setMotion(video.paused ? "paused" : "playing");
    };
    const waitForFrame = () => {
      if (frameAvailable || disposed || failed) return;
      if (typeof video.requestVideoFrameCallback === "function") {
        if (frameCallback === null) {
          frameCallback = video.requestVideoFrameCallback(() => {
            frameCallback = null;
            publishFrame();
          });
        }
      } else if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !fallbackFrame) {
        // loadeddata guarantees a decoded frame; wait for its next paint.
        fallbackFrame = requestAnimationFrame(() => {
          fallbackFrame = 0;
          publishFrame();
        });
      }
    };
    const cancelFrame = () => {
      if (frameCallback !== null && typeof video.cancelVideoFrameCallback === "function") {
        video.cancelVideoFrameCallback(frameCallback);
      }
      frameCallback = null;
      if (fallbackFrame) cancelAnimationFrame(fallbackFrame);
      fallbackFrame = 0;
    };
    const refreshPlayback = () => {
      if (disposed || failed) return;
      if (!canPlay()) {
        playAttempt += 1;
        pendingPlay = false;
        video.pause();
        setMotion("paused");
        return;
      }
      if (pendingPlay || !video.paused) return;
      // No src is attached on a fresh reduced-motion visit, so no film downloads.
      if (!sourceAttached) {
        sourceAttached = true;
        video.src = waterVideo;
      }
      video.muted = true;
      video.playbackRate = 1;
      waitForFrame();
      const attempt = ++playAttempt;
      pendingPlay = true;
      void video.play().then(() => {
        if (disposed || failed || attempt !== playAttempt) return;
        pendingPlay = false;
        if (canPlay()) {
          waitForFrame();
          if (frameAvailable) setMotion("playing");
        } else {
          video.pause();
        }
      }).catch(() => {
        if (disposed || failed || attempt !== playAttempt) return;
        pendingPlay = false;
        wantsPlayback = false;
        video.pause();
        setPaused(true);
        setMotion("paused");
      });
    };
    const onPlay = () => {
      // Native autoplay can begin after decoding; it must still respect intent.
      if (!canPlay()) video.pause();
    };
    const onPlaying = () => {
      if (!canPlay()) {
        video.pause();
        return;
      }
      waitForFrame();
      if (frameAvailable) setMotion("playing");
    };
    const onPause = () => {
      if (!disposed && !failed) setMotion("paused");
    };
    const onError = () => {
      if (disposed || failed) return;
      failed = true;
      playAttempt += 1;
      pendingPlay = false;
      cancelFrame();
      video.pause();
      video.removeAttribute("src");
      video.load();
      setHasFrame(false);
      setUnavailable(true);
      setMotion("static");
    };
    const onPreferenceChange = () => {
      wantsPlayback = !preference.matches;
      setPaused(!wantsPlayback);
      refreshPlayback();
    };
    const onVisibilityChange = () => refreshPlayback();
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      refreshPlayback();
    }, { threshold: 0 });

    controlsRef.current = {
      togglePaused: () => {
        if (failed || disposed) return;
        wantsPlayback = !wantsPlayback;
        setPaused(!wantsPlayback);
        // Call play synchronously from a deliberate click for autoplay policies.
        refreshPlayback();
      },
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("loadeddata", waitForFrame);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibilityChange);
    preference.addEventListener("change", onPreferenceChange);
    observer.observe(container);
    refreshPlayback();

    return () => {
      disposed = true;
      playAttempt += 1;
      cancelFrame();
      observer.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("loadeddata", waitForFrame);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      preference.removeEventListener("change", onPreferenceChange);
      controlsRef.current = null;
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return (
    <figure
      ref={containerRef}
      className={`portal-wave ${hasFrame ? "portal-wave-ready" : ""} ${className}`.trim()}
      aria-label={t("Animated water surface")}
      data-motion={motion}
    >
      <img
        className="portal-wave-still"
        src={waterPoster}
        alt={hasFrame ? "" : t("A still water surface.")}
        aria-hidden={hasFrame || undefined}
        width="1920"
        height="1080"
        fetchPriority="high"
        decoding="async"
      />
      <video
        className="portal-wave-video"
        ref={videoRef}
        poster={waterPoster}
        muted
        loop
        playsInline
        autoPlay
        preload="none"
        aria-hidden="true"
      />
      {!unavailable && (
        <button
          className="portal-wave-control"
          type="button"
          onClick={() => controlsRef.current?.togglePaused()}
          aria-label={paused ? t("Play animation") : t("Pause animation")}
        >
          {paused ? t("Play animation") : t("Pause animation")}
        </button>
      )}
    </figure>
  );
}
