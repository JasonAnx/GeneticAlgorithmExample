
// var src = "http://crossorigin.me/http://lorempixel.com/100/100";
// var 
var img = new Image;
img.src = "canvas.png";

var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');
img.crossOrigin = "Anonymous";
canvas = [];

// The individuals
context         = [];

var imgData ;

var imageData   = [];

var individuals = [];

// Render the image
// when it has been loaded 
img.onload = function() {
    ctx.drawImage( img, 0, 0 );
    toHTML();
}


function toHTML(población) {
    alert("Remove población array");
    población = new Array(25);
    
    // get to original image in order to use it later
    //  for camparisons
    imgData = ctx.getImageData(0,0,100,100) ;

    table   = document.getElementById('table') ;
	similitudes = [];

    // Number of columns of the table
    var numc = 5; 
	for ( var i = 0; i < población.length; i++ ) {
    	if ( i % numc == 0 ) {
            // Insert / change to a new row every _numc_ iterations
        	row = table.insertRow(table.rows.length) ;
        }
        // create the HTML canvas that will hold the image
    	canvas[i] = document.createElement("canvas") ;
        canvas[i].width = "100";
        canvas[i].height= "100";
		canvas[i].className = "card-panel hoverable"
		
        context[i]  = canvas[i].getContext('2d');
        CreateImage ( context[i] );
        //context[i].putImageData(imgData,0,0) ;

        imageData[i] = context[i].getImageData( 0, 0, 100, 100);
        // context[i].font = '11pt Calibri';
		
		similitudes[i] = similarity( imgData, imageData[i] );
        // context[i].fillText( similitudes[i], 10, 95) ;

        // Create the tooltip that shows onHover
        // and set the tooltip data to its img similarity
        cont = document.createElement("a") ;
        cont.className = "tooltipped";
        $(cont).attr('data-tooltip', "Similarity: "+ Math.floor(similitudes[i]) );

        row.appendChild(cont);
        cont.appendChild(canvas[i]);
    }
    // Find the smallest similarity value i.e the most similar
	var smallest = similitudes[0];
	for ( var i = 0; i < población.length; i++ ) {
		//document.getElementById("asdf").innerHTML += similitudes[i]+'<br>';
		if (similitudes[i]<smallest) smallest = similitudes[i];
		//echo "<br>";
	}
	document.getElementById("sm").innerHTML +=  '<br>Smallest <br>'+smallest+'<br>';
    $('.tooltipped').tooltip({delay: 50});

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
	var g			= 0;
	población 	    = [100];
	poblaciónNueva  = [180];
	generarPoblaciónInicial( población );

	aptitud = [población.length];
	calcularAptitud(población,aptitud);
	while (g++<1000 && aptitudMayor(población,aptitud)<4){
		cruzar(población, poblaciónNueva);
		mutar(población) ;
		seleccionar(población, poblaciónNueva,aptitud);
	}
}

function generarPoblaciónInicial(población) {
	for (var i = 0; i < población.length; i++) {
		población[i]= (Math.random()*10)-5 ;
	}
}

function calcularAptitud(población, aptitud) {
	for (var i = 0; i < población.length; i++) {
		aptitud[i]= -1*población[i]*población[i]+3;
	}
}

function mutar(poblaciónNueva) {
	// System.out.println("mutar");
	var a;
	for ( var i = 0; i < poblaciónNueva.length*.1; i++) {
		a =  (Math.random()*180) ;
		poblaciónNueva[a]= (Math.random()*10) - 5; 
	}
}
function cruzar(población, poblaciónNueva) {
	// System.out.println("cruzar");
	for (var i = 0; i < población.length; i++) {
		poblaciónNueva[i]=población[i];
	}
	var a,b;
	for (var i = 0; i < población.length*.8; i++) {
		a = (Math.random()*100) ;
		b = (Math.random()*100) ;
		poblaciónNueva[i+población.length]= (población[a]*población[b])/2; 
	}
}
// ----------------------------------------------
//   EOF Genetic Algorithms
// ---------------------------------------------- 

function CreateImage(context) {
	nCircles    = Math.floor((Math.random() * 3) + 1);
    nLines      = Math.floor((Math.random() * 3) + 1);
    nRectangles = Math.floor((Math.random() * 3) + 1);

    context.circles      = nCircles           ;
    context.lines        = nLines             ;
    context.rectangles   = nRectangles        ;
    
    for (var i=0 ; i<nCircles;i++) {
		x1= Math.floor((Math.random() * 100) + 1);
     	y1= Math.floor((Math.random() * 100) + 1);
    	fill= "#"+Math.floor((Math.random() * 100) + 1)+Math.floor((Math.random() * 100) + 1)+Math.floor((Math.random() * 100) + 1);
    	stroke= "#"+Math.floor((Math.random() * 100) + 1)+Math.floor((Math.random() * 100) + 1)+Math.floor((Math.random() * 100) + 1);
    	radius= Math.floor((Math.random() * 20) + 1);
    	lineWidth= Math.floor((Math.random() * 5) + 1);
    
		drawCircle(context,x1,y1,radius,fill,3,stroke) ;
    }
    
    for (var i=0 ; i<nLines;i++) {
		x1= Math.floor((Math.random() * 100) + 1);
    	x2= Math.floor((Math.random() * 100) + 1);
  	  	y1= Math.floor((Math.random() * 100) + 1);
    	y2= Math.floor((Math.random() * 100) + 1);
    	stroke= "#"+Math.floor((Math.random() * 100) + 1)+Math.floor((Math.random() * 100) + 1)+Math.floor((Math.random() * 100) + 1);
    	lineWidth= Math.floor((Math.random() * 5) + 1);
    
		drawLine(context,x1,y1,x2,y2,lineWidth,stroke) ;
    }
    
    for (var i=0 ; i<nRectangles;i++) {
		x1= Math.floor((Math.random() * 100) + 1);
    	x2= Math.floor((Math.random() * 100) + 1);
  	  	y1= Math.floor((Math.random() * 100) + 1);
    	y2= Math.floor((Math.random() * 100) + 1);
    	fill= "#"+Math.floor((Math.random() * 100) + 1)+Math.floor((Math.random() * 100) + 1)+Math.floor((Math.random() * 100) + 1);
    	stroke= "#"+Math.floor((Math.random() * 100) + 1)+Math.floor((Math.random() * 100) + 1)+Math.floor((Math.random() * 100) + 1);
    	lineWidth= Math.floor((Math.random() * 5) + 1);
    
    	drawRectangle(context,x1,y1,x2,y2,fill,lineWidth,stroke) ;
	}
}

function drawRectangle(context,x1,y1,x2,y2,fill,lineWidth,stroke) {
	  context.beginPath();
      context.rect(x1, y1, x2, y2);
      context.fillStyle = fill ;
      context.fill();
      context.lineWidth = lineWidth;
      context.strokeStyle = stroke;
      context.stroke();
}

function drawLine(context,x1,y1,x2,y2,lineWidth,stroke) {
	  context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineWidth= lineWidth ;
      context.strokeStyle= stroke ;
      context.stroke();
}

function drawCircle(context, x,y,radius,fill,lineWidth,stroke) {
	  context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = fill;
      context.fill();
      context.lineWidth = lineWidth;
      context.strokeStyle = stroke;
      context.stroke();
}


function similarity(imageData1, imageData2) {
	data1= imageData1.data ;
    data2= imageData2.data ;
    suma=0 ;
    for (var i=0;i<data1.length;i+=4) {
    	d=0 ;
        d+= Math.pow((data1[i]-data2[i]),2);
        d+= Math.pow((data1[i+1]-data2[i+1]),2);
        d+= Math.pow((data1[i+2]-data2[i+2]),2);
        suma+=Math.pow(d,1/2) ;
    }
    
    return suma/(data1.length*.75);
}
        


 
