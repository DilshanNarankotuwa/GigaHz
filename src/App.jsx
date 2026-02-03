
import { Route, Routes } from 'react-router'
import './App.css'
import HomePage from './pages/homepage'
import LaptopsPage from './pages/laptopspage'
import MobilesPage from './pages/mobilespage'
import PreOwnedPage from './pages/preownedpage'
import BuildMyPC from './pages/buildmypcpage'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage/>}/>
      <Route path='laptops' element={<LaptopsPage/>}/>
      <Route path='mobiles' element={<MobilesPage/>}/>
      <Route path='preowned' element={<PreOwnedPage/>}/>
      <Route path='buildmypc' element={<BuildMyPC/>}/>
    </Routes>
  )
}

export default App
