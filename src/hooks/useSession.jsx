import { createContext, useContext } from "react";

export const SessionContext = createContext({
  session: null,
  setSession: () => {},
});

export const useSessionContext = () => useContext(SessionContext);