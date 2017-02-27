
$('#contact').click(function(){
$('#img').toggle()
})
	var i=0
function add(){
	i++
	if (i>=4) {
		i=0
	}
	$('.imgbox').eq(i).css({'display':'block'}).siblings().css({'display':'none'})
}
console.log($('.imgbox').length)
var set=setInterval(add,1000)
$('#imgSection').hover(function(){
	clearInterval(set)
},function(){
	setInterval(add,1000)
})
	


