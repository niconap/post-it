import { useState } from 'react';
import UserList from './UserList';

function Users(props) {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      let res = await fetch('http://localhost:5000/api/user/all', {
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

  return (
    <div className="pageusers">
      <UserList
        acceptRequest={props.acceptRequest}
        declineRequest={props.declineRequest}
        sendFriendRequest={props.sendFriendRequest}
        revokeRequest={props.revokeRequest}
        fetchUsers={fetchUsers}
        users={users}
      />
    </div>
  );
}

export default Users;
