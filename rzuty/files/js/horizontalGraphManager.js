var board = createBoard();

var curve, info_h,info_v,info_g, info_zasieg, p, intervalID = "idle";

function horizontalThrow(h,v,g, zasieg){
	board = clearAll(board);
	curve = board.create('functiongraph', [function(x){ return h-((g*x*x)/(2*v*v))},0,zasieg],{strokeWidth:2, strokeColor:'#2980b9'});
	board.on('up', up);
	info_h = h;
	info_v = v;
	info_g = g;
	info_zasieg = zasieg;
	p = board.createElement('point',[0,h],{face:'o', size:8, strokeColor:'red', fillOpacity:0.6, strokeOpacity: 0.6, fixed: true, withLabel: false});
	if(!board.hasPoint(0,h) || !board.hasPoint(zasieg,0)){
		board.setBoundingBox([-zasieg/25,h*1.1,zasieg*1.1,-h/20],  true); 
	}
	//setTimeout(animatePoint(),1000);
	
}

function animatePoint(){
	if(intervalID == "idle"){
		var x = 0;
		intervalID = setInterval(
		function(){
			p.moveTo([x,info_h-((info_g*x*x)/(2*info_v*info_v))],40);
			x+=info_zasieg/60;
			if(x>info_zasieg){
				clearInterval(intervalID);
				p.moveTo([0,info_h],2);
				intervalID = "idle";
			}
		}
		,50);
	}
}

function createBoard(){
	var b = JXG.JSXGraph.initBoard('box', {boundingbox: [-1, 10, 10, -1], axis:false, showCopyright: false,keepaspectratio:true});
	
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

function clearAll(board) {
    JXG.JSXGraph.freeBoard(board);
    board = createBoard();
    return board;
}

function getMouseCoords(e, i) {
        var cPos = board.getCoordsTopLeftCorner(e, i),
            absPos = JXG.getPosition(e, i),
            dx = absPos[0]-cPos[0],
            dy = absPos[1]-cPos[1];
 
        return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
}

function up(e) {
        var canCreate = true, i, coords, el;
 
        if (e[JXG.touchProperty]) {
            i = 0;
        }
        coords = getMouseCoords(e, i);
 
        /*for (el in board.objects) {
            if(JXG.isPoint(board.objects[el]) && board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                canCreate = false;
                break;
            }
        }*/
		//console.log(board.downObjects);
		if(board.downObjects && board.downObjects.length > 1){
			if(board.downObjects[1].type == 12){
				var children = board.downObjects[1].childElements;
				//console.log(children);
				//for (el in children) {
				//	console.log(el);
				//}
				//console.log(children);
				for( var key in children) {
					if( children.hasOwnProperty(key) ) {
						board.removeObject(board.select(key));
					}
				}
				board.removeObject(board.downObjects[1]);
			}
		}
		else if(curve && curve.hasPoint(coords.scrCoords[1], coords.scrCoords[2])){
			//board.create('point', [coords.usrCoords[1], coords.usrCoords[2]]);
			
			createInfoPoint(coords.usrCoords[1]);
		}
}

function pointUp(e){
	//console.log(e);
}

function createInfoPoint(x){
	var y = info_h-((info_g*x*x)/(2*info_v*info_v)); //wzor na rzut poziomy
	
	var t = Math.sqrt((2*info_h-2*y)/info_g);
	t = Math.round(t * 100) / 100; //zaokraglenie
	
	var v_total = Math.sqrt(info_v*info_v+((info_g*t)*(info_g*t)));
	v_total = Math.round(v_total * 100) / 100; //zaokraglenie
	
	var v_vertical = -info_g*t;
	v_vertical = Math.round(v_vertical * 100) / 100; //zaokraglenie
	
	var point = board.create('point', [x, y], 
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
	
	var xAnchor = board.create('point', [x+(v_total/6), y]);
	xAnchor.hideElement();
	point.addChild(xAnchor);
	
	var yAnchor = board.create('point', [x, y+(v_vertical/6)]);
	yAnchor.hideElement();
	point.addChild(yAnchor);
	
	var xArrow = board.create('arrow', [point, xAnchor],{
		withLabel: true,
		name:'Vx: ' + info_v + 'm/s',
		label: { 
         offset: [10,-10],
		 cssClass: 'tag',
         highlightCssClass: 'tag'
        }
	});
	point.addChild(xArrow);
	xArrow.strokeColor("#c0392b");
	
	var yArrow = board.create('arrow', [point, yAnchor],{
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
	
	var diagAnchor = board.create('point', [xAnchor.X(),yAnchor.Y()]);
	diagAnchor.hideElement();
	point.addChild(diagAnchor);
	var diagArrow = board.create('arrow', [point, diagAnchor],{});
	point.addChild(diagArrow);
	diagArrow.strokeColor("rgba(192,57,43,0.8)");
}