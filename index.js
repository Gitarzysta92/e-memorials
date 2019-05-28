const app = require('./app/main.js');


const ABSPATH = __dirname;
const paths = {
	client: `${ABSPATH}/client`,
	library: `${ABSPATH}/lib`,
	utilities: `${ABSPATH}/utils`,
	constants: `${ABSPATH}/constants`,
	layouts: `${ABSPATH}/views/layouts`,
	partials: `${ABSPATH}/views/partials`
}

const database = {

}


const memorial = app({
	server: {
		port: process.env.PORT || 3000,
		notify: 'Server listen'
	},
	dir: paths,
	database: false
});




memorial.run();