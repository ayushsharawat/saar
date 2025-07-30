'use client'
import React, { useState, useEffect } from 'react'
import { supabase } from '@/Services/supabase'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, RefreshCw } from 'lucide-react'

export default function LibraryDisplay() {
  const { user } = useUser();
  const router = useRouter();
  const [libraryData, setLibraryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLibraryData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Library')
        .select('*')
        .eq('userEmail', user?.primaryEmailAddress?.emailAddress)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching library data:', error);
        setError(error.message);
      } else {
        setLibraryData(data || []);
        console.log('Library data fetched:', data);
      }
    } catch (err) {
      console.error('Error in fetchLibraryData:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, [user]);

  const viewSearchResults = (entry) => {
    const encodedQuery = encodeURIComponent(entry.searchInput);
    const encodedType = encodeURIComponent(entry.type);
    router.push(`/search/results?q=${encodedQuery}&type=${encodedType}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Library Entries</h3>
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
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="text-red-600 bg-red-100 p-2 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {!loading && !error && libraryData.length === 0 && (
        <p className="text-gray-500">No entries found. Try adding some searches!</p>
      )}
      
      {!loading && !error && libraryData.length > 0 && (
        <div className="space-y-2">
          {libraryData.map((entry) => (
            <div key={entry.id} className="bg-white p-3 rounded border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">{entry.searchInput}</p>
                  <p className="text-sm text-gray-600">Type: {entry.type}</p>
                  {entry.aiModel && (
                    <p className="text-sm text-gray-600">AI Model: {entry.aiModel}</p>
                  )}
                  {entry.searchId && (
                    <p className="text-xs text-gray-500">Search ID: {entry.searchId}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {entry.type}
                  </span>
                  <Button 
                    onClick={() => viewSearchResults(entry)}
                    size="sm"
                    variant="ghost"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 