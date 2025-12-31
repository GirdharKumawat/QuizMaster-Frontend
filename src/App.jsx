import { useEffect } from 'react';
import { Toaster } from 'sonner'; 
import Routing from './routes/Routing'
import { useAuth } from './features/auth/useAuth';

function App() {
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
     <Routing/>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
