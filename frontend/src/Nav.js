function Nav() {
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div id="nav">
      <h1 id="maintitle">Odinbook</h1>
      <span id="logout" onClick={logOut}>
        Log out
      </span>
    </div>
  );
}

export default Nav;
