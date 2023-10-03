import { useState, useEffect } from "react";
import UseEffect from "./UseEffect";

const Form = () => {
  // useEffect(() => {
  //   console.log("This runs on mount and reload. ");
  // });

  const [formInfo, setFormInfo] = useState({
    email: "",
    firstName: "",
  });

  const [show, setShow] = useState(false);

  const helperFunction = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // two ways to update
    // setFormInfo((prevState) => {
    //   return { ...prevState, [name]: value };
    // });
    console.log(formInfo);

    // update
    setFormInfo({ ...formInfo, [name]: value });
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(formInfo.email, formInfo.firstName);
  };

  return (
    <div>
      <form onSubmit={submit}>
        <label>Email</label>
        <br />
        <input
          type="text"
          value={formInfo.email}
          onChange={helperFunction}
          name="email"
        />
        <br />
        <label>First Name</label>
        <br />
        <input
          type="text"
          value={formInfo.firstName}
          onChange={helperFunction}
          name="firstName"
        />
        <input type="submit" value="submit" />
      </form>

      <button onClick={() => setShow(!show)}>Show/ Hide</button>

      {show ? <UseEffect /> : null}
    </div>
  );
};

export default Form;
