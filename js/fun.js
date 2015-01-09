var r = 0;
function rotate(){
	r=r-90;
	if(r==-270){
		r=0;
	}
	document.body.setAttribute( "style", "-webkit-transform: rotate(" + r + "deg);-moz-transform: rotate(" + r + "deg);-o-transform: rotate(" + r + "deg);transform: rotate(" + r + "deg);");
}