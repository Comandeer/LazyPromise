const fs = require( 'fs' );
const code = fs.readFileSync( 'index.js', 'utf8' );

fs.writeFileSync( 'index.es6.js', code.replace( 'module.exports =', 'export default' ) );
