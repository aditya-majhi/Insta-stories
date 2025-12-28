import { useEffect, useState } from "react";
import StoriesBar from "./components/storiesBar";
import StoryViewer from "./components/storyViewer";
import type { ProfileStories } from "./types";

function App() {
  const [profiles, setProfiles] = useState<ProfileStories[]>([]);
  const [activeProfile, setActiveProfile] = useState<number | null>(null);
  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    fetch("/stories.json")
      .then((res) => res.json())
      .then(setProfiles);
  }, []);

  const openProfile = (index: number) => {
    setActiveProfile(index);
    setActiveStory(0);
  };

  const closeViewer = () => {
    setActiveProfile(null);
    setActiveStory(0);
  };

  return (
    <div className="bg-black min-h-screen">
      <StoriesBar profiles={profiles} onSelect={openProfile} />

      {activeProfile !== null && (
        <StoryViewer
          profiles={profiles}
          profileIndex={activeProfile}
          storyIndex={activeStory}
          onStoryChange={setActiveStory}
          onProfileChange={setActiveProfile}
          onClose={closeViewer}
        />
      )}
    </div>
  );
}

export default App;
