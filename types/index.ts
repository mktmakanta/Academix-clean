export interface Post {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  content: string;
  excerpt: string | null;
  created_at: string;
  author: string;
  published: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles?: Profile;
}

export interface Profile {
  id: string;
  name: string | null;
  avatar: string | null;
  email: string | null;
  role?: string | null;
}

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  cover_image?: File | null;
  published: boolean;
}
