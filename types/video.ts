export interface VideoData {
  sourceUrl: string;
  title: string;
  thumbnail: string;
  duration: string;
  username: string;
  nickname: string;
  avatar: string;
  downloadUrl: string;
  downloadMp3: string;
  views?: number;
  likes?: number;
  /** "video" untuk post video, "image" untuk post foto/carousel */
  type?: "video" | "image";
  /** Array URL foto (hanya ada jika type === "image") */
  images?: string[];
}
