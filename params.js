var params = {
	"years" : [0, 0],
	"months" : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
};

//

if(process.argv[2]){

	//years=[0,0];months=[1,2,3,4,5]

	var p = process.argv[2].split(";");
	
	p.forEach(function(value, index){

		var param = value.split("=");

		params[param[0]] = eval(param[1]);

	});

}

//

if(params.year && !Array.isArray(params.year)){

	params.years = [params.year, params.year];

}

if(params.month && !Array.isArray(params.month)){

	params.months = [params.month];

}

if(!Array.isArray(params.years)){

	params.years = [params.years, params.years];

}

if(!Array.isArray(params.months)){

	params.months = [params.months];

}

params.years = {
	begin: params.years[0],
	end: params.years[1]
}

//

module.exports = params;