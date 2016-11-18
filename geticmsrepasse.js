var db = require("./class/db");
var crawler = require("./class/crawler");
var lib = require("./class/lib");
var params = require("./params");

//

console.log("");
console.log("Parâmetros:");
console.log("Exercícios: " + params.years.begin + " a " + params.years.end);
console.log("Meses: " + params.months.join(","));
console.log("");

//

if(!(params.years.begin >= 2009) || params.years.begin > params.years.end){
	console.log("Intervalo de Exercícios inválido, verifique os parâmetros.");
	process.exit();
}

//

var getQuotaParte = function(callback){

	console.log('Buscando Valores de Quota Parte de ICMS ...');

	var quotaParte = [];
	var currentYear = params.years.begin;

	var getRecursiveForYearQuotaParte = function(quotaParteFinded){

		quotaParte[currentYear] = quotaParteFinded;

		currentYear++;

		if(currentYear <= params.years.end){

			crawler.getQuotaParte(currentYear, params.months, getRecursiveForYearQuotaParte);

		}else{

			callback(quotaParte);

		}

	}

	crawler.getQuotaParte(currentYear, params.months, getRecursiveForYearQuotaParte);

}

var getCity = function(callback){
	return function(quotaParte){

		console.log('Buscando Dados dos Municípios ...');

		var dbconfig = require("./dbconfig");
		var citys = require("./citys");

		if(citys.length > 0){

			var city = citys.shift();

			var getRecursiveForCity = function(dbCity){

				if(dbCity.length > 0){

					dbCity = dbCity.shift();

					dbCity.conn = city.conn;

					callback(dbCity, quotaParte);

				}

				if(citys.length > 0){

					city = citys.shift();

					db.getCity(city.code, getRecursiveForCity);

				}

			}		

			db.connect(dbconfig.conn, function(){

				db.getCity(city.code, getRecursiveForCity);

			});

		}

	}
}

var getICMSRepasse = function(callback){
	return function(city, quotaParte){

		console.log('Buscando Valores de ICMS Repasse do Município de ' + city.description + ' ...');

		var icmsRepasse = [];
		var currentYear = params.years.begin;

		var getRecursiveForYear = function(icmsRepasseFinded){

			icmsRepasse[currentYear] = icmsRepasseFinded;

			currentYear++;

			if(currentYear <= params.years.end){

				crawler.getICMSRepasse(city.code, currentYear, params.months, getRecursiveForYear);

			}else{

				callback(city, icmsRepasse, quotaParte);

			}

		};

		crawler.getICMSRepasse(city.code, currentYear, params.months, getRecursiveForYear);

	}
}

var insertICMSRepasseEQuotaParte = function(){
	return function(city, icmsRepasse, quotaParte){

		console.log('Inserindo Valores de ICMS Repasse e Quota Parte do Município de ' + city.description + ' ...');

		db.insertICMSRepasseEQuotaParte(city, icmsRepasse, quotaParte);

	}
}

getQuotaParte(
	getCity(
		getICMSRepasse(
			insertICMSRepasseEQuotaParte()
		)
	)	
);

// getQuotaParte
//   getCity
//     getICMSRepasse
//       insertICMSRepasseEQuotaParte()