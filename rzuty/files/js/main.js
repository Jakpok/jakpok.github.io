var g = 10;

function rzutPoziomy(){
	var h = document.getElementById("pozH").value;
	var v = document.getElementById("pozV").value;
	h = h.replace(",",".");
	v = v.replace(",",".");
	if(isNaN(h)|| isNaN(v)){
		$('.alert').show();
	}
	else{
		h = eval(h);
		v = eval(v);
		
		var zasieg = v*Math.sqrt((2*h)/g);
		document.getElementById("zasieg").innerHTML = customRound(zasieg) + " [m]"
		
		var czas = Math.sqrt((2*h)/g);
		document.getElementById("t_upadku").innerHTML = customRound(czas) + " [s]"
		
		var predkosc = Math.sqrt(v*v+2*g*h);
		document.getElementById("v_upadku").innerHTML = customRound(predkosc) + " [m/s]"
		
		horizontalThrow(h,v,g, zasieg);
	}
}

function rzutUkosny(){
	var a = document.getElementById("alfa").value;
	var v = document.getElementById("ukoV").value;
	a = a.replace(",",".");
	v = v.replace(",",".");
	if(isNaN(a)|| isNaN(v)){
		$('.alert').show();
	}
	else{
		a = eval(a);
		a = toRad(a); // do radianow
		v = eval(v);
		
		var zasieg = (v*v)/g*Math.sin(2*a);
		document.getElementById("zasieg_diagonal").innerHTML = customRound(zasieg) + " [m]"
		
		var czas = ((2*v*Math.sin(a))/g);
		document.getElementById("t_upadku_diagonal").innerHTML = czas.toFixed(2) + " [s]"
		
		var hmax = (Math.pow(v*Math.sin(a),2))/(2*g);
		document.getElementById("h_max_diagonal").innerHTML = customRound(hmax) + " [m]"
		
		diagonalThrow(a,v,g, zasieg,hmax);
	}
}

function toRad (a) {
	return a * (Math.PI / 180);
}

function customRound(x){
	return Math.round(x * 1000) / 1000;
}