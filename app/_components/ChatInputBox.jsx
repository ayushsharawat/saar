'use client'
import Image from 'next/image'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Atom, AudioLines, Cpu, Globe, Mic, Paperclip, SearchCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ChatInputBox() {
  return (
    <div className=" h-screen flex flex-col items-center justify-center w-full">
      <Image src="/logoname.png" alt="logo" height={300} width={300} />
      <div className="p-2 w-full max-w-2xl border rounded-2xl">
        <div className='flex items-end justify-between'>
          <Tabs defaultValue="Search" className="w-[400px]">
            <TabsContent value="Search"><input type="text" placeholder="Ask Anything"
              className='w-full p-4 outline-none' /></TabsContent>
            <TabsContent value="Research"><input type="text" placeholder="Research Anything"
              className='w-full p-4 outline-none' /></TabsContent>
            <TabsList>
              <TabsTrigger value="Search" className='text-primary'> <SearchCheck /> Search</TabsTrigger>
              <TabsTrigger value="Research" className='text-primary'> <Atom /> Research</TabsTrigger>
            </TabsList>

          </Tabs>
          <div className='flex gap-0 items-center'>
            <Button variant={'ghost'}>
            <Cpu className={'text-gray-500 h-5 w-5'} />
            </Button>
            <Button variant={'ghost'}>
            <Globe className={'text-gray-500 h-5 w-5'} />
            </Button>
            <Button variant={'ghost'}>
            <Paperclip className={'text-gray-500 h-5 w-5'} />
            </Button>
            <Button variant={'ghost'}>
            <Mic className={'text-gray-500 h-5 w-5'} />
            </Button>
            <Button>
              <AudioLines className={'text-white h-5 w-5'} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}