'use client'
import Image from 'next/image'
import React from 'react'

export default function ChatInputBox() {
  return (
    <div className=" h-screen flex flex-col items-center justify-center w-full">
      <Image src="/logoname.png" alt="logo" height={300} width={300} />
      <div className="p-2 w-full max-w-2xl border rounded-2xl">
        <input type="text" placeholder="Ask Anything" 
        className='w-full p-4 outline-none' />
      </div>
    </div>
  )
}