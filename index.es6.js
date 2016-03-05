'use strict';

const tmp = new WeakMap();

class LazyPromise extends Promise {
	constructor( factory ) {
		if ( typeof factory !== 'function' ) {
			throw new TypeError( `Promise resolver ${typeof factory} is not a function` );
		}

		let _resolve;
		let _reject;

		const _factory = ( resolve, reject ) => {
			_resolve = resolve;
			_reject = reject;
		};

		super( _factory );

		tmp.set( this, {
			factory,
			resolve: _resolve,
			reject: _reject
		} );
	}

	then( onSuccess, onFailure ) {
		const options = tmp.get( this );

		if ( options.factory ) {
			setImmediate( () => {
				if ( typeof options.factory === 'function' ) {
					options.factory( options.resolve, options.reject );

					options.factory = undefined;
				}
			} );
		}

		return super.then( onSuccess, onFailure );
	}

	catch( onFailure ) {
		return this.then( undefined, onFailure );
	}
}

export default LazyPromise;
