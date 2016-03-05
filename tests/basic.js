'use strict';

const LazyPromise = require( '../index' );
const chai = require( 'chai' );
const expect = chai.expect;

chai.use( require( 'chai-spies' ) );

describe( 'LazyPromise', () => {
	it( 'is an instance of Promise', () => {
		const promise = new LazyPromise( () => {} );

		expect( promise ).to.be.an.instanceof( Promise );
	} );

	it( 'accepts only function as parameter', () => {
		const fn = () => {
			new LazyPromise( 'a' );
		};

		expect( fn ).to.throw( TypeError, 'Promise resolver string is not a function' );
	} );

	it( 'returns a thenable', () => {
		const promise = new LazyPromise( () => {} );

		expect( promise ).to.have.property( 'then' );
		expect( promise.then ).to.be.a( 'function' );
	} );

	it( 'does not have any own properties', () => {
		const promise = new LazyPromise( () => {} );

		expect( Object.getOwnPropertyNames( promise ) ).to.be.empty;
		expect( Object.getOwnPropertySymbols( promise ) ).to.be.empty;
	} );
} );

describe( 'thenable', () => {
	it( 'is called asynchronously', () => {
		const promise = new LazyPromise( ( resolve ) => {
			resolve();
		} );
		const spy = chai.spy();

		promise.then( spy );

		expect( spy ).to.not.have.been.called();
	} );

	it( 'returns promise', () => {
		const promise = new LazyPromise( () => {} );
		const ret = promise.then();

		expect( ret ).to.be.an.instanceof( Promise );
	} );

	it( 'calls only success callback on success', ( done ) => {
		const promise = new LazyPromise( ( resolve ) => {
			resolve();
		} );
		const success = chai.spy();
		const failure = chai.spy();

		promise.then( success, failure );

		setTimeout( () => {
			expect( success ).to.have.been.called.once();
			expect( failure ).not.to.have.been.called();

			done();
		}, 20 );
	} );

	it( 'calls only failure callback on failure', ( done ) => {
		const promise = new LazyPromise( ( resolve, reject ) => {
			reject();
		} );
		const success = chai.spy();
		const failure = chai.spy();

		promise.then( success, failure );

		setTimeout( () => {
			expect( success ).not.to.have.been.called();
			expect( failure ).to.have.been.called.once();

			done();
		}, 20 );
	} );

	it( 'passes value on success', ( done ) => {
		const value = {};
		const promise = new LazyPromise( ( resolve ) => {
			resolve( value );
		} );

		promise.then( ( param ) => {
			expect( param ).to.be.equal( value );

			done();
		} );
	} );

	it( 'passes value on failure', ( done ) => {
		const value = {};
		const promise = new LazyPromise( ( resolve, reject ) => {
			reject( value );
		} );

		promise.then( () => {}, ( param ) => {
			expect( param ).to.be.equal( value );

			done();
		} );
	} );
} );

describe( 'factory callback', () => {
	it( 'is not called when no action is taken', ( done ) => {
		const factory = chai.spy();

		new LazyPromise( factory );

		setTimeout( () => {
			expect( factory ).not.have.been.called();

			done();
		}, 20 );
	} );

	it( 'is called when then is invoked', ( done ) => {
		const factory = chai.spy( ( resolve ) => {
			resolve();
		} );
		const promise = new LazyPromise( factory );

		promise.then( () => {} );

		setTimeout( () => {
			expect( factory ).to.have.been.called();

			done();
		}, 20 );

	} );

	it( 'is called when catch is invoked', ( done ) => {
		const factory = chai.spy( ( resolve, reject ) => {
			reject();
		} );
		const promise = new LazyPromise( factory );

		promise.catch( () => {} );

		setTimeout( () => {
			expect( factory ).to.have.been.called();

			done();
		}, 20 );

	} );

	it( 'is called only once', ( done ) => {
		const factory = chai.spy( ( resolve ) => {
			resolve();
		} );
		const promise = new LazyPromise( factory );

		promise.then( () => {} );
		promise.catch( () => {} );

		setTimeout( () => {
			expect( factory ).to.have.been.called.once();

			done();
		}, 20 );
	} );

	it( 'is called asynchronously', () => {
		const factory = chai.spy();
		const promise = new LazyPromise( factory );

		promise.then( () => {}, () => {} );

		expect( factory ).not.have.been.called();
	} );
} );
