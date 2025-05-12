"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsyncErrors = (theFunction) => (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
};
exports.default = catchAsyncErrors;
//# sourceMappingURL=catchAsyncErrors.js.map