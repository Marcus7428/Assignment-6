import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Header.css";

function Header() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="navBar">
                <h1 className="navTitle" onClick={() => navigate("/")}>WebFlicks</h1>
                <div className="buttonGroup">
                    <button className="LoginButton" onClick={() => navigate("/login")}>Login</button>
                    <button className="RegisterButton" onClick={() => navigate("/register")}>Register</button>
                </div>
            </div>
        </div>
    );
}

export default Header;