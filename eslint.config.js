const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: ['node_modules', 'dist', 'coverage'], // Bỏ qua các thư mục không cần kiểm tra
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier
      'prettier/prettier': 'auto',

      // Cơ bản
      'semi': ['error', 'always'], // Bắt buộc dấu chấm phẩy
      'quotes': ['error', 'single'], // Dấu nháy đơn
      'indent': ['error', 2], // Thụt lề 2 khoảng trắng
      'no-trailing-spaces': 'error', // Không cho phép khoảng trắng thừa

      // Hiệu năng và logic
      'no-duplicate-imports': 'error', // Không cho phép import trùng lặp
      'prefer-template': 'error', // Sử dụng template string thay vì nối chuỗi

      // Bảo mật
      'no-eval': 'error', // Cấm sử dụng eval
      'default-case': 'error', // Yêu cầu có default trong switch

      // Hàm và biến
      'arrow-parens': ['error', 'always'], // Arrow function luôn cần ngoặc
      'no-param-reassign': 'error', // Không ghi đè tham số hàm

      // Clean code
      'array-callback-return': 'error', // Bắt buộc có return trong callback
      'no-else-return': 'error', // Không cần else nếu return ở trên
      'no-multi-spaces': 'error', // Không cho phép nhiều khoảng trắng

    },
  },
];
