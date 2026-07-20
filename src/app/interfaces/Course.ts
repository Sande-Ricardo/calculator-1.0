export type BlockType = 'text' | 'latex' | 'image' | 'link';

export interface CourseBlock {
  id: string;
  type: BlockType;
  content: string;
  metadata?: any; // e.g. { caption?: string } for image, { label?: string } for link
}

export interface Course {
  id: number;
  title: string;
  description: string;
  author: {
    name: string;
    bio: string;
  };
  blocks: CourseBlock[];
}
