import React from "react";
import logo from "./logo.svg";
import "./App.css";

//import my firebase configged apps
import { database, storage, auth } from "./firebase/firebase";

// import firebase actions
import {
  ref,
  set,
  push,
  onChildAdded,
  remove,
  onChildRemoved,
} from "firebase/database";

import {
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

const DB_STUDENTLIST_KEY = "studentList";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      description: "",
      studentList: [],
      file: null,
      email: "",
      password: "",
      isLoggedIn: false,
      user: {},
    };
  }

  componentDidMount() {
    const dbRef = ref(database, DB_STUDENTLIST_KEY);
    onChildAdded(dbRef, (data) => {
      // console.log("CHILD ADDED:", data.key, data.val());

      this.setState((prevState) => ({
        studentList: [
          ...prevState.studentList,
          { key: data.key, ...data.val() },
        ],
      }));

      // the version that only takes the very last one into consideration
      // this.setState({
      //   studentList: [
      //     ...this.state.studentList,
      //     { key: data.key, ...data.val() },
      //   ],
      // });

      onChildRemoved(dbRef, (data) => {
        // console.log("removed element:", data.key, data.val());

        const newStudentList = this.state.studentList.filter(
          (student) => student.key !== data.key
        );

        this.setState({
          studentList: newStudentList,
        });
      });
    });

    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        console.log(userInfo);
        // signed in user
        this.setState({
          user: userInfo,
          isLoggedIn: true,
        });
      } else {
        // no signed in user
        this.setState({
          user: {},
          isLoggedIn: false,
        });
      }
    });
  }

  testFunction = () => {
    console.log("this is a test");
  };

  logout = () => {
    signOut(auth).then(() => {
      console.log("Signed out");
    });
  };

  onChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;

    this.setState({
      [name]: value,
    });

    // foongs updating logic
    // if (e.target.id === "firstName") {
    //   this.setState({
    //     firstName: e.target.value,
    //   });
    // } else {
    //   this.setState({
    //     description: e.target.value,
    //   });
    // }
  };

  // on submit, save a record into firebase
  handleSubmit = (e) => {
    e.preventDefault();
    // push up image into storage
    const fileRef = sRef(storage, `students/${this.state.file.name}`);
    uploadBytesResumable(fileRef, this.state.file)
      .then((snapshot) => {
        console.log("snapshot:", snapshot);
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      })
      .then(() => {
        return getDownloadURL(fileRef);
      })
      .then((url) => {
        console.log("url:", url);
        console.log("or did this run first (INSIDE)");
        // pushing up into realtime database
        const dbRef = ref(database, DB_STUDENTLIST_KEY);
        push(dbRef, {
          name: this.state.firstName,
          desc: this.state.description,
          date: `${new Date()}`,
          profilePic: url,
          email: this.state.user.email,
        });
      })
      .then(() => {
        this.setState({
          firstName: "",
          description: "",
          file: null,
        });
      });
  };

  handleDelete = (e) => {
    const studentRef = ref(database, `${DB_STUDENTLIST_KEY}/${e.target.id}`);
    remove(studentRef);
  };

  fileChange = (e) => {
    this.setState({
      file: e.target.files[0],
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.isLoggedIn ? (
            <button onClick={this.logout}>signout</button>
          ) : (
            <>
              <form>
                <label>Email</label>
                <br />
                <input
                  type="text"
                  id="email"
                  placeholder="enter email"
                  onChange={(e) => this.onChange(e)}
                  value={this.state.email}
                />
                <br />
                <label>Password</label>
                <br />

                <input
                  type="password"
                  id="password"
                  placeholder="enter password"
                  onChange={(e) => this.onChange(e)}
                  value={this.state.password}
                />
                <br />
                <div>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();

                      return createUserWithEmailAndPassword(
                        auth,
                        this.state.email,
                        this.state.password
                      ).then((userInfo) => {
                        console.log("successful signup");
                        console.log(userInfo);
                        this.setState({
                          email: "",
                          password: "",
                        });
                      });
                    }}
                  >
                    Signup
                  </button>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();

                      return signInWithEmailAndPassword(
                        auth,
                        this.state.email,
                        this.state.password
                      ).then((userInfo) => {
                        console.log("successful signup");
                        console.log(userInfo);
                        this.setState({
                          email: "",
                          password: "",
                        });
                      });
                    }}
                  >
                    Login
                  </button>
                  {this.state.email.length > 10 ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        sendPasswordResetEmail(auth, this.state.email).then(
                          () => {
                            console.log("email sent");
                          }
                        );
                      }}
                    >
                      Forgotten password{" "}
                    </button>
                  ) : null}
                </div>
              </form>
            </>
          )}
          <img src={logo} className="App-logo" alt="logo" />

          {this.state.isLoggedIn ? (
            <form onSubmit={(e) => this.handleSubmit(e)}>
              <input
                type="text"
                id="firstName"
                placeholder="enter student name here:"
                onChange={(e) => this.onChange(e)}
                value={this.state.firstName}
              />
              <br />
              <input
                type="text"
                id="description"
                placeholder="enter student description:"
                onChange={(e) => this.onChange(e)}
                value={this.state.description}
              />
              <br />
              <input type="file" onChange={(e) => this.fileChange(e)} />
              <br />
              <input type="submit" />
            </form>
          ) : null}

          <br />
          {this.state.studentList.map((student) => {
            return (
              <div key={student.key}>
                <h3>{student.name}</h3>
                <br />
                <p>{student.desc}</p>
                <br />
                <p>{student.email ? student.email : null}</p>
                <br />
                <img src={student.profilePic} alt={student.name}></img>
                <br />
                {this.state.isLoggedIn &&
                student.email === this.state.user.email ? (
                  <button
                    id={student.key}
                    onClick={(e) => this.handleDelete(e)}
                  >
                    delete me
                  </button>
                ) : null}
              </div>
            );
          })}
        </header>
      </div>
    );
  }
}

export default App;
