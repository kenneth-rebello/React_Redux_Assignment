import React, { useEffect, useState } from "react";
import './NewArticle.css';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { addArticle, unsetPost, updateArticle } from "../../redux/actions/articleActions";
import { connect } from "react-redux";
import { setError, unsetError } from "../../redux/actions/errorActions";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "mediumaquamarine"
  },
  close: {
    margin: theme.spacing(3, 2, 2),
    backgroundColor: "red"
  },
}));



const NewArticle = ({
  closeForm, 
  currentUser, selectedArticle, 
  addArticle, updateArticle, unsetPost, setError, unsetError
}) => {
  const classes = useStyles();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(()=>{
    setTitle(selectedArticle?.title || "");
    setContent(selectedArticle?.content || "");
    return () => {
      setTitle("");
      setContent("");
      unsetPost();
    }
  },[])

  const handleSubmit = async e => {
    e.preventDefault();
    
    if(!title || title.trim()===""){
      setError("Title is required");
      setTimeout(unsetError, 100);
      return;
    }
    if(!content || content.trim()===""){
      setError("Content is required");
      setTimeout(unsetError, 100);
      return;
    }

    const date = new Date();

    try{
      const data = {
        title: title,
        content: content,
        created_at: date.toString(),
        author_id: currentUser?.id,
        author_name: currentUser?.name
      }
      if(selectedArticle){
        await updateArticle({
          id: selectedArticle.id,
          ...data
        });
      }
      else{
        await addArticle(data)
      }
      closeForm();
    } catch(err){
      setError(err.message);
      setTimeout(unsetError, 100);
      return;
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
                value={title}
                onChange={e=>setTitle(e.target.value)}
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
                value={content}
                onChange={e=>setContent(e.target.value)}
            />
            <div className="controls">
              <Button
                type="button"
                varaiant="contained"
                onClick={closeForm}
                className={classes.close}
              >
                Close
              </Button>
              <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
              >
                  Post
              </Button>
            </div>
        </form>
    </div>
  );
}


const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  selectedArticle: state.articles.selectedArticle
})

const mapDispatchToProps = {
  addArticle,
  updateArticle,
  unsetPost,
  setError,
  unsetError
}

export default connect(mapStateToProps, mapDispatchToProps)(NewArticle);