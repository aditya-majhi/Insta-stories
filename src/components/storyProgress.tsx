import { motion } from "framer-motion";

interface Props {
  count: number;
  activeIndex: number;
  duration: number;
  paused: boolean;
}

export default function StoryProgress({
  count,
  activeIndex,
  duration,
  paused,
}: Props) {
  return (
    <div className="absolute top-0 left-0 right-0 px-2 pt-2 z-30">
      <div className="flex gap-1">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 bg-white/30 rounded overflow-hidden"
          >
            {i < activeIndex && <div className="h-full bg-white w-full" />}

            {i === activeIndex && (
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: duration / 1000,
                  ease: "linear",
                }}
                style={{
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
