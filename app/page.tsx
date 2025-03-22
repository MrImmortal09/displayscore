import { MongoClient } from 'mongodb';

// This is a server component that fetches data at request time
export default async function Home() {
  // Connect to MongoDB
  const client = new MongoClient(process.env.MONGODB_URI || '');
  
  try {
    await client.connect();
    const database = client.db('sequriquest');
    const collection = database.collection('userProgress');
    
    // Fetch all documents from the collection
    const userData = await collection.find({}).toArray();
    
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6">User Progress Data</h1>
        
        {userData.length === 0 ? (
          <p>No user progress data found</p>
        ) : (
          <div className="grid gap-4">
            {userData.map((user, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <pre className="whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6">User Progress Data</h1>
        <p className="text-red-500">Error loading data: {String(error)}</p>
      </main>
    );
  } finally {
    await client.close();
  }
}