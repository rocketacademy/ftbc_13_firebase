import { Outlet, Link } from "react-router-dom";

const DisplayStudents = ({ studentList, user, handleDelete, isLoggedIn }) => {
  return (
    <div>
      {studentList && studentList.length > 0
        ? studentList.map((student) => {
            return (
              <div key={student.key}>
                <h3>{student.name}</h3>
                <p>{student.desc}</p>
                <p>{student.email ? student.email : null}</p>
                <img src={student.profilePic} alt={student.name} />
                <br />
                {isLoggedIn && student.email === user.email ? (
                  <button id={student.key} onClick={(e) => handleDelete(e)}>
                    delete me
                  </button>
                ) : null}
              </div>
            );
          })
        : null}

      <Link to="profile">Profile</Link>
      <Link to="editProfile">Edit Profile</Link>

      <Outlet />
    </div>
  );
};

export default DisplayStudents;
