export interface Episode {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  position: number;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  poster: string;
  category: string;
  description: string;
}
