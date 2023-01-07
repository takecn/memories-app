import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

// components
import { Users } from './containers/Users.jsx';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ユーザー一覧 */}
        <Route path="/admin/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}
