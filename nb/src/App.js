import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import axios from "axios"
import styles from "./styles/styles.css"
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Home from "./components/Home"
import Admin from "./components/Admin"
import DisplayData from "./components/DisplayData"



function App() {
  return (
    <BrowserRouter>
      <Route path="/home" component={Home} />
      <Route path="/pr" component={DisplayData} />
      <Route path="/admin" component={Admin}></Route>
      <Redirect from="/" exact to="/home"/>
    </BrowserRouter>
    
  );
}

export default App;
