// Mock Inngest implementation - no external dependencies required
export const inngest = {
  send: async (event) => {
    console.log('Mock Inngest event sent:', event);
    return Promise.resolve();
  }
};

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
    console.log('Search event logged:', { query, type, userId });
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
    console.log('Image event logged:', { query, userId });
  } catch (error) {
    console.error('Failed to send image event:', error);
  }
} 