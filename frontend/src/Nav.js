import { NavLink } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';

function Nav() {
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div id="nav">
      <NavLink to="/frontend">
        <h1 id="maintitle">Post it!</h1>
      </NavLink>
      <div id="navlinks">
        <NavLink id="bell" to="/frontend/requests">
          <NotificationsIcon />
        </NavLink>
        <a href={'/frontend/profile?id=' + localStorage.getItem('user')}>
          My profile
        </a>
        <span id="logout" onClick={logOut}>
          Log out
        </span>
      </div>
    </div>
  );
}

export default Nav;
