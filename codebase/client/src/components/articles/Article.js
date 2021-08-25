import React from 'react';
import './Article.css';

import Moment from 'react-moment';

const Article = ({title, content, author_name, created_at}) => {
    return (
        <div className="card article">
            <h4 className="title">{title}</h4>
            <span className="date"><Moment date={Date.parse(created_at)} format="HH:mm DD-MM-YYYY"/></span>
            <p className="content">{content}</p>
            <span className="author">{author_name}</span>
        </div>
    )
}

export default Article
