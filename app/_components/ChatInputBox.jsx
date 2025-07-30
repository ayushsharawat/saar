'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, ArrowRightCircleIcon, ArrowRightSquare, Atom, AudioLines, Cpu, Globe, Mic, Paperclip, SearchCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AIModelsOptions } from '@/Services/Shared'
import { supabase } from '@/Services/supabase'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function ChatInputBox() {
  const { user } = useUser();
  const [userSearchInput, setUserSearchInput] = useState('');
  const [searchType, setSearchType] = useState('search')
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSearchQuery = async () => {
    if (!userSearchInput || !user) {
      console.log('No input or user found');
      return;
    }

    setLoading(true);
    
    try {
      // Encode the query for URL safety
      const encodedQuery = encodeURIComponent(userSearchInput);
      const encodedType = encodeURIComponent(searchType);
      
      // Redirect to search results page with query parameters
      router.push(`/search/results?q=${encodedQuery}&type=${encodedType}`);
      
    } catch (error) {
      console.error('Error redirecting to search:', error);
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userSearchInput && !loading) {
      onSearchQuery();
    }
  }

  return (
    <div className=" h-screen flex flex-col items-center justify-center w-full">
      <Image src="/logoname.png" alt="logo" height={300} width={300} />
      <div className="p-2 w-full max-w-2xl border rounded-2xl">
        <div className='flex items-end justify-between'>
          <Tabs defaultValue="Search" className="w-[400px]">
            <TabsContent value="Search">
              <input 
                type="text" 
                placeholder="Ask Anything"
                value={userSearchInput}
                onChange={(e) => setUserSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className='w-full p-4 outline-none' 
              />
            </TabsContent>
            <TabsContent value="Research">
              <input 
                type="text" 
                placeholder="Research Anything"
                value={userSearchInput}
                onChange={(e) => setUserSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className='w-full p-4 outline-none' 
              />
            </TabsContent>
            <TabsList>
              <TabsTrigger value="Search" className='text-primary' onClick={() => setSearchType('search')}> 
                <SearchCheck /> Search
              </TabsTrigger>
              <TabsTrigger value="Research" className='text-primary' onClick={() => setSearchType('research')}> 
                <Atom /> Research
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className='flex gap-0 items-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'}>
                  <Cpu className={'text-gray-500 h-5 w-5'} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {AIModelsOptions.map((model, index) => (
                  <DropdownMenuItem key={index} className={'mb-1'}>
                    <div>
                      <h2 className='text-smaller'>{model.name}</h2>
                      <p className='text-xs'>{model.desc}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant={'ghost'}>
              <Globe className={'text-gray-500 h-5 w-5'} />
            </Button>
            <Button variant={'ghost'}>
              <Paperclip className={'text-gray-500 h-5 w-5'} />
            </Button>
            <Button variant={'ghost'}>
              <Mic className={'text-gray-500 h-5 w-5'} />
            </Button>
            <Button 
              onClick={onSearchQuery}
              disabled={!userSearchInput || loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : !userSearchInput ? (
                <AudioLines className={'text-white h-5 w-5'} />
              ) : (
                <ArrowRight className={'text-white h-5 w-5'} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}