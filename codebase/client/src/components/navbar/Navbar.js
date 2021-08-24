import { AppBar, Toolbar } from '@material-ui/core';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../services/LoginService';
import './Navbar.css';


const Navbar = ({currentUser, authCompleted}) => {

    const logoutUser = () => {
        logout();
        authCompleted();
    }

    return (
        <Fragment>
            <AppBar position="fixed">
                <Toolbar>
                    <div className="header">
                        <Link to="/">
                            <h2>Blogify</h2>
                        </Link>
                        <div className="links">
                            <p>{currentUser?.name}</p>
                            {currentUser && <p onClick={logoutUser}>Logout</p>}
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </Fragment>
    )
}

export default Navbar
