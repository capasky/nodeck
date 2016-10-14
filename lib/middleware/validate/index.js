/**
 * 模型验证中间件
 * @author capasky
 */

module.exports = options => {
    return function validate(ctx, next) {
        return next();
    }
};
