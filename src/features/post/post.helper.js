const sortCategory = (favoritePost, categorySuggestions) => {
  const categoryCount = new Map();

  const newCategorySuggestions = favoritePost.concat(categorySuggestions);

  newCategorySuggestions.forEach((item) => {
    if (!item) return; // Skip null or undefined items
    const { category, categoryParent } = item;
    const parent = categoryParent ? String(categoryParent) : 'unknown';
    const key = category ? `${parent}-${String(category)}` : parent;
    categoryCount.set(key, (categoryCount.get(key) || 0) + 1);
  });

  // Sắp xếp theo số lần xuất hiện
  return [...categoryCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => {
      const parts = key.split('-');
      const categoryParent = parts[0];
      const category = parts.length > 1 ? parts.slice(1).join('-') : null;
      return { category, categoryParent };
    });
};

module.exports = { sortCategory };
