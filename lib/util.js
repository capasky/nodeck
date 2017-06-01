/**
 * Check if `obj` is a promise.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

const isPromise = exports.isPromise = function isPromise(obj) {
  return 'function' == typeof obj.then;
};

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

const isGenerator = exports.isGenerator = function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
};

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

const isGeneratorFunction = exports.isGeneratorFunction = function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
};