var mongoose = require('mongoose'),
		mongooseLocale = require('mongoose-locale'),
		mongooseBcrypt = require('mongoose-bcrypt');

var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

mongoose.Promise = Promise;
mongoose.connect('localhost', 'main');


// ------------------------
// *** Schema Block ***
// ------------------------


var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: String,
	date: {type: Date, default: Date.now},
});

var areaSchema = new Schema({
	_short_id: { type: String, index: true },
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	contacts: {
		adress: { type: String, trim: true, locale: true },
		schedule: { type: String, trim: true, locale: true },
		phones: [String],
		emails: [String]
	},
	halls: [{ type: ObjectId, ref: 'Hall' }],
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now}
});

var hallSchema = new Schema({
	_short_id: { type: String, index: true },
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now}
});

var newsSchema = new Schema({
	_short_id: { type: String, index: true },
	title: { type: String, trim: true, locale: true },
	s_title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	areas: [{ type: ObjectId, ref: 'Area' }],
	categorys: [{ type: ObjectId, ref: 'Category' }],
	meta: {
		tuzik: {
			ru: String,
			en: String
		}
	},
	interval: {
		begin: Date,
		end: Date
	},
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	status: String,
	date: {type: Date, default: Date.now}
});

var eventSchema = new Schema({
	_short_id: { type: String, index: true },
	title: { type: String, trim: true, locale: true },
	s_title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	status: String,
	program: {
		parent: { type: ObjectId, ref: 'Event' },
		children: [{ type: ObjectId, ref: 'Event' }]
	},
	meta: {
		tuzik: {
			ru: String,
			en: String
		}
	},
	tickets: {
		alt: { type: String, trim: true, locale: true },
		ids : [{
			complex: Boolean,
			id: { type: ObjectId, ref: 'Ticket' }
		}]
	},
	type: String,
	interval: {
		begin: Date,
		end: Date
	},
	age: Number,
	place: {
		area: { type: ObjectId, ref: 'Area' },
		halls: [{ type: ObjectId, ref: 'Hall' }]
	},
	categorys: [{ type: ObjectId, ref: 'Category' }],
	partners: [{
		rank: String,
		ids: [{ type: ObjectId, ref: 'Partner' }]
	}],
	members: [{
		role: String,
		ids: [{ type: ObjectId, ref: 'Member' }]
	}],
	images: [{
		description: { type: String, trim: true, locale: true },
		original: String,
		thumb: String
	}],
	date: {type: Date, default: Date.now, index: true}
});

var memberSchema = new Schema({
	_short_id: { type: String, index: true },
	name: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	photo: String,
	roles: [String],
	status: String,
	date: {type: Date, default: Date.now, index: true}
});

var partnerSchema = new Schema({
	_short_id: { type: String, index: true },
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	type: String,
	link: String,
	logo: String,
	status: String,
	date: {type: Date, default: Date.now, index: true}
});

var categorySchema = new Schema({
	_short_id: { type: String, index: true },
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	type: String,
	status: String,
	date: {type: Date, default: Date.now, index: true}
});

var ticketSchema = new Schema({
	events: [{ type: ObjectId, ref: 'Event' }],
	complex: Boolean,
	type: String,
	status: String,
	price: Number,
	date: {type: Date, default: Date.now}
});

var logSchema = new Schema({
	_item_id: ObjectId,
	_user_id: { type: ObjectId, ref: 'User' },
	type: String,
	status: String,
	date: {type: Date, expires: 3600 * 24 * 90, default: Date.now}
});


// ------------------------
// *** Plugins Block ***
// ------------------------


userSchema.plugin(mongooseBcrypt, { fields: ['password'] });

hallSchema.plugin(mongooseLocale);
areaSchema.plugin(mongooseLocale);
eventSchema.plugin(mongooseLocale);
newsSchema.plugin(mongooseLocale);
categorySchema.plugin(mongooseLocale);
memberSchema.plugin(mongooseLocale);
partnerSchema.plugin(mongooseLocale);


// ------------------------
// *** Index Block ***
// ------------------------


newsSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override: 'lg', default_language: 'ru'});

eventSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
eventSchema.index({ 'type': 1, 'status': 1 });

categorySchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
categorySchema.index({ 'type': 1, 'status': 1 });

partnerSchema.index({'title.value': 'text', 'description.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
partnerSchema.index({ 'type': 1, 'status': 1 });

memberSchema.index({'name.value': 'text', 'description.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
memberSchema.index({ 'roles': 1, 'status': 1 });


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Hall = mongoose.model('Hall', hallSchema);
module.exports.Area = mongoose.model('Area', areaSchema);
module.exports.Event = mongoose.model('Event', eventSchema);
module.exports.News = mongoose.model('News', newsSchema);
module.exports.Member = mongoose.model('Member', memberSchema);
module.exports.Category = mongoose.model('Category', categorySchema);
module.exports.Ticket = mongoose.model('Ticket', ticketSchema);
module.exports.Partner = mongoose.model('Partner', partnerSchema);
module.exports.Log = mongoose.model('Log', logSchema);