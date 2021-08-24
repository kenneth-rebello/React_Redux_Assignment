import React, { useEffect, useState } from 'react';
import './Home.css';
import NewArticle from '../article-form/NewArticle'
import { fetchArticles } from '../../services/ArticleService';
import Article from '../articles/Article';

export default function Home({currentUser}) {


    const [articles, setArticles] = useState([]);

    useEffect(()=>{
        loadArticles();
    },[]);

    const loadArticles = async () =>{
        const response = await fetchArticles();
        setArticles(response.data);
    }

    return (
        <div className="home">
            <NewArticle loadArticles={loadArticles} currentUser={currentUser}/>
            <div className="articles">
                {articles.map(article => <Article key={article.id} {...article}/>)}
            </div>
        </div>
    )
}
