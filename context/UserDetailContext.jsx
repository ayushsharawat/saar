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
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setErrorMsg(null);
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }
      // Check Supabase config
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setErrorMsg('Supabase credentials are not set. Please check your .env.local file.');
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
        if (error && Object.keys(error).length > 0) {
          setErrorMsg(
            'Error fetching user data from Supabase. ' +
            (error.message || 'Unknown error. Check if the Users table and email column exist.')
          );
          // Log for devs
          console.error('Error fetching user data:', error, {
            table: 'Users',
            email: user?.primaryEmailAddress?.emailAddress,
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            data,
          });
        } else if (error && Object.keys(error).length === 0) {
          setErrorMsg(
            'Supabase returned an empty error object. This usually means the table or column does not exist, or credentials are wrong.'
          );
          console.error('Supabase returned empty error object. Check table/column/case/credentials.');
        }
        setUserData(data);
      } catch (error) {
        setErrorMsg('Unexpected error fetching user data.');
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
    user,
    errorMsg,
  };

  return (
    <UserDetailContext.Provider value={value}>
      {errorMsg && (
        <div style={{color: 'red', background: '#fff3f3', padding: 12, margin: 8, borderRadius: 8, fontWeight: 'bold'}}>
          {errorMsg}
        </div>
      )}
      {children}
    </UserDetailContext.Provider>
  );
};