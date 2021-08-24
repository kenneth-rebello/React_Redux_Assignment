import React from 'react';
import './Article.css';

const Article = ({title, content, author_id, author_name, created_at}) => {
    return (
        <div className="card article">
            <h4>{title}</h4>
            <p>{content}</p>
            <span>{author_name}</span>
        </div>
    )
}

export default Article
