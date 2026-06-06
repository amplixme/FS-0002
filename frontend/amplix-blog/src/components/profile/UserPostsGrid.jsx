import { useNavigate } from "react-router-dom";
import PostCard from "../PostCard";
import { EmptyState } from "../common/EmptyState";

export default function UserPostsGrid({ posts }) {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return <EmptyState message="Este usuario aún no ha publicado artículos." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={{
            ...post,
            author: post.author?.name ?? "",
            authorAvatar: post.author?.avatarUrl ?? null,
            excerpt: post.content,
          }}
          onClick={() => navigate(`/posts/${post.id}`)}
        />
      ))}
    </div>
  );
}