import React, { useEffect } from 'react';
import './Home.css';
import NewArticle from '../article-form/NewArticle'
import { fetchArticles } from '../../redux/actions/articleActions';
import Article from '../articles/Article';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';

const Home = ({currentUser, articles, fetchArticles}) => {

    useEffect(()=>{
        fetchArticles();
    },[fetchArticles]);
    const [searchQuery, setSearchQuery] = React.useState("");

    let filteredArticles = [];
    if(searchQuery.trim()!==""){
        const query = searchQuery.trim().toLowerCase();
        filteredArticles =  articles.filter(article => article.title.toLowerCase().includes(query)
                                || article.author_name.toLowerCase().includes(query)
                            );
    }else{
        filteredArticles = [...articles];
    }
    const sortedArticles = filteredArticles.sort((a,b)=>new Date(b.created_at) - new Date(a.created_at));
    return (
        <div className="home">
            <NewArticle currentUser={currentUser}/>
            <div className="search">
                <TextField
                    variant="outlined"
                    margin="dense"
                    size="small"
                    fullWidth
                    id="search"
                    label="Search by title or author"
                    name="search"
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="articles">
                {sortedArticles.map(article => <Article key={article.id} {...article}/>)}
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    articles: state.articles.all
})

const mapDispatchToProps = {
    fetchArticles
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);