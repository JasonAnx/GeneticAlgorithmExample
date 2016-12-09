
// var src = "http://crossorigin.me/http://lorempixel.com/100/100";
// var 
var img = new Image();
img.src = "canvas.png";

var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');
imgData = ctx.getImageData(0, 0, 100, 100);
canvas = [];

// The individuals
// context         = [];

var imgData;

var imageData = [];

var individuals = [];

// Render the image
// when it has been loaded 
img.onload = function () {
	ctx.drawImage(img, 0, 0);
	main();
}


function toHTML(población) {
	// alert("To HTML");
	// get to original image in order to use it later
	//  for camparisons


	// imgData = ctx.getImageData(0, 0, 100, 100);

	table = document.getElementById('table');
	similitudes = [];

	// Number of columns of the table
	var numc = 5;
	for (var i = 0; i < población.length; i++) {
		if (i % numc == 0) {
			// Insert / change to a new row every _numc_ iterations
			row = table.insertRow(table.rows.length);
		}

		//context[i].putImageData(imgData,0,0) ;

		imageData[i] = context[i].getImageData(0, 0, 100, 100);
		// context[i].font = '11pt Calibri';

		similitudes[i] = similarity(imgData, imageData[i]);
		// context[i].fillText( similitudes[i], 10, 95) ;

		// Create the tooltip that shows onHover
		// and set the tooltip data to its img similarity
		cont = document.createElement("a");
		cont.className = "tooltipped";
		$(cont).attr('data-tooltip', "Similarity: " + Math.floor(similitudes[i]));

		row.appendChild(cont);
		cont.appendChild(canvas[i]);
	}
	// Find the smallest similarity value i.e the most similar
	var smallest = similitudes[0];
	for (var i = 0; i < población.length; i++) {
		//document.getElementById("asdf").innerHTML += similitudes[i]+'<br>';
		if (similitudes[i] < smallest) smallest = similitudes[i];
		//echo "<br>";
	}
	document.getElementById("sm").innerHTML += '<br>Smallest <br>' + smallest + '<br>';
	$('.tooltipped').tooltip({ delay: 50 });

	indls = document.getElementById("indv");
	for (var i in context) {
		indls.innerHTML += context[i].circles + "<br>";
	}


}

// ----------------------------------------------
// 
//   Genetic Algorithms
// 
// ---------------------------------------------- 
function main() {

	pobSize = 10; // TODO subir a 100 de nuevo

	población = new Array(pobSize);
	poblaciónNueva = new Array(población.length + población.length * 0.8);

	inicializar(población);
	inicializar(poblaciónNueva);
	generarPoblaciónInicial(población);

	aptitud = new Array(población.length);
	// calcularAptitud(población, aptitud);
	calcularAptitud(población);

	var counter = 0;
	numGeneraciones = 100; // TODO subir a 1000

	console.log(población.length);
	console.log(poblaciónNueva.length);

	// población.forEach(function(entry) {
	//     console.log(entry);
	// });


	// ---------------------------------------
	table = document.getElementById('table');
	row = table.insertRow(table.rows.length);

	cont = document.createElement("a");
	cont.className = "tooltipped";
	$(cont).attr('data-tooltip', "Similarity: " + 45);

	row.appendChild(cont);
	cont.appendChild(población[1].canvas);
	$('.tooltipped').tooltip({ delay: 50 });
	// ---------------------------------------



	while (counter++ < numGeneraciones && aptitudMayor(población, aptitud) < 4) {
		cruzar(población, poblaciónNueva);
		mutar(población);
		// calcularAptitud( población, aptitud ); por que aca´?
		seleccionar(población, poblaciónNueva, aptitud);
	}
}

function inicializar(p) {
	for (var i = 0; i < p.length; i++) {

		p[i] = new Object;

		// create the HTML canvas that will hold the image
		p[i].canvas = document.createElement("canvas");
		p[i].canvas.width = "100";
		p[i].canvas.height = "100";
		p[i].canvas.className = "card-panel hoverable"

		// p[i]  = canvas[i].getContext('2d');
	}
}

function generarPoblaciónInicial(p) {
	for (var i = 0; i < p.length; i++) {
		genIndividuo(p[i]);
		// console.log( p[i].circles[0] );
		// console.log( p[i].lines[0] );
		// console.log( p[i].rectangles[0] );
	}

}

function aptitudMayor(población, aptitud) {
	var máximo = 0;
	var t = aptitud[0];
	for (var i = 0; i < aptitud.length; i++) {
		t = aptitud[i];
		máximo = t > máximo ? t : máximo;
	}
	return 0;
}

// seleccionar los mejores, y algunos chapas
function seleccionar(población, poblaciónNueva, aptitud) {
	// calcularAptitud(poblaciónNueva, aptitud);
	calcularAptitud(poblaciónNueva);
	ordenar(poblaciónNueva);


	for (var i = 0; i < población.length * .8; i++) {
		población[i] = poblaciónNueva[i];
	}
	for (var i = 0; i < población.length * .2; i++) {
		población[i] = poblaciónNueva[poblaciónNueva.length - i];
	}

}

function ordenar(a) {
	// taken from 
	// http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
	a.sort(compare);
}

function compare(a, b) {
	if (a.sim < b.sim)
		return -1;
	if (a.sim > b.sim)
		return 1;
	return 0;
}



// function calcularAptitud(población, aptitud) {
function calcularAptitud(población) {
	for (var i = 0; i < población.length; i++) {
		imdDta = población[i].canvas.getContext('2d').getImageData(0, 0, 100, 100);
		población[i].sim = similarity(imdDta, imgData);
	}
}

function similarity(imageData1, imageData2) {
	data1 = imageData1.data;
	data2 = imageData2.data;
	suma = 0;
	for (var i = 0; i < data1.length; i += 4) {
		d = 0;
		d += Math.pow((data1[i] - data2[i]), 2);
		d += Math.pow((data1[i + 1] - data2[i + 1]), 2);
		d += Math.pow((data1[i + 2] - data2[i + 2]), 2);
		suma += Math.pow(d, 1 / 2);
	}

	return suma / (data1.length * .75);
}


function mutar(poblaciónNueva) {
	// mutar 10% de la población 
	var a;
	for (var i = 0; i < poblaciónNueva.length * .1; i++) {
		a = parseInt(Math.random() * poblaciónNueva.length);
		// poblaciónNueva[a] = (Math.random()*10) - 5; 
		poblaciónNueva[a].circles = parseInt(Math.random() * 10) - 5; // TODO why 10?
		poblaciónNueva[a].lines = parseInt(Math.random() * 10) - 5;
		poblaciónNueva[a].rectangles = parseInt(Math.random() * 10) - 5;
	}
}

function cruzar(población, poblaciónNueva) {

	for (var i = 0; i < población.length; i++) {
		poblaciónNueva[i] = población[i];
	}

	var a, b;
	// setting the población.length*0.8 remaining entries
	for (var i = 0; i < población.length * 0.8; i++) {

		a = parseInt(Math.random() * población.length);
		b = parseInt(Math.random() * población.length);

		pater = población[a];
		mater = población[b];

		circles = Math.ceil((pater.circles.length + mater.circles.length) / 2);

		child = poblaciónNueva[i + población.length];

		child.circles = {};
		// numb circles taken from pater
		cc = Math.ceil((pater.circles.length / (pater.circles.length + mater.circles.length)) * circles);
		for (var j = 0; j < cc; j++) {
			child.circles[j] = {
				// context: context,
				x1: pater.circles[j].x1,
				y1: pater.circles[j].y1,
				fill: pater.circles[j].fill,
				stroke: pater.circles[j].stroke,
				radius: pater.circles[j].radius,
				lineWidth: pater.circles[j].lineWidth
			}
		}
		// numb circles taken from mater
		cc = Math.ceil((mater.circles.length / (pater.circles.length + mater.circles.length)) * circles);
		for (var j = 0; j < cc; j++) {
			child.circles[j] = {
				// context: context,
				x1: mater.circles[j].x1,
				y1: mater.circles[j].y1,
				fill: mater.circles[j].fill,
				stroke: mater.circles[j].stroke,
				radius: mater.circles[j].radius,
				lineWidth: mater.circles[j].lineWidth
			}
		}

		child.lines = (población[a].lines * población[b].lines) / 2;
		child.rectangles = (población[a].rectangles * población[b].rectangles) / 2;
	}
}
// ----------------------------------------------
//   EOF Genetic Algorithms
// ---------------------------------------------- 

function genIndividuo(context) {
	nCircles = Math.floor((Math.random() * 3) + 1);
	nLines = Math.floor((Math.random() * 3) + 1);
	nRectangles = Math.floor((Math.random() * 3) + 1);

	context.circles = [];
	context.lines = [];
	context.rectangles = [];

	for (var i = 0; i < nCircles; i++) {
		x1 = Math.floor((Math.random() * 100) + 1);
		y1 = Math.floor((Math.random() * 100) + 1);
		fill = "#" + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1);
		stroke = "#" + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1);
		radius = Math.floor((Math.random() * 20) + 1);
		lineWidth = Math.floor((Math.random() * 5) + 1);

		context.circles[i] = {
			// context: context,
			x1: x1,
			y1: y1,
			fill: fill,
			stroke: stroke,
			radius: radius,
			lineWidth: lineWidth
		}

		drawCircle(context.canvas.getContext('2d'), x1, y1, radius, fill, lineWidth, stroke);
	}

	for (var i = 0; i < nLines; i++) {
		x1 = Math.floor((Math.random() * 100) + 1);
		x2 = Math.floor((Math.random() * 100) + 1);
		y1 = Math.floor((Math.random() * 100) + 1);
		y2 = Math.floor((Math.random() * 100) + 1);
		stroke = "#" + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1);
		lineWidth = Math.floor((Math.random() * 5) + 1);

		context.lines[i] = {
			x1: x1,
			x2: x2,
			y1: y1,
			y2: y2,
			stroke: stroke,
			lineWidth: lineWidth
		}

		drawLine(context.canvas.getContext('2d'), x1, y1, x2, y2, lineWidth, stroke);
	}

	for (var i = 0; i < nRectangles; i++) {
		x1 = Math.floor((Math.random() * 100) + 1);
		x2 = Math.floor((Math.random() * 100) + 1);
		y1 = Math.floor((Math.random() * 100) + 1);
		y2 = Math.floor((Math.random() * 100) + 1);
		fill = "#" + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1);
		stroke = "#" + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1) + Math.floor((Math.random() * 100) + 1);
		lineWidth = Math.floor((Math.random() * 5) + 1);

		context.rectangles[i] = {
			x1: x1,
			x2: x2,
			y1: y1,
			y2: y2,
			fill: fill,
			stroke: stroke,
			lineWidth: lineWidth
		}

		drawRectangle(context.canvas.getContext('2d'), x1, y1, x2, y2, fill, lineWidth, stroke);
	}
}

function drawRectangle(context, x1, y1, x2, y2, fill, lineWidth, stroke) {
	context.beginPath();
	context.rect(x1, y1, x2, y2);
	context.fillStyle = fill;
	context.fill();
	context.lineWidth = lineWidth;
	context.strokeStyle = stroke;
	context.stroke();
}

function drawLine(context, x1, y1, x2, y2, lineWidth, stroke) {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineWidth = lineWidth;
	context.strokeStyle = stroke;
	context.stroke();
}

function drawCircle(context, x, y, radius, fill, lineWidth, stroke) {
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI, false);
	context.fillStyle = fill;
	context.fill();
	context.lineWidth = lineWidth;
	context.strokeStyle = stroke;
	context.stroke();
}



