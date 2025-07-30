'use client'
import React from 'react'
import { Heart, Github, Instagram } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-gray-300">Made with</span>
            <Heart className="h-5 w-5 text-red-500 fill-current animate-pulse" />
            <span className="text-gray-300">by</span>
            <span className="font-semibold text-white">Ayush Sharawat</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="https://github.com/ayushsharawat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <Github className="h-5 w-5" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
            
            <Link 
              href="https://www.instagram.com/iussehrawat/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <Instagram className="h-5 w-5" />
              <span className="hidden sm:inline">Instagram</span>
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} SaaR.ai. All rights reserved. | 
            <span className="ml-1">Advanced AI-powered search engine</span>
          </p>
        </div>
      </div>
    </footer>
  )
} 