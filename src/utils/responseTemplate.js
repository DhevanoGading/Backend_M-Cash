module.exports = {
  responseTemplate: async (res, status, message, data) => {
    let cleanedData = null;

    if (Array.isArray(data) && data.length > 0) {
      cleanedData = data.map((clean) => {
        delete clean["$permissions"];
        delete clean["$collectionId"];
        delete clean["$databaseId"];
        return clean;
      });
    } else if (typeof data === "object" && data !== null) {
      cleanedData = { ...data };
      delete cleanedData["$permissions"];
      delete cleanedData["$collectionId"];
      delete cleanedData["$databaseId"];
    }

    return res.status(status).json({
      message,
      data: cleanedData || data,
    });
  },
};
