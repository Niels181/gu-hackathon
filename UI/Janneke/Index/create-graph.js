/*
 * Parse the data and create a graph with the data.
 */
function parseData(createGraph) {
	Papa.parse("P1.csv", {
		download: true,
		complete: function(results) {
			createGraph(results.data);
		}
	});
}

function calculateFlow(data) {
    let result = []
    for (i = 0; i < data.length - 1; i++) {
        result.push(data[i + 1] - data[i]);
    }
    return result;
}

function createGraph(data) {
    console.log(data);
	var time = [];
    var p1_meterreading_t1 = [];
    var p1_meterreading_t2 = [];

	//start at 1 beause you dont want the first row (header)
	//push keeps on pushing the data into
	for (var i = 1; i < data.length; i+= 100) {
		time.push(data[i][0]);
        p1_meterreading_t1.push(data[i][5]);
        p1_meterreading_t2.push(data[i][7]);
    }

    let t1_data = calculateFlow(p1_meterreading_t1);
    let t2_data = calculateFlow(p1_meterreading_t2);

	console.log(time);
    console.log(t1_data);
    console.log(t2_data);


    var chart = c3.generate({
        bindto: '#chart',
        data: {
            columns: [
                ['T1'].concat (t1_data),
                ['T2'].concat (t2_data),
            ]
           
		},
		axis: {
			x: {
				type: 'category',
				categories: time,
                tick: {
                    //zorgt ervoor dat de x namen recht staan ipv horizontaal
                    multiline: true,
                    rotate: 75, 
					//zorgt voor sprongen van 15 in de jaren
					culling: {
						max: 15
					}
				}
			}
		},
		zoom: {
			enabled: true
		},
		legend: {
			position: 'right'
		}
	});
}

parseData(createGraph);