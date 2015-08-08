"use strict";

const tmp = new WeakMap();

class LazyPromise extends Promise
{
	constructor(factory)
	{
		if(typeof factory !== 'function')
			throw new TypeError('Promise resolver ' + typeof factory + ' is not a function');

		var _resolve
		,_reject
		,_factory = function(resolve, reject)
		{
			_resolve = resolve;
			_reject = reject;
		};

		super(_factory);

		tmp.set(this, {
			factory: factory
			,resolve: _resolve
			,reject: _reject
		});
	}
	then(success, failure)
	{
		var options = tmp.get(this);

		if(options.factory)
			setImmediate(function()
			{
				if(typeof options.factory === 'function')
				{
					options.factory(options.resolve, options.reject);

					options.factory = undefined;
				}
			});
		return super.then(success, failure);
	}
};

LazyPromise.tmp = tmp;

module.exports = LazyPromise;
