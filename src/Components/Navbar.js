import { Link } from "react-router-dom";
const Navbar = (props) => {
  return (
    <div className="nav">
      {props.isLoggedIn ? (
        <button className="link" onClick={props.logout}>
          Logout
        </button>
      ) : (
        <Link className="link" to="authentication">
          Auth
        </Link>
      )}
      <Link className="link" to="students">
        Students
      </Link>
      {props.isLoggedIn ? (
        <Link className="link" to="composer">
          New Student
        </Link>
      ) : null}
    </div>
  );
};

export default Navbar;
