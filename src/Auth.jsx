import { useState } from "react";
import {supabase} from "./supabaseClient";
import {LoadingIcon} from './components/Icons'


export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleLogin= async (e) =>
    {
        e.preventDefault()
        setLoading(true)
        const {error}=await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error){
            alert(error.error_description || error.message)
        }else{
            alert("Redireccionando-------------")
        }
        
        setLoading(false)
    }

    
    return(
        <div className="h-screen">
        <div className="flex flex-col justify-center items-center h-full bg-blue-100">
            <h1 className="text-xl font-bold">
                Weather Station Telematicas
            </h1>
            <h1 className="text-2xl font-bold py-10">
                Inicio de Sesion
            </h1>
            <form onSubmit={handleLogin}>
                <div className="flex flex-col justify-center space-y-2">
            <label htmlFor="emai" className="font-bold">
                Correo Electronico
            </label>
            <input
            className="border border-black px-4 py-2 rounded-lg"
            type="email"
            placeholder="Your email address"
            value={email}
            required={true}
            onChange={e => setEmail(e.target.value)}
            />
            <label htmlFor="password" className="font-bold pt-4">
                Contraseña
            </label>
            <input
            className="border border-black px-4 py-2 rounded-lg"
            type="password"
            placeholder="Your password"
            value={password}
            required={true}
            onChange={e => setPassword(e.target.value)}
            />
            <button disabled= {loading} className="px-4 py-2 bg-blue-800 text-white font-bold rounded-lg">
            {loading ? (
                <>
            <LoadingIcon />
                <span>Iniciando sesion</span>
                </>
              ) : 
                <span>Ingresar</span>
              }
            </button>
            
        </div>

            





            </form>
            </div>
            </div>
            
            

    )
    }