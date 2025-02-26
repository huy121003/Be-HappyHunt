// const createCategory = (req, res, next) => {
//   const { name, attributes, url, icon, keywords } = req.body;
//   if (!name || !attributes || !url || !keywords) {
//     return sendValidationError(res, 'Thông tin không được để trống');
//   }
//   if (!icon && (!req.files || Object.keys(req.files).length === 0)) {
//     return sendValidationError(res, 'Icon không được để trống');
//   }
//   next();
// };
// const fetchCategoryById = (req, res, next) => {
//   const { id } = req.params;
//   if (!id) {
//     return sendValidationError(res, 'Id không được để trống');
//   }
//   next();
// };
// const updateCategory = (req, res, next) => {
//   const { id } = req.params;
//   if (!id) {
//     return sendValidationError(res, 'Id không được để trống');
//   }
//   const { name, attributes, url, icon, keywords } = req.body;
//   if (!icon && (!req.files || Object.keys(req.files).length === 0)) {
//     return sendValidationError(res, 'Icon không được để trống');
//   }
//   if (!name || !attributes || !url || !keywords) {
//     return sendValidationError(res, 'Thông tin không được để trống');
//   }
//   console.log(req.files);
//   next();
// };
// const deleteCategory = (req, res, next) => {
//   const { id } = req.params;
//   if (!id) {
//     return sendValidationError(res, 'Id không được để trống');
//   }
//   next();
// };

// module.exports = {
//   createCategory,
//   fetchCategoryById,
//   updateCategory,
//   deleteCategory,
// };
