const mongoose = require('mongoose')

if ( process.argv.length < 3 ) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-ezblr.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const noteSchema = new mongoose.Schema({
	content: String,
	date: Date,
	important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//     content: 'HTML is easy',
//     date: new Date(),
//     important: true,
// })

// note.save().then(res => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })

Note.find({}).then(result => {
	result.forEach( note => {
		console.log(note)
	})
	mongoose.connection.close()
})