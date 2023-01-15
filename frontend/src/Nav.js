import { NavLink } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import DropDown from './Dropdown';

function Nav() {
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div id="nav">
      <NavLink to="/frontend" id="maintitle">
        <h1>Post it!</h1>
      </NavLink>
      <div id="navlinks">
        <NavLink id="bell" className="navicon" to="/frontend/requests">
          <NotificationsIcon />
        </NavLink>
        <NavLink id="usericon" className="navicon" to="/frontend/users">
          <PersonIcon />
        </NavLink>
        <a href={'/frontend/profile?id=' + localStorage.getItem('user')}>
          My profile
        </a>
        <span id="logout" onClick={logOut}>
          Log out
        </span>
      </div>
      <DropDown logOut={logOut} />
    </div>
  );
}

export default Nav;
