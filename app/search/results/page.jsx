'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/Services/supabase'
import { useUser } from '@clerk/nextjs'
import { ArrowLeft, SearchCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState('search')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchId, setSearchId] = useState(null)

  useEffect(() => {
    const initializeSearch = async () => {
      const queryParam = searchParams.get('q')
      const typeParam = searchParams.get('type') || 'search'
      
      if (!queryParam) {
        router.push('/')
        return
      }

      setQuery(queryParam)
      setSearchType(typeParam)
      
      // Generate a unique search ID
      const newSearchId = crypto.randomUUID()
      setSearchId(newSearchId)
      
      // Save the search to database
      await saveSearchToDatabase(queryParam, typeParam, newSearchId)
      
      // Perform the search
      await performSearch(queryParam, typeParam)
    }

    initializeSearch()
  }, [searchParams, router, user])

  const saveSearchToDatabase = async (searchQuery, type, searchId) => {
    if (!user) return

    try {
      const result = await supabase.from('Library').insert([
        {
          searchInput: searchQuery,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          type: type,
          searchId: searchId
        }
      ]).select()

      if (result.error) {
        console.error('Error saving search:', result.error)
      } else {
        console.log('Search saved successfully:', result.data)
      }
    } catch (error) {
      console.error('Error saving search to database:', error)
    }
  }

  const performSearch = async (searchQuery, type) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate AI search results (replace with actual AI integration)
      const mockResults = await generateMockResults(searchQuery, type)
      setResults(mockResults)
    } catch (error) {
      console.error('Error performing search:', error)
      setError('Failed to perform search. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateMockResults = async (query, type) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate mock results based on query and type
    const mockData = [
      {
        id: 1,
        title: `AI Analysis: ${query}`,
        content: `This is a comprehensive analysis of "${query}" using advanced AI algorithms. The results show significant insights and patterns that could be valuable for your research.`,
        source: 'AI Research Database',
        confidence: 0.95,
        type: type
      },
      {
        id: 2,
        title: `Research Findings: ${query}`,
        content: `Recent studies and research papers related to "${query}" have revealed interesting correlations and new perspectives on this topic.`,
        source: 'Academic Database',
        confidence: 0.87,
        type: type
      },
      {
        id: 3,
        title: `Expert Opinion: ${query}`,
        content: `Leading experts in the field have provided insights on "${query}" that challenge conventional understanding and offer new approaches.`,
        source: 'Expert Network',
        confidence: 0.92,
        type: type
      }
    ]

    return mockData
  }

  const handleNewSearch = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Searching for "{query}"</h2>
          <p className="text-gray-600">Analyzing your query with AI...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Search Error</h1>
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
      <div className="max-w-6xl mx-auto p-6">
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
                <h1 className="text-2xl font-bold">{query}</h1>
                <p className="text-sm text-gray-500">Search ID: {searchId}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              searchType === 'search' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {searchType}
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>User: {user?.primaryEmailAddress?.emailAddress}</p>
            <p>Results: {results.length} found</p>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {Math.round(result.confidence * 100)}% confidence
                </span>
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">{result.content}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Source: {result.source}</span>
                <span>Type: {result.type}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
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