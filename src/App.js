import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

// import components
import LoginSignup from "./Components/LoginSignup";
import DisplayStudents from "./Components/DisplayStudents";
import NewPost from "./Components/NewPost";
import Error from "./Components/Error";
import Profile from "./Components/Profile";
import EditProfile from "./Components/EditProfile";

// Firebase
import { database, auth } from "./firebase/firebase";
import { ref, onChildAdded, remove, onChildRemoved } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Navbar from "./Components/Navbar";

const App = () => {
  // firebase key
  const DB_STUDENTLIST_KEY = "studentList";
  // global app
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
        <Navbar isLoggedIn={isLoggedIn} logout={logout} />

        <Routes>
          <Route path="authentication" element={<LoginSignup auth={auth} />} />
          <Route
            path="students"
            element={
              <DisplayStudents
                studentList={studentList}
                user={user}
                handleDelete={handleDelete}
                isLoggedIn={isLoggedIn}
              />
            }
          >
            <Route path="profile" element={<Profile user={user} />} />
            <Route path="editProfile" element={<EditProfile user={user} />} />
          </Route>
          <Route
            path="composer"
            element={
              <NewPost
                DB_STUDENTLIST_KEY={DB_STUDENTLIST_KEY}
                database={database}
                user={user}
              />
            }
          />

          <Route path="*" element={<Error />} />
        </Routes>
      </header>
    </div>
  );
};

export default App;
