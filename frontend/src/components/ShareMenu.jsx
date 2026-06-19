import { useState } from "react";
import { sharePost } from "../services/postApi";

function ShareMenu({ postId }) {
 const [open,setOpen]=useState(false);
 const getShareUrl=async()=>{
  const data=await sharePost(postId);
  return data.url;
 };
 const handleCopyLink=async()=>{
  try{
   const url=await getShareUrl();
   await navigator.clipboard.writeText(url);
   alert("Link copied");
   setOpen(false);
  }catch(err){
   console.error(err);
  }
 };
 const handleShare=async()=>{
  try{
   const url=await getShareUrl();
   if(!navigator.share){
    return handleCopyLink();
   }
   await navigator.share({
    title:"Post",
    url
   });
   setOpen(false);
  }catch(err){
   console.error(err);
  }
 };
 return (
 <div
  style={{
   position:"relative"
  }}
 >
  <button
   onClick={()=>
    setOpen(prev=>!prev)
   }
   style={{
    background:"none",
    border:"none",
    cursor:"pointer",
    fontSize:"18px"
   }}
  >
   📩
  </button>

  {open && (
   <div
    style={{
     position:"absolute",
     bottom:"120%",
     right:0,
     minWidth:"140px",
     background:"#1a1a1a",
     border:"1px solid #333",
     borderRadius:"8px",
     overflow:"hidden",
     zIndex:1000,
     boxShadow:"0 4px 12px rgba(0,0,0,0.3)"
    }}
   >
    <button
     onClick={handleShare}
     style={{
      width:"100%",
      padding:"10px",
      background:"none",
      border:"none",
      color:"#fff",
      textAlign:"left",
      cursor:"pointer"
     }}
    >
     📤 Share
    </button>

    <button
     onClick={handleCopyLink}
     style={{
      width:"100%",
      padding:"10px",
      background:"none",
      border:"none",
      color:"#fff",
      textAlign:"left",
      cursor:"pointer"
     }}
    >
     🔗 Copy Link
    </button>
   </div>
  )}
 </div>
);
}
export default ShareMenu;