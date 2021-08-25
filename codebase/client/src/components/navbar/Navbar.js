import { AppBar, Toolbar } from '@material-ui/core';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/actions/authActions';
import config from '../../environments/main';
import './Navbar.css';


const Navbar = ({currentUser, logout, message}) => {

    const logoutUser = () => {
        logout();
    }

    return (
        <Fragment>
            <AppBar position="fixed">
                <Toolbar>
                    <div className="header">
                        <Link to="/">
                            <h2>Blogify</h2>
                        </Link>
                        {message ? 
                            <div className="links">
                                <p>{message}</p>
                            </div>
                            :
                            <div className="links">
                                {currentUser?.profile_picture &&
                                <img 
                                    src={`${config.staticUrl}/uploads/${currentUser?.profile_picture}`}
                                    alt={`${currentUser?.name.charAt(0)}`}
                                />}
                                <p>{currentUser?.name}</p>
                                {currentUser && <p onClick={logoutUser}>Logout</p>}
                            </div>
                        }
                    </div>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </Fragment>
    )
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser
})

const mapDispatchToProps = {
    logout
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
