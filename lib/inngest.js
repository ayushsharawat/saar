import { Inngest } from 'inngest';

// Create Inngest client
export const inngest = new Inngest({ 
  id: "saar-ai-search-engine",
  name: "SaaR.AI Search Engine",
  // Add your Inngest signing key here (get from Inngest dashboard)
  // signingKey: process.env.INNGEST_SIGNING_KEY,
});

// Helper function to send events
export async function sendSearchEvent(query, type, userId) {
  try {
    await inngest.send({
      name: "search/requested",
      data: {
        query,
        type,
        userId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to send search event:', error);
  }
}

export async function sendImageEvent(query, userId) {
  try {
    await inngest.send({
      name: "image/requested",
      data: {
        query,
        userId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to send image event:', error);
  }
} 