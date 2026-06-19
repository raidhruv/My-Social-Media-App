import { createContext, useContext } from "react";
import useCurrentUser from "../hooks/useCurrentUser";

const CurrentUserContext=createContext(null);

export function CurrentUserProvider({children}){

 const value=useCurrentUser();

 return(
  <CurrentUserContext.Provider value={value}>
   {children}
  </CurrentUserContext.Provider>
 );

}

export function useCurrentUserContext(){

 const context=useContext(CurrentUserContext);

 if(!context){
  throw new Error(
   "useCurrentUserContext must be used inside CurrentUserProvider"
  );
 }

 return context;

}