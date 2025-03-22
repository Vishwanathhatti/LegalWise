import { useEffect } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import Signup from './components/pages/auth/Signup';
import Login from './components/pages/auth/Login';
import ChatLayout from './components/pages/ChatLayout';
import NotFound from './components/pages/NotFound';
import { useSelector } from 'react-redux';
import Profile from './components/pages/Profile';
import ChatList from './components/pages/ChatList';
import Dashboard from './components/pages/Dashboard';

function App() {
  const darkMode = useSelector((state) => state.mode.darkmode);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/chat/:id" element={<ChatLayout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
