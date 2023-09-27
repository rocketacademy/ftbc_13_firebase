import React from "react";
import logo from "./logo.svg";
import "./App.css";

//import my firebase configged apps
import { database, storage } from "./firebase/firebase";

// import firebase actions
import {
  ref,
  set,
  push,
  onChildAdded,
  remove,
  onChildRemoved,
} from "firebase/database";

import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

const DB_STUDENTLIST_KEY = "studentList";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      description: "",
      studentList: [],
      file: null,
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
  }

  testFunction = () => {
    console.log("this is a test");
  };

  onChange = (e) => {
    if (e.target.id === "firstName") {
      this.setState({
        firstName: e.target.value,
      });
    } else {
      this.setState({
        description: e.target.value,
      });
    }
  };

  // on submit, save a record into firebase
  handleSubmit = (e) => {
    e.preventDefault();
    // push up image into storage
    const fileRef = sRef(storage, `students/${this.state.file.name}`);
    uploadBytes(fileRef, this.state.file)
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
          <img src={logo} className="App-logo" alt="logo" />
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

          <br />
          {this.state.studentList.map((student) => {
            return (
              <div key={student.key}>
                <h3>{student.name}</h3>
                <br />
                <p>{student.desc}</p>
                <br />
                <img src={student.profilePic} alt={student.name}></img>
                <br/>
                <button id={student.key} onClick={(e) => this.handleDelete(e)}>
                  delete me
                </button>
              </div>
            );
          })}
        </header>
      </div>
    );
  }
}

export default App;
