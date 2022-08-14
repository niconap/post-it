import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import uniqid from 'uniqid';

function UserList(props) {
  const [requests, setRequests] = useState([]);

  const handleRevokeRequest = async (id) => {
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
      props.fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFriendRequest = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/user/friend/request/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      });
      props.fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const users = props.users.filter((user) => {
    return (
      !user.friends.includes(localStorage.getItem('user')) &&
      user._id !== localStorage.getItem('user')
    );
  });

  const fetchRequests = async () => {
    let res = await fetch(`http://localhost:5000/api/user/requests`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    });
    let resJson = await res.json();
    let array = [];
    resJson.requests.forEach((request) => {
      array.push(request._id);
    });
    setRequests(array);
    props.fetchUsers();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="users">
      <h3>Find new friends!</h3>
      {users.map((user) => {
        return (
          <div key={uniqid()} className="user">
            <span>
              {user.firstName} (
              {
                <NavLink to={`/profile?id=${user._id}`}>
                  {user.username}
                </NavLink>
              }
              )
            </span>
            {user._id === localStorage.getItem('user') ||
            user.requests.indexOf(localStorage.getItem('user')) >= 0 ||
            user.requests.includes(localStorage.getItem('user')) ||
            requests.includes(user._id) ? (
              ''
            ) : (
              <button onClick={() => handleFriendRequest(user._id)}>
                Add friend
              </button>
            )}
            {user._id !== localStorage.getItem('user') &&
            user.requests.indexOf(localStorage.getItem('user')) >= 0 ? (
              <button
                className="redbutton"
                onClick={() => handleRevokeRequest(user._id)}
              >
                Revoke request
              </button>
            ) : (
              ''
            )}
            {requests.includes(user._id) ? (
              <div className="userlistbuttons">
                <button
                  className="greenbutton"
                  onClick={() =>
                    props.acceptRequest(user._id, () => {
                      fetchRequests();
                      props.fetchUsers();
                    })
                  }
                >
                  Accept
                </button>
                <button
                  className="redbutton"
                  onClick={() =>
                    props.declineRequest(user._id, () => {
                      fetchRequests();
                      props.fetchUsers();
                    })
                  }
                >
                  Decline
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UserList;
