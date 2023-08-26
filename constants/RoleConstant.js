const roles = {
    Owner: {
        "id": 1,
        "name": "Owner",
        "nameVi": "Chủ sở hữu",
        "description": "Owner toàn quyền",
        "status": "true",
        "content": "Owner",
        "is_default":"true",
        // "permission": [
        //     "view", "read", "export", "read_attachments", "export_data", "send_messages", "acknowledge_alarm", "edit_state"
        // ]
        "role_type_id": 1,
        "permission": [
            1, 2
        ]
    },
    Manage: {
        "id": 2,
        "name": "Manage",
        "nameVi": "Quản lý",
        "description": "Manage",
        "status": "true",
        "content": "Manage",
        "is_default":"true",
        "role_type_id":1
    },
    Admin: {
        "id": 3,
        "name": "Admin",
        "nameVi": "Quản trị viên",
        "description": "Admin of the system",
        "status": "true",
        "content": "Admin",
        "is_default":"true",
        "permission": [
            1, 2
        ],
        "role_type_id":2
    },
    Mentor: {
        "id": 4,
        "name": "Mentor",
        "nameVi": "Mentor tiếng Việt",
        "description": "Mentor",
        "status": "true",
        "content": "Mentor",
        "is_default":"true",
        "role_type_id":2
    },
    Mentee: {
        "id": 5,
        "name": "Mentee",
        "nameVi": "Mentee tiếng Việt",
        "description": "Mentee",
        "status": "true",
        "content": "Mentee",
        "is_default":"true",
        "role_type_id":2
    }
};
module.exports = roles;