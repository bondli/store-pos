import React, { createContext, useState, useEffect } from 'react';
import { getStore } from '@common/electron';

type UserInfo = {
  id: number;
  name: string;
  avatar: string;
};
type MainContextType = {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  currentLang: string;
  setCurrentLang: React.Dispatch<React.SetStateAction<string>>;
};

export const MainContext = createContext<MainContextType | undefined>(undefined);
export const MainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: 0,
    name: '',
    avatar: '',
  });
  const [currentPage, setCurrentPage] = useState('sales');
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const lang = getStore('currentLang');
    if (lang) {
      setCurrentLang(lang);
    }
  }, []);

  return (
    <MainContext.Provider
      value={{
        userInfo,
        setUserInfo,
        currentPage,
        setCurrentPage,
        currentLang,
        setCurrentLang,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};