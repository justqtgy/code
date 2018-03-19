
const fs = require('fs');

function controller(app){
	console.log('init_route begin');	
	
	app.use('/', require('./routes/index'));

	fs.readdirSync(__dirname + '/routes').filter((f) => {
        return f.endsWith('.js');
    }).forEach((f) => {
        console.log(`process controller: ${f}...`);
		//let mapping = require(__dirname + '/routes/' + f);
		var mapping = f.slice(0, f.lastIndexOf('.'));
        app.use(`/${mapping}`, require(`./routes/${mapping}`));
    });
	
	console.log('init_route end');
}

module.exports = controller;