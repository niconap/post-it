import { useState, useEffect } from 'react';
import Post from './Post';
import uniqid from 'uniqid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PostForm from './PostForm';

function Feed() {
  const [mode, setMode] = useState('general');
  const [generalPosts, setGeneralPosts] = useState([]);
  const [friendPosts, setFriendPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchPosts = async () => {
    try {
      let res = await fetch('http://localhost:5000/api/post/friends', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
      let resJson = await res.json();
      setFriendPosts(resJson.posts);
    } catch (err) {
      console.log(err);
    }
    try {
      let res = await fetch('http://localhost:5000/api/post/general', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
      let resJson = await res.json();
      setGeneralPosts(resJson.posts);
    } catch (err) {
      console.log(err);
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoaded) {
    return (
      <div id="container">
        <span>General </span>
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
        <span> Friends</span>
        <div id="info-icon">
          <InfoOutlinedIcon fontSize="small" sx={{ color: 'gray' }} />
        </div>
        <PostForm />
        {mode === 'general'
          ? generalPosts
              .slice(0)
              .reverse()
              .map((post) => {
                let date = new Date(post.timeStamp);
                return (
                  <Post
                    key={uniqid()}
                    fetchPosts={fetchPosts}
                    date={date}
                    post={post}
                    mode={mode}
                  />
                );
              })
          : friendPosts
              .slice(0)
              .reverse()
              .map((post) => {
                let date = new Date(post.timeStamp);
                return (
                  <Post
                    key={uniqid()}
                    fetchPosts={fetchPosts}
                    date={date}
                    post={post}
                    mode={mode}
                  />
                );
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
