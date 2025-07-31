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
  const [selectedModel, setSelectedModel] = useState(AIModelsOptions[0])
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
      const encodedModel = encodeURIComponent(selectedModel.name);
      
      // Redirect to search results page with query parameters
      router.push(`/search/results?q=${encodedQuery}&type=${encodedType}&model=${encodedModel}`);
      
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

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center w-full py-8">
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
                <Button variant={'ghost'} className="flex items-center gap-2">
                  <Cpu className={'text-gray-500 h-5 w-5'} />
                  <span className="text-xs text-gray-500 hidden sm:inline">{selectedModel.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>Select AI Model</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {AIModelsOptions.map((model, index) => (
                  <DropdownMenuItem 
                    key={index} 
                    className={`mb-1 cursor-pointer ${selectedModel.name === model.name ? 'bg-blue-50' : ''}`}
                    onClick={() => handleModelSelect(model)}
                  >
                    <div className="w-full">
                      <h3 className="font-medium text-sm">{model.name}</h3>
                      <p className="text-xs text-gray-500">{model.desc}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant={'ghost'} 
              onClick={() => {
                // Web search functionality
                if (userSearchInput) {
                  const encodedQuery = encodeURIComponent(userSearchInput);
                  window.open(`https://www.google.com/search?q=${encodedQuery}`, '_blank');
                }
              }}
              title="Search on Google"
            >
              <Globe className={'text-gray-500 h-5 w-5'} />
            </Button>
            <Button 
              variant={'ghost'}
              onClick={() => {
                // File upload functionality
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.txt,.pdf,.doc,.docx,.csv';
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setUserSearchInput(event.target.result);
                    };
                    reader.readAsText(file);
                  }
                };
                input.click();
              }}
              title="Upload File"
            >
              <Paperclip className={'text-gray-500 h-5 w-5'} />
            </Button>
            <Button 
              variant={'ghost'}
              onClick={() => {
                // Voice input functionality
                if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                  const recognition = new SpeechRecognition();
                  recognition.continuous = false;
                  recognition.interimResults = false;
                  recognition.lang = 'en-US';
                  
                  recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setUserSearchInput(transcript);
                  };
                  
                  recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    alert('Speech recognition not available. Please type your query.');
                  };
                  
                  recognition.start();
                } else {
                  alert('Speech recognition not supported in this browser. Please type your query.');
                }
              }}
              title="Voice Input"
            >
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