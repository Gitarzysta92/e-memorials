
const Container = require('./container');

const store = {}
store._containers = [];

const createContainer = function(userID, formData, mergeMethod) {
	const existingContainer = store._containers.find(session => session.userID === userID);
	if (existingContainer) {
		existingContainer.update(formData);
		return existingContainer.ID;
	}
	const container = new Container(userID, formData, mergeMethod);
	store._containers.push(container);
	return container.ID;
}

const generateModel = function(storeID) {
	const container = store._containers.find(session => session.ID === storeID);
	return container ? container.getModel() : false;
}

const removeContainerBy = function(userID) {
	const sessions = store._containers;
	store._sessions = sessions.filter(session => !(session.userID === userID));
}

module.exports = {
	createContainer,
	generateModel,
	removeContainerBy
}


