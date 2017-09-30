var mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
	user_id: {
		type: String
	},
	course_id: {
		type: String
	},
	filename: {
		type: String
	},
	author: {
		type: String
	},
	avatar: {
		type: String
	},
	link: {
		type: String
	},
	size: {
		type: Number
	},
	time: {
		type: String
	},
	avatar: {
		type: String
	}
});

var Note = module.exports = mongoose.model('Note', NoteSchema);

// Create a new study note
module.exports.createNote = function(newNote, callback){
	newNote.save(callback);
};

// Retrieve a study note by the filename
module.exports.getNoteByFilename = function(filename, callback){
	var query = {filename: filename};
	Note.findOne(query, callback);
};
