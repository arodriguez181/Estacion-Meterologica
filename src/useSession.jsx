import { createContext,useContext } from "react";
 export const SessionContext= createContext({
    session:null,
    setSession:(session)=>{}
 })
 export function useSession(){
    return useContext(SessionContext)
    }
    