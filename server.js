const express = require('express')  /* import libaraies */
const app = express()
const bcrypt = require('bcrypt')
const fs = require('fs');
const { title } = require('process');

app.use(express.json()) //allow the server to accept data as jason file 

const users = [] // an empoty defult array to stor data
const posts = []

app.get ('/users', (req, res) => {  // give the response as a json file
  res.json(users)
})

app.post('/users', async (req, res) => {
  try{
    const hashPassword = await bcrypt.hash(req.body.password, 10) // wait for the password and save it as a hash  
    const user = {name: req.body.name, password: hashPassword}  // creat a user with name and hash pasword
    users.push(user)  // add the user
    res.status(201).send() // sends a response (created) if it was successful
  } catch {
    res.status(500).send() // sends a response (server error) if creation was failed
  }
})

app.get ('/users/login', (req, res) => {  // give the response as a json file
  res.json(users)
})

app.post('/users/login', async (req, res) => { //authenticate
  const user = users.find(user => user.name === req.body.name) // Searches for the user 
  if (user == null) {
    return res.status(400).send("Can not find user") // if user not found gives error
  } 
  try{
    if (await bcrypt.compare(req.body.password, user.password)){ //compare the req password with the usre password
      res.send('Succes') // sends a succes response if the password was correct.
    } else {
      res.send('Not allowed') //sends a not allowed response if the password was incorrect.
    }
    }catch{
   res.status(500).send() //server error
  }
})

app.get ('/posts', (req, res) => {  // give the response as a json file
  res.json(posts)
})

app.post('/posts', (req, res) => {
  
  if (!req.body.title || !req.body.content) {
    return res.status(400).send("title and content is required!")
  }
  const post = { 
    title: req.body.title, 
    content: req.body.content,
    createdAt: new Date()
  }
  posts.push(post)
  res.status(201).send(post)
})


app.listen(3000) // port
