const exportFilter = (evaluate) => {
  console.log(evaluate);
  const res = {
    ...(evaluate.page ? { page: Number(evaluate.page) } : { page: 0 }),
    ...(evaluate.size ? { size: Number(evaluate.size) } : { size: 10 }),
    ...(evaluate.sort ? { sort: evaluate.sort } : { sort: '-createdAt' }),
    ...(evaluate.star && { star: evaluate.star }),
    ...(evaluate.isSeller !== undefined && {
      isSeller:
        evaluate.isSeller === 'buyer'
          ? { $ne: true }
          : evaluate.isSeller === 'seller'
            ? { $eq: true }
            : undefined,
    }),
    ...(evaluate.target && { target: evaluate.target }),
    ...(evaluate.post && { post: evaluate.post }),
    ...(evaluate.createdBy && { createdBy: evaluate.createdBy }),
    ...(evaluate.updatedBy && { updatedBy: evaluate.updatedBy }),
  };
  return res;
};
module.exports = exportFilter;
