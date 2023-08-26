var Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { to, ReE, ReS, TE } = require('../utils/util.service');
const {
    Role,
    Permission,
    RolePermissions,
    Course,
    CourseReviewSuggestionTag,
    UserReviewSuggestionTag,
    MentorRegistrationStatus,
    Province,
    District,
    Ward
} = require('../models');
const RoleConstant = require('../constants/RoleConstant');
const MentorRegistrationStatusConstant = require('../constants/MentorRegistrationStatusConstant');
const RolePermissionTypeConstant = require('../constants/RolePermissionTypeConstant');
const PermissionSysConstant = require('../constants/PermissionSysConstant');
const InitTempConstant = require('../constants/InitTempConstant');
const reader = require('xlsx');
// const file = reader.readFile(__dirname + '/MaTinh3.xlsx');

exports.createDefaultCourse = async () => {
    // console.log("getDataProvinceFromExcel", getDataProvinceFromExcel())
    // const dataProvince = await Province.findAll();
    // if (dataProvince.length == 0) {
    // let dataExcel = getDataProvinceFromExcel()
    // dataExcel.province.forEach(element => {
    //     Province.create({
    //         id: element.code,
    //         name_vi: element.textVi,
    //         name_en: element.textEn
    //     });
    // });

    // dataExcel.district.forEach(element => {
    //     District.create({
    //         id: element.code*1,
    //         name_vi: element.textVi,
    //         name_en: element.textEn,
    //         province_id:element.codeTinh*1
    //     });
    // });
    // dataExcel.ward.forEach(element => {
    //     if(element.code*1>29932)
    //     Ward.create({
    //         id: element.code*1,
    //         name_vi: element.textVi,
    //         name_en: element.textEn,
    //         district_id:element.codeHuyen*1
    //     });
    // });
    // }
    const role = await Course.findAll();
    if (role.length == 0) {
        for (const [key, value] of Object.entries(InitTempConstant.course)) {
            Course.create(value);
        }
    }

    const dataCourseReviewSuggestionTag = await CourseReviewSuggestionTag.findAll();
    if (dataCourseReviewSuggestionTag.length == 0) {
        for (const [key, value] of Object.entries(InitTempConstant.course_review_suggestion_tag)) {
            CourseReviewSuggestionTag.create(value);
        }
    }

    const dataUserReviewSuggestionTag = await UserReviewSuggestionTag.findAll();
    if (dataUserReviewSuggestionTag.length == 0) {
        for (const [key, value] of Object.entries(InitTempConstant.user_review_suggestion_tag)) {
            UserReviewSuggestionTag.create(value);
        }
    }

    const dataMentorRegistrationStatus = await MentorRegistrationStatus.findAll();
    if (dataMentorRegistrationStatus.length == 0) {
        for (const [key, value] of Object.entries(MentorRegistrationStatusConstant)) {
            MentorRegistrationStatus.create(value);
        }
    }
    // const rolePermissionType = await RolePermissionType.findAll();
    // if (rolePermissionType.length == 0) {
    //     for (const [key, value] of Object.entries(RolePermissionTypeConstant)) {
    //         RolePermissionType.create(value);
    //     }
    // }

    // const rolePermissionSys = await PermissionSys.findAll();
    // if (rolePermissionSys.length == 0) {
    //     for (const [keyRole, valueRole] of Object.entries(PermissionSysConstant)) {
    //         for (const [key, value] of Object.entries(valueRole)) {
    //             PermissionSys.create(value);
    //         }
    //         // PermissionSys.create(value);
    //     }
    // }
};

function getDataProvinceFromExcel() {
    console.log('getDataProvinceFromExcel');
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[3]]);
    let matinh = 0,
        mahuyen = 0,
        maphuong = 0;
    let dataTinh = [],
        dataHuyen = [],
        dataPhuong = [],
        data = [];
    temp.forEach((res) => {
        if (res['Mã tỉnh'] != matinh) {
            dataTinh.push({
                code: res['Mã tỉnh'],
                textVi: res['Tên Tỉnh'],
                textEn: res['City']
            });
            matinh = res['Mã tỉnh'];
        }
        if (res['Mã huyện'] != mahuyen) {
            dataHuyen.push({
                code: res['Mã huyện'],
                textVi: res['Tên Huyện'],
                textEn: res['District'],
                codeTinh: res['Mã tỉnh']
            });
            mahuyen = res['Mã huyện'];
        }
        if (res['Mã Phường/Xã/TT'] != maphuong) {
            dataPhuong.push({
                code: res['Mã Phường/Xã/TT'],
                textVi: res['Tên Phường/Xã/TT'],
                textEn: res['Ward'],
                codeHuyen: res['Mã huyện']
            });
            maphuong = res['Mã Phường/Xã/TT'];
        }
    });
    // console.log("data---",data)
    // console.log("dataTinh---",dataTinh)
    // console.log("dataHuyen---",dataHuyen)
    return { province: dataTinh, district: dataHuyen, ward: dataPhuong };
}
