"use client"
import { supabase } from '@/Services/supabase';
import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import { UserDetailProvider } from '@/context/UserDetailContext'

function Provider({ children }) {

    const { user } = useUser();

    const CreateNewUser = async () => {
        if (!user) {
            console.log('No user found');
            return;
        }
        
        console.log('User found:', user);
        console.log('User email:', user?.primaryEmailAddress?.emailAddress);
        console.log('User name:', user?.fullName);
        
        try {
            // Check if Supabase is properly configured
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                console.warn('Supabase environment variables not configured. Skipping user creation.');
                return;
            }

            // Test Supabase connection first
            console.log('Testing Supabase connection...');
            const { data: testData, error: testError } = await supabase
                .from('Users')
                .select('count')
                .limit(1);
            
            if (testError) {
                console.error('Supabase connection error:', testError);
                return;
            }
            
            console.log('Supabase connection successful');

            // Check if user already exists
            const { data: existingUsers, error: selectError } = await supabase
                .from('Users')
                .select('*')
                .eq('email', user?.primaryEmailAddress?.emailAddress);

            if (selectError) {
                console.error('Error checking existing user:', selectError);
                return;
            }

            console.log('Existing users found:', existingUsers);
            
            // If user doesn't exist, create new user
            if (!existingUsers || existingUsers.length === 0) {
                console.log('Creating new user...');
                
                const { data: newUser, error: insertError } = await supabase
                    .from('Users')
                    .insert([
                        {
                            name: user?.fullName,
                            email: user?.primaryEmailAddress?.emailAddress
                        },
                    ])
                    .select()

                if (insertError) {
                    console.error('Error creating user:', insertError);
                } else {
                    console.log('New user created successfully:', newUser);
                }
            } else {
                console.log('User already exists:', existingUsers[0]);
            }
        } catch (error) {
            console.error('Error in CreateNewUser:', error);
        }
    }

    useEffect(() => {
        console.log('Provider useEffect triggered, user:', user);
        if (user) {
            CreateNewUser();
        }
    }, [user])

    return (
        <UserDetailProvider>
            {children}
        </UserDetailProvider>
    )
}

export default Provider