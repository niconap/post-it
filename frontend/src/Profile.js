import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Post from './Post';
import uniqid from 'uniqid';

function Profile(props) {
  const [searchParams] = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState('');
  const [requests, setRequests] = useState([]);

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
    let res2 = await fetch(`http://localhost:5000/api/user/requests`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    });
    let resJson2 = await res2.json();
    setRequests(resJson2.requests);
    setIsLoaded(true);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRemoveFriend = async () => {
    try {
      await fetch(`http://localhost:5000/api/user/friend/remove/${user._id}/`, {
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

  if (isLoaded) {
    const isFriend = user.friends.filter((friend) => {
      return friend._id === localStorage.getItem('user');
    });

    const isRequested = requests.filter((request) => {
      return request._id === user._id;
    });

    return (
      <div id="profile">
        <h1>{user.firstName + ' ' + user.lastName}</h1>
        <h3>{user.username}</h3>
        {user._id === localStorage.getItem('user') ||
        user.requests.indexOf(localStorage.getItem('user')) >= 0 ||
        isFriend.length > 0 ||
        isRequested.length > 0 ? (
          ''
        ) : (
          <button
            onClick={() => props.sendFriendRequest(user._id, fetchUserData)}
          >
            Add friend
          </button>
        )}
        {user._id !== localStorage.getItem('user') &&
        user.requests.indexOf(localStorage.getItem('user')) >= 0 ? (
          <button
            className="redbutton"
            onClick={() => props.revokeRequest(user._id, fetchUserData)}
          >
            Revoke request
          </button>
        ) : (
          ''
        )}
        {isFriend.length > 0 ? (
          <button className="redbutton" onClick={handleRemoveFriend}>
            Remove friend
          </button>
        ) : (
          ''
        )}
        {user._id === localStorage.getItem('user') ? (
          <form enctype="multipart/form-data">
            <input type="file" name="profilepicture" />
          </form>
        ) : (
          ''
        )}
        {isRequested.length > 0 ? (
          <div id="requested">
            <span>{user.firstName} sent you a friend request </span>
            <button
              className="greenbutton"
              onClick={() => props.acceptRequest(user._id, fetchUserData)}
            >
              Accept
            </button>
            <button
              className="redbutton"
              onClick={() => props.declineRequest(user._id, fetchUserData)}
            >
              Decline
            </button>
          </div>
        ) : (
          ''
        )}
        <div id="feed">
          <div className="posts">
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
          <div className="users">
            <h3>Friends list</h3>
            {user.friends.length === 0 ? (
              <p>{user.firstName} doesn't have any friends yet</p>
            ) : (
              ''
            )}
            <ul>
              {user.friends.map((friend) => {
                return (
                  <li key={uniqid()}>
                    {friend.firstName} (
                    {
                      <a href={`/profile?id=${friend._id}`}>
                        {friend.username}
                      </a>
                    }
                    )
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  } else {
    return 'Loading...';
  }
}

export default Profile;
