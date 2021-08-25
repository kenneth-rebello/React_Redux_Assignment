import React from 'react';
import './Article.css';

import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Moment from 'react-moment';
import { connect } from 'react-redux';

import { deleteArticle, editPost } from '../../redux/actions/articleActions';
import { setError, unsetError } from '../../redux/actions/errorActions';

const Article = ({id, title, content, author_name, author_id, created_at, openForm,
        currentUser, 
        editPost,
        deleteArticle, 
        setError,
        unsetError,
    }) => {

    const remove = async () => {
        try {
            await deleteArticle(id)
        } catch (error) {
            setError(error.message);
            setTimeout(unsetError,100);
        }
    }
    const edit = () =>{
        try {
            editPost({
                id, title, content, author_id, author_name
            })
            openForm();
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
            <span className="actions">
                <span className="author">{author_name}</span>
                {currentUser?.id === author_id && <IconButton onClick={()=>remove()}>
                    <DeleteIcon color="error"/>    
                </IconButton>}
                {currentUser?.id === author_id && <IconButton onClick={()=>edit()} >
                    <CreateIcon color="primary"/>    
                </IconButton>}
            </span>
        </div>
    )
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser
})

const mapDispatchToProps = {
    editPost,
    deleteArticle,
    setError,
    unsetError
}

export default connect(mapStateToProps, mapDispatchToProps)(Article)
