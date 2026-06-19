import api from "./api";

export const createPost=async(content)=>{
 const response=await api.post("/posts",{content});
 return response.data;
};

export const getFeed=async()=>{
 const response=await api.get("/posts/feed");
 return response.data;
};

export const getUserPosts=async(username)=>{
 const response=await api.get(`/posts/user/${username}`);
 return response.data;
};

export const likePost=async(postId)=>{
 const response=await api.post(`/posts/${postId}/like`);
 return response.data;
};

export const unlikePost=async(postId)=>{
 const response=await api.delete(`/posts/${postId}/like`);
 return response.data;
};

export const getComments=async(postId)=>{
 const response=await api.get(`/posts/${postId}/comments`);
 return response.data;
};

export const createComment=async(postId,content)=>{
 const response=await api.post(`/posts/${postId}/comments`,{content});
 return response.data;
};

export const deleteComment=async(commentId)=>{
 const response=await api.delete(`/posts/comments/${commentId}`);
 return response.data;
};

export const bookmarkPost=async(postId)=>{
 const response=await api.post(`/posts/${postId}/bookmark`);
 return response.data;
};

export const unbookmarkPost=async(postId)=>{
 const response=await api.delete(`/posts/${postId}/bookmark`);
 return response.data;
};

export const getBookmarkedPosts=async()=>{
 const response=await api.get("/posts/bookmarks");
 return response.data;
};

export const sharePost=async(postId)=>{
 const response=await api.post(`/posts/${postId}/share`);
 return response.data;
};

export const getPost = async postId => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

export const deletePost=async(postId)=>{
 const response=await api.delete(`/posts/${postId}`);
 return response.data;
};

export const searchUsers=async(query)=>{
 const response=await api.get(`/users/search?q=${query}`);
 return response.data.users;
};

export const repostPost=async(postId)=>{
 const response=await api.post(
  `/posts/${postId}/repost`
 );

 return response.data;
};

export const getUserReposts=async(username)=>{
 const response=await api.get(
  `/posts/user/${username}/reposts`
 );

 return response.data;
};

