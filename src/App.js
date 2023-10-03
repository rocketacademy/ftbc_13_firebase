import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

// import components
import LoginSignup from "./Components/LoginSignup";
import DisplayStudents from "./Components/DisplayStudents";
import NewPost from "./Components/NewPost";

// Firebase
import { database, auth } from "./firebase/firebase";
import { ref, onChildAdded, remove, onChildRemoved } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";

const App = () => {
  const DB_STUDENTLIST_KEY = "studentList";
  const [studentList, setStudentList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const dbRef = ref(database, DB_STUDENTLIST_KEY);
    onChildAdded(dbRef, (data) => {
      setStudentList((prevState) => {
        return [...prevState, { key: data.key, ...data.val() }];
      });
    });

    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        setUser(userInfo);
        setIsLoggedIn(true);
      } else {
        setUser({});
        setIsLoggedIn(false);
      }
    });
  }, []);

  useEffect(() => {
    const dbRef = ref(database, DB_STUDENTLIST_KEY);
    onChildRemoved(dbRef, (data) => {
      const newStudentList = studentList.filter(
        (student) => student.key !== data.key
      );
      setStudentList(newStudentList);
    });
  });

  const logout = () => {
    signOut(auth).then(() => {
      console.log("Signed out");
    });
  };

  const handleDelete = (e) => {
    console.log(e);
    const studentRef = ref(database, `${DB_STUDENTLIST_KEY}/${e.target.id}`);
    remove(studentRef);
  };
  return (
    <div className="App">
      <header className="App-header">
        {isLoggedIn ? (
          <button onClick={logout}>signout</button>
        ) : (
          <LoginSignup auth={auth} />
        )}
        <img src={logo} className="App-logo" alt="logo" />

        {isLoggedIn ? (
          <NewPost
            DB_STUDENTLIST_KEY={DB_STUDENTLIST_KEY}
            database={database}
            user={user}
          />
        ) : null}

        <br />
        <DisplayStudents
          studentList={studentList}
          user={user}
          handleDelete={handleDelete}
          isLoggedIn={isLoggedIn}
        />
      </header>
    </div>
  );
};

export default App;
