import { createContext, useState } from 'react';

export const LoginStatus = createContext({});

export default function LoginStatusProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <LoginStatus.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </LoginStatus.Provider>
  );
}
