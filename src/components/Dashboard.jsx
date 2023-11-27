import React, { useState } from "react";
import { useSessionContext } from "../hooks/useSession";
import { supabase } from "../supabaseClient";
import Table from "./Table";
import Forecasting from "./Forecasting";
export default function Dashboard ({ tittle}){
    const[section,setSection]=useState("Dashboard")
    const { session } = useSessionContext();
    return(
        <>
        <div className="bg-slate-900 w-full text-white">
            <div className="flex justify-between px-5">


                <div className="inline-flex items-center space-x-4">
                    <h3 className="text-2xl font-bold">Telematica Weather Station {tittle}
                    </h3>
                    
                    <p  className="cursor-pointer" onClick={()=> setSection("Dashboard")}>DashBoard</p>
                    
                   
                    <p   className="cursor-pointer" onClick={()=> setSection("Forecasting")}>Forecasting</p>
                     
                </div>
        {/*RIGHT SECTION*/}
        <div className="inline-flex space-x-4 items-center py-4">
        <p className="text-sm p-2 rounded-full bg-slate-400 font-bold text-black"
            > Usuario:{session.user.email}</p>
            <button className="p-2 rounded-md bg-sky-600 font-bold text-black"
            onClick={() => supabase.auth.signOut()}> Cerrar Sesion</button><br></br>
           
             </div>

            </div>
        </div>    
            {/* Title*/}
            <div className="w-full">
                <div className="px-5 py-4 border-b border-black">
                    <h1 className="text-4xl font-bold">{section}</h1>

                
            </div>                  
                    </div>
      
         
            <div className="px-5 py">
                {section ==="Dashboard" &&<Table />}
                {section==="Forecasting"&& <Forecasting/>}
          
                </div>
        

        </>
    )
}

