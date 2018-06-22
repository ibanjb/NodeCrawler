var mongoose 	= require('mongoose'),
	Festa  		= mongoose.model('Festa');

//GET - Return all
exports.findAll = function(req, res) {
	Festa.find(function(err, festes) {
    if (err) {
        return res.status(500).send(500, err.message);
    }
	res.status(200).jsonp(festes);
	});
};

//GET - Return by Id
exports.findById = function(req, res) {
	Festa.findById(req.params.id, function(err, festa) {
    if (err) {
        return res.status(500).send(500, err.message);
    }
	res.status(200).jsonp(festa);
	});
};

//GET - Return by DateIni
//Example: localhost/api/festes/date/21-01-2018
//
exports.findByDate = function(req, res) {
	console.log(req.params.date);
	Festa.find({date: req.params.date}, function(err, festes) {
		if (err) {
			return res.status(500).send(500, err.message);
		}
		res.status(200).jsonp(festes);
		});		
}

exports.saveData = function(festa) {
	festa.save(function(err) {
		if (err) {
            return false;
        }
        return true;
	});
};

//POST - Insert
exports.add = function(req, res) {
	var festa = new Festa({
        title:          req.body.title,
        summary:        req.body.summary,
		description:    req.body.description,
		location:       req.body.location,
		date:        	req.body.date,
		lat:            req.body.lat,
        lng:            req.body.lng,
        type:           req.body.type
	});
	var result = saveData(festa);
	if (result) {
		return res.status(200).jsonp(festa);		
	} else {
		return res.status(500).send(500, err.message);
	}        	
};

//PUT - Update by Id
exports.update  = function(req, res) {
	Festa.findById(req.params.id, function(err, festa) {
        festa.title         = req.body.title;
        festa.summary       = req.body.summary;
		festa.description   = req.body.description;
		festa.location      = req.body.location;
		festa.date	        = req.body.date;
		festa.lat           = req.body.lat;
        festa.lng           = req.body.lng;
        festa.type          = req.body.type;
		festa.save(function(err) {
			if (err) {
                return res.status(500).send(err.message);
            } 
            res.status(200).jsonp(festa);
		});
	});
};

//DELETE - Delete by Id
exports.delete = function(req, res) {
	Festa.findById(req.params.id, function(err, festa) {
		festa.remove(function(err) {
			if (err) {
                return res.status(500).send(err.message);
            } 
            res.status(200);
		})
	});
};
