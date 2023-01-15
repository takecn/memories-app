import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Users } from './components/containers/Users.jsx';
import { Posts } from './components/containers/Posts.jsx';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/users" element={<Users />} />
        <Route path="/home" element={<Posts />} />
      </Routes>
    </BrowserRouter>
  );
}
