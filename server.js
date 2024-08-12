import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

const Todo = mongoose.model('Todo', todoSchema);

// API routes
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
