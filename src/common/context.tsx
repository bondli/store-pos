import React, { createContext, useState } from 'react';

type UserInfo = {
  id: number;
  name: string;
  avatar: string;
};
type MainContextType = {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
};

export const MainContext = createContext<MainContextType | undefined>(undefined);
export const MainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: 0,
    name: '',
    avatar: '',
  });
  return (
    <MainContext.Provider
      value={{
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};