const uuid = require('uuid/v4');

module.exports = function({database, dirs}) {

	// Save attachment as file and add reference to database
	const saveAttachment = function(panelID, file, type, partialPath) {
		const absPath = `${dirs.public}${partialPath}`;
		const path = partialPath;
		saveFile(file, absPath).then(name=> database.addAttachment({name, path}, type, panelID))
				.catch(console.error);
	}

	// Save multiple attachments
	const saveAttachments = function(panelID, files = [], type, path) {
		Array.isArray(files) && files.forEach(file => {
			saveAttachment(panelID, file, type, path);
		});
	}

	// Get attachments of given type
	const getAttachment = function(panelID, type) {
		return database.getAttachments(panelID, type);
	}

	// Get attachments of given types
	const getAttachments = async function(panelID, types = []) {
		const attachments = {};

		for (let i; i < types.length; i++) {
			const result = await getAttachment(panelID, types[i]);
			Object.defineProperty(acc, type, {
				value: result,
				enumerable: true
			})
		}

		return attachments;
	}

	return {
		saveAttachment,
		saveAttachments,
		getAttachment,
		getAttachments
	}
}


function saveFile(file, path) {
	const fileExt = getExt(file.name);
	const fileName = `${uuid()}.${fileExt}`;

	const moveFile = new Promise((resolve, reject) => {
		if (file.name.length == 0) {
			reject(new Error('No file uploaded'));
			return;
		};
		file.mv(path + fileName, function(err) {
			if (err) {
				reject(err);
			}
			resolve(fileName);
		})
	});
	return moveFile;
}


function getExt(fileName) {
	if (typeof fileName !== 'string') return;
	const name = fileName.split('.');
	return name[name.length -1];
}