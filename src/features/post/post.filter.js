const parseAttributes = (attributes) => {
  return (
    attributes?.map((attr) => {
      const [name, value] = attr.split(':');
      return { name, value };
    }) || []
  );
};

const createPriceFilter = (minPrice, maxPrice) => {
  const filter = {};
  if (minPrice !== undefined && minPrice !== null) {
    filter.$gte = Number(minPrice);
  }
  if (maxPrice !== undefined && maxPrice !== null) {
    filter.$lte = Number(maxPrice);
  }
  return Object.keys(filter).length > 0 ? { price: filter } : {};
};

const createAddressFilter = (ward, district, province, filterType) => {
  const conditions = [];
  if (ward) {
    conditions.push({
      'address.ward': Number(ward),
      'address.district': Number(district),
      'address.province': Number(province),
    });
  }
  if (district) {
    conditions.push({
      'address.district': Number(district),
      'address.province': Number(province),
    });
  }
  if (province) {
    conditions.push({ 'address.province': Number(province) });
  }
  if (filterType === 'suggest') {
    conditions.push({});
  }
  return conditions;
};

const createSort = (sortType, isTextSearch) => {
  if (!sortType)
    return isTextSearch ? { score: { $meta: 'textScore' } } : { createdAt: -1 };

  const sortOptions = {
    relevance: isTextSearch && { score: { $meta: 'textScore' } },
    newest: { createdAt: -1 },
    lowest: { price: 1 },
    highest: { price: -1 },
  };

  return sortOptions[sortType] || { createdAt: -1 };
};

const exportFilter = (post) => {
  const isTextSearch = post.q?.trim();
  const parsedAttributes = parseAttributes(post.attribute);
  const priceFilter = createPriceFilter(post.minPrice, post.maxPrice);
  const addressFilter = createAddressFilter(
    post.ward,
    post.district,
    post.province,
    post.filterType
  );
  const sort = createSort(post.sort, isTextSearch);

  const filter = {
    ...(post.currentSlug && { slug: { $ne: post.currentSlug } }),

    ...(post.q?.trim() && {
      $text: {
        $search: post.q?.trim(),
        $caseSensitive: false,
        $diacriticSensitive: false,
      },
    }),

    ...(parsedAttributes.length > 0 && {
      attributes: {
        $all: parsedAttributes.map(({ name, value }) => ({
          $elemMatch: {
            name,
            value: { $in: [value, String(value), Number(value)] },
          },
        })),
      },
    }),
    ...(addressFilter.length > 0 && { $or: addressFilter }),
    ...(post.category && { category: post.category }),
    ...(post.categoryParent && { categoryParent: post.categoryParent }),
    ...(post.isIndividual && { isIndividual: post.isIndividual }),
    ...(post.statusAdmin && { status: post.statusAdmin }),
    ...(post.updatedBy && { updatedBy: post.updatedBy }),
    ...(post.createdBy && { createdBy: post.createdBy }),
    ...(post.isSold && { isSold: post.isSold }),
    ...priceFilter,
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

  return {
    ...filter,
    page: Number(post.page) || 0,
    size: Number(post.size) || 10,
    sort,
  };
};

module.exports = exportFilter;
