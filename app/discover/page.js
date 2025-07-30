'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Search, Lightbulb, Clock, Star, ArrowRight, Compass } from 'lucide-react'

export default function DiscoverPage() {
  const router = useRouter()
  const { user } = useUser()
  const [trendingTopics, setTrendingTopics] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDiscoverData()
  }, [user])

  const loadDiscoverData = async () => {
    setLoading(true)
    
    // Mock trending topics
    const mockTrending = [
      { id: 1, title: 'Artificial Intelligence', category: 'Technology', searches: 15420, trend: 'up' },
      { id: 2, title: 'Climate Change', category: 'Environment', searches: 12850, trend: 'up' },
      { id: 3, title: 'Space Exploration', category: 'Science', searches: 9870, trend: 'up' },
      { id: 4, title: 'Quantum Computing', category: 'Technology', searches: 7650, trend: 'up' },
      { id: 5, title: 'Renewable Energy', category: 'Environment', searches: 6540, trend: 'up' },
      { id: 6, title: 'Machine Learning', category: 'Technology', searches: 5430, trend: 'up' }
    ]

    setTrendingTopics(mockTrending)
    setLoading(false)
  }

  const handleTopicClick = (topic) => {
    const encodedQuery = encodeURIComponent(topic.title)
    router.push(`/search/results?q=${encodedQuery}&type=search`)
  }

  const handleQuickSearch = (query) => {
    const encodedQuery = encodeURIComponent(query)
    router.push(`/search/results?q=${encodedQuery}&type=search`)
  }

  const searchSuggestions = [
    'Latest AI developments',
    'Climate change solutions',
    'Space missions 2024',
    'Quantum computing breakthroughs',
    'Renewable energy trends',
    'Machine learning applications'
  ]

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Compass className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Discovering Trends</h2>
          <p className="text-gray-600">Loading trending topics...</p>
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
                <Compass className="h-8 w-8 mr-3 text-blue-600" />
                Discover
              </h1>
              <p className="text-gray-600 mt-2">Explore trending topics and get inspired</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-semibold">{user?.firstName || 'User'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trending Topics */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                  Trending Topics
                </CardTitle>
                <CardDescription>
                  Most searched topics this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={topic.id}
                      onClick={() => handleTopicClick(topic)}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{topic.title}</h3>
                          <p className="text-sm text-gray-500">{topic.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{topic.searches.toLocaleString()} searches</span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-500" />
                  Quick Search
                </CardTitle>
                <CardDescription>
                  Popular search suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => handleQuickSearch(suggestion)}
                    >
                      <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your recent searches
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentSearches.length === 0 ? (
                  <div className="text-center py-4">
                    <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent searches</p>
                    <p className="text-xs text-gray-400">Start searching to see your history</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="text-sm truncate">{search.query}</span>
                        <span className="text-xs text-gray-500">{search.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>
                  Search activity overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Searches</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">This Week</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Favorite Topics</span>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Explore by Category</CardTitle>
              <CardDescription>
                Discover topics by interest area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Technology', icon: '💻', color: 'bg-blue-100 text-blue-800' },
                  { name: 'Science', icon: '🔬', color: 'bg-purple-100 text-purple-800' },
                  { name: 'Environment', icon: '🌍', color: 'bg-green-100 text-green-800' },
                  { name: 'Health', icon: '🏥', color: 'bg-red-100 text-red-800' },
                  { name: 'Business', icon: '💼', color: 'bg-gray-100 text-gray-800' },
                  { name: 'Education', icon: '📚', color: 'bg-yellow-100 text-yellow-800' },
                  { name: 'Entertainment', icon: '🎬', color: 'bg-pink-100 text-pink-800' },
                  { name: 'Sports', icon: '⚽', color: 'bg-orange-100 text-orange-800' }
                ].map((category) => (
                  <Button
                    key={category.name}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-1"
                    onClick={() => handleQuickSearch(category.name)}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 