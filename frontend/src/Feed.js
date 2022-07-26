import { useState, useEffect } from 'react';
import uniqid from 'uniqid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
              console.log(mode);
            }}
          />
          <span class="slider"></span>
        </label>
        <span> General</span>
        <div id="info-icon">
          <InfoOutlinedIcon fontSize="small" sx={{ color: 'gray' }} />
        </div>
        {mode === 'general'
          ? generalPosts.map((post) => {
              let date = new Date(post.timeStamp);
              return (
                <div key={uniqid()} className="post">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <span>
                    Written by: {post.user.firstName} ({post.user.username}) on{' '}
                    {date.toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </span>
                  <div className="likes">
                    {post.likes.length === 1
                      ? '1 like'
                      : `${post.likes.length} likes`}
                  </div>
                </div>
              );
            })
          : friendPosts.map((post) => {
              let date = new Date(post.timeStamp);
              return (
                <div key={uniqid()} className="post">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <span>
                    Written by: {post.user.firstName} ({post.user.username}) on{' '}
                    {date.toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </span>
                  <div className="likes">
                    {post.likes.length === 1
                      ? '1 like'
                      : `${post.likes.length} likes`}
                  </div>
                </div>
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
