import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Post from './Post';
import uniqid from 'uniqid';

function Profile() {
  const [searchParams] = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState('');

  const fetchUserData = async () => {
    let res = await fetch(
      `http://localhost:5000/api/user/get/${searchParams.get('id')}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      }
    );
    let resJson = await res.json();
    setUser(resJson);
    setIsLoaded(true);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFriendRequest = async () => {
    try {
      await fetch(`http://localhost:5000/api/user/friend/request/${user._id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
      fetchUserData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRevokeRequest = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/user/friend/request/${user._id}/revoke`,
        {
          method: 'PUT',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      fetchUserData();
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoaded) {
    return (
      <div id="profile">
        <h1>{user.firstName + ' ' + user.lastName}</h1>
        <h3>{user.username}</h3>
        {user._id === localStorage.getItem('user') ||
        user.requests.indexOf(localStorage.getItem('user')) >= 0 ? (
          ''
        ) : (
          <button onClick={handleFriendRequest}>Add friend</button>
        )}
        {user._id !== localStorage.getItem('user') &&
        user.requests.indexOf(localStorage.getItem('user')) >= 0 ? (
          <button onClick={handleRevokeRequest}>Revoke request</button>
        ) : (
          ''
        )}
        {user.posts && user.posts.length !== 0 ? (
          user.posts
            .slice(0)
            .reverse()
            .map((post) => {
              let date = new Date(post.timeStamp);
              return (
                <Post
                  key={uniqid()}
                  fetchPosts={fetchUserData}
                  date={date}
                  post={post}
                />
              );
            })
        ) : (
          <p>{user.firstName} hasn't published any posts yet.</p>
        )}
      </div>
    );
  } else {
    return 'Loading...';
  }
}

export default Profile;
