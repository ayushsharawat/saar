"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/Services/supabase';

export const UserDetailContext = createContext();

export const useUserDetail = () => {
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error('useUserDetail must be used within a UserDetailProvider');
  }
  return context;
};

export const UserDetailProvider = ({ children }) => {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('Users')
          .select('*')
          .eq('email', user?.primaryEmailAddress?.emailAddress)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user data:', error);
        }

        setUserData(data);
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const value = {
    userData,
    loading,
    user
  };

  return (
    <UserDetailContext.Provider value={value}>
      {children}
    </UserDetailContext.Provider>
  );
};