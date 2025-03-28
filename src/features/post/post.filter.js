const exportFilter = (post) => {
  const priceFilter = {};
  if (post.minPrice !== undefined && post.minPrice !== null) {
    priceFilter.$gte = Number(post.minPrice);
  }
  if (post.maxPrice !== undefined && post.maxPrice !== null) {
    priceFilter.$lte = Number(post.maxPrice);
  }
  const filter = {
    ...(post.currentSlug && { slug: { $ne: post.currentSlug } }),
    ...(post.name?.trim() && {
      $or: [
        { $text: { $search: post.name.trim().replace(/\s+/g, ' ') } },
        { name: new RegExp(post.name, 'i') },
      ],
    }),
    ...(post.attribute &&
      post.attribute.length > 0 && {
        attributes: post.attribute.map((item) => ({
          $elemMatch: {
            name: item.name,
            value: item.value,
          },
        })),
      }),

    ...(post.address && {
      $or: [
        post.address.ward && {
          'address.ward': post.address.ward,
          'address.district': post.address.district,
          'address.province': post.address.province,
        },
        post.address.district && {
          'address.district': post.address.district,
          'address.province': post.address.province,
        },
        post.address.province && { 'address.province': post.address.province },
        {},
      ].filter(Boolean),
    }),
    ...(post.category && { category: post.category }),
    ...(post.categoryParent && { categoryParent: post.categoryParent }),
    ...(post.isIndividual && { isIndividual: post.isIndividual }),
    ...(post.statusAdmin && { status: post.statusAdmin }),
    ...(post.updatedBy && { updatedBy: post.updatedBy }),
    ...(post.createdBy && { createdBy: post.createdBy }),
    ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
    ...(post.status && {
      status: {
        $in:
          post.status === 'WAITING'
            ? ['WAITING', 'WAITING|AI_CHECKING_FAILED']
            : post.status === 'CHECKING'
              ? ['WAITING', 'WAITING|AI_CHECKING_FAILED', 'REJECTED']
              : [post.status],
      },
    }),
  };

  const sort = post.sort
    ? post.sort === 'relevance'
      ? post.name?.trim()
        ? { score: { $meta: 'textScore' } }
        : { createdAt: -1 }
      : post.sort === 'newest'
        ? { createdAt: -1 }
        : post.sort === 'lowest'
          ? { price: 1 }
          : post.sort === 'highest'
            ? { price: -1 }
            : { createdAt: -1 }
    : post.name?.trim()
      ? { score: { $meta: 'textScore' } }
      : { createdAt: -1 }; // Mặc định nếu không có text search

  return {
    ...filter,
    page: Number(post.page) || 0,
    size: Number(post.size) || 10,
    sort,
  };
};

module.exports = exportFilter;
