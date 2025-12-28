export interface Story {
    id: number;
    image: string;
}

export interface ProfileStories {
    id: number;
    username: string;
    avatar: string;
    stories: Story[];
}
