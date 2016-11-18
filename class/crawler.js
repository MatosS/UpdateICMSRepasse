exports.getQuotaParte = function(year, months, callback){

	var request = require("request");
	var cheerio = require("cheerio");

	var $;
	var formData;

	var _PAGE_TO_SCRAPING = "https://www.fazenda.sp.gov.br/RepasseConsulta/Consulta/quotaparte.aspx";

	request(_PAGE_TO_SCRAPING, function(error, response, body) {

		if(response.statusCode === 200) {

	        $ = cheerio.load(body);

			formData = {};

			$("form [name]").each(function(){

				if($(this).val()){

					formData[$(this).attr("name")] = $(this).val();

				}

			});

			formData["ctl00$ConteudoPagina$ddlAno"] = year;

			request.post({url: _PAGE_TO_SCRAPING, form: formData}, function(error, response, body) {

				if(response.statusCode === 200) {
			        
			        $ = cheerio.load(body);

			        //

			        var quotaParte = [];

			        var month = 0;
			        var col = 0;

			        $("#ConteudoPagina_gdvRepasse tr").each(function(){

			        	if($(this).find("td").length > 0){

			        		var dateQuotaParte = $(this).find("td").first().text().split("/");

			        		if(dateQuotaParte.length == 2){

				        		var month = parseInt(dateQuotaParte[1]);

				        		if(months.indexOf(month) > -1){

					        		col = 0;

						        	$(this).find("td").each(function(){

						        		col++;

						        		if(col == 2){

						        			if(!quotaParte[month]){
												quotaParte[month] = 0;
											}

						        			quotaParte[month] += parseFloat($(this).text().replaceAll(".", "").replaceAll(",", "."));

						        		}

						        	});

						        }

						    }

				        }

			        });

			        callback(quotaParte);

			        //
			        
			    }else{

			        return false;

			    }

			});        

	    }else{

	        return false;

	    }

	});

}

exports.getICMSRepasse = function(cityCode, year, months, callback){

	var request = require("request");
	var cheerio = require("cheerio");

	var $;
	var formData;

	var _PAGE_TO_SCRAPING = "https://www.fazenda.sp.gov.br/RepasseConsulta/Consulta/repasse.aspx";

	request(_PAGE_TO_SCRAPING, function(error, response, body) {

		if(response.statusCode === 200) {

	        $ = cheerio.load(body);

			formData = {};

			$("form [name]").each(function(){

				if($(this).val()){

					formData[$(this).attr("name")] = $(this).val();

				}

			});

			formData["ctl00$ConteudoPagina$ddlMuni"] = cityCode;
			formData["ctl00$ConteudoPagina$ddlAno"] = year;
			formData["ctl00$ConteudoPagina$rblTipo"] = "ANO";

			request.post({url: _PAGE_TO_SCRAPING, form: formData}, function(error, response, body) {

				if(response.statusCode === 200) {
			        
			        $ = cheerio.load(body);

			        //

			        var icmsRepasse = [];

			        var month = 0;
			        var col = 0;

			        $("#ConteudoPagina_gdvRepasse tr").each(function(){

			        	if($(this).find("td").length > 0){

			        		var monthsDescription = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

			        		var monthDescription = $(this).find("td").first().text();

			        		month = monthsDescription.indexOf(monthDescription.substring(0, 3).toLowerCase()) + 1;

			        		if(months.indexOf(month) > -1){

				        		col = 0;

					        	$(this).find("td").each(function(){

					        		col++;

					        		if(col == 2){

					        			icmsRepasse[month] = parseFloat($(this).text().replaceAll(".", "").replaceAll(",", "."));

					        		}

					        	});

					        }

				        }

			        });

			        callback(icmsRepasse);

			        //
			        
			    }else{

			        return false;

			    }

			});        

	    }else{

	        return false;

	    }

	});

}