const express = require("express")
const formidable = require("formidable")
const path = require('path');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');



const fs = require("fs")
 const app = express()
 let blogs = ""
if(fs.existsSync("./data/blogs.json")){
     blogs =require("./data/blogs.json")
}
app.use(express.static('public'))
 app.set("view engine","ejs")

 app.listen(3003,()=>{
     console.log("listening port 3003")
 })

app.use(express.urlencoded({ extended: true }))

app.use(express.json())
//========= GET REQUESTS ==========
 app.get("/",(req,res) => {
    console.log(__dirname ) 
   res.render("pages/index",{blogs})
 })

 app.get("/add-blog",(req,res) => {
    
     res.render("pages/add-blog")
   })
app.get("/singleblog/:id",(req,res) => {
   
  let filteredBlog = blogs.filter((elt) => {
    return String(elt.id) === String(req.params.id)
  })
// console.log(filteredBlog)

  res.render("pages/blog",{filteredBlog})
})

app.get("/add-img",(req,res) => {
  res.render("pages/img-upload")
})

app.get("/fileupload",(req,res) => {
  res.render("pages/img-upload")
})


//========= DELETE REQUESTS ==========
app.get("/delete/:id",(req,res) => {
    let blogDelete = JSON.parse(fs.readFileSync("./data/blogs.json","utf8")  )
     console.log(blogDelete)
     let deletedBlog = blogDelete.filter( (elt) => {
      return String(elt.id) !== String(req.params.id)
     })
     console.log(deletedBlog, "here =>",deletedBlog.length)
     fs.writeFile("./data/blogs.json",JSON.stringify(deletedBlog),(err) => {
        if(err){throw err} 
        fs.readFile("./data/blogs.json","utf8",(err,files) => {
          blogs = JSON.parse(files)
        })
        res.redirect("/")

       } )

})

//========= POST REQUESTS ==========
let uuid = uuidv4()


app.post("/fileupload",(req,res,next) => {
  const form = new formidable.IncomingForm()
//   form.parse(req,(err,fields,files) => {
      
//     let old_path = files.filetoupload.path
//     let new_path ="C:/Users/seanc/Documents/a-blog-template"+files.filetoupload.name
//     fs.rename(old_path,new_path,(err) => {
//       if(err) throw err
//       res.write('File uploaded and moved!');
//     })

//   })

form.parse(req);

form.on('fileBegin', (name, file)=>{
    file.path = __dirname + '/public/' + file.name;
    fs.rename(file.path,uuid.file.name.path.extname())
});

form.on('file', (name, file)=>{
    console.log('Uploaded ' + file.name);
    fs.rename(file.name,uuid.file.name.path.extname())
});



return res.status(200).json({"result":"upload successful" })


})

   app.post("/new",
   
   
   // password must be at least 5 chars long
   body('title').isLength({ min: 5 }),
   (req,res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let blog = [
        {    
            id: uuidv4(),
            "url":"/img3.jpg",
            title: req.body.title,
            body: req.body.blogBody
        }
    ]

    // console.log(blog)
    if(!fs.existsSync("./data/blogs.json")){
        fs.writeFile("./data/blogs.json",JSON.stringify(blog),(err) => {
         if(err){throw err} 
         fs.readFile("./data/blogs.json","utf8",(err,files) => {
           blogs = JSON.parse(files)
         })
        } )
    }else{

        blog = 
            {   id: uuidv4(),
                title: req.body.title,
                body: req.body.blogBody
            }
        
     let blogJson = JSON.parse(fs.readFileSync("./data/blogs.json","utf8")  )
     blogJson.push(blog)
     console.log(blogJson)
     fs.writeFile("./data/blogs.json",JSON.stringify(blogJson),(err) => {
        if(err){throw err} 
        fs.readFile("./data/blogs.json","utf8",(err,files) => {
          blogs = JSON.parse(files)
        })
       } )
    }
     res.redirect("/fileupload")
   })

 