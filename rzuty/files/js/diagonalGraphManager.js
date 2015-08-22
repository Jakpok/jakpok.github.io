var board2 = createboard2();

var curve2, diag_a,diag_v, diag_zasieg, p2, interval2ID = "idle";

function diagonalThrow(a,v,g, zasieg,hmax){
	board2 = clearBoard2(board2);
	curve2 = board2.create('functiongraph', [function(x){ return x*Math.tan(a)-((g/(2*Math.pow(v*Math.cos(a),2)))*x*x)},0,zasieg],{strokeWidth:2, strokeColor:'#2980b9'});
	board2.on('up', upDiagonal);
	diag_a = a;
	diag_v = v;
	info_g = g;
	diag_zasieg = zasieg;
	p2 = board2.createElement('point',[0,0],{face:'o', size:8, strokeColor:'red', fillOpacity:0.6, strokeOpacity: 0.6, fixed: true, withLabel: false});
	if(!board2.hasPoint(0,hmax) || !board2.hasPoint(zasieg,0)){
		board2.setBoundingBox([-zasieg/25,hmax*1.1,zasieg*1.1,-hmax/20],  true); 
	}
	//setTimeout(animatePointDiagonal(),1000);
	
}

function animatePointDiagonal(){
	if(interval2ID == "idle"){
		var x = 0;
		interval2ID = setInterval(
		function(){
			p2.moveTo([x,x*Math.tan(diag_a)-((g/(2*Math.pow(diag_v*Math.cos(diag_a),2)))*x*x)],40);
			x+=diag_zasieg/60;
			if(x>diag_zasieg){
				clearInterval(interval2ID);
				p2.moveTo([0,0],2);
				interval2ID = "idle";
			}
		}
		,50);
	}
}

function createboard2(){
	var b = JXG.JSXGraph.initBoard('box2', {boundingbox: [-1, 10, 10, -1], axis:false, showCopyright: false,keepaspectratio:true});
	var ax1 = b.create('axis', [[0,0],[1,0]],{
		withLabel: true,
		name:'x[m]',
		label: { 
		 cssClass: 'tag',
         anchorX: 'left',
		 offset: [385,10],
        }
	});
	var ax2 = b.create('axis', [[0,0],[0,1]],{
		withLabel: true,
		name:'y[m]',
		label: { 
		 cssClass: 'tag',
         anchorX: 'left',
		 offset: [-30,195],
        }
	});
	return b;
}

function clearBoard2(board2) {
    JXG.JSXGraph.freeBoard(board2);
    board2 = createboard2();
    return board2;
}

function getMouseCoords2(e, i) {
        var cPos = board2.getCoordsTopLeftCorner(e, i),
            absPos = JXG.getPosition(e, i),
            dx = absPos[0]-cPos[0],
            dy = absPos[1]-cPos[1];
 
        return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board2);
}

function upDiagonal(e) {
        var canCreate = true, i, coords, el;
 
        if (e[JXG.touchProperty]) {
            i = 0;
        }
        coords = getMouseCoords2(e, i);
 
        /*for (el in board2.objects) {
            if(JXG.isPoint(board2.objects[el]) && board2.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                canCreate = false;
                break;
            }
        }*/
		//console.log(board2.downObjects);
		if(board2.downObjects && board2.downObjects.length > 1){
			if(board2.downObjects[1].type == 12){
				var children = board2.downObjects[1].childElements;
				//console.log(children);
				//for (el in children) {
				//	console.log(el);
				//}
				//console.log(children);
				for( var key in children) {
					if( children.hasOwnProperty(key) ) {
						board2.removeObject(board2.select(key));
					}
				}
				board2.removeObject(board2.downObjects[1]);
			}
		}
		else if(curve2 && curve2.hasPoint(coords.scrCoords[1], coords.scrCoords[2])){
			//board2.create('point', [coords.usrCoords[1], coords.usrCoords[2]]);
			createInfoPoint2(coords.usrCoords[1]);
		}
}

function createInfoPoint2(x){
	var y = x*Math.tan(diag_a)-((g/(2*Math.pow(diag_v*Math.cos(diag_a),2)))*x*x); //wzor na rzut ukosny
	
	var t = x/(diag_v*Math.cos(diag_a));
	t = Math.round(t * 100) / 100; //zaokraglenie
	
	//var v_total = Math.sqrt(info_v*info_v+((info_g*t)*(info_g*t)));
	//v_total = Math.round(v_total * 100) / 100; //zaokraglenie
	
	var v_horizontal = diag_v*Math.cos(diag_a); // predkosc pozioma
	v_horizontal = Math.round(v_horizontal * 100) / 100; //zaokraglenie
	//alert(v_horizontal);
	
	var v_vertical = (diag_v*Math.sin(diag_a)) - g*t; //predkosc pionowa
	v_vertical = Math.round(v_vertical * 100) / 100; //zaokraglenie
	
	var v_total = Math.sqrt(v_horizontal*v_horizontal + v_vertical*v_vertical);
	v_total = Math.round(v_total * 100) / 100;
	
	var point = board2.create('point', [x, y], 
    {size:4,
	 name:'t:'+ t + 's  |  v:'+ v_total + "m/s" ,
     label: { 
         offset: [-9, 12],
         cssClass: 'tag',
         highlightCssClass: 'tag'
        }
    });
	point.setProperty({fixed:true});
	point.on('up', pointUp);
	point.fillColor("#c0392b");
	point.strokeColor("#c0392b");
	
	var xAnchor = board2.create('point', [x+(v_horizontal/6), y]);
	xAnchor.hideElement();
	point.addChild(xAnchor);
	
	var yAnchor = board2.create('point', [x, y+(v_vertical/6)]);
	yAnchor.hideElement();
	point.addChild(yAnchor);
	
	var xArrow = board2.create('arrow', [point, xAnchor],{
		withLabel: true,
		name:'Vx: ' + v_horizontal + 'm/s',
		label: { 
         offset: [10,-10],
		 cssClass: 'tag',
         highlightCssClass: 'tag'
        }
	});
	point.addChild(xArrow);
	xArrow.strokeColor("#c0392b");
	
	var yArrow = board2.create('arrow', [point, yAnchor],{
		withLabel: true,
		name:'Vy: ' + v_vertical + 'm/s',
		label: { 
         offset: [10, -30],
		 cssClass: 'tag',
         highlightCssClass: 'tag'
        }
	});
	point.addChild(yArrow);
	yArrow.strokeColor("#c0392b");
	
	var diagAnchor = board2.create('point', [xAnchor.X(),yAnchor.Y()]);
	diagAnchor.hideElement();
	point.addChild(diagAnchor);
	var diagArrow = board2.create('arrow', [point, diagAnchor],{});
	point.addChild(diagArrow);
	diagArrow.strokeColor("rgba(192,57,43,0.8)");
}