const { to, ReE, ReS } = require('../utils/util.service');
const { User, AccountRequest, Organization } = require('../models');
const contantStatus = require('../utils/util.helper');
const semail = require('../lib/email');
const base = require('./baseController');
const CONFIG = require('../config/config');
const { Op } = require('sequelize');
const sendSms = require('../lib/sms');
const i18n = require('i18n');

exports.getAllAccountRequest = async (req, res, next) => {
    try {
        let { page = 0, amount = 10, order = 'id', search = '', arrangement = 'ASC', type, status } = req.query;
        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }
        if (order == '') {
            order = 'id';
        }
        let filterType = undefined,
            filterStatus = undefined;
        if (type != undefined && type != '') {
            filterType = {
                partnerMemberAccess: type
            };
        }
        if (status != undefined && status != '') {
            filterStatus = {
                status: status
            };
        }
        let data = await AccountRequest.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        fullname: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        email: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        phone: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        organization: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                ],
                [Op.and]: [filterType, filterStatus]
            },
            subQuery: false,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            limit: amount * 1,
            offset: page * amount,
            order: [[order, arrangement]]
        });
        return ReS(
            res,
            {
                count: data.count,
                data: data.rows
            },
            200
        );
    } catch (error) {
        next(error);
    }
};

exports.getOne = base.getOne(AccountRequest);

exports.actionStatus = async (req, res, next) => {
    try {
        let { role_id, organization_id, status, trial } = req.body;
        if (!status) {
            return ReE(res, 'Data null', 400, contantStatus.errorCode.DataNull);
        }
        //Status: 1 new, 2 approve, 3 reject
        if (status == 2) {
            if (!role_id) {
                return ReE(res, 'Bạn thiếu role_id', 400, contantStatus.errorCode.DataNull);
            }
            if (!organization_id) {
                return ReE(res, 'Bạn thiếu organization_id', 400, contantStatus.errorCode.DataNull);
            }
            let fountOrganization = await Organization.findByPk(organization_id);
            if (!fountOrganization) return ReE(res, 'Organization not found', 404, contantStatus.errorCode.NotFound);
        }
        let data = await AccountRequest.findByPk(req.params.id);
        if (!data) {
            return ReE(res, 'Account not found', 404, contantStatus.errorCode.NotFound);
        }
        if (data.status == 2 || data.status == 3) {
            return ReE(res, 'Account confirmed', 404, contantStatus.errorCode.InvalidData);
        }
        data.status = status;
        data.save();
        if (status == 2) {
            const userExist = await User.findOne({ where: { username: data.username } });
            if (userExist) {
                return ReE(res, 'Tài khoản đã tồn tại', 400, contantStatus.errorCode.Exist);
            }
        }
        let organization = await Organization.findByPk(req.user.organization_id);
        let organizationName = {
            en: organization.name,
            vi: organization.nameVi
        };
        if (isNaN(data.username)) {
            //k phải sđt, là email
            if (status == 2) {
                //status 2 approve
                let callFunc = 'templateEmail.ContentApproveAccount_' + data.language;
                to(
                    semail.sendMail({
                        to: data.email,
                        // from: 'Coco <conmeocon3600@zohomail.com>',
                        subject: '<' + organizationName[data.language] + '> ' + i18n.__({ phrase: 'Subject Approve Email', locale: data.language }),
                        body: eval(callFunc)(data.fullname, CONFIG.host_ui, organizationName[data.language])
                    })
                );
            } else if (status == 3) {
                //status 3 reject
                let callFunc = 'templateEmail.ContentRejectAccount_' + data.language;
                to(
                    semail.sendMail({
                        to: data.email,
                        // from: 'Coco <conmeocon3600@zohomail.com>',
                        subject: i18n.__({ phrase: 'Subject Reject Account Email', locale: data.language }),
                        body: eval(callFunc)(data.fullname, organization.name)
                    })
                );
            }
            // if (err) return ReE(res, err, 400, contantStatus.errorCode.Exception)
            return ReS(
                res,
                {
                    message: 'Gửi mail thành công, vui lòng kiểm tra email'
                },
                200
            );
        } else {
            // let err = {};
            // let errSendSMS = {}, checkSendSMS = {};
            let [err, dataToken] = await to(sendSms.getTokenSMS());
            if (err) return ReE(res, 'Err get token send sms', 400, contantStatus.errorCode.Exception);
            let toPhone = data.phone;

            if (status == 2) {
                //status 2 approve
                let callFunc = 'templateSMS.ContentApproveAccount_' + data.language;
                let content = eval(callFunc)(data.fullname, CONFIG.host_ui, organization.name);
                to(
                    sendSms.sendSMS({
                        access_token: dataToken.access_token,
                        phone: toPhone,
                        message: content
                    })
                );
            } else if (status == 3) {
                //status 3 reject
                let callFunc = 'templateSMS.ContentRejectAccount_' + data.language;
                let content = eval(callFunc)(data.fullname, organization.name);
                to(
                    sendSms.sendSMS({
                        access_token: dataToken.access_token,
                        phone: toPhone,
                        message: content
                    })
                );
            }
            // if (errSendSMS) return ReE(res, err, 400, contantStatus.errorCode.Exception)
            return ReS(
                res,
                {
                    message: 'Gửi sms thành công, vui lòng kiểm tra sms'
                },
                200
            );
        }
    } catch (error) {
        next(error);
    }
};
