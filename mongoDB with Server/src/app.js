const express = require('express')
const noteModel = require("./models/note.model")

const app = express();
app.use(express.json());

app.post("/notes", async (req, res) => {
    const data = req.body
    await noteModel.create({
        title: data.title,
        content: data.content
    })

    res.status(201).json({
        message: "note created successfully"
    })
})
 
app.get("/notes", async (req, res) => {
    const notes = await noteModel.find()

    // const notes = await noteModel.find({
    //     title : "lisandro1"
    // })

    res.status(200).json({
        message: "note fetch successfully",
        notes : notes
    })
})

app.delete("/notes/:id", async (req, res) => {
    
    const id = req.params.id
    await noteModel.findOneAndDelete({
        _id : id 
    })
    res.status(200).json({
        message: "note deleted successfully",
    })
})

app.patch("/notes/:id", async (req, res) => {
    
    const id = req.params.id
    const content = req.body.content
    await noteModel.findOneAndUpdate({
        _id : id
    }, 
    {
        content : content
    })
    res.status(200).json({
        message: "note updated successfully",
    })
})

module.exports = app