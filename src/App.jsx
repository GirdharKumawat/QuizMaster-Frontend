import { useEffect } from 'react';
import { Toaster } from './components/UI/Toast'; 
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
      <Toaster/>
    </>
  )
}

export default App
