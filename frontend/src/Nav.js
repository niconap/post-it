import { NavLink } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';

function Nav() {
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div id="nav">
      <NavLink to="/">
        <h1 id="maintitle">Odinbook</h1>
      </NavLink>
      <div id="navlinks">
        <NavLink id="bell" to="requests">
          <NotificationsIcon />
        </NavLink>
        <a href={'/profile?id=' + localStorage.getItem('user')}>My profile</a>
        <span id="logout" onClick={logOut}>
          Log out
        </span>
      </div>
    </div>
  );
}

export default Nav;
