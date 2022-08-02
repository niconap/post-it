import { NavLink } from 'react-router-dom';

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
        <NavLink to={'/profile?id=' + localStorage.getItem('user')}>
          My profile
        </NavLink>
        <span id="logout" onClick={logOut}>
          Log out
        </span>
      </div>
    </div>
  );
}

export default Nav;
