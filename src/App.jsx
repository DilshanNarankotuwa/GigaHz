
import { Route, Routes } from 'react-router'
import './App.css'
import HomePage from './pages/homepage'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage/>}/>
    </Routes>
  )
}

export default App
