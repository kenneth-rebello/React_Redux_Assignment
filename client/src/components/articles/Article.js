import React from 'react';
import './Article.css';

import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Moment from 'react-moment';
import { connect } from 'react-redux';

import { deleteArticle } from '../../redux/actions/articleActions';
import { setError, unsetError } from '../../redux/actions/errorActions';

const Article = ({id, title, content, author_name, author_id, created_at, 
        currentUser, 
        deleteArticle, 
        setError,
        unsetError
    }) => {

    const remove = async () => {
        try {
            await deleteArticle(id)
        } catch (error) {
            setError(error.message);
            setTimeout(unsetError,100);
        }
    }

    return (
        <div className="card article">
            <h4 className="title">{title}</h4>
            <span className="date"><Moment date={Date.parse(created_at)} format="HH:mm DD-MM-YYYY"/></span>
            <p className="content">{content}</p>
            <span className="author">{currentUser?.id === author_id && <IconButton onClick={()=>remove()}>
                <DeleteIcon/>    
            </IconButton>}{author_name}</span>
        </div>
    )
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser
})

const mapDispatchToProps = {
    deleteArticle,
    setError,
    unsetError
}

export default connect(mapStateToProps, mapDispatchToProps)(Article)
