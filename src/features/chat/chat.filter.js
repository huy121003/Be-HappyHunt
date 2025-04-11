const exportFilter = (chat) => {
  const res = {
    page: chat.page ? Number(chat.page) : 0,
    size: chat.size ? Number(chat.size) : 10,
    sort: chat.sort || '-updatedAt',
  };

  if (chat.currentUser) {
    switch (chat.viewType) {
      case 'seller':
        res.seller = chat.currentUser;
        res.lastMessage = { $ne: null };
        break;

      case 'buyer':
        res.buyer = chat.currentUser;
        break;

      case 'notRead':
        res.$or = [{ seller: chat.currentUser }, { buyer: chat.currentUser }];
        res['lastMessage.status'] = 'SENT';
        res['lastMessage.sender'] = { $ne: chat.currentUser };
        res.lastMessage = { $ne: null };
        break;

      case 'all':
      default:
        res.$or = [
          { seller: chat.currentUser, lastMessage: { $ne: null } },
          { buyer: chat.currentUser },
        ];
        break;
    }
  }

  return res;
};

module.exports = exportFilter;
