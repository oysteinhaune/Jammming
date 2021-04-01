import React from 'react'
import './Header.css'

function Header() {
    return (
        <nav class="Header navbar navbar-expand-lg navbar-light">
            <a class="navbar-brand" href="#">  <h1>Ja<span className="highlight">mmm</span>ing</h1></a>
            <div class="justify-content-end navbar-collapse" id="navbarSupportedContent" >
                <ul class="navbar-nav">
                    <li class="nav-item btn" id="login">
                        <a href="/login">Log in</a>
                    </li>
                    <li class="nav-item " id="loggedin">
                        Logged in
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Header
