import React, { Fragment } from 'react';
import Navbar from '../navbar/Navbar';
import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.log("Inside Error Boundry Component : ",error);
        return { hasError: true }
    }

    componentDidCatch(error, info){
        console.log(error, info);
    }

    errorPage = <div className="error">
        <img src="https://i.imgur.com/A040Lxr.png" alt="Spaceman"/>
        <h2>This page is lost somewhere in space-time</h2>
    </div>

    render() {
        if (this.state.hasError) {
            return this.props.isNavBar ? 
            <Fragment>
                <Navbar message="There was en error loading your info"/>
                {this.errorPage}
            </Fragment>
            :
            this.errorPage
        }
        else{
            return this.props.children;
        }
    }
}