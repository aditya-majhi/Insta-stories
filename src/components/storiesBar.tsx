import type { ProfileStories } from "../types";

interface Props {
  profiles: ProfileStories[];
  onSelect: (index: number) => void;
}

export default function StoriesBar({ profiles, onSelect }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto p-4 bg-black">
      {profiles.map((profile, index) => (
        <button
          key={profile.id}
          onClick={() => onSelect(index)}
          className="flex flex-col items-center gap-1 shrink-0"
        >
          <div className="w-16 h-16 rounded-full border-2 border-pink-500 overflow-hidden">
            <img
              src={profile.avatar}
              className="w-full h-full object-cover"
              alt={profile.username}
            />
          </div>
          <span className="text-xs text-white truncate w-16 text-center">
            {profile.username}
          </span>
        </button>
      ))}
    </div>
  );
}
