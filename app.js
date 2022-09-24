//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const load=require("lodash");
require("dotenv").config();
const mongoose=require('mongoose');
const homeStartingContent = "WELCOME TO SAYON'S PERSONAL BLOG SPOT";
const aboutContent = "I am a Sophomore Computer Science Undergad in HITK";
const contactContent = "Information";
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true}).then((data)=>{
  console.log("Database connected")
}); 

const blog_schema={
  body_post:String,
  body_title:String
};
const Blog=mongoose.model("blog",blog_schema);

const app = express();
// let posts=[];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  Blog.find({},function(err,docs){
    if(!err){
      res.render("home",{start:homeStartingContent,posts:docs
      });
    }
  });
  
  
});
app.get("/contact",function(req,res){
  res.render("contact",{
    contactContent:contactContent
  })
})
app.get("/about",function(req,res){
  res.render("about",{
    aboutContent:aboutContent
  });
});
app.get("/compose",function(req,res){
  res.render("compose");
 
});

app.post("/compose",function(req,res){
  let body=req.body.post_body;
  let title=req.body.post_title;
  
  const post=new Blog({
    body_post:body,
    body_title:title
  });
  post.save();
  res.redirect("/");

 
});


app.get("/posts/:post_id",function(req,res){  
 const post_id=req.params.post_id;
 Blog.findOne({_id:post_id},function(err,docs){
   if(!err){
       res.render("post",{
         title:docs.body_title,
         body:docs.body_post
       });
   }
 })
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
