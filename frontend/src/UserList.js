import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import uniqid from 'uniqid';

function UserList(props) {
  const [requests, setRequests] = useState([]);

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
    <>
      <h3>Find new friends!</h3>
      {users.map((user) => {
        return (
          <div key={uniqid()} className="user">
            {user.profilePicture ? (
              <img
                id="profilepicture"
                src={`${user.profilePicture}`}
                alt="profile"
                width={30}
                height={30}
              />
            ) : (
              <img
                id="profilepicture"
                src={`/images/default.jpg`}
                alt="profile"
                width={30}
                height={30}
              />
            )}
            <span>
              {user.firstName} (
              {
                <NavLink to={`/frontend/profile?id=${user._id}`}>
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
              <button
                onClick={() =>
                  props.sendFriendRequest(user._id, props.fetchUsers)
                }
              >
                Add friend
              </button>
            )}
            {user._id !== localStorage.getItem('user') &&
            user.requests.indexOf(localStorage.getItem('user')) >= 0 ? (
              <button
                className="redbutton"
                onClick={() => props.revokeRequest(user._id, props.fetchUsers)}
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
    </>
  );
}

export default UserList;
