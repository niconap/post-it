import { useState, useEffect } from 'react';
import Post from './Post';
import uniqid from 'uniqid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PostForm from './PostForm';
import UserList from './UserList';

function Feed(props) {
  const [mode, setMode] = useState('general');
  const [generalPosts, setGeneralPosts] = useState([]);
  const [friendPosts, setFriendPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchPosts = async () => {
    try {
      let res = await fetch('/api/post/friends', {
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
      let res = await fetch('/api/post/general', {
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

  const fetchUsers = async () => {
    try {
      let res = await fetch('/api/user/all', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
      let resJson = await res.json();
      setUsers(resJson);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
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
        <div id="feed">
          <PostForm />
          <div className="posts">
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
          <UserList
            acceptRequest={props.acceptRequest}
            declineRequest={props.declineRequest}
            sendFriendRequest={props.sendFriendRequest}
            revokeRequest={props.revokeRequest}
            fetchUsers={fetchUsers}
            users={users}
          />
        </div>
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
