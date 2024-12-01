import { useState, useEffect } from 'react';
import './App.css';

const channels = [
  'hoon-academy-0',
  'hoon-academy-1',
  'hoon-academy-2',
  'hoon-academy-3',
  'hoon-academy-4',
  'hoon-academy-5',
  'hoon-academy-6',
  'hoon-academy-7',
  'hoon-academy-8',
];

let learning: any = null
function App() {
  const [count, setCount] = useState<any>(0)
  const fetchWithRetry = async (retryCount = 0, maxRetries = 10) => {
    try {
      const ran1 = Math.random();
      const chan = channels[Math.floor(ran1 * channels.length)];
      const res = await fetch(`https://api.are.na/v2/channels/${chan}/contents`);

      if (res.ok) {
        const contents = await res.json();
        const ran2 = Math.random();
        const content = contents.contents[Math.floor(ran2 * contents.contents.length)];
        if(!learning) learning=content.content_html || 'No content available'
        setCount(count+1)
      } else if (res.status === 404 && retryCount < maxRetries) {
        console.warn(`404 received for channel ${chan}. Retrying... (${retryCount + 1}/${maxRetries})`);
        await fetchWithRetry(retryCount + 1, maxRetries);
      } else {
        throw new Error(`API call failed with status: ${res.status}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (retryCount < maxRetries) {
        console.warn(`Retrying... (${retryCount + 1}/${maxRetries})`);
        await fetchWithRetry(retryCount + 1, maxRetries);
      } else {
      }
    }
  };

  useEffect(() => {
    fetchWithRetry(); // Only runs once because no dependencies are added
  }, []);

  useEffect(() => {

  }, [count])

  return (
    <>
      {/*@ts-ignore*/}
      <div dangerouslySetInnerHTML={{ __html: learning || 'Loading...' }} />
    </>
  );
}

export default App;
