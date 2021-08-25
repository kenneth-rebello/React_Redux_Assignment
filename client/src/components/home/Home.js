import React, { useEffect } from 'react';
import './Home.css';
import NewArticle from '../article-form/NewArticle'
import { fetchArticles } from '../../redux/actions/articleActions';
import Article from '../articles/Article';
import { connect } from 'react-redux';
import { Button, Divider, TextField } from '@material-ui/core';

const Home = ({currentUser, articles, fetchArticles}) => {

    useEffect(()=>{
        fetchArticles();
    },[fetchArticles]);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [showForm, toggleShowForm] = React.useState(false);

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
            <div className="controls">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>toggleShowForm(!showForm)}
                >
                    New Post
                </Button>
            </div>
            {showForm && <NewArticle currentUser={currentUser} closeForm={()=>toggleShowForm(false)}/>}
            <Divider className="divider"/>
            <h2>All Posts</h2>
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
                {sortedArticles.map(article => <Article 
                    key={article.id} 
                    {...article} 
                    openForm={()=>toggleShowForm(true)}
                />)}
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