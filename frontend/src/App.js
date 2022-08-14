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
  const acceptRequest = async (id, callback) => {
    try {
      await fetch(`http://localhost:5000/api/user/friend/accept/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
      callback();
    } catch (err) {
      console.log(err);
    }
  };

  const declineRequest = async (id, callback) => {
    try {
      await fetch(`http://localhost:5000/api/user/friend/decline/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
      callback();
    } catch (err) {
      console.log(err);
    }
  };

  const sendFriendRequest = async (id, callback) => {
    try {
      await fetch(`http://localhost:5000/api/user/friend/request/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
      callback();
    } catch (err) {
      console.log(err);
    }
  };

  const revokeRequest = async (id, callback) => {
    try {
      await fetch(
        `http://localhost:5000/api/user/friend/request/${id}/revoke`,
        {
          method: 'PUT',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      callback();
    } catch (err) {
      console.log(err);
    }
  };

  if (localStorage.getItem('token') != null) {
    return (
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route
            exact
            path="/profile"
            element={
              <Profile
                acceptRequest={acceptRequest}
                declineRequest={declineRequest}
                sendFriendRequest={sendFriendRequest}
                revokeRequest={revokeRequest}
              />
            }
          />
          <Route
            exact
            path="requests"
            element={
              <RequestsPage
                acceptRequest={acceptRequest}
                declineRequest={declineRequest}
              />
            }
          />
          <Route path="/post" element={<PostPage />} />
          <Route
            path="*"
            element={
              <Feed
                acceptRequest={acceptRequest}
                declineRequest={declineRequest}
                sendFriendRequest={sendFriendRequest}
                revokeRequest={revokeRequest}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    );
  } else {
    return (
      <div className="bluebackground">
        <BrowserRouter>
          <Routes>
            <Route exact path="/signup" element={<Signup />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}
