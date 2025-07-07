const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).json({ message });
};

const createError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

const errorHandling = (funct) => {
    return (req, res, next) => {
        funct(req, res, next).catch((err) => next(err));
    };
};

module.exports = {
    errorMiddleware,
    createError,
    errorHandling,
};
