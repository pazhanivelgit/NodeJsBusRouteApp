var helper = function(){
}

helper.prototype.isEmpty = function(checkStr){
    var retFlag = false;
    if (checkStr == undefined || checkStr == null || checkStr == '') {
        retFlag = true;
    }
    return retFlag;
}
module.exports = new helper();