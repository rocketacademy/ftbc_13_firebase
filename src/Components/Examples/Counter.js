// functional components
import { useState } from "react";

const CounterHook = ({ name }) => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{name}</p>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
};

export default CounterHook;

// // class based components
//  import React from 'react'

//  class Counter extends React.Component{
//   constructor(props){
//     this.state= {
//       count: 0,
//       email: ''
//     }
//   }

//   incrementCount =()=>{
// this.setState({
//   count: this.state.count +1
// })
//   }
//   decrementCount =()=>{

//   }

//   render(){

//     return (

//     )
//   }

//  }
