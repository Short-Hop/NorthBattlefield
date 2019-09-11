import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import logo from "../assets/NB Blue Yellow (transparent).png"

function Footer() {
    return(
        <div className="footer">
            <Link to="/admin"><h5>Login</h5></Link>
            
        </div>
    )
}

export default Footer