import { useState } from "react";
import {
  ref as sRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

import { ref, push } from "firebase/database";

import { storage } from "../firebase/firebase";

const NewPost = ({ DB_STUDENTLIST_KEY, database, user }) => {
  const [firstName, setFirstName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // push up image into storage
    const fileRef = sRef(storage, `students/${file.name}`);
    uploadBytesResumable(fileRef, file)
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
          name: firstName,
          desc: description,
          date: `${new Date()}`,
          profilePic: url,
          email: user.email,
        });
      })
      .then(() => {
        setFirstName("");
        setDescription("");
        setFile(null);
      });
    navigate("/students");
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          id="firstName"
          placeholder="enter student name here:"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />
        <br />
        <input
          type="text"
          id="description"
          placeholder="enter student description:"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <br />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <br />
        <input type="submit" />
      </form>
    </div>
  );
};

export default NewPost;

/**
 *   // onChange = (e) => {
  //   const name = e.target.id;
  //   const value = e.target.value;

  //   this.setState({
  //     [name]: value,
  //   });

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
  // };
 */
