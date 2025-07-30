'use client'
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/Services/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Clock, 
  Filter, 
  RefreshCw, 
  Eye, 
  Trash2, 
  Calendar,
  Brain,
  Globe,
  FileText
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Library() {
  const { user } = useUser()
  const router = useRouter()
  const [libraryData, setLibraryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, search, research
  const [sortBy, setSortBy] = useState('newest') // newest, oldest

  useEffect(() => {
    if (user) {
      fetchLibraryData()
    }
  }, [user, filter, sortBy])

  const fetchLibraryData = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      let query = supabase
        .from('Library')
        .select('*')
        .eq('userEmail', user?.primaryEmailAddress?.emailAddress)

      // Apply filter
      if (filter !== 'all') {
        query = query.eq('type', filter)
      }

      // Apply sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: true })
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching library data:', error)
        setError(error.message)
      } else {
        setLibraryData(data || [])
        console.log('Library data fetched:', data)
      }
    } catch (err) {
      console.error('Error in fetchLibraryData:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const viewSearchResults = (entry) => {
    const encodedQuery = encodeURIComponent(entry.searchInput)
    const encodedType = encodeURIComponent(entry.type)
    const encodedModel = entry.aiModel ? encodeURIComponent(entry.aiModel) : ''
    
    if (encodedModel) {
      router.push(`/search/results?q=${encodedQuery}&type=${encodedType}&model=${encodedModel}`)
    } else {
      router.push(`/search/results?q=${encodedQuery}&type=${encodedType}`)
    }
  }

  const deleteEntry = async (entryId) => {
    try {
      const { error } = await supabase
        .from('Library')
        .delete()
        .eq('id', entryId)

      if (error) {
        console.error('Error deleting entry:', error)
      } else {
        // Refresh the data
        fetchLibraryData()
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'search':
        return <Search className="h-4 w-4" />
      case 'research':
        return <FileText className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'search':
        return 'bg-blue-100 text-blue-800'
      case 'research':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Sign In Required</h1>
          <p className="text-gray-500 mb-4">Please sign in to view your library</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Brain className="h-8 w-8 mr-3 text-blue-600" />
                Library
              </h1>
              <p className="text-gray-600 mt-2">Your saved conversations and search history</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Entries</p>
              <p className="font-semibold text-2xl">{libraryData.length}</p>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="search">Search</option>
                  <option value="research">Research</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
            <Button 
              onClick={fetchLibraryData} 
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your library...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={fetchLibraryData} variant="outline" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        ) : libraryData.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Saved Conversations</h2>
            <p className="text-gray-500 mb-4">Start searching to see your conversations here</p>
            <Button onClick={() => router.push('/')}>
              Start Searching
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraryData.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(entry.type)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(entry.type)}`}>
                        {entry.type}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {entry.searchInput}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-gray-600">
                    {entry.aiModel && (
                      <div className="flex items-center space-x-2">
                        <Brain className="h-3 w-3" />
                        <span>{entry.aiModel}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(entry.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button
                      onClick={() => viewSearchResults(entry)}
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 