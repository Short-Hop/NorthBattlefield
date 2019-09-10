import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import axios from "axios"
import styles from "./styles/styles.css"
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Home from "./components/Home"
import PR from "./components/PR"
import DisplayData from "./components/DisplayData"



function App() {
  return (
    <BrowserRouter>
      <Redirect from="/" exact to="/home"/>
      <Route path="/home" component={Home} />
      <Route path="/pr" component={DisplayData} />
      <Route path="/admin" component={pr}></Route>
    </BrowserRouter>
    
  );
}

export default App;
