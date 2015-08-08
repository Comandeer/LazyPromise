"use strict";

var LazyPromise = require('../index')
,chai = require('chai')
,expect = chai.expect;

chai.use(require('chai-spies'));

describe('LazyPromise', function()
{
	it('is an instance of Promise', function()
	{
		var promise = new LazyPromise(function() {});

		expect(promise).to.be.an.instanceof(Promise);
	});

	it('accepts only function as parameter', function()
	{
		var fn = function()
		{
			new LazyPromise('a');
		};

		expect(fn).to.throw(TypeError, 'Promise resolver string is not a function');
	})

	it('return a thenable', function()
	{
		var promise = new LazyPromise(function() {});

		expect(promise).to.have.property('then');
		expect(promise.then).to.be.a('function');
	});

	it('does not have any own properties', function()
	{
		var promise = new LazyPromise(function() {});

		expect(Object.getOwnPropertyNames(promise)).to.be.empty;
		expect(Object.getOwnPropertySymbols(promise)).to.be.empty;
	});
});

describe('thenable', function()
{
	it('is called asynchronously', function()
	{
		var promise = new LazyPromise(function(resolve) {
			resolve();
		})
		,spy = chai.spy();

		promise.then(spy);

		expect(spy).to.not.have.been.called();
	});

	it('returns promise', function()
	{
		var promise = new LazyPromise(function() {})
		,ret = promise.then();

		expect(ret).to.be.an.instanceof(Promise);
	});

	it('calls only success callback on success', function(done)
	{
		var promise = new LazyPromise(function(resolve, reject) {
			resolve();
		})
		,success = chai.spy()
		,failure = chai.spy();

		promise.then(success, failure);

		setTimeout(function()
		{
			expect(success).to.have.been.called.once();
			expect(failure).not.to.have.been.called();

			done();
		}, 20);
	});

	it('calls only failure callback on failure', function(done)
	{
		var promise = new LazyPromise(function(resolve, reject) {
			reject();
		})
		,success = chai.spy()
		,failure = chai.spy();

		promise.then(success, failure);

		setTimeout(function()
		{
			expect(success).not.to.have.been.called();
			expect(failure).to.have.been.called.once();

			done();
		}, 20);
	});

	it('passes value on success', function(done)
	{
		var value = {}
		,promise = new LazyPromise(function(resolve, reject) {
			resolve(value);
		});

		promise.then(function(param)
		{
			expect(param).to.be.equal(value);

			done();
		});
	});

	it('passes value on failure', function(done)
	{
		var value = {}
		,promise = new LazyPromise(function(resolve, reject) {
			reject(value);
		});

		promise.then(function() {},
		function(param)
		{
			expect(param).to.be.equal(value);

			done();
		});
	});
});

describe('factory callback', function()
{
	it('is not called when no action is taken', function(done)
	{
		var factory = chai.spy()
		,promise = new LazyPromise(factory);

		setTimeout(function()
		{
			expect(factory).not.have.been.called();

			done();
		}, 20);
	});

	it('is called when then is invoked', function(done)
	{
		var factory = chai.spy(function(resolve, reject)
		{
			resolve();
		})
		,promise = new LazyPromise(factory);

		promise.then(function() {});

		setTimeout(function()
		{
			expect(factory).to.have.been.called();

			done();
		}, 20);

	});

	it('is called only once', function(done)
	{
		var factory = chai.spy(function(resolve, reject)
		{
			resolve();
		})
		,promise = new LazyPromise(factory);

		promise.then(function() {});
		promise.then(function() {});

		setTimeout(function()
		{
			expect(factory).to.have.been.called.once();

			done();
		}, 20);
	});

	it('is called asynchronously', function()
	{
		var factory = chai.spy()
		,promise = new LazyPromise(factory);

		promise.then(function() {}, function() {});

		expect(factory).not.have.been.called();
	});
});
