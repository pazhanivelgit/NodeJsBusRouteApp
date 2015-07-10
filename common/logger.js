var logger = function(){
}

logger.prototype.log = function(message){
	console.log(message);
}
module.exports = new logger();