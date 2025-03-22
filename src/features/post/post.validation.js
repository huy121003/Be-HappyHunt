const { apiHandler } = require('../../helpers');
const configs = require('../../helpers/constant');
const { Post, Account } = require('../../models');

const create = async (req, res, next) => {
  const [fetchUser, postbyUser] = await Promise.all([
    Account.findById(req.userAccess._id),
    Post.countDocuments({
      createdBy: req.userAccess._id,
      status: {
        $in: ['WAITING', 'SELLING', 'WAITING|AI_CHECKING_FAILED'],
      },
    }),
  ]);
  if (!fetchUser)
    return apiHandler.sendNotFound(
      res,
      'Something went wrong, please try again later'
    );
  if (
    (fetchUser.isVip && postbyUser >= configs.postVip) ||
    (!fetchUser.isVip && postbyUser >= configs.postNormal)
  )
    return fetchUser.isVip
      ? apiHandler.sendValidationError(
          res,
          'You can only create 60 posts at the same time'
        )
      : apiHandler.sendValidationError(
          res,
          'You can only create 20 posts at the same time, please upgrade to VIP to create more posts'
        );

  next();
};
module.exports = {
  create,
};
