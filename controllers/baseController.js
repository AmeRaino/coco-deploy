const AppError = require('../utils/appError');
const { to, ReE, ReS, TE } = require('../utils/util.service');
const contantStatus = require('../utils/util.helper');

exports.deleteOne = (Model) => async (req, res, next) => {
    try {
        let doc = await Model.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!doc) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        // res.status(204).json({
        //     status: 'success',
        //     data: null
        // });
        res.status(200).json({
            message: 'Xóa thành công',
            success: true
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOne = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.update(req.body, { where: { id: req.params.id } });

        if (doc == false) {
            return next(new AppError(404, 'fail', 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            message: 'Cập nhật thành công',
            success: true
            // data: await Model.findByPk(req.params.id)
        });
    } catch (error) {
        next(error);
    }
};

exports.createOne = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                doc
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getOne = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.findByPk(req.params.id);

        if (!doc) {
            return ReE(res, 'No document found with that id', 404, contantStatus.errorCode.NotFound);
        }
        return ReS(
            res,
            {
                data: doc
            },
            200
        );
    } catch (error) {
        next(error);
    }
};

exports.getAll = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.findAll();
        return ReS(
            res,
            {
                data: doc
            },
            200
        );
    } catch (error) {
        next(error);
    }
};
