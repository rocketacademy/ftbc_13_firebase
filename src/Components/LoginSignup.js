import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";

const LoginSignup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  return (
    <form>
      <label>Email</label>
      <br />
      <input
        type="text"
        id="email"
        placeholder="enter email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <br />
      <label>Password</label>
      <br />

      <input
        type="password"
        id="password"
        placeholder="enter password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <br />
      <div>
        <button
          onClick={async (e) => {
            e.preventDefault();
            createUserWithEmailAndPassword(props.auth, email, password).then(
              (userInfo) => {
                console.log(userInfo);
                setPassword("");
                setEmail("");
              }
            );
            navigate("/students");
          }}
        >
          Signup
        </button>
        <button
          onClick={async (e) => {
            e.preventDefault();
            signInWithEmailAndPassword(props.auth, email, password).then(
              (userInfo) => {
                console.log(userInfo);
                setPassword("");
                setEmail("");
              }
            );
            navigate("/students");
          }}
        >
          Login
        </button>
        {email.length > 10 ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              sendPasswordResetEmail(props.auth, email).then((response) => {
                console.log("email sent");
                console.log("email response?", response);
              });
            }}
          >
            Forgotten password{" "}
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default LoginSignup;
