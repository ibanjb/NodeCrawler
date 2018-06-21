
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
            var numberItems = 0;
            $(".et_pb_module").each(function(i, items) { 
                $(items).find('tr').each(function(i, item) {
                    numberItems++;
                    var dateUnformat = $(item).find("td").eq(3).text().split('-');
                    var dateFormatted = convertCustomToDate(dateUnformat);                                        
                    var festa = new Festa({
                        title:          $(item).find("td").eq(1).text(),
                        description:    '',
                        location:       $(item).find("td").eq(2).text() + ', ' + $(item).find("td").eq(0).text(),
                        dateini:        dateFormatted,
                        dateend:        dateFormatted,
                        lat:            0,
                        lng:            0,
                        type:           'other'
                    });
                    console.log(festa);
                });
            });
            console.log('Crawled ' + numberItems + ' items');
        }
        done();}
    });
    c.queue(properties.get('crawler.festes.catalunya'));

    function convertCustomToDate(customDate) {
        var month = '';        
        switch (customDate[1]) {
            case 'gen':
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
            case 'mai':
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
            case 'des':
                month = '12';
                break;
        };
        var dateFormatted = '2018-' + month + '-' + customDate[0] + 'T00:00:00';
        console.log(dateFormatted);
        return dateFormatted;
    }    
};

