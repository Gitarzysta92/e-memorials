module.exports = function({ api, services }) {

	const { pages, partners, users } = services.externalApi;

	//
	// user
	// 
	const createUser = async function(req, res) {
		const result = await users.create(req.body);
		res.send(result);
	}

	const getUserById = async function(req, res) {
		const id = req.params.id;
		const user = await users.get(id);
		const resultWithId = Object.assign(user, {id: user.user_ID})
		res.send(resultWithId);
	}

	const getAllUsers = async function(req, res) {
		const result = await users.getAll();
		const resultWithId = result.map(user => Object.assign(user, {id: user.user_ID}));
		res.send(resultWithId);
	}

	const updateUserById = async function(req, res) {
		const id = req.body.id;
		const result = await users.update(id, req.body);
		res.send(result);
	}

	const deleteUserById = async function(req, res) {
		const id = req.params.id;
		const result = await users.remove(id);
		res.send(result);
	}

	//
	// Partners
	//
	const createPartner = async function(req, res) {
		const result = await partners.create(req.body);
		console.log(result)
		res.send(result);
	}

	const getPartnerById = async function(req, res) {
		const id = req.params.id;
		const partner = await partners.get(id);
		const resultWithId = Object.assign(partner, {id: partner.partner_ID})
		res.send(resultWithId);
	}

	const getAllPartners = async function(req, res) {
		const result = await partners.getAll();
		const resultWithId = result.map(partner => Object.assign(partner, {id: partner.partner_ID}));
		res.send(resultWithId);
	}

	const updatePartnerById = async function(req, res) {
		const id = req.body.id;
		const result = await partners.update(id, req.body);
		res.send(result);
	}

	const deletePartnerById = async function(req, res) {
		const id = req.params.id;
		const result = await partners.remove(id);
		res.send(result);
	}

	//
	// Pages
	//
	const createPage = async function(req, res) {
		console.log(req.body);
		const result = await pages.create(req.body);
		res.send(result);
	}

	const getPageById = async function(req, res) {
		const id = req.params.id;
		const page = await pages.get(id);
		const resultWithId = Object.assign(page, {id: page.page_ID})
		res.send(resultWithId);
	}

	const getAllPages = async function(req, res) {
		const page = await pages.getAll();
		const resultWithId = page.map(page => Object.assign(page, {id: page.page_ID}));
		res.send(resultWithId);
	}

	const updatePageById = async function(req, res) {
		const id = req.body.id;
		const result = await pages.update(id, req.body);
		res.send(result);
	}

	const deletePageById = async function(req, res) {
		const id = req.params.id;
		const result = await pages.remove(id);
		res.send(result);
	}


	return {
		createUser,
		getUserById,
		getAllUsers,
		updateUserById,
		deleteUserById,

		createPartner,
		getPartnerById,
		getAllPartners,
		updatePartnerById,
		deletePartnerById,

		createPage,
		getPageById,
		getAllPages,
		updatePageById,
		deletePageById,
	}
}
