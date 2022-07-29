function Nav() {
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div id="nav">
      <a href="/">
        <h1 id="maintitle">Odinbook</h1>'
      </a>
      <span id="logout" onClick={logOut}>
        Log out
      </span>
    </div>
  );
}

export default Nav;
