
var Crawler          = require("crawler"),
    PropertiesReader = require('properties-reader'),
    properties       = PropertiesReader('./server/config/festes.ini');

var mongoose 	= require('mongoose'),
	Festa  		= mongoose.model('Festa');    

exports.craw = function() {
    var c = new Crawler({
        maxConnections : 10,        
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;
                var items = $('table font.titol').length;

                for (var i=0; i < items; i++) {                    

                    var _title = $('table font.titol')[i].textContent;
                    var _summary = $('table font.titol')[i].textContent;
                    var _description = $('table font.text_petit')[i].textContent;
                    var _location = $('table font.subtitol_p')[i].textContent;

                    var festa = new Festa({
                        title:          _title,
                        summary:        _summary,
                        description:    _description,
                        location:       _location,
                        dateini:        '2018-06-24T00:00:00',
                        dateend:        '2018-06-24T00:00:00',
                        lat:            0,
                        lng:            0,
                        type:           'other'
                    });
                    console.log(festa);

                }
            }
            done();
        }
    });    
    c.queue(properties.get('crawler.festes.org'));
};
