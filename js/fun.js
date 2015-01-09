var r = 0;
function rotate(){
	r=r-90;
	if(r==-270){
		r=0;
	}
	document.body.setAttribute( "style", "-moz-transform: rotate(" + r + "deg);");
}