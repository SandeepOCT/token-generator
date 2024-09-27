import React, { createContext } from "react";
import { IAppState } from "../types";
import { readFromLocalStorage } from "../utils";



const defaultValue: IAppState = (readFromLocalStorage('token-generator') ?? 
  { isValid: false }) as IAppState;

defaultValue.status = 'idle';
defaultValue.options = defaultValue.options ?? { autoRefresh: false, expiresIn: 600, cookieName: '_access_token' };

type AppContextType = [
  IAppState,
  React.Dispatch<React.SetStateAction<IAppState>>
];

export const AppContext = createContext<AppContextType>([
  defaultValue,
  () => {}
]);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<IAppState>(defaultValue);
  return (
    <AppContext.Provider value={[state, setState]}>
      {children}
    </AppContext.Provider>
  );
};
