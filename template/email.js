exports.ContentAccountRequest_en = (fullname) => {
    return (
        '<p>This email is intended for ' +
        fullname +
        '</p>' +
        '<p>Your account request is being processed.</p>' +
        '<p>If you need assistance, please contact us at <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Best Regards,<br>Coco.'
    );
};

exports.ContentAccountRequest_vi = (fullname) => {
    return (
        '<p>Email này được gửi đến cho ' +
        fullname +
        '</p>' +
        '<p>Yêu cầu tạo tài khoản của bạn đang trong quá trình được phê duyệt.</p>' +
        '<p>Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Trân Trọng,<br>Coco.'
    );
};

exports.ContentActiveAccount_en = (fullname, link, codeOtp) => {
    return (
        '<p>This email is intended for ' +
        fullname +
        '</p>' +
        '<p>Your account is created. Please <a href=' +
        link +
        '>click here to active your account.</a></p>' +
        '<p>OTP for mobile: ' +
        codeOtp +
        '</p>' +
        '<p>If you need assistance, please contact us at <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Best Regards,<br>Coco.'
    );
};

exports.ContentActiveAccount_vi = (fullname, link, codeOtp) => {
    return (
        '<p>Xin chào ' +
        fullname +
        '</p>' +
        '<p>Mã OTP của bạn là ' +
        codeOtp +
        ', vui lòng nhập mã OTP vào ứng dụng để hoàn tất quá trình đăng ký tài khoản.</p>' +
        '<p>Xin cảm ơn và chào mừng bạn đến với cộng đồng học tập, kết nối Mentee-Mentor CoCo.</p>' +
        'Trân Trọng,<br>Coco.'
    );
};

exports.ContentRejectAccount_en = (fullname, organization_name) => {
    return (
        ' <p>This email is intended for ' +
        fullname +
        '</p>' +
        '<p>Your account request has been rejected.</p>' +
        '<p>If you need assistance, please contact us at <a href="support.coco@gmail.com">support.coco@gmail.com</a>' +
        '</p>Best Regards,<br>' +
        organization_name +
        '.'
    );
};

exports.ContentRejectAccount_vi = (fullname, organization_name) => {
    return (
        ' <p>Email này được gửi đến cho ' +
        fullname +
        '</p>' +
        '<p>Yêu cầu tạo tài khoản của bạn đã bị từ chối.</p>' +
        '<p>Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email <a href="support.coco@gmail.com">support.coco@gmail.com</a>' +
        '</p>Trân Trọng,<br>' +
        organization_name +
        '.'
    );
};

exports.ContentApproveAccount_en = (fullname, host_ui, organization_name) => {
    return (
        ' <p>This email is intended for ' +
        fullname +
        '</p>' +
        '<p>Your account is now active. You can login at <a href="' +
        host_ui +
        '">' +
        organization_name +
        '</a>.</p>' +
        '<p>If you need assistance, please contact us at <a href="support.coco@gmail.com">support.coco@gmail.com</a>' +
        '</p>Best Regards,<br>' +
        organization_name +
        '.'
    );
};

exports.ContentApproveAccount_vi = (fullname, host_ui, organization_name) => {
    return (
        ' <p>Email này được gửi đến cho ' +
        fullname +
        '</p>' +
        '<p>Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập vào <a href="' +
        host_ui +
        '">' +
        organization_name +
        '</a>.</p>' +
        '<p>Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email <a href="support.coco@gmail.com">support.coco@gmail.com</a>' +
        '</p>Trân Trọng,<br>' +
        organization_name +
        '.'
    );
};

exports.ContentResetPassword_en = (fullname, link, codeOtp) => {
    return (
        ' <p>This email is intended for ' +
        fullname +
        '</p>' +
        // '<p><a href="' +
        // link +
        // '">Click here to reset your password.</a></p>' +
        '<p>This link will be good for 2 hours. After that you will need to click on the Forgot Password link to receive a' +
        'new web link by email to reset your password.</p>' +
        '<p>OTP for mobile: ' +
        codeOtp +
        '</p>' +
        '<p>If you need assistance, please contact us at <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Best Regards,<br>Coco.'
    );
};

exports.ContentResetPassword_vi = (fullname, link, codeOtp) => {
    return (
        ' <p>Xin chào ' +
        fullname +
        '</p>' +
        '<p>Bạn vừa yêu cầu thay đổi mật khẩu trên Coco.</p>' +
        '<p>Vui lòng nhập chính xác mã OTP: ' +
        codeOtp +
        ' vào ứng dụng để thay đổi mật khẩu. </p>' +
        'Trân Trọng,<br>Coco.'
    );
};

exports.ContentInvitation_en = (fullname, organization_name, link, codeOtp) => {
    return (
        '<p>This email is intended for ' +
        fullname +
        '</p>' +
        '<p>You have just been invited to join ' +
        organization_name +
        '. <a href="' +
        link +
        '">Click here to complete your account.</a></p>' +
        '<p>OTP for mobile: ' +
        codeOtp +
        '</p>' +
        '<p>If you need assistance, please contact us at <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Best Regards,<br>Coco.'
    );
};

exports.ContentInvitation_vi = (fullname, organization_name, link, codeOtp) => {
    return (
        ' <p>Email này được gửi đến cho ' +
        fullname +
        '</p>' +
        '<p>Bạn vừa nhận được lời mời tham gia vào ' +
        organization_name +
        '. <a href="' +
        link +
        '">Bấm chọn vào đây để hoàn thiện tài khoản của bạn.</a></p>' +
        '<p>OTP cho mobile: ' +
        codeOtp +
        '</p>' +
        '<p>Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Trân Trọng,<br>Coco.'
    );
};

exports.ContentTicketAssignation_en = (fullname, link) => {
    return (
        '<p>This email is intended for ' +
        fullname +
        '</p>' +
        '<p>A ticket has just been assigned to you. <a href="' +
        link +
        '">Click here to view detail of your ticket. </a></p>' +
        '<p>If you need assistance, please contact us at <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Best Regards,<br>Coco.'
    );
};

exports.ContentTicketAssignation_vi = (fullname, link) => {
    return (
        ' <p>Email này được gửi đến cho ' +
        fullname +
        '</p>' +
        '<p>Một nhiệm vụ vừa mới được giao cho bạn. <a href="' +
        link +
        '">Bấm chọn vào đây để xem chi tiết nhiệm vụ của bạn. </a></p>' +
        '<p>Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Trân Trọng,<br>Coco.'
    );
};

exports.ContentTicketAssignationParticipant_en = (fullname, fullname_email_assigned, link) => {
    return (
        '<p>This email is intended for ' +
        fullname +
        '</p>' +
        '<p>A ticket has just been assigned to ' +
        fullname_email_assigned +
        ' and you are a participant of it. <a href="' +
        link +
        '">Click here to view detail of your ticket. </a></p>' +
        '<p>If you need assistance, please contact us at <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Best Regards,<br>Coco.'
    );
};

exports.ContentTicketAssignationParticipant_vi = (fullname, fullname_email_assigned, link) => {
    return (
        ' <p>Email này được gửi đến cho ' +
        fullname +
        '</p>' +
        '<p>Một nhiệm vụ vừa mới được giao đến cho ' +
        fullname_email_assigned +
        ' và bạn được giao với tư cách là người tham gia. <a href="' +
        link +
        '">Bấm chọn vào đây để xem chi tiết nhiệm vụ </a></p>' +
        '<p>Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Trân Trọng,<br>Coco.'
    );
};

exports.ContentTicketRemindation_en = (fullname, fullname_email_assigned, deadline, link) => {
    return (
        '<p>This email is intended for ' +
        fullname +
        '</p>' +
        '<p>The ticket of ' +
        fullname_email_assigned +
        '  has been overdue since ' +
        deadline +
        '. <a href="' +
        link +
        '">Click here to view detail of your ticket. </a></p>' +
        '<p>If you need assistance, please contact us at <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Best Regards,<br>Coco.'
    );
};

exports.ContentTicketRemindation_vi = (fullname, fullname_email_assigned, deadline, link) => {
    return (
        ' <p>Email này được gửi đến cho ' +
        fullname +
        '</p>' +
        '<p>Nhiệm vụ của ' +
        fullname_email_assigned +
        ' đã hết hạn từ ngày ' +
        deadline +
        '. <a href="' +
        link +
        '">Bấm chọn vào đây để xem chi tiết nhiệm vụ </a></p>' +
        '<p>Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Trân Trọng,<br>Coco.'
    );
};

exports.ContentApproveDataSharingRequest_en = (fullname, link) => {
    return (
        '<p>This email is intended for ' +
        fullname +
        '</p>' +
        '<p>Your data sharing request is approved.</p>' +
        '<p><a href="' +
        link +
        '">Click here </a>to view request information and download template files.</p>' +
        '<p>If you need assistance, please contact us at <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Best Regards,<br>Coco.'
    );
};

exports.ContentApproveDataSharingRequest_vi = (fullname, link) => {
    return (
        ' <p>Email này được gửi đến cho ' +
        fullname +
        '</p>' +
        '<p>Yêu cầu chia sẻ dữ liệu của bạn đã được phê duyệt.</p>' +
        '<p><a href="' +
        link +
        '">Bấm chọn vào đây </a>để xem thông tin yêu cầu và tải xuống tệp mẫu.</p>' +
        '<p>Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Trân Trọng,<br>Coco.'
    );
};

exports.ContentRejectDataSharingRequest_en = (fullname) => {
    return (
        '<p>This email is intended for ' +
        fullname +
        '</p>' +
        '<p>Your data sharing request has been rejected.</p>' +
        '<p>If you need assistance, please contact us at <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Best Regards,<br>Coco.'
    );
};

exports.ContentRejectDataSharingRequest_vi = (fullname) => {
    return (
        ' <p>Email này được gửi đến cho ' +
        fullname +
        '</p>' +
        '<p>Yêu cầu chia sẻ dữ liệu của bạn đã bị từ chối.</p>' +
        '<p>Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email <a href="support.coco@gmail.com">support.coco@gmail.com</a></p>' +
        'Trân Trọng,<br>Coco.'
    );
};
