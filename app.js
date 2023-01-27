//jshint esversion:6
require('dotenv').config();
const express=require("express");
const body=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
// var md5=require("md5");
var bcrypt=require("bcrypt");
const saltRounds=10;


mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema=new mongoose.Schema
({
    email:String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const app=express();
const User=mongoose.model("user",userSchema);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(body.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render("home");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.get("/login",function(req,res){
    res.render("login");
})


app.post("/register",function(req,res){

    bcrypt.hash(req.body.password,saltRounds,function(err,hash){

        const newUser= new User({
            email:req.body.username,
            password:hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }
            else{
                res.render("secrets");
            }
        });
    });
    
})

app.post("/login",function(req,res){
    const email=req.body.username;
    const pass=req.body.password;

    User.findOne({email:email},function(err,found){
        console.log(found.password);
        if(!err){
            if(found){
           bcrypt.compare(pass,found.password,function(err,result){
            if(result===true)
            {
                res.render("secrets");
            }

           })
            }
        }
        else{
            console.log(err);
        }
    })
})

app.listen(3000,function(){
    console.log("server started at 3000");
})