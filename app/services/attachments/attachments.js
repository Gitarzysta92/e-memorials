

module.exports = function({db, dirs}) {

	// Save attachment as file and add reference to database
	const saveAttachment = function(userID, file, type, partialPath) {
		const absPath = `${dirs.public}${partialPath}`
		saveFile(file, absPath).then(file => db.addAttachment(file, type, userID))
				.catch(console.error);
	}

	// Save multiple attachments
	const saveAttachments = function(userID, files = [], type, path) {
		Array.isArray(files) && files.forEach(file => {
			saveAttachment(userID, file, type, path);
		});
	}

	// Get attachments of given type
	const getAttachment = function(userID, type) {
		return db.getAttachments(userID, type);
	}

	// Get attachments of given types
	const getAttachments = async function(userID, types = []) {
		const attachments = {};

		for (let i; i < types.length; i++) {
			const result = await getAttachment(userID, types[i]);
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
			resolve({
				name: file.name,
				path: filePath
			});
		})
	});
	return moveFile;
}


function getExt(fileName) {
	if (typeof fileName !== 'string') return;
	const name = fileName.split('.');
	return name[name.length -1];
}