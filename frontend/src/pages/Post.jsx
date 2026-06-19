import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../services/postApi";
import PostCard from "../components/PostCard";

function Post() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      const data = await getPost(postId);
      setPost(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      <PostCard post={post} />
    </div>
  );
}

export default Post;