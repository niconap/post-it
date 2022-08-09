import { useEffect, useState } from 'react';
import uniqid from 'uniqid';
import { NavLink } from 'react-router-dom';

function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
    console.log(resJson);
    setRequests(resJson.requests);
    setIsLoaded(true);
  };

  const acceptRequest = async (id) => {
    let res = await fetch(
      `http://localhost:5000/api/user/friend/accept/${id}`,
      {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
      }
    );
    let resJson = await res.json();
    console.log(resJson);
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (isLoaded) {
    console.log(requests);
    return (
      <div id="requestspage">
        <h3>Incoming friend requests</h3>
        {requests.length === 0 ? (
          <p>Currently you have no pending friend requests.</p>
        ) : (
          requests.map((request) => {
            return (
              <div key={uniqid()} className="request">
                <span>
                  {request.firstName} (
                  {
                    <NavLink to={`/profile?id=${request._id}`}>
                      {request.username}
                    </NavLink>
                  }
                  ) wants to be your friend
                </span>
                <button onClick={() => acceptRequest(request._id)}>
                  Accept
                </button>
              </div>
            );
          })
        )}
      </div>
    );
  } else {
    return 'Loading...';
  }
}

export default RequestsPage;
