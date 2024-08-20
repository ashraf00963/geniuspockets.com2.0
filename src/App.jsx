import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import Login from './components/Auth/Login';
import IncomePage from './components/Income/IncomePage';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import PocketsPage from './components/Pockets/PocketsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/pockets' element={<PocketsPage />} />
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
