function security(req, res, next) {
	if(authenticate()) {
		next();
	}
	else {
		var err = new error('Not authenticated');
		next(err);
	}
}

function authenticate() {
	return true;
	//return false;
}
module.exports = security;