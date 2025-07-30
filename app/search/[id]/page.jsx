'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/Services/supabase'
import { ArrowLeft, SearchCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SearchPage() {
  const params = useParams()
  const [searchEntry, setSearchEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSearchEntry = async () => {
      if (!params.id) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('Library')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) {
          console.error('Error fetching search entry:', error)
          setError(error.message)
        } else {
          setSearchEntry(data)
          console.log('Search entry fetched:', data)
        }
      } catch (err) {
        console.error('Error in fetchSearchEntry:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSearchEntry()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading search results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!searchEntry) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Search Not Found</h1>
          <p className="text-gray-500 mb-4">The search entry you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{searchEntry.searchInput}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                searchEntry.type === 'search' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {searchEntry.type}
              </span>
            </div>
            
            <div className="text-sm text-gray-500 space-y-1">
              <p>User: {searchEntry.userEmail}</p>
              <p>Created: {new Date(searchEntry.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Search Results Placeholder */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <SearchCheck className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600 mb-2">Search functionality coming soon!</p>
            <p className="text-sm text-gray-500">
              This is where AI-powered search results will be displayed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 