module.exports = {
  responseTemplate: async (res, status, message, data) => {
    delete data["$permissions"];
    delete data["$collectionId"];
    delete data["$databaseId"];

    return res.status(status).json({
      message,
      data,
    });
  },
};
