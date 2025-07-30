'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/Services/supabase'
import { useUser } from '@clerk/nextjs'
import { ArrowLeft, SearchCheck, Loader2, ExternalLink, Image as ImageIcon, Globe, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState('search')
  const [webResults, setWebResults] = useState([])
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchId, setSearchId] = useState(null)
  const [activeTab, setActiveTab] = useState('web')

  useEffect(() => {
    const initializeSearch = async () => {
      const queryParam = searchParams.get('q')
      const typeParam = searchParams.get('type') || 'search'
      const modelParam = searchParams.get('model') || 'GPT-4'
      
      if (!queryParam) {
        router.push('/')
        return
      }

      setQuery(queryParam)
      setSearchType(typeParam)
      
      // Generate a unique search ID
      const newSearchId = crypto.randomUUID()
      setSearchId(newSearchId)
      
      // Send background event (server-side only)
      if (user) {
        try {
          await fetch('/api/inngest/trigger', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              event: 'search/requested',
              data: {
                query: queryParam,
                type: typeParam,
                model: modelParam,
                userId: user.id
              }
            })
          })
        } catch (error) {
          console.log('Background event failed (optional):', error)
        }
      }
      
      // Perform the search
      await performSearch(queryParam, typeParam, newSearchId, modelParam)
    }

    initializeSearch()
  }, [searchParams, router, user])

  const performSearch = async (searchQuery, type, searchId, model) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          type: type,
          model: model
        })
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      
      if (data.success) {
        setWebResults(data.webResults || [])
        setAiAnalysis(data.aiAnalysis || null)
        
        // Save to database
        await saveSearchToDatabase(searchQuery, type, searchId, data, model)
      } else {
        throw new Error(data.error || 'Search failed')
      }
    } catch (error) {
      console.error('Error performing search:', error)
      setError('Failed to perform search. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const saveSearchToDatabase = async (searchQuery, type, searchId, searchData, model) => {
    if (!user) return

    try {
      const result = await supabase.from('Library').insert([
        {
          searchInput: searchQuery,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          type: type,
          searchId: searchId,
          searchResults: JSON.stringify(searchData),
          aiModel: model
        }
      ]).select()

      if (result.error) {
        console.error('Error saving search:', result.error)
        // Log more details for debugging
        console.error('Error details:', {
          error: result.error,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          searchQuery,
          type,
          searchId,
          model
        })
      } else {
        console.log('Search saved successfully:', result.data)
      }
    } catch (error) {
      console.error('Error saving search to database:', error)
      // Log more details for debugging
      console.error('Catch error details:', {
        error: error.message,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        searchQuery,
        type,
        searchId,
        model
      })
    }
  }

  const handleNewSearch = () => {
    router.push('/')
  }

  const handleImageSearch = () => {
    const encodedQuery = encodeURIComponent(query)
    router.push(`/search/images?q=${encodedQuery}`)
  }

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Searching for "{query}"</h2>
          <p className="text-gray-600">Analyzing your query with AI...</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="text-sm text-gray-500">Processing web results and AI analysis...</p>
          </div>
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
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                searchType === 'search' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {searchType}
              </span>
              <Button onClick={handleImageSearch} variant="outline" size="sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Images
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>User: {user?.primaryEmailAddress?.emailAddress}</p>
            <p>Web Results: {webResults.length} found</p>
            {aiAnalysis && <p>AI Analysis: {aiAnalysis.confidence * 100}% confidence</p>}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('web')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'web'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Globe className="h-4 w-4 inline mr-2" />
                Web Results ({webResults.length})
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ai'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                AI Analysis
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'web' && (
              <div className="space-y-4">
                {webResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No web results found</p>
                ) : (
                  webResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                          <a href={result.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            {result.title}
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {result.source}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{result.snippet}</p>
                      <p className="text-sm text-gray-500 mt-2">{result.url}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                {aiAnalysis ? (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
                      <p className="text-gray-700 leading-relaxed">{aiAnalysis.summary}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Model: {aiAnalysis.model}</span>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          {Math.round(aiAnalysis.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">Key Points</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8">AI analysis not available</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
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