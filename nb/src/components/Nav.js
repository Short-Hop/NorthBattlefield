import React, { useState, useEffect } from 'react';
import logo from "../assets/NB Blue Yellow (transparent).png"
import { Link } from "react-router-dom";

function Nav(props) {
    const [navLinks, setnavLinks] = useState(<div></div>)

    useEffect(() => {
        if (props.match.path === "/home") {
                setnavLinks(
                    <div className="links">
                        <img src={logo}></img>
                        <Link to="/home"><h5 className="selected">Home</h5></Link>    
                        <Link to="/events"><h5>Events</h5></Link>
                        <Link to="/PR"><h5>Power Rankings</h5></Link>
                    </div>
                )
        } else if (props.match.path === "/events") {
            setnavLinks(
                <div className="links">
                    <img src={logo}></img>
                    <Link to="/home"><h5 >Home</h5></Link>    
                    <Link to="/events"><h5 className="selected">Events</h5></Link>
                    <Link to="/PR"><h5>Power Rankings</h5></Link>
                </div>
            )
        } else if (props.match.path === "/pr") {
            setnavLinks(
                <div className="links">
                    <img src={logo}></img>
                    <Link to="/home"><h5 >Home</h5></Link>    
                    <Link to="/events"><h5>Events</h5></Link>
                    <Link to="/pr"><h5 className="selected">Power Rankings</h5></Link>
                </div>
            )
        }
    },[])

    



    return(
        <div className="nav">
            {navLinks}
        </div>
    )
}

export default Nav