import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Feed from './Feed';
import Nav from './Nav';
import React from 'react';
import PostPage from './PostPage';
import Profile from './Profile';
import RequestsPage from './RequestsPage';

export default function App() {
  if (localStorage.getItem('token') != null) {
    return (
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="requests" element={<RequestsPage />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="*" element={<Feed />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/signup" element={<Signup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
