const paginate = (model) => {
  model.paginate = async function (filter = {}, options = {}) {
    const sort = options.sortBy || "createdAt";
    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;
    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;
    const offset = (page - 1) * limit;

    let order;
    if (Array.isArray(options.order)) {
      order = options.order;
    } else {
      const sort = options.sortBy || "createdAt";
      order = [[sort, "ASC"]];
    }

    const findOptions = {
      where: filter,
      limit,
      offset,
      order,
    };

    if (options.include) {
      findOptions.include = options.include;
    }

    const countPromise = model.count({ where: filter });
    const docsPromise = model.findAll(findOptions);

    const [totalResults, results] = await Promise.all([
      countPromise,
      docsPromise,
    ]);

    const totalPages = Math.ceil(totalResults / limit);
    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
  };
};

module.exports = paginate;