var mongoose = require('mongoose'),
		mongooseLocale = require('mongoose-locale'),
		mongooseBcrypt = require('mongoose-bcrypt'),
		Schema = mongoose.Schema;


var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: {type: String, default: 'User'},
	date: {type: Date, default: Date.now},
});

var areaSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	adress: { type: String, trim: true, locale: true },
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now}
});

var hallSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	area: { type: Schema.Types.ObjectId, ref: 'Area' },
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now}
});

var eventSchema = new Schema({
	_short_id: String,
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	status: String,
	tickets: {
		alt: { type: String, trim: true, locale: true },
		ids: [{ type: Schema.Types.ObjectId, ref: 'Hall' }]
	},
	format: {
		type: String,
		dates: [Date]
	},
	age: Number,
	hall: { type: Schema.Types.ObjectId, ref: 'Hall' },
	events: {
		parent: { type: Schema.Types.ObjectId, ref: 'Event' },
		children: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
	},
	categorys: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
	members: [{
		status: { type: String, trim: true, locale: true },
		ids: [{ type: Schema.Types.ObjectId, ref: 'Member' }]
	}],
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now}
});

var memberSchema = new Schema({
	_short_id: String,
	name: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	date: {type: Date, default: Date.now}
});

var categorySchema = new Schema({
	_short_id: String,
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	status: String,
	date: {type: Date, default: Date.now}
});

var ticketSchema = new Schema({
	type: String,
	expired: {type: Boolean, default: false},
	price: Number,
	date: {type: Date, default: Date.now}
});

var stateSchema = new Schema({
	type: String,
	date: {type: Date, default: Date.now}
});


// ------------------------
// *** Plugins Block ***
// ------------------------


userSchema.plugin(mongooseBcrypt, { fields: ['password'] });

hallSchema.plugin(mongooseLocale);
areaSchema.plugin(mongooseLocale);
eventSchema.plugin(mongooseLocale);
categorySchema.plugin(mongooseLocale);
memberSchema.plugin(mongooseLocale);


// ------------------------
// *** Index Block ***
// ------------------------


eventSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override:'lg', default_language: 'ru'});


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Hall = mongoose.model('Hall', hallSchema);
module.exports.Area = mongoose.model('Area', areaSchema);
module.exports.Event = mongoose.model('Event', eventSchema);
module.exports.Member = mongoose.model('Member', memberSchema);
module.exports.Category = mongoose.model('Category', categorySchema);
module.exports.Ticket = mongoose.model('Ticket', ticketSchema);

module.exports.State = mongoose.model('State', stateSchema);
