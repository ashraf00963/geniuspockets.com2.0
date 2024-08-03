import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import Login from './components/Auth/Login';
import IncomePage from './components/Income/IncomePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
