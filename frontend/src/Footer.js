import { NavLink } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <span>© 2022 Nico Nap</span>
      <NavLink to="/privacypolicy">Privacy policy</NavLink>
    </footer>
  );
}

export default Footer;
