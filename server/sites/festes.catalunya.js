
var Crawler          = require("crawler"),
    PropertiesReader = require('properties-reader'),
    properties       = PropertiesReader('./server/config/festes.ini'),
    NodeGeocoder     = require('node-geocoder');

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
            var itemNumber = 0;
            $(".et_pb_module").each(function(i, items) { 
                $(items).find('tr').each(function(i, item) {                    
                    var mainTitle = $(item).find("td").eq(1).text();
                    if (mainTitle !== 'FESTA') {
                        itemNumber++;
                        var dateUnformat = $(item).find("td").eq(3).text().split('-');
                        var dateFormatted = convertCustomToDate(dateUnformat);
                        var mainLocation = $(item).find("td").eq(2).text() + ', ' + $(item).find("td").eq(0).text();
                        if (dateFormatted.indexOf('--') === -1) {
                            fillGeoLocationSave(mainTitle, mainLocation, dateFormatted, itemNumber);
                        }
                    }                    
                });
            });
            console.log('Crawled ' + itemNumber + ' items');
        }
        done();}
    });
    
    c.queue(properties.get('crawler.festes.catalunya'));

    function fillGeoLocationSave(title, address, dateFormatted, itemNumber) {        
        var options = {
            provider: 'google',
            httpAdapter: 'https',
            apiKey: properties.get('server.googlemap.api')
        };
        if (itemNumber === 1) {
            var geocoder = NodeGeocoder(options);
            geocoder.geocode(address)
                .then(function(res) {
                    if (res.length > 0) {
                        saveFesta(title, address, dateFormatted, res[0].latitude, res[0].longitude);                        
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        } else {
            saveFesta(title, address, dateFormatted, 0, 0);
        }
    }

    function saveFesta(title, address, date, latitude, longitude) {
        var controller = require('../controllers/festes');
        var festa = new Festa({
            title:          title,
            description:    '',
            location:       address,
            date:           date,
            lat:            latitude,
            lng:            longitude,
            type:           'other'
        });                        
        controller.saveData(festa);
    }

    function convertCustomToDate(customDate) {
        var month = '';        
        switch (customDate[1]) {
            case 'gen' | 'ene':
                month = '01';
                break;
            case 'feb':
                month = '02';
                break;
            case 'mar':
                month = '03';
                break;
            case 'abr':
                month = '04';
                break;
            case 'mai' | 'may':
                month = '05';
                break;
            case 'jun':
                month = '06';
                break;
            case 'jul':
                month = '07';
                break;
            case 'ago':
                month = '08';
                break;
            case 'sep':
                month = '09';
                break;
            case 'oct':
                month = '10';
                break;
            case 'nov':
                month = '11';
                break;
            case 'des' | 'dic':
                month = '12';
                break;
        };        
        var dateFormatted =  customDate[0] + '-' + month + '-2018';        
        return dateFormatted;
    }    
};

