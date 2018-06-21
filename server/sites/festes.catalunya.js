'use strict';

var Crawler          = require("crawler"),
    PropertiesReader = require('properties-reader'),
    properties       = PropertiesReader('./server/config/festes.ini');

var mongoose 	= require('mongoose'),
    Festa  		= mongoose.model('Festa');    
    
exports.craw = function(req, res) {
    var response = res;
    var c = new Crawler({
        maxConnections : 5,        
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            } else {
                var $ = res.$;                                
                var links = [];
                var linksPerPage = $('.c_vista_previa_titol a').length;                
                for (var i=0; i < linksPerPage; i++) {                
                    var innerLink = $('.c_vista_previa_titol a')[i].attribs.href;
                    links.push(innerLink);
                    console.log(innerLink);
                }
            }
            done();
        }
    });
    c.queue('https://www.festacatalunya.cat/index.php?md=cercador&es_portada=1&accio=cerca_avansada_resultat&data_ini=24%2F03%2F2018&data_fi=24%2F03%2F2018&municipi=&tipus=0&paraula_clau=&enviar=cercar');        
};