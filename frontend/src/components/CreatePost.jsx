import {useState} from "react";
import {createPost} from "../services/postApi";

function CreatePost({onPostCreated}){
 const[content,setContent]=useState("");
 const[loading,setLoading]=useState(false);

 const handleSubmit=async()=>{
  if(!content.trim()) return;

  try{
   setLoading(true);

   const post=await createPost(content);

   setContent("");

   if(onPostCreated){
    onPostCreated(post);
   }
  }catch(err){
   console.error(err);
  }finally{
   setLoading(false);
  }
 };

 return(
  <div style={{
   background:"#161616",
   border:"1px solid #262626",
   borderRadius:14,
   padding:"1rem",
   marginBottom:"1rem"
  }}>
   <textarea
    value={content}
    onChange={e=>setContent(e.target.value)}
    placeholder="What's on your mind?"
    style={{
     width:"100%",
     minHeight:100,
     background:"#1a1a1a",
     color:"#fff",
     border:"1px solid #2e2e2e",
     borderRadius:10,
     padding:"12px",
     resize:"vertical",
     boxSizing:"border-box"
    }}
   />

   <button
    onClick={handleSubmit}
    disabled={loading}
    style={{
     marginTop:"0.75rem",
     padding:"8px 18px",
     border:"none",
     borderRadius:999,
     background:"linear-gradient(135deg,#a855f7,#ec4899)",
     color:"#fff",
     cursor:"pointer"
    }}
   >
    {loading?"Posting...":"Post"}
   </button>
  </div>
 );
}

export default CreatePost;