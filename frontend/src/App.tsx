import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'

import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'

function App() {
  const {checkAuth, authUser, onlineUsers} = useAuthStore();
  const { theme } = useThemeStore();

  // Check if user is logged in
  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  return (
    <div data-theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}/>
          <Route path='/login' element={!authUser ? <LoginPage />: <Navigate to="/" replace />}/>
          <Route path='/setting' element={<SettingsPage />}/>
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
        </Routes>
      </Router>
      
      <Toaster />
    </div>
  )
}

export default App
