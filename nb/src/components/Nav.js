import React, { useState, useEffect } from 'react';
import logo from "../assets/NB Blue Yellow (transparent).png"

function Nav() {
    return(
        <div className="nav">
            
            <div className="links">
            <img src={logo}></img>
                <h5>Home</h5>
                <h5>Events</h5>
                <h5>Power Rankings</h5>
            </div>
        </div>
    )
}

export default Nav