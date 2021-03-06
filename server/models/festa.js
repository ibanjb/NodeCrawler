exports = module.exports = function(app, mongoose) {
	var festaSchema = new mongoose.Schema({
        title: 		    { type: String },
        summary: 	    { type: String },
		description: 	{ type: String },
		location: 	    { type: String },
		date:			{ type: String },
        lat:     	    { type: Number },
        lng:     	    { type: Number },
		type: 		{
			type: String,
			enum: ['local', 'concert', 'food', 'drink', 'dance', 'other']
		}		
	});
	mongoose.model('Festa', festaSchema);
};