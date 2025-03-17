import { db } from "./firebase";
import { ref, get, update, push, remove, query, orderByChild, equalTo } from "firebase/database";

interface Post {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  likes: number;
  ratings: number[];
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  authorId: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
}

/** 🔹 Fetch all posts */
export const fetchPosts = async (): Promise<Post[]> => {
  const postsRef = ref(db, "posts");
  const snapshot = await get(postsRef);
  if (snapshot.exists()) {
    return Object.keys(snapshot.val()).map((key) => ({
      id: key,
      ...snapshot.val()[key],
    })) as Post[];
  }
  return [];
};

/** 🔹 Fetch user's posts */
export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const postsRef = ref(db, "posts");
    const userPostsQuery = query(
      postsRef,
      orderByChild("authorId"),
      equalTo(userId)
    );
    const snapshot = await get(userPostsQuery);
    
    if (!snapshot.exists()) {
      console.log("No posts found for user:", userId);
      return [];
    }

    const posts: Post[] = [];
    snapshot.forEach((childSnapshot) => {
      const postData = childSnapshot.val();
      posts.push({
        id: childSnapshot.key!,
        title: postData.title,
        content: postData.content,
        authorId: postData.authorId,
        createdAt: postData.createdAt,
        likes: postData.likes || 0,
        ratings: postData.ratings || [],
        comments: postData.comments || [],
      });
    });

    console.log("Fetched posts for user:", userId, posts);
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

/** 🔹 Fetch a single post */
export const fetchPostById = async (postId: string): Promise<Post | null> => {
  const postRef = ref(db, `posts/${postId}`);
  const snapshot = await get(postRef);
  return snapshot.exists() ? { id: snapshot.key!, ...snapshot.val() } as Post : null;
};

/** 🔹 Create a new post */
export const createPost = async (post: Omit<Post, "id">): Promise<void> => {
  const postRef = ref(db, "posts");
  await push(postRef, post);
};

/** 🔹 Update an existing post */
export const updatePost = async (postId: string, updatedData: Partial<Post>): Promise<void> => {
  const postRef = ref(db, `posts/${postId}`);
  await update(postRef, updatedData);
};

/** 🔹 Delete a post */
export const deletePost = async (postId: string): Promise<void> => {
  const postRef = ref(db, `posts/${postId}`);
  await remove(postRef);
};

/** 🔹 Like a post */
export const likePost = async (postId: string, currentLikes: number): Promise<void> => {
  const postRef = ref(db, `posts/${postId}`);
  await update(postRef, { likes: currentLikes + 1 });
};

/** 🔹 Add a comment to a post */
export const addComment = async (postId: string, newComment: Comment): Promise<void> => {
  const post = await fetchPostById(postId);
  if (!post) return;

  const updatedComments = [...post.comments, newComment];
  await update(ref(db, `posts/${postId}`), { comments: updatedComments });
};

/** 🔹 Like or dislike a comment */
export const likeDislikeComment = async (postId: string, commentId: string, type: "like" | "dislike"): Promise<void> => {
  const post = await fetchPostById(postId);
  if (!post) return;

  const updatedComments = post.comments.map((comment) =>
    comment.id === commentId
      ? {
          ...comment,
          likes: type === "like" ? comment.likes + 1 : comment.likes,
          dislikes: type === "dislike" ? comment.dislikes + 1 : comment.dislikes,
        }
      : comment
  );

  await update(ref(db, `posts/${postId}`), { comments: updatedComments });
};

/** 🔹 Reply to a comment */
export const replyToComment = async (postId: string, commentId: string, reply: Comment): Promise<void> => {
  const post = await fetchPostById(postId);
  if (!post) return;

  const updatedComments = post.comments.map((comment) =>
    comment.id === commentId
      ? { ...comment, replies: [...comment.replies, reply] }
      : comment
  );

  await update(ref(db, `posts/${postId}`), { comments: updatedComments });
};
