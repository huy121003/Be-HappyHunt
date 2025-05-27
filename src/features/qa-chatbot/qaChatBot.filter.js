const exportFilter = (data) => {
  return {
    ...(data.page ? { page: Number(data.page) } : { page: 0 }),
    ...(data.size ? { size: Number(data.size) } : { size: 10 }),
    ...(data.sort ? { sort: data.sort } : { sort: '-createdAt' }),
    ...(data.question && { question: new RegExp(data.question, 'i') }),
    ...(data.answer && { answer: new RegExp(data.answer, 'i') }),
  };
};
module.exports = exportFilter;
