const { Post } = require('../../models'); // Giả sử bạn đã định nghĩa model Post

const exportFilter = async (post) => {
  // Hàm tạo truy vấn tìm kiếm thông minh
  const createSmartSearchQuery = (searchTerm) => {
    if (!searchTerm) return null;
    const terms = searchTerm
      .trim()
      .split(/\s+/)
      .filter((term) => term.length > 0);
    if (terms.length === 0) return null;

    return {
      $and: terms.map((term) => ({
        name: {
          $regex: term
            .split('')
            .map((char) => `[${char}]?`)
            .join('[-\\s]?'),
          $options: 'i',
        },
      })),
    };
  };

  // Hàm tạo gợi ý dựa trên input
  const generateSuggestions = async (searchTerm) => {
    if (!searchTerm) return [];

    // Tìm các bài đăng chứa searchTerm trong name
    const posts = await Post.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).limit(10); // Giới hạn 10 kết quả để tối ưu hiệu suất

    // Trích xuất các từ khóa liên quan từ name
    const suggestions = new Set();
    posts.forEach((post) => {
      const words = post.name.toLowerCase().split(/\s+/);
      words.forEach((word) => {
        if (word.includes(searchTerm.toLowerCase())) {
          // Tạo gợi ý dựa trên các cụm từ chứa searchTerm
          const index = words.indexOf(word);
          if (index > 0) {
            suggestions.add(`${words[index - 1]} ${word}`); // Từ trước + từ hiện tại
          }
          if (index < words.length - 1) {
            suggestions.add(`${word} ${words[index + 1]}`); // Từ hiện tại + từ sau
          }
          suggestions.add(word); // Từ đơn lẻ
        }
      });
    });

    return Array.from(suggestions).slice(0, 5); // Trả về tối đa 5 gợi ý
  };

  // Tạo filter cơ bản
  const filter = {
    ...(post.page ? { page: Number(post.page) } : { page: 0 }),
    ...(post.size ? { size: Number(post.size) } : { size: 10 }),
    ...(post.sort ? { sort: post.sort } : { sort: '-createdAt' }),
    ...(post.name && {
      name: { $regex: post.name, $options: 'i' },
    }),
    ...(post.p && createSmartSearchQuery(post.p)),
    ...(post.status && {
      status: {
        $in:
          post.status === 'WAITING'
            ? ['WAITING', 'WAITING|AI_CHECKING_FAILED']
            : post.status,
      },
    }),
    ...(post.updatedBy && { updatedBy: post.updatedBy }),
    ...(post.createdBy && { createdBy: post.createdBy }),
  };

  // Nếu có post.p, thêm gợi ý
  let suggestions = [];
  if (post.p) {
    suggestions = await generateSuggestions(post.p);
  }

  return { filter, suggestions };
};

module.exports = exportFilter;
