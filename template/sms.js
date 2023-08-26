
exports.ContentAccountRequest_en = (fullname) => {
    return "This SMS is intended for " + fullname +
        ". Your account request is being processed." +
        " If you need assistance, please contact us at support.coco@gmail.com." +
        " Best Regards, Coco."
}

exports.ContentAccountRequest_vi = (fullname) => {
    return "SMS này được gửi đến cho " + fullname +
        ". Yêu cầu tạo tài khoản của bạn đang trong quá trình được phê duyệt." +
        " Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email support.coco@gmail.com." +
        " Trân Trọng, Coco."
}

exports.ContentActiveAccount_en = (fullname, link , codeOtp) => {
    return "This SMS is intended for " + fullname +
        ". Your account is created." +
        " Please click on the following to active your account: " + link +
        '. OTP for mobile: ' + codeOtp + 
        " . If you need assistance, please contact us at support.coco@gmail.com." +
        " Best Regards, Coco."
}

exports.ContentActiveAccount_vi = (fullname, link, codeOtp) => {
    return "SMS này được gửi đến cho " + fullname +
        ". Tài khoản của bạn đã được tạo." +
        " Vui lòng nhấp vào phần sau để kích hoạt tài khoản của bạn: " + link +
        '. OTP cho mobile: ' + codeOtp + 
        " . Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi theo địa chỉ support.coco@gmail.com." +
        " Trân Trọng, Coco."
}

exports.ContentRejectAccount_en = (fullname, organization_name) => {
    return "This SMS is intended for " + fullname +
        ". Your account request has been rejected." +
        " . If you need assistance, please contact us at support.coco@gmail.com." +
        " Best regards, " + organization_name + '.';
}

exports.ContentRejectAccount_vi = (fullname, organization_name) => {
    return "SMS này được gửi đến cho " + fullname +
        ". Yêu cầu tạo tài khoản của bạn đã bị từ chối." +
        " . Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email: support.coco@gmail.com." +
        " Trân Trọng, " + organization_name + '.';
}

exports.ContentApproveAccount_en = (fullname, host_ui, organization_name) => {
    return "This SMS is intended for " + fullname +
        ". Your account is now active. You can login at " + host_ui +
        " . If you need assistance, please contact us at support.coco@gmail.com." +
        " Best Regards, " + organization_name + '.';
}

exports.ContentApproveAccount_vi = (fullname, host_ui, organization_name) => {
    return "SMS này được gửi đến cho " + fullname +
        ". Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập vào " + host_ui +
        " . Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email: support.coco@gmail.com." +
        " Trân Trọng, " + organization_name + '.';
}

exports.ContentResetPassword_en = (fullname, link, codeOtp) => {
    return "This SMS is intended for " + fullname +
        ". Click to reset your password: " + link +
        " . This link will be good for 2 hours. After that you will need to click on the Forgot Password link to receive a new web link by email to reset your password." +
        '. OTP for mobile: ' + codeOtp + 
        " If you need assistance, please contact us at support.coco@gmail.com." +
        " Best Regards, Coco.";
}

exports.ContentResetPassword_vi = (fullname, link, codeOtp) => {
    return "SMS này được gửi đến cho " + fullname +
        ". Bấm chọn vào phần sau đây để khôi phục mật khẩu: " + link +
        " . Đường dẫn này có hiệu lực trong vòng 2 giờ. Sau đó bạn sẽ phải bấm chọn lại “Quên Mật Khẩu” để nhận lại đường dẫn mới để khôi phục mật khẩu của bạn." +
        '. OTP cho mobile: ' + codeOtp + 
        " . Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email: support.coco@gmail.com." +
        " Trân Trọng, Coco.";
}

exports.ContentInvitation_en = (fullname, organization_name, link, codeOtp) => {
    return "This SMS is intended for " + fullname +
        ". You have just been invited to join " + organization_name + "." +
        " Please click on the following to complete your account: " + link +
        '. OTP for mobile: ' + codeOtp + 
        " . If you need assistance, please contact us at support.coco@gmail.com." +
        " Best regards, Coco."
}

exports.ContentInvitation_vi = (fullname, organization_name, link, codeOtp) => {
    return "SMS này được gửi đến cho " + fullname +
        ". Bạn vừa nhận được lời mời tham gia vào " + organization_name + "." +
        ". Bấm chọn vào phần sau đây để hoàn thiện tài khoản của bạn: " + link +
        '. OTP cho mobile: ' + codeOtp + 
        " . Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email: support.coco@gmail.com." +
        " Trân Trọng, Coco.";
}


exports.ContentApproveDataSharingRequest_en = (fullname, link) => {
    return "This SMS is intended for " + fullname +
        ". Your data sharing request is approved." +
        " Click here on the following to view request information and download template files.: " + link +
        " . If you need assistance, please contact us at support.coco@gmail.com." +
        " Best regards, Coco."
}

exports.ContentApproveDataSharingRequest_vi = (fullname, link) => {
    return "SMS này được gửi đến cho " + fullname +
        ". Yêu cầu chia sẻ dữ liệu của bạn đã được phê duyệt." +
        " Bấm chọn vào phần sau đây để xem thông tin yêu cầu và tải xuống tệp mẫu: " + link +
        " . Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email: support.coco@gmail.com." +
        " Trân Trọng, Coco.";
}

exports.ContentRejectDataSharingRequest_en = (fullname) => {
    return "This SMS is intended for " + fullname +
        ". Your data sharing request has been rejected." +
        " If you need assistance, please contact us at support.coco@gmail.com." +
        " Best Regards, Coco."

}

exports.ContentRejectDataSharingRequest_vi = (fullname) => {
    return "SMS này được gửi đến cho " + fullname +
        ". Yêu cầu chia sẻ dữ liệu của bạn đã bị từ chối." +
        " Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email support.coco@gmail.com." +
        " Trân Trọng, Coco."
}

exports.ContentTicketAssignation_en = (fullname, link) => {
    return "This SMS is intended for " + fullname +
        " A ticket has just been assigned to you. Please click on the following to view detail of your ticket: " + link +
        " . If you need assistance, please contact us at support.coco@gmail.com." +
        " Best regards, Coco."
}

exports.ContentTicketAssignation_vi = (fullname, link) => {
    return "SMS này được gửi đến cho " + fullname +
        ". Một nhiệm vụ vừa mới được giao cho bạn. Bấm chọn vào phần sau đây để xem chi tiết nhiệm vụ của bạn: " + link +
        " . Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email: support.coco@gmail.com." +
        " Trân Trọng, Coco.";
}

exports.ContentTicketAssignationParticipant_en = (fullname, fullname_sms_assigned, link) => {
    return "This SMS is intended for " + fullname +
        " A ticket has just been assigned to " + fullname_sms_assigned + " and you are a participant of it. Please click on the following to view detail of your ticket: " + link +
        " . If you need assistance, please contact us at support.coco@gmail.com." +
        " Best regards, Coco."
}

exports.ContentTicketAssignationParticipant_vi = (fullname, fullname_sms_assigned, link) => {
    return "SMS này được gửi đến cho " + fullname +
        ". Một nhiệm vụ vừa mới được giao cho " + fullname_sms_assigned + " và bạn được giao với tư cách là người tham gia. Bấm chọn vào phần sau đây để xem chi tiết nhiệm vụ của bạn: " + link +
        " . Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email: support.coco@gmail.com." +
        " Trân Trọng, Coco.";
}

exports.ContentTicketRemindation_en = (fullname, fullname_sms_assigned, deadline, link) => {
    return "This SMS is intended for " + fullname +
        " The ticket of " + fullname_sms_assigned + " has been overdue since " + deadline + ". Please click on the following to view detail of your ticket: " + link +
        " . If you need assistance, please contact us at support.coco@gmail.com." +
        " Best regards, Coco."
}

exports.ContentTicketRemindation_vi = (fullname, fullname_sms_assigned, deadline, link) => {
    return "SMS này được gửi đến cho " + fullname +
        ". Nhiệm vụ của " + fullname_sms_assigned + " đã hết hạn từ ngày" + deadline + ". Bấm chọn vào phần sau đây để xem chi tiết nhiệm vụ của bạn: " + link +
        " . Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi qua địa chỉ email: support.coco@gmail.com." +
        " Trân Trọng, Coco.";
}