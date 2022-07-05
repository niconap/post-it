function Signup() {
  return (
    <div id="signup">
      <form>
        <input type="text" name="firstname" placeholder="First name" />
        <input type="text" name="lastname" placeholder="Last name" />
        <input type="email" name="email" placeholder="E-mail" />
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <input type="submit" value="Log in" />
      </form>
      <p>
        Already have an account? Log in <a href="/">here</a>
      </p>
    </div>
  );
}

export default Signup;
