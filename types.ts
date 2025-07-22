
export interface StorySource {
  uri: string;
  title: string;
}

export interface GeneratedStory {
  title: string;
  story: string;
  sources: StorySource[];
}