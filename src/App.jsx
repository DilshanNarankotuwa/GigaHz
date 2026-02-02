
import { Route, Routes } from 'react-router'
import './App.css'
import HomePage from './pages/homepage'
import LaptopsPage from './pages/laptopspage'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage/>}/>
      <Route path='laptops' element={<LaptopsPage/>}/>
    </Routes>
  )
}

export default App
