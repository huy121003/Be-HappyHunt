const Policy = require('../models/policy');
const createAutoPolicyService = async () => {
  let policy = await Policy.create({});
};