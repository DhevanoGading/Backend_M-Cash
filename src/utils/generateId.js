module.exports = {
  generateId: async (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomId = "";

    for (let i = 0; i < length; i++) {
      randomId += characters[Math.floor(Math.random() * characters.length)];
    }

    return randomId;
  },
};
