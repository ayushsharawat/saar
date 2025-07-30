import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request) {
  try {
    const { query, type, model } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Web search using DuckDuckGo (free, no API key needed)
    const searchResults = await performWebSearch(query);
    
    // AI analysis using the selected model
    const aiAnalysis = await performAIAnalysis(query, searchResults, type, model);

    return NextResponse.json({
      success: true,
      query,
      type,
      model,
      webResults: searchResults,
      aiAnalysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}

async function performWebSearch(query) {
  try {
    // Using DuckDuckGo search (free, no API key)
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    // Extract search results
    $('.result').each((index, element) => {
      if (index < 10) { // Limit to 10 results
        const title = $(element).find('.result__title').text().trim();
        const link = $(element).find('.result__url').attr('href');
        const snippet = $(element).find('.result__snippet').text().trim();
        
        if (title && link) {
          results.push({
            title,
            url: link,
            snippet,
            source: 'DuckDuckGo'
          });
        }
      }
    });

    return results;
  } catch (error) {
    console.error('Web search error:', error);
    // Fallback to mock results
    return [
      {
        title: `Search results for: ${query}`,
        url: '#',
        snippet: `This is a search result for "${query}". The actual web search is temporarily unavailable.`,
        source: 'Mock Data'
      }
    ];
  }
}

async function performAIAnalysis(query, webResults, type, model) {
  try {
    // Using Hugging Face Inference API (free tier available)
    // You'll need to get a free API key from: https://huggingface.co/settings/tokens
    
    // For now, we'll use a mock AI analysis
    const analysis = {
      summary: `AI analysis of "${query}": Based on the search results, this topic appears to be significant in current discussions. The analysis suggests multiple perspectives and potential areas for further research.`,
      keyPoints: [
        `Primary focus: ${query}`,
        'Multiple sources available',
        'Recent developments noted',
        'Potential for deeper research'
      ],
      confidence: 0.85,
      model: 'Mock AI Model',
      type: type
    };

    return analysis;
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      summary: `Analysis of "${query}" completed with basic processing.`,
      keyPoints: ['Basic analysis performed', 'Web results processed'],
      confidence: 0.7,
      model: 'Fallback Model',
      type: type
    };
  }
} 