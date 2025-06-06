const sortCategory = (favoritePost, categorySuggestions) => {
  const seen = new Set();
  const result = [];

  const newCategorySuggestions = favoritePost.concat(categorySuggestions);

  newCategorySuggestions.forEach((item) => {
    if (!item) return; // Bỏ qua item null hoặc undefined
    const { category, categoryParent } = item;
    const parent = categoryParent ? String(categoryParent) : 'unknown';
    const key = category ? `${parent}-${String(category)}` : parent;

    if (!seen.has(key)) { 
      seen.add(key);
      result.push({
        category: category || null,
        categoryParent: categoryParent || 'unknown',
      });
    }
  });

  return result;
};

module.exports = { sortCategory };
