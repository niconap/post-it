import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Post from './Post';
import uniqid from 'uniqid';

function Profile() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState('');

  const fetchUserData = async () => {
    let res = await fetch(
      `http://localhost:5000/api/user/${searchParams.get('id')}`,
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
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div id="profile">
      <h1>{user.firstName + ' ' + user.lastName}</h1>
      <h3>{user.username}</h3>
      <button>Add friend</button>
      {user.posts && user.posts.length !== 0 ? (
        user.posts.map((post) => {
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
}

export default Profile;
