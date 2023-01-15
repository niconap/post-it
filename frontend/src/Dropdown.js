import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Dropdown(props) {
  const [display, setDisplay] = useState('none');

  function handleClick() {
    if (display === 'none') {
      setDisplay('block');
    } else {
      setDisplay('none');
    }
  }

  return (
    <div id="dropdown">
      <button onClick={handleClick}>Menu</button>
      <div style={{ display: display }} id="menu">
        <NavLink id="bell" className="navicon" to="/frontend/requests">
          <p>Requests</p>
        </NavLink>
        <NavLink id="usericon" className="navicon" to="/frontend/users">
          <p>Find friends</p>
        </NavLink>
        <a href={'/frontend/profile?id=' + localStorage.getItem('user')}>
          My profile
        </a>
        <p id="logout" onClick={props.logOut}>
          Log out
        </p>
      </div>
    </div>
  );
}

export default Dropdown;
