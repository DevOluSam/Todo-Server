const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const TodoModel = require("./Models/Todo")
const dotenv = require("dotenv")
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// mongoose.connect('mongodb://127.0.0.1:27017/test')

const DB = process.env.DATABASE_URI
mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
}).catch((err) => {
  console.log(err);
  console.log('DB connection failed!');
});
app.post("/add", async (req, res) => {
    const task = req.body.task;
    if(!task){
        return res.json({ error: "Task is required"})
    }

    const todo = await TodoModel.create({ task: task })
    res.send(todo)
})
app.get("/todos", async (req, res) => {
    const todos = await TodoModel.find()
    res.send(todos)
})

app.put("/completed/:id", async (req, res) => {
    const { id } = req.params;
    const todo = await TodoModel.findByIdAndUpdate({_id: id}, {done: true})
    res.json(todo)
})
app.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const task = req.body.task;
    const todo = await TodoModel.findByIdAndUpdate({_id: id}, {task: task})
    res.json(todo)
})
app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const todo = await TodoModel.findByIdAndDelete({_id: id});
    res.json(todo)
})

app.listen(3001, () => {
    console.log("Server is running")
})