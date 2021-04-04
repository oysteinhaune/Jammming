import React from 'react'
import './Header.css'

function Header() {
    return (
        <nav className="Header navbar navbar-expand-lg navbar-light">
            <a className="navbar-brand" href="/">  <h1>Ja<span className="highlight">mmm</span>ing</h1></a>
            <div className="justify-content-end navbar-collapse" id="navbarSupportedContent" >
                <ul className="navbar-nav">
                <li className="nav-item btn" id="users">
                        <a href="/users">Users</a>
                    </li>
                    <li className="nav-item btn" id="login">
                        <a href="http://localhost:3001/login">Log in to Spotify</a>
                    </li>
                    <li className="nav-item " id="loggedin">
                        Logged in
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Header
