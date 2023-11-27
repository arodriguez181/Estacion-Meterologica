import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { SessionContext } from "./hooks/useSession";
import Auth from "./Auth";
import Dashboard from "./components/Dashboard";

function SignOut() {
  return (
    <>
      <span>Autenticado</span>
      <button onClick={() => supabase.auth.signOut()}>
        Cierra sesi&oacute;n
      </button>
    </>
  );
}

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      <SessionContext.Provider value={{ session, setSession }}>
      {!session ? (
        <Auth />
      ) : (
        <Dashboard>
        </Dashboard>
      )}
    </SessionContext.Provider>
    </>
  );
}

export default App;