import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PostPage from './pages/PostPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:slug" element={<PostPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
