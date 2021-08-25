import React from "react";
import './NewArticle.css';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { addArticle } from "../../redux/actions/articleActions";
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
}));



const NewArticle = ({currentUser, addArticle, setError, unsetError}) => {
  const classes = useStyles();

  const title = React.useRef(null);
  const content = React.useRef(null);

  const handleSubmit = async e => {
    e.preventDefault();
    
    if(!title.current.value || title.current.value.trim()===""){
      setError("Title is required");
      setTimeout(unsetError, 100);
      return;
    }
    if(!content.current.value || content.current.value.trim()===""){
      setError("Content is required");
      setTimeout(unsetError, 100);
      return;
    }

    const date = new Date();


    try{
      const data = {
        title: title.current.value,
        content: content.current.value,
        created_at: date.toString(),
        author_id: currentUser?.id,
        author_name: currentUser?.name
      }
      await addArticle(data);
      title.current.value="";
      content.current.value="";
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


const mapStateToProps = state => ({
  currentUser: state.auth.currentUser
})

const mapDispatchToProps = {
  addArticle,
  setError,
  unsetError
}

export default connect(mapStateToProps, mapDispatchToProps)(NewArticle);