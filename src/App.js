import React from "react";
import logo from "./logo.svg";
import "./App.css";

//import my firebase configged apps
import { database } from "./firebase/firebase";

// import firebase actions
import {
  ref,
  set,
  push,
  onChildAdded,
  remove,
  onChildRemoved,
} from "firebase/database";

const DB_STUDENTLIST_KEY = "studentList";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      description: "",
      studentList: [],
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
    const dbRef = ref(database, DB_STUDENTLIST_KEY);
    push(dbRef, {
      name: this.state.firstName,
      desc: this.state.description,
      date: `${new Date()}`,
    });

    this.setState({
      firstName: "",
      description: "",
    });
  };

  handleDelete = (e) => {
    const studentRef = ref(database, `${DB_STUDENTLIST_KEY}/${e.target.id}`);
    remove(studentRef);
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
