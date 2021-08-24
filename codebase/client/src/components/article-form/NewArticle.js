import React from "react";
import './NewArticle.css';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { addArticle } from "../../services/ArticleService";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));



const NewArticle = ({currentUser, loadArticles}) => {
  const classes = useStyles();

  const title = React.useRef(null);
  const content = React.useRef(null);

  const handleSubmit = async e => {
    e.preventDefault();
    
    const date = new Date();
    const data = {
      title: title.current.value,
      content: content.current.value,
      created_at: date.toString(),
      author_id: currentUser.id,
      author_name: currentUser.name
    }

    try{
        const response = await addArticle(data);
        if(response.success){
          loadArticles();
        } 
    } catch(err){
        console.log(err);
    }
  };
  

  return (
    <div className="newArticle">
        <form key={"haha"} className={classes.form} onSubmit={handleSubmit}>
            <h2>Add a new blog post</h2>
            <TextField
                variant="outlined"
                margin="dense"
                size="small"
                required
                fullWidth
                id="title"
                label="Blog title"
                name="title"
                autoComplete="title"
                inputRef={title}
            />
            <TextField
                variant="outlined"
                margin="dense"
                multiline
                minRows={3}
                required
                fullWidth
                id="content"
                label="Blog content"
                name="content"
                autoComplete="content"
                inputRef={content}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Post
            </Button>
        </form>
    </div>
  );
}
export default NewArticle;