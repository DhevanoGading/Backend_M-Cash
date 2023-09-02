module.exports = {
  responseTemplate: async (
    res,
    status,
    message,
    data,
    budgetInit = null,
    totalExpense = null,
    budgetRemaining = null
  ) => {
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

    const responseObj = {
      message,
      data: cleanedData || data,
    };

    if (
      budgetInit !== null ||
      totalExpense !== null ||
      budgetRemaining !== null
    ) {
      responseObj.budgetInit = budgetInit;
      responseObj.totalExpense = totalExpense;
      responseObj.budgetRemaining = budgetRemaining;
    }

    return res.status(status).json(responseObj);
  },
};
