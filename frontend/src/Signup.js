import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import uniqid from 'uniqid';

function Signup() {
  let navigate = useNavigate();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  let handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      let res = await fetch('/api/auth/signup', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstname,
          lastName: lastname,
          email: email,
          username: username,
          password: password,
        }),
      });
      let resJson = await res.json();
      if (resJson.id) {
        setFirstname('');
        setLastname('');
        setEmail('');
        setUsername('');
        setPassword('');
        navigate('../frontend/?signup=true', { replace: true });
      } else {
        setErrors(resJson.errors);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="signup">
      <h1>Post it!</h1>
      <form onSubmit={handleSubmit} name="signup">
        <input
          type="text"
          name="firstname"
          value={firstname}
          placeholder="First name"
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          type="text"
          name="lastname"
          value={lastname}
          placeholder="Last name"
          onChange={(e) => setLastname(e.target.value)}
        />
        <input
          type="email"
          name="email"
          value={email}
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          name="username"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input type="submit" value="Sign up" />
        <ul>
          {errors.map((element) => {
            return <li key={uniqid()}>{element.msg}</li>;
          })}
        </ul>
      </form>
      <p>
        Already have an account? Log in <a href="/frontend">here</a>
      </p>
    </div>
  );
}

export default Signup;
