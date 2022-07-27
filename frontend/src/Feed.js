import { useState, useEffect } from 'react';
import Post from './Post';
import uniqid from 'uniqid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';

function Feed() {
  const [mode, setMode] = useState('general');
  const [generalPosts, setGeneralPosts] = useState([]);
  const [friendPosts, setFriendPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchPosts = async (url, type) => {
    try {
      let res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
      let resJson = await res.json();
      if (type === 'general') {
        setGeneralPosts(resJson.posts);
      }
      if (type === 'friends') {
        setFriendPosts(resJson.posts);
      }
      setIsLoaded(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts('http://localhost:5000/api/post/friends', 'friends');
    fetchPosts('http://localhost:5000/api/post/general', 'general');
  }, []);

  if (isLoaded) {
    return (
      <div id="container">
        <span>Friends </span>
        <label className="switch">
          <input
            type="checkbox"
            onChange={() => {
              if (mode === 'friends') {
                setMode('general');
              } else {
                setMode('friends');
              }
            }}
          />
          <span className="slider"></span>
        </label>
        <span> General</span>
        <div id="info-icon">
          <InfoOutlinedIcon fontSize="small" sx={{ color: 'gray' }} />
        </div>
        {mode === 'general'
          ? generalPosts.map((post) => {
              // friend's posts
              let date = new Date(post.timeStamp);
              return <Post key={uniqid()} date={date} post={post} />;
            })
          : friendPosts.map((post) => {
              // general posts
              let date = new Date(post.timeStamp);
              return <Post key={uniqid()} date={date} post={post} />;
            })}
      </div>
    );
  } else {
    return (
      <div id="loading">
        <p>Loading...</p>
      </div>
    );
  }
}

export default Feed;
