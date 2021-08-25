const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../../middleware/auth');
const { 
    postArticle, 
    getAllArticles, 
    getArticleById, 
    updateArticle, 
    removeArticle 
} = require('../../../services/article');


//ADD POST
router.post("/", 
    [
        check("title", "title is required").trim().notEmpty(),
        check("content", "content is required").trim().notEmpty(),
        check("author_id", "author_id is required").trim().notEmpty(),
        check("author_name", "author_name is required").trim().notEmpty()
    ],
    auth,
    async(req, res) => {
        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            return res.json({
                error: validationErrors.array(),
                success: false,
                statusCode: 400
            });
        }
        const newArticle = req.body;

        const result = await postArticle(newArticle);
        return res.json({
            ...result.response,
            statusCode: result.status
        });
    }
);

//GET ALL ARTICLES
router.get('/', auth, async (req, res) => {
    const result = await getAllArticles();
    return res.json({
        ...result.response,
        statusCode: result.status
    });
});


//GET ARTICLE BY ID
router.get("/:id", auth, async(req, res) => {
    const result = await getArticleById(req.params.id);
    return res.json({
        ...result.response,
        statusCode: result.status
    });
})


//UPDATE ARTICLE
router.put('/:id', 
    auth, 
    [
        check('title','title is required').optional().trim().notEmpty(),
        check('content', 'content is required').optional().trim().notEmpty(),
        check("author_id", "author_id is required").trim().notEmpty(),
        check("author_name", "author_name is required").trim().notEmpty()
    ],
    async(req, res) => {

        const validationErrors = validationResult(req);
        if(!validationErrors.isEmpty()){
            return res.json({
                error: validationErrors.array(),
                success: false,
                statusCode: 400
            });
        }
        const newData = req.body;
        const response = await getArticleById(req.params.id);
        const oldData = response.response.data;

        const updatedArticle = {
            "id": oldData.id,
            "title": newData.title || oldData.title,
            "content": newData.content || oldData.content,
            "author_id": oldData.author_id,
            "author_name": oldData.author_name,
            "created_at": newData.created_at
        }

        if(await updateArticle(updatedArticle)){
            return res.json({ 
                data: {
                    msg:`Article updated`,
                    new: updatedArticle
                },
                success: true,
                statusCode: 400
            })
        }else{
            return res.json({ 
                error: [{msg: "There was an issue updating the article"}],
                success: false,
                statusCode: 500
            })
        }
})

//DELETE POST
router.delete("/:id", auth, async(req, res) => {
    const result = await getArticleById(req.params.id);
    if(!result.response.success){
        return res.json({
            error: [{msg: result.response.error[0].msg}],
            success: false,
            statusCode: result.status
        });
    }
    const article = result.response.data;
    if(req.user.id != article.author_id){
        return res.json({
            error:[{ msg: "You are not authorized to perform this action"}],
            success: false,
            statusCode: 403
        });
    }
    if(!article){
        return res.json({
            error: [{ msg: "The article you are looking for does not exist"}],
            success: false,
            statusCode: 404
        });
    }
    const success = await removeArticle(req.params.id);

    return success ? res.json({
        data:{
            msg: "Article deleted successfully"
        },
        success: true,
        statusCode: 200
    }) 
    : 
    res.json({
        error: [{msg: "Failed to delete the article"}],
        success: false,
        statusCode: 500
    });
});

module.exports = router;