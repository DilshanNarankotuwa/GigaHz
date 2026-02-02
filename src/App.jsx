
import { Route, Routes } from 'react-router'
import './App.css'
import HomePage from './pages/homepage'
import LaptopsPage from './pages/laptopspage'
import MobilesPage from './pages/MobilesPage'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage/>}/>
      <Route path='laptops' element={<LaptopsPage/>}/>
      <Route path='mobiles' element={<MobilesPage/>}/>
    </Routes>
  )
}

export default App
