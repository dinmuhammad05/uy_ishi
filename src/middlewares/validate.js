export const validate = (schemaValid) => {
    return function (req, res, next) {
        try {
            const schema = schemaValid();

            const { error } = schema.validate(req.body);

            if (error) {
                return res.status(422).json({
                    statusCode: 422,
                    message: error.details,
                });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error?.message,
            });
        }
    };
};
