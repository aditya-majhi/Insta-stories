import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProfileStories } from "../types";
import StoryProgress from "./storyProgress";

interface Props {
  profiles: ProfileStories[];
  profileIndex: number;
  storyIndex: number;
  onStoryChange: (index: number) => void;
  onProfileChange: (index: number) => void;
  onClose: () => void;
}

const AUTO_ADVANCE = 5000;
const SWIPE_THRESHOLD = 50;

export default function StoryViewer({
  profiles,
  profileIndex,
  storyIndex,
  onStoryChange,
  onProfileChange,
  onClose,
}: Props) {
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const [loading, setLoading] = useState(true);

  const profile = profiles[profileIndex];
  const stories = profile.stories;

  useEffect(() => {
    if (loading || paused) {
      return;
    }

    timer.current = window.setTimeout(() => {
      next();
    }, AUTO_ADVANCE);

    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [profileIndex, storyIndex, loading, paused]);

  useEffect(() => {
    setLoading(true);

    const img = new Image();
    img.src = stories[storyIndex].image;

    img.onload = () => {
      setLoading(false);
    };

    return () => {};
  }, [profileIndex, storyIndex]);

  const next = () => {
    if (storyIndex < stories.length - 1) {
      onStoryChange(storyIndex + 1);
    } else if (profileIndex < profiles.length - 1) {
      onProfileChange(profileIndex + 1);
      onStoryChange(0);
    } else {
      onClose();
    }
  };

  const prev = () => {
    if (storyIndex > 0) {
      onStoryChange(storyIndex - 1);
    } else if (profileIndex > 0) {
      const prevProfile = profiles[profileIndex - 1];
      onProfileChange(profileIndex - 1);
      onStoryChange(prevProfile.stories.length - 1);
    }
  };

  /** Touch gestures */
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;

    setPaused(false);
    touchStart.current = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < -SWIPE_THRESHOLD) next();
      if (dx > SWIPE_THRESHOLD) prev();
    } else if (dy > SWIPE_THRESHOLD) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black z-50"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress */}
      <StoryProgress
        count={stories.length}
        activeIndex={storyIndex}
        duration={AUTO_ADVANCE}
        paused={paused || loading}
      />

      {/* Header */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 w-[30%]">
        <img
          src={profile.avatar}
          className="w-8 h-8 rounded-full"
          alt={profile.username}
        />
        <span className="text-white text-sm font-medium">
          {profile.username}
        </span>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 text-white text-xl"
      >
        ×
      </button>

      {/* Tap zones */}
      <div className="absolute inset-y-0 left-0 w-1/2 z-20" onClick={prev} />
      <div className="absolute inset-y-0 right-0 w-1/2 z-20" onClick={next} />

      <div className="absolute inset-0 bg-linear-to-b from-neutral-800 to-black" />

      {/* Story image */}
      <AnimatePresence mode="wait">
        {!loading && (
          <motion.img
            key={`${profile.id}-${stories[storyIndex].id}`}
            src={stories[storyIndex].image}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
