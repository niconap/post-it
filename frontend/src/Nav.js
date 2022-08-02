import { NavLink } from 'react-router-dom';

function Nav() {
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div id="nav">
      <a href="/">
        <h1 id="maintitle">Odinbook</h1>
      </a>
      <div id="navlinks">
        <NavLink to="/profile">My profile</NavLink>
        <span id="logout" onClick={logOut}>
          Log out
        </span>
      </div>
    </div>
  );
}

export default Nav;
