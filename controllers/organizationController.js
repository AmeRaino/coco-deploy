const { Organization, User } = require('../models');
const base = require('./baseController');
const OrganizationConstant = require('../constants/OrganizationConstant');
const { to, ReE, ReS, TE } = require('../utils/util.service');
const util = require('util');
const fs = require('fs');
var Sequelize = require('sequelize');
const { Op } = require('sequelize');
const contantStatus = require('../utils/util.helper');

exports.createDefaultOrganizations = async () => {
    const organization = await Organization.findAll();
    if (organization.length == 0) {
        for (const [key, value] of Object.entries(OrganizationConstant)) {
            Organization.create(value);
        }
    }
    // if(organization.length == 0){
    //     OrganizationConstant.forEach(element => {
    //         Organization.create(element);
    //     });
    // }
};

exports.getAllOrganizations = async (req, res, next) => {
    try {
        let { page = 0, amount = 10, order = 'id', search = '', arrangement = 'ASC' } = req.query;
        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }
        if (order == '') {
            order = 'id';
        }
        if (order == 'count') {
            order = Sequelize.literal('count');
        }
        let count = await Organization.count({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        nameVi: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                ]
            },
            distinct: true,
            col: 'Organization.id'
        });
        let data = await Organization.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        nameVi: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                ]
            },
            subQuery: false,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id']
                }
            ],
            attributes: {
                include: [[Sequelize.fn('COUNT', Sequelize.col('user.id')), 'count']],
                exclude: ['description', 'email', 'phone', 'address', 'url_logo', 'user', 'createdAt', 'updatedAt']
            },
            limit: amount * 1,
            offset: page * amount,
            group: ['Organization.id'],
            order: [[order, arrangement]]
        });
        return ReS(
            res,
            {
                count,
                data: data
            },
            200
        );
    } catch (error) {
        next(error);
    }
};

exports.getOrganization = base.getOne(Organization);

exports.createOrganization = async (req, res, next) => {
    try {
        const files = req.files;
        const { name, nameVi, email, phone, address, description } = req.body;
        let urlLogo;
        if (!files[0]) {
            //nếu k có thì k cần create file name
            urlLogo = '';
        } else {
            urlLogo = 'public/avatars/' + files[0].filename;
        }

        var existName = await Organization.findOne({ where: { [Op.or]: [{ name: name }, { nameVi: nameVi }] } });
        // if (data.name != name && data.nameVi != nameVi) {
        //     existName = await Organization.findOne({ where: { [Op.or]: [{ name: name }, { nameVi: nameVi }], } });
        // } else if (data.name != name) {
        //     existName = await Organization.findOne({ where: { name: name } });
        // } else if (data.nameVi != nameVi) {
        //     existName = await Organization.findOne({ where: { nameVi: nameVi } });
        // }
        if (existName) {
            return ReE(res, 'Organization Exist', 400, contantStatus.errorCode.Exist);
        }

        var exist;
        if (email != undefined && phone != undefined && email != '')
            exist = await Organization.findOne({ where: { [Op.or]: [{ email: email }, { phone: phone }, { name: name }, { nameVi: nameVi }] } });
        else if (email != undefined && email != '')
            exist = await Organization.findOne({ where: { [Op.or]: [{ email: email }, { name: name }, { nameVi: nameVi }] } });
        else if (phone != undefined && phone != '')
            exist = await Organization.findOne({ where: { [Op.or]: [{ phone: phone }, { name: name }, { nameVi: nameVi }] } });

        if (exist) {
            return ReE(res, 'Organization Exist', 400, contantStatus.errorCode.Exist);
        }
        let data = await Organization.create({
            name,
            nameVi,
            email,
            description,
            status: true,
            phone,
            address,
            url_logo: urlLogo
        });
        if (data)
            return ReS(
                res,
                {
                    data
                },
                200
            );
        else {
            if (urlLogo != '') deleteFile(urlLogo);
            return ReE(res, 'Tạo k thành công', 400, contantStatus.errorCode.Exception);
        }
    } catch (error) {
        //nếu mà k thành công thì xóa hình.
        const files = req.files;
        if (files[0]) {
            urlLogo = 'public/avatars/' + files[0].filename;
            deleteFile(urlLogo);
        }
        next(error);
    }
};

exports.deleteOrganization = async (req, res, next) => {
    try {
        let data = await Organization.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id']
                }
            ],
            attributes: {
                include: [[Sequelize.fn('COUNT', Sequelize.col('user.id')), 'count']],
                exclude: ['user', 'createdAt', 'updatedAt']
            }
        });
        if (data.id == null) {
            return ReE(res, 'Organization not found', 404, contantStatus.errorCode.NotFound);
        }
        if (data.dataValues.count > 0) {
            return ReE(res, 'dont delete', 405, contantStatus.errorCode.CanNot);
        }
        let urlLogo = data.url_logo;
        let checkdelete = await Organization.destroy({
            where: { id: req.params.id }
        });
        if (checkdelete) {
            if (urlLogo) deleteFile(urlLogo);
            return ReS(
                res,
                {
                    message: 'Xóa thành công'
                },
                200
            );
        }

        return ReE(res, 'Xóa không thành công', 404, contantStatus.errorCode.NotFound);
    } catch (error) {
        next(error);
    }
};

exports.updateOrganization = async (req, res, next) => {
    try {
        const files = req.files;
        const { name, nameVi, email, phone, address, description, url_logo } = req.body;
        const data = await Organization.findByPk(req.params.id);
        if (!data) {
            return ReE(res, 'Organization not found', 404, contantStatus.errorCode.NotFound);
        }

        var existName;
        if (data.name != name && data.nameVi != nameVi) {
            existName = await Organization.findOne({ where: { [Op.or]: [{ name: name }, { nameVi: nameVi }] } });
        } else if (data.name != name) {
            existName = await Organization.findOne({ where: { name: name } });
        } else if (data.nameVi != nameVi) {
            existName = await Organization.findOne({ where: { nameVi: nameVi } });
        }
        if (existName) {
            return ReE(res, 'Organization Exist', 400, contantStatus.errorCode.Exist);
        }

        var exist;
        if (data.email != email && data.phone != phone) {
            exist = await Organization.findOne({ where: { [Op.or]: [{ email: email }, { phone: phone }] } });
        } else if (data.email != email) {
            exist = await Organization.findOne({ where: { email: email } });
        } else if (data.phone != phone) {
            exist = await Organization.findOne({ where: { phone: phone } });
        }

        if (exist) {
            return ReE(res, 'Organization Exist', 400, contantStatus.errorCode.Exist);
        }
        let urlLogo;
        if (!files[0]) {
            if (url_logo)
                // k có fil mới, có logo thì lấy logo cũ.
                urlLogo = data.dataValues.url_logo;
            else {
                if (data.dataValues.url_logo) {
                    deleteFile(data.dataValues.url_logo);
                }
                urlLogo = '';
            }
        } else {
            if (data.dataValues.url_logo) {
                deleteFile(data.dataValues.url_logo);
            }
            urlLogo = 'public/avatars/' + files[0].filename;
        }

        data.name = name;
        data.nameVi = nameVi;
        data.email = email;
        data.description = description;
        data.phone = phone;
        data.address = address;
        data.url_logo = urlLogo;
        let check = await data.save();
        if (check)
            return ReS(
                res,
                {
                    data
                },
                200
            );
    } catch (error) {
        //nếu mà k thành công thì xóa hình.
        const files = req.files;
        if (files[0]) {
            urlLogo = 'public/avatars/' + files[0].filename;
            deleteFile(urlLogo);
        }
        next(error);
    }
};

const deleteFile = (files) => {
    const unlink = util.promisify(fs.unlink);
    if (fs.existsSync(files)) {
        return unlink(files);
    }
    return true;
};
