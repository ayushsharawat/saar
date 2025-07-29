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

        if (error) {
          // Log the full error object and query params for debugging
          console.error('Error fetching user data:', error, {
            table: 'Users',
            email: user?.primaryEmailAddress?.emailAddress
          });
          // If the error is about missing table or column, show a clear warning
          if (error.message && (error.message.includes('relation') || error.message.includes('column'))) {
            console.warn('Supabase table "Users" or column "email" does not exist. Please check your database schema.');
          }
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