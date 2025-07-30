'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { ArrowLeft, SearchCheck, Loader2, Image as ImageIcon, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ImageSearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  
  const [query, setQuery] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initializeImageSearch = async () => {
      const queryParam = searchParams.get('q')
      
      if (!queryParam) {
        router.push('/')
        return
      }

      setQuery(queryParam)
      
      // Send background event (server-side only)
      if (user) {
        try {
          await fetch('/api/inngest/trigger', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              event: 'image/requested',
              data: {
                query: queryParam,
                userId: user.id
              }
            })
          })
        } catch (error) {
          console.log('Background event failed (optional):', error)
        }
      }
      
      // Perform image search
      await performImageSearch(queryParam)
    }

    initializeImageSearch()
  }, [searchParams, router, user])

  const performImageSearch = async (searchQuery) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate image search (replace with actual image API)
      const mockImages = await generateMockImages(searchQuery)
      setImages(mockImages)
    } catch (error) {
      console.error('Error performing image search:', error)
      setError('Failed to perform image search. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateMockImages = async (query) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock image results
    const mockImages = [
      {
        id: 1,
        url: `https://picsum.photos/400/300?random=1&query=${encodeURIComponent(query)}`,
        title: `${query} - Image 1`,
        source: 'Unsplash',
        width: 400,
        height: 300
      },
      {
        id: 2,
        url: `https://picsum.photos/400/300?random=2&query=${encodeURIComponent(query)}`,
        title: `${query} - Image 2`,
        source: 'Pexels',
        width: 400,
        height: 300
      },
      {
        id: 3,
        url: `https://picsum.photos/400/300?random=3&query=${encodeURIComponent(query)}`,
        title: `${query} - Image 3`,
        source: 'Pixabay',
        width: 400,
        height: 300
      },
      {
        id: 4,
        url: `https://picsum.photos/400/300?random=4&query=${encodeURIComponent(query)}`,
        title: `${query} - Image 4`,
        source: 'Unsplash',
        width: 400,
        height: 300
      },
      {
        id: 5,
        url: `https://picsum.photos/400/300?random=5&query=${encodeURIComponent(query)}`,
        title: `${query} - Image 5`,
        source: 'Pexels',
        width: 400,
        height: 300
      },
      {
        id: 6,
        url: `https://picsum.photos/400/300?random=6&query=${encodeURIComponent(query)}`,
        title: `${query} - Image 6`,
        source: 'Pixabay',
        width: 400,
        height: 300
      }
    ]

    return mockImages
  }

  const handleNewSearch = () => {
    router.push('/')
  }

  const handleDownload = (imageUrl, imageTitle) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${imageTitle}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Searching for images of "{query}"</h2>
          <p className="text-gray-600">Finding the best images for you...</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="text-sm text-gray-500">Processing image search...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Image Search Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleNewSearch}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Try New Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <ImageIcon className="h-6 w-6 mr-2" />
                  Images for "{query}"
                </h1>
                <p className="text-sm text-gray-500">Image search results</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Image Search
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>User: {user?.primaryEmailAddress?.emailAddress}</p>
            <p>Images found: {images.length}</p>
          </div>
        </div>

        {/* Image Grid */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Image Results</h2>
          
          {images.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No images found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div key={image.id} className="group relative bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                      <Button
                        onClick={() => handleDownload(image.url, image.title)}
                        size="sm"
                        variant="secondary"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  {/* Image info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 truncate">{image.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{image.source}</span>
                      <span className="text-xs text-gray-500">{image.width}×{image.height}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <Button onClick={handleNewSearch} variant="outline">
            <SearchCheck className="mr-2 h-4 w-4" />
            New Search
          </Button>
          <Button onClick={() => window.print()}>
            Export Results
          </Button>
        </div>
      </div>
    </div>
  )
} 