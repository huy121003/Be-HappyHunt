const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const bcrypt = require('bcrypt');
const accountSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      default: '',
      trim: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: { type: String, required: true },
    isBanned: { type: Boolean, default: true },
    avatar: { type: String, default: '' },
    isVip: { type: Boolean, default: false },
    dateVipExpired: { type: String, default: null },
    address: {
      province: { type: Number, ref: 'province', default: null },
      district: { type: Number, ref: 'district', default: null },
      ward: { type: Number, ref: 'ward', default: null },
      specificAddress: { type: String, default: '' },
    },
    slug: { type: String, unique: true, default: '', trim: true },
    role: { type: Number, ref: 'role', default: null },
    description: { type: String, default: '' },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, accountSchema, 'account');
accountSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Account = model('account', accountSchema);

// const createAccount = async () => {
//   await Account.insertMany([
//     {
//       _id: 3,
//       name: 'Nguyen Van A',
//       username: 'nguyen.a123',
//       phoneNumber: '0987654321',
//       password: await bcrypt.hash('123@123a', 10),
//       avatar: 'https://picsum.photos/200/200?random=1',
//       isVip: true,
//       address: {
//         province: 1,
//         district: 1,
//         ward: 1,
//         specificAddress: '123 Nguyen Luong Bang',
//       },
//       description: 'Toi yeu lap trinh.',
//     },
//     {
//       _id: 4,
//       name: 'Tran Thi B',
//       username: 'tran.b87',
//       phoneNumber: '0971112233',
//       password: await bcrypt.hash('123@123a', 10),
//       avatar: 'https://picsum.photos/200/200?random=2',
//       isVip: false,
//       address: {
//         province: 2,
//         district: 3,
//         ward: 5,
//         specificAddress: '456 Le Loi',
//       },
//       description: 'Cuoc song la mot hanh trinh.',
//     },
//     {
//       _id: 5,
//       name: 'Le Van C',
//       username: 'le.c56',
//       phoneNumber: '0969998887',
//       password: await bcrypt.hash('123@123a', 10),
//       avatar: 'https://picsum.photos/200/200?random=3',
//       isVip: true,
//       address: {
//         province: 3,
//         district: 2,
//         ward: 4,
//         specificAddress: '789 Tran Hung Dao',
//       },
//       description: 'Lap trinh la dam me.',
//     },
//     {
//       _id: 6,
//       name: 'Pham Thi D',
//       username: 'pham.d21',
//       phoneNumber: '0958887776',
//       password: await bcrypt.hash('123@123a', 10),
//       avatar: 'https://picsum.photos/200/200?random=4',
//       isVip: false,
//       address: {
//         province: 4,
//         district: 1,
//         ward: 2,
//         specificAddress: '159 Nguyen Hue',
//       },
//       description: 'Song cham de yeu thuong.',
//     },
//     {
//       _id: 7,
//       name: 'Hoang Van E',
//       username: 'hoang.e99',
//       phoneNumber: '0947776665',
//       password: await bcrypt.hash('123@123a', 10),
//       avatar: 'https://picsum.photos/200/200?random=5',
//       isVip: true,
//       address: {
//         province: 5,
//         district: 2,
//         ward: 3,
//         specificAddress: '951 Pham Van Dong',
//       },
//       description: 'Cham chi tao nen thanh cong.',
//     },
//     {
//       _id: 8,
//       name: 'Dang Thi F',
//       username: 'dang.f44',
//       phoneNumber: '0936665554',
//       password: await bcrypt.hash('123@123a', 10),
//       avatar: 'https://picsum.photos/200/200?random=6',
//       isVip: false,
//       address: {
//         province: 6,
//         district: 3,
//         ward: 1,
//         specificAddress: '753 Hoang Dieu',
//       },
//       description: 'Han phuc don gian la duoc yeu thuong.',
//     },
//     {
//       _id: 9,
//       name: 'Bui Van G',
//       username: 'bui.g88',
//       phoneNumber: '0925554443',
//       password: await bcrypt.hash('123@123a', 10),
//       avatar: 'https://picsum.photos/200/200?random=7',
//       isVip: true,
//       address: {
//         province: 7,
//         district: 1,
//         ward: 5,
//         specificAddress: '357 Vo Thi Sau',
//       },
//       description: 'Giac mo thanh hien thuc.',
//     },
//     {
//       _id: 10,
//       name: 'Vo Thi H',
//       username: 'vo.h77',
//       phoneNumber: '0914443332',
//       password: await bcrypt.hash('123@123a', 10),
//       avatar: 'https://picsum.photos/200/200?random=8',
//       isVip: false,
//       address: {
//         province: 8,
//         district: 4,
//         ward: 3,
//         specificAddress: '258 Ly Thuong Kiet',
//       },
//       description: 'Hen gap lai vao mot ngay dep troi.',
//     },
//   ]);
// };
// createAccount();
module.exports = Account;
