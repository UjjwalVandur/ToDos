import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin:['http://localhost:5173'],
  credentials:true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Define a schema and model for Todo items
const todoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  todo: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, Unique: true },
  password: { type: String, required:true},
});

const Todo = mongoose.model('Todo', todoSchema);
const User = mongoose.model('Users', userSchema);

// API routes

app.post('/register', async (req, res)=>{
  const {name, email, password} = await req.body;
  User.create({name, email, password})
  .then(user => res.json(user))
  .catch(err => res.json(err))
})

app.post('/login', async(req, res)=>{
  const {email, password} =  req.body;
  const user = await User.findOne({ email })
  console.log({user})
 
    if(user){
        if(user.password === password){
          const accessToken = jwt.sign({email}, "jwt-access-token-secret-key", {expiresIn: '1m'})
          const refreshToken = jwt.sign({email}, "jwt-refresh-token-secret-key", {expiresIn: '5m'})
          res.cookie('accessToken',accessToken,{maxAge:60000, httpOnly:true,secure:false,sameSite:'strict'})
          res.cookie('refreshToken',refreshToken,{maxAge:300000, httpOnly:true,secure:false,sameSite:'strict'})
          return res.json({Login:true})
        }
    }
    else{
      res.json({Login:false, Message:"User not registered"})
    }
  })


const verifyUser =(req,res,next)=>{
  const accesstoken =req.cookies.accessToken;
  if(!accesstoken){
    if(renewToken(req,res)){
      next()
    }
  }
  else{
    jwt.verify(accesstoken,'jwt-access-token-secret-key',(err,decoded)=>{
        if(err){
          return res.json({valid:false, message:"invalid token"})
        }
        else{
          req.email =decoded.email;
          next()
        }
    })
  }
}

const renewToken =(req,res)=>{
  const refreshtoken =req.cookies.refreshToken;
  let exist = false;
  if(!refreshtoken){
    return res.json({valid:false, message:'NO refresh token'})
  }
  else{
    jwt.verify(refreshtoken,'jwt-refresh-token-secret-key',(err,decoded)=>{
        if(err){
          return res.json({valid:false, message:"invalid refresh token"})
        }
        else{
          const accessToken = jwt.sign({email: email}, "jwt-access-token-secret-key", {expiresIn: '1m'})
          res.cookie('accessToken',accessToken,{maxAge:60000})
          exist :true
        }
    })
  }
  return exist
}

app.get('/home', (req, res)=>{
  return res.json({valid: true, message:"logged in"})
})



app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/todos', async (req, res) => {
  const newTodo = new Todo(req.body);

  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    res.json(deletedTodo);
  } catch (err) {
    res.status(400).send(err);
  }
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
