var db = require("mssql");

var connection;

exports.connect = function(conn, callback){

	connection = new db.Connection(conn);

	connection.connect(function(error){

		if(!error){

			callback();

		}else{

			console.log(error);

		}

	});

}

exports.getCity = function(cityCode, callback){

	var SQL_SELECT = "SELECT id = IdGiaMunicipio, code = CodigoMunicipio, description = DescricaoMunicipio FROM GiaMunicipio WHERE IdGiaEstado = 24 AND CodigoMunicipio = " + cityCode;

	var request = new db.Request(connection);

	request.query(SQL_SELECT, function(error, records){

		if(!error){

			callback(records);

		}else{

			console.log(error);

		}

	});

}

exports.insertICMSRepasseEQuotaParte = function(city, icmsRepasse, quotaParte){

	var toFile = (!city.conn);

	var SQL_INSERT = "EXEC dbo.NextId 'IdDipRepasseIcms', 'DipRepasseIcms', @IdDipRepasseIcms OUTPUT " + (toFile ? "\n" : "")
	               + "INSERT INTO DipRepasseIcms VALUES (@IdDipRepasseIcms, @IdMunicipio, @Exercicio, @Mes, @Valor, @QuotaParte, GETDATE(), 'Importador');";

	var sqlFinal = "";

	var years = "";
	var months = "";

	icmsRepasse.forEach(function(icmsRepasseForYear, year){

		years += (years == "" ? "" : ",") + year;

		icmsRepasseForYear.forEach(function(value, month){

			if(months.indexOf(month) == -1)
				months += (months == "" ? "" : ",") + month;

			var sql = SQL_INSERT

			sql = sql.replace("@IdMunicipio", city.id);
			sql = sql.replace("@Exercicio", year);
			sql = sql.replace("@Mes", month);
			sql = sql.replace("@Valor", value);

			if(quotaParte[year] && quotaParte[year][month]){
				sql = sql.replace("@QuotaParte", quotaParte[year][month]);
			}else{
				sql = sql.replace("@QuotaParte", quotaParte[year][month]);
			}

			sqlFinal += sql + (toFile ? "\n" : "");

		});

	});

	if(sqlFinal){

		sqlFinal = "DECLARE " + (toFile ? "\n" : "")
		         + "	@IdDipRepasseIcms Int " + (toFile ? "\n" : "")
		         + "DELETE FROM DipRepasseIcms WHERE IdGiaMunicipio = " + city.id + " AND Ano IN (" + years + ") AND Mes IN (" + months + ") " + (toFile ? "\n" : "")
		         + sqlFinal;

     	if(toFile){

     		var fs = require('fs');
     		var lib = require("./lib");

     		fs.writeFile(__dirname + '/../sql_inserts/icms-repasse-' + lib.simplifyStr(city.description) + '-years-' + years.replaceAll(",", "-") + '-months-' + months.replaceAll(",", "-") + '.txt', sqlFinal, function(error){

     			if(error){

					console.log(error);
					console.log(sqlFinal);

				}

     		});

        }else{
        	
        	var conn = new db.Connection(city.conn);

			conn.connect(function(error){

				if(!error){

					var request = new db.Request(conn);

					request.query(sqlFinal, function(error){

						if(error){

							console.log(error);
							console.log(sqlFinal);

						}

					});

				}else{

					console.log(error);

				}

			});

		}

	}



}