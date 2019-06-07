const uuid = require('uuid/v4');

module.exports = class Container {
	constructor(userID, formData, merge) {
		this.ID = uuid();
		this.userID = userID;
		this._merge = merge;
		this._model = this._createModel(formData)
	}

	getModel() {
		return this._model;
	}

	update(formData) {
		this._model = this._createModel(formData);
	}

	_createModel(data) {
		const isHasMargeMethod = this.hasOwnProperty('_merge');
		if (!isHasMargeMethod) return false;
		const mergedData = this._merge(data);
		return mergedData ? Object.assign({}, mergedData) : {};
	}
}
