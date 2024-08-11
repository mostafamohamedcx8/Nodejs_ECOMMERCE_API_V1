const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.DeletOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    // Trigger "remove" event when update document
    await document.deleteOne();
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    // Trigger "save" event when update document
    document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const Document = await Model.create(req.body);
    res.status(201).json({ data: Document });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    const Document = await query;
    if (!Document) {
      return next(new ApiError(`No Document for this id ${id}`, 404));
    }
    res.status(200).json({ data: Document });
  });

exports.getAll = (Model, modelName = " ") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const countDocuments = await Model.countDocuments();
    const apifeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .paginate(countDocuments)
      .sort()
      .Limitfields()
      .search(modelName);
    // excute query
    const { paginationresults, mongooseQuery } = apifeatures;
    const Documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: Documents.length, paginationresults, data: Documents });
  });
