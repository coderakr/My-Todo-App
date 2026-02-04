import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useAuth } from './Context/AuthContext'

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={user ? <Home /> : <Navigate to="/auth" />} />
        <Route path='/auth' element={user ? <Navigate to="/" /> : <Auth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App