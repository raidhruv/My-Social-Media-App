import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { searchUsers } from "../services/postApi";

function SearchBar(){

 const navigate=useNavigate();

 const [query,setQuery]=useState("");
 const [results,setResults]=useState([]);

 useEffect(()=>{

  if(!query.trim()){
   setResults([]);
   return;
  }

  const timer=setTimeout(async()=>{

   try{
    const users=
     await searchUsers(query);

    setResults(users);
   }catch(err){
    console.error(err);
   }

  },300);

  return()=>clearTimeout(timer);

 },[query]);

 return(
  <div style={{
   position:"relative",
    width:"100%"
  }}>
   <input
    value={query}
    onChange={e=>
     setQuery(
      e.target.value
     )
    }
    placeholder=
     "Search users..."
    style={{
     width:"100%",
     height:"100%",
     background:"transparent",
     border:"none",
     outline:"none",
     color:"#fff",
     fontSize:"14px"
    }}
   />

   {results.length>0&&(
    <div style={{
     position:"absolute",
     top:"100%",
     left:0,
     right:0,
     background:"#171717",
     border:"1px solid #333",
     borderRadius:"12px",
     marginTop:"0.25rem",
     zIndex:50
    }}>
     {results.map(user=>(
      <div
       key={user.id}
       onClick={()=>
        navigate(
         `/profile/${user.username}`
        )
       }
       style={{
        display:"flex",
        alignItems:"center",
        gap:"0.75rem",
        padding:"0.75rem",
        cursor:"pointer"
       }}
      >
       <img
        src={
         user.profilePicture
        }
        alt=""
        style={{
         width:"40px",
         height:"40px",
         borderRadius:"50%",
         objectFit:"cover"
        }}
       />

       <div>
        <div>
         {user.firstName}
         {" "}
         {user.lastName}
        </div>

        <div style={{
         color:"#888",
         fontSize:"14px"
        }}>
         @{user.username}
        </div>
       </div>
      </div>
     ))}
    </div>
   )}
  </div>
 );
}

export default SearchBar;