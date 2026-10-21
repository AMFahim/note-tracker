import { Types } from 'mongoose';

interface PostSummary {
  id: Types.ObjectId;
  title: string;
  body: string;
  createdAt: Date;
}

export interface UserPosts {
  author: { id: Types.ObjectId; name: string };
  posts: PostSummary[];
}
