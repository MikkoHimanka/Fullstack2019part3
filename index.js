require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Note = require('./models/note')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())


// let notes = [
//     {
//         id: 1,
//         content: "HTML is easy",
//         date: "2019-05-30T17:30:31.098Z",
//         important: true
//     },
//     {
//         id: 2,
//         content: "Browser can execute only Javascript",
//         date: "2019-05-30T18:39:34.091Z",
//         important: false
//     },
//     {
//         id: 3,
//         content: "GET and POST are the most important methods of HTTP protocol",
//         date: "2019-05-30T19:20:14.298Z",
//         important: true
//     }
// ]

// app.get('/', (req, res) => {
//     res.send('<h1>Hello World!</h1>')
// })

app.get('/api/notes', (req, res) => {
	Note.find({}).then(notes => {
		res.json(notes.map(note => note.toJSON()))
	})
})

app.get('/api/notes/:id', (req, res, next) => {
	Note.findById(req.params.id)
		.then(note => {
			if (note) {
				res.json(note.toJSON())
			}
			else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
	Note.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

app.put('/api/notes/:id', (req, res, next) => {
	const body = req.body

	const note = {
		content: body.content,
		important: body.important,
	}

	Note.findByIdAndUpdate(req.params.id, note, { new: true })
		.then(updatedNote => {
			res.json(updatedNote.toJSON())
		})
		.catch(error => next(error))
})

app.post('/api/notes', (req, res, next) => {
	const body = req.body

	if (body.content === undefined) {
		return res.status(400).json({ error: 'content missing' })
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})

	note.save()
		.then(savedNote => savedNote.toJSON())
		.then(savedAndFormattedNote => res.json(savedAndFormattedNote))
		.catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return res.status(400).send( { error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})