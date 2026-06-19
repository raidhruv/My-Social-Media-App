import {useEffect,useState} from "react";
import api from "../services/api";

function NotificationBell({style,dotStyle}){

const[open,setOpen]=useState(false);
const[notifications,setNotifications]=useState([]);

useEffect(()=>{
fetchNotifications();
},[]);

const fetchNotifications=async()=>{
try{
const token=localStorage.getItem("accessToken");
const response=await api.get("http://localhost:5000/api/notifications",{headers:{Authorization:`Bearer ${token}`}});
setNotifications(response.data);
}catch(err){console.error(err);}
};

const markRead=async(id)=>{
try{
const token=localStorage.getItem("accessToken");
await api.patch(`http://localhost:5000/api/notifications/${id}/read`,{},{headers:{Authorization:`Bearer ${token}`}});
setNotifications(prev=>prev.map(n=>n.id===id?{...n,isRead:true}:n));
}catch(err){console.error(err);}
};

const unread=notifications.some(n=>!n.isRead);

const message=(n)=>{
if(n.type==="NEW_FOLLOWER") return `${n.sender?.username} followed you`;
if(n.type==="FOLLOW_REQUEST") return `${n.sender?.username} requested to follow`;
if(n.type==="FOLLOW_ACCEPTED") return `${n.sender?.username} accepted your request`;
return n.type;
};

return(
<div style={{position:"relative"}}>
<div style={style} onClick={()=>setOpen(!open)}>
<i className="ti ti-bell"/>
{unread&&<div style={dotStyle}/>}
</div>

{open&&(
<div style={{position:"absolute",top:44,right:0,width:320,maxHeight:420,overflowY:"auto",background:"#161616",border:"1px solid #262626",borderRadius:14,padding:12,zIndex:999,boxShadow:"0 8px 30px rgba(0,0,0,0.4)"}}>
{notifications.length===0&&<div style={{fontSize:13,color:"#737373"}}>No notifications</div>}

{notifications.map(n=>(
<div key={n.id}
onClick={()=>markRead(n.id)}
style={{padding:"10px 12px",borderRadius:10,marginBottom:8,cursor:"pointer",background:n.isRead?"transparent":"#1e1428",color:"#f5f5f5",fontSize:13}}>
{message(n)}
</div>
))}
</div>
)}
</div>
);
}

export default NotificationBell;