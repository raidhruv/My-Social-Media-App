import { useState, useEffect, useRef } from "react";
import {
  getComments,
  createComment,
  deleteComment
} from "../services/postApi";

function CommentSection({
  postId,
  currentUserId,
  setCommentsCount
}) {

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const inputRef = useRef(null);

  const formatTime = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  // Auto-load comments on mount
  useEffect(() => {
    loadComments();
  }, [postId]);

  useEffect(() => {
    if(inputRef.current){
      inputRef.current.focus();
    }
  }, []);

  const loadComments = async () => {
    try {
      setLoadingComments(true);

      const data = await getComments(postId);

      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleComment = async () => {
    try {
      if (!commentText.trim()) return;

      const newComment = await createComment(postId, commentText);

      setComments((prev) => [...prev, newComment]);
      setCommentsCount((c) => c + 1);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setCommentsCount((c) => c - 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      marginTop: "1rem",
      background: "#0f0f0f",
      border: "1px solid #1f1f1f",
      borderRadius: "16px",
      padding: "1rem"
    }}>

      {/* Input Row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "1rem"
      }}>
        <input
          ref={inputRef}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter" && !e.shiftKey){
              e.preventDefault();
              handleComment();
            }
          }}
          placeholder="Add a comment..."
          style={{
            flex: 1,
            background: "#171717",
            border: "1px solid #262626",
            borderRadius: "999px",
            padding: "0.85rem 1rem",
            color: "#fff",
            outline: "none"
          }}
        />

        <button
          onClick={handleComment}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "0.7rem 1rem",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Post
        </button>
      </div>

      {/* Loading State */}
      {loadingComments && (
        <div>Loading...</div>
      )}

      {/* Empty State */}
      {!loadingComments && comments.length === 0 && (
        <div style={{
          textAlign: "center",
          color: "#737373",
          padding: "1rem"
        }}>
          No comments yet. Be the first.
        </div>
      )}

      {/* Comments List */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            display: "flex",
            gap: "0.75rem",
            padding: "0.75rem 0"
          }}
        >

          {/* Avatar with Fallback */}
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            overflow: "hidden",
            background: "linear-gradient(135deg,#7c3aed,#ec4899)",
            flexShrink: 0
          }}>
            {comment.author?.profilePicture ? (
              <img
                src={comment.author.profilePicture}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 600
              }}>
                {comment.author.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Comment Body */}
          <div style={{ flex: 1 }}>

            {/* Username + Date Row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.25rem"
            }}>
              <span style={{
                fontWeight: 600,
                fontSize: "14px"
              }}>
                {comment.author.username}
              </span>

              <span style={{
                fontSize: "12px",
                color: "#737373"
              }}>
                {formatTime(comment.createdAt)}
              </span>
            </div>

            {/* Comment Bubble */}
            <div style={{
              background: "#171717",
              padding: "0.75rem 1rem",
              borderRadius: "14px",
              color: "#d4d4d4"
            }}>
              {comment.content}
            </div>

            {/* Remove Button */}
            {comment.author.id === currentUserId && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                style={{
                  marginTop: "0.35rem",
                  background: "none",
                  border: "none",
                  color: "#737373",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Remove
              </button>
            )}

          </div>
        </div>
      ))}

    </div>
  );
}

export default CommentSection;
