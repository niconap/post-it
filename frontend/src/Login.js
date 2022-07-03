import { useEffect } from 'react';

function Login() {
  useEffect(() => {
    fetch('http://localhost:5000/api/user/')
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <div id="login">
      <form onsubmit="return false;" method="get" name="login">
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <input type="submit" value="Log in" onclick={validate(event)} />
      </form>
      <p>
        Don't have an account? Sign up <a href="signup">here</a>
      </p>
    </div>
  );
}

export default Login;
