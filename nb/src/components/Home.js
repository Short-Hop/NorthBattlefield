import React, { useState, useEffect } from 'react';
import Nav from "./Nav"
import Footer from "./Footer"
import { Link } from "react-router-dom";

function Home(props) {
    return(
        <>
        <Nav match ={props.match}></Nav>
        <div className="home">
            <div className="hero">
                <h2>Small City</h2>
                <h1>Big Plays</h1>
                <Link to="/events"><button>See Upcoming Events</button></Link>
            </div>
        </div>
        <Footer></Footer>
        </>
    )
}

export default Home