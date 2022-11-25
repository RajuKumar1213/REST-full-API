const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const wikiSchema = new mongoose.Schema ({
    title : String,
    content : String
});

const Article = mongoose.model("article" , wikiSchema);

////////////////////////// Request Targeting all Articles///////////////////

app.route("/articles")

.get(function(req , res){
    Article.find({}, function(err , foundArticles){
        if(err){
           console.log(err);
        }
        else {
            res.send(foundArticles);
        }
    });
})

.post(function(req, res){

    const newArticle = new Article ({
        title : req.body.title,
        content :req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added the item to Atricle");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all the articles");
        } else {
            res.send(err);
        }
    })
});


////////////////////////// Request Targeting  a specefic article///////////////////

app.route("/articles/:articleTitle")


.get(function(req, res){
    
    Article.findOne({title : req.params.articleTitle},function(err , foundArticle){
        if(!err){
            res.send(foundArticle);
        }
        else {
            res.send("No articles matching that title was found");
        } 
    });
})

.put(function(req, res){
    Article.updateOne(
        {title : req.params.articleTitle},
        {title : req.body.title , content : req.body.content},
        function(err){
            if(!err){
                res.send("Successfully Updated the article");
            }
        }
    );
})

.delete(function(req, res){
    Article.deleteOne({title : req.params.articleTitle}, function(err ){
        if(!err){
            res.send("Successfully deleted the corresponding Article");
        }
        else{
            res.send(err);
        }
    });
});




app.listen(3000 , function(){
    console.log("Your server started at port 3000");
});