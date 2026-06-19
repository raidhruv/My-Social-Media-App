import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { likePost, unlikePost, bookmarkPost, unbookmarkPost, getBookmarkedPosts, repostPost  } from "../services/postApi";
import CommentSection from "./CommentSection";
import ShareMenu from "./ShareMenu";

function PostCard({ post, currentUserId, onDelete }) {

  const isRepost = !!post.repostOf;
  const displayPost = isRepost ? post.repostOf : post;

  const initials = (
    displayPost.author?.firstName?.[0] ||
    displayPost.author?.username?.[0] ||
    "U"
  ).toUpperCase();

  const navigate = useNavigate();

  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);
  const [reposted, setReposted] = useState(post.isReposted || false);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount || 0);

  const actionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "none",
    border: "none",
    color: "#888",
    cursor: "pointer",
    fontSize: "14px"
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikePost(post.id);
        setLiked(false);
        setLikesCount((c) => c - 1);
      } else {
        await likePost(post.id);
        setLiked(true);
        setLikesCount((c) => c + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async () => {
    try {
      if (bookmarked) {
        await unbookmarkPost(post.id);
        setBookmarked(false);
      } else {
        await bookmarkPost(post.id);
        setBookmarked(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRepost = async () => {
    try {
      await repostPost(post.id);
      setReposted(true);
      setRepostsCount((prev) => prev + 1);
    } catch (err) {
      if (err.response?.data?.message === "Already reposted") {
        return;
      }
      console.error(err);
    }
  };

  return (
    <div style={{
      padding: "1.25rem",
      borderBottom: "1px solid #262626"
    }}>

      {/* Author Row */}
      <div style={{
        display: "flex",
        gap: "0.75rem",
        marginBottom: "0.75rem"
      }}>

        {/* Avatar */}
        <div
          onClick={() => navigate(`/profile/${displayPost.author?.username}`)}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            overflow: "hidden",
            background: "linear-gradient(135deg,#a855f7,#ec4899)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0
          }}
        >
          {displayPost.author?.profilePicture ? (
            <img
              src={displayPost.author.profilePicture}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          ) : (
            initials
          )}
        </div>

        {/* Author Info */}
        <div style={{ flex: 1 }}>
          <div
            onClick={() => navigate(`/profile/${displayPost.author?.username}`)}
            style={{
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {displayPost.author?.firstName || displayPost.author?.username}
          </div>

          <div style={{
            fontSize: 12,
            color: "#737373"
          }}>
            @{displayPost.author?.username} · {" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Delete Button */}
        {post.userId === currentUserId && (
          <button
            onClick={() => onDelete(post.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888"
            }}
          >
            🗑
          </button>
        )}

      </div>

      {/* Repost Banner */}
      {isRepost && (
        <div
          style={{
            fontSize: "0.9rem",
            color: "#888",
            marginBottom: "10px"
          }}
        >
          🔁 {post.author?.username} reposted
        </div>
      )}

      {/* Post Content */}
      <div style={{
        lineHeight: 1.6,
        color: "#d4d4d4"
      }}>
        {displayPost.content}
      </div>

      {/* Actions Row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginTop: "0.75rem",
        paddingTop: "0.75rem",
        borderTop: "1px solid #262626"
      }}>

        {/* Like Button */}
        <button
          onClick={handleLike}
          style={{ ...actionStyle, color: liked ? "#ec4899" : "#888" }}
        >
          {liked ? "❤️" : "🤍"} {likesCount}
        </button>

        {/* Comment Toggle Button */}
        <button
          onClick={() => setShowComments((prev) => !prev)}
          style={actionStyle}
        >
          💬 {commentsCount}
        </button>

        {/* Repost Button */}
        <button
          onClick={handleRepost}
          disabled={reposted}
          style={{
            ...actionStyle,
            color: reposted ? "#16a34a" : "#888"
          }}
        >
          🔁 {repostsCount}
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          style={{
            ...actionStyle,
            color: bookmarked ? "#2563eb" : "#888"
          }}
        >
          {bookmarked ? "🔖" : "📌"}
        </button>
        <ShareMenu postId={post.id} />

      </div>

      {/* Comment Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          currentUserId={currentUserId}
          setCommentsCount={setCommentsCount}
        />
      )}

    </div>
  );
}

export default PostCard;
