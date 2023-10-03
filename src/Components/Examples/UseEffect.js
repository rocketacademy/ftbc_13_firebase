/**
 *
 * UseEffect
 *
 * componentDidMount
 * fire off functions/ api calls that need to be run when the component / page loads
 * Getting posts from firebase
 *
 * componentDidUpdate
 * runs when the component is updated -  when react reconciliation occurs
 *
 * componentWillUnmount
 * this function runs when we no longer need the component
 * insert any cleanup code to stop react memory leaks
 *
 */

import { useState, useEffect } from "react";

const ClockHook = (props) => {
  const [date, setDate] = useState(new Date());
  const [toggle, setToggle] = useState(false);

  const tick = () => {
    setDate(new Date());
  };

  // componentWillMount
  useEffect(() => {
    console.log("I run once when mounted.");
  }, []);

  // componentDidUpdate
  useEffect(() => {
    console.log("toggled");
  }, [toggle]);

  useEffect(() => {
    console.log("I run once updated.");
  }, [date]);

  // componentDidMount && componentWillUnmount
  useEffect(() => {
    let timer = setInterval(tick, 1000);

    return () => {
      clearInterval(timer);
    };
  });

  return (
    <div>
      <p className="display">{date.toLocaleString("en-GB")}</p>
      <button onClick={() => setToggle(!toggle)}>toggle me</button>
    </div>
  );
};

export default ClockHook;
