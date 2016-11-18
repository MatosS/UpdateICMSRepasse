var db = require("mssql");
var citys = require("./citys");

var recursiveVerifyConnection = function(citys){

	if(citys.length > 0){

		var city = citys.shift();

		if(city.conn){

			var conn = new db.Connection(city.conn);

			var code = city.code;

			conn.connect(function(error){

				if(!error){

					console.log("Município " + code + ": Conexão estabelecida com sucesso!");

				}else{

					console.log("Município " + code + ": Não foi possivel conectar no banco de dados!");
					//console.log(error);

				}

				recursiveVerifyConnection(citys);

			});

		}else{

			console.log("Município " + code + ": Os dados de conexão não foram informados!");

			recursiveVerifyConnection(citys);

		}

	}else{

		process.exit();

	}

}

recursiveVerifyConnection(citys);