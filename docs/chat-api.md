# Chat API

### [GET] `/api/v1/conversations/online-users/:userId`

-   **Ý nghĩa:** Lấy danh sách tất cả người dùng đang online
-   **Phương thức:** `GET`
-   **Response:**

```json
{
    "message": "Get online users successfully!",
    "count": 1,
    "data": [
        {
            "isOnline": true,
            "lastOnlineAt": "2022-09-13T08:17:08.000Z",
            "user": {
                "id": 1,
                "email": "owner@gmail.com",
                "fullname": "Owner",
                "phone": "0932221911",
                "avatar": null
            }
        }
    ],
    "success": true
}
```

-   **Ghi chú:** `isOnline = 0` là đang offline, `isOnline = 1` là đang online.

### [POST] `/api/v1/conversations/join`

-   **Ý nghĩa:** Bắt đầu cuộc trò chuyện với một người dùng
-   **Phương thức:** `POST`
-   **Params:**

```json
{
    "senderId": 1,
    "receiverIds": [2]
}
```

-   **Response:**

```json
{
    "message": "Join conversation successfully!",
    "data": {
        "conversationId": 5,
        "senderConversationMemberId": 1,
        "senderUser": {
            "id": 1,
            "email": "owner@gmail.com",
            "fullname": "Owner",
            "phone": "0932221911"
        }
    },
    "success": true
}
```

-   **Ghi chú:** Gọi API => API trả giá trị về => Navigate + Truyền giá trị `conversationId` và `senderConversationMemberId` vừa nhận được cho màn hình Chat Details.

### [POST] `/api/v1/conversations/messages/:messageId`

-   **Ý nghĩa:** Đánh dấu đã đọc một tin nhắn
-   **Phương thức:** `POST`
-   **Params:**

```json
{
    "userId": 1
}
```

-   **Response:**

```json
{
    "message": "Mark message as read successfully!",
    "success": true
}
```

### [GET] `/api/v1/conversations/users/:userId`

-   **Ý nghĩa:** Lấy danh sách tất cả các cuộc trò chuyện của một người dùng
-   **Phương thức:** `GET`
-   **Response:**

```json
{
    "message": "Get all conversations successfully!",
    "count": 6,
    "data": [
        {
            "conversationId": 1,
            "messageId": 27,
            "userId": 1,
            "createdAt": "2022-09-13T04:26:59.000Z",
            "conversation": {
                "id": 1,
                "uid": "d0dba696c0f184e05726e2856996b7fb",
                "lastMessageId": null,
                "createdBy": null,
                "createdAt": "2022-08-21T14:56:09.000Z",
                "updatedAt": "2022-08-21T15:35:31.000Z",
                "isDeleted": true,
                "conversation_members": [
                    {
                        "id": 2,
                        "conversationId": 1,
                        "userId": 2,
                        "createdBy": null,
                        "createdAt": "2022-08-21T14:56:09.000Z",
                        "updatedAt": "2022-08-21T14:56:09.000Z",
                        "isDeleted": false,
                        "user": {
                            "id": 2,
                            "email": "manager@gmail.com",
                            "fullname": "Manager",
                            "phone": "0932221912",
                            "avatar": null
                        }
                    },
                    {
                        "id": 1,
                        "conversationId": 1,
                        "userId": 1,
                        "createdBy": null,
                        "createdAt": "2022-08-21T14:56:09.000Z",
                        "updatedAt": "2022-08-21T14:56:09.000Z",
                        "isDeleted": false,
                        "user": {
                            "id": 1,
                            "email": "owner@gmail.com",
                            "fullname": "Owner",
                            "phone": "0932221911",
                            "avatar": null
                        }
                    }
                ]
            },
            "message": {
                "id": 27,
                "conversationId": 1,
                "memberId": 1,
                "content": "Hello, World!",
                "createdBy": null,
                "createdAt": "2022-09-13T04:26:59.000Z",
                "updatedAt": "2022-09-13T04:26:59.000Z",
                "isDeleted": false,
                "member": {
                    "id": 1,
                    "user": {
                        "id": 1,
                        "email": "owner@gmail.com",
                        "fullname": "Owner",
                        "phone": "0932221911",
                        "avatar": null
                    }
                },
                "read_by": [
                    {
                        "userId": 1
                    },
                    {
                        "userId": 2
                    }
                ]
            }
        }
    ],
    "success": true
}
```

### [GET] `/api/v1/conversations/:conversationId/messages`

-   **Ý nghĩa:** Lấy danh sách tất cả các tin nhắn của một cuộc trò chuyện
-   **Phương thức:** `GET`
-   **Response:**

```json
{
    "message": "Get conversation details successfully!",
    "count": 1,
    "data": [
        {
            "conversationId": 1,
            "content": "Hello, World!",
            "createdAt": "2022-08-22T01:45:02.000Z",
            "member": {
                "id": 1,
                "user": {
                    "id": 1,
                    "email": "owner@gmail.com",
                    "fullname": "Owner",
                    "phone": "0932221911",
                    "avatar": null
                }
            }
        }
    ],
    "success": true
}
```

-   **Ghi chú:**
    -   App chuyển sang màn hình Chat Details thì gọi API này đầu tiên.
    -   Một tin nhắn sẽ là tin nhắn do người dùng hiện tại gửi nếu giá trị `senderId` của nó khớp với giá trị `senderConversationMemberId` đã lưu.

### [DELETE] `/api/v1/conversations/:conversationId`

-   **Ý nghĩa:** Xóa một cuộc trò chuyện
-   **Phương thức:** `DELETE`
-   **Response:**

```json
{
    "message": "Delete conversation successfully!",
    "success": true
}
```
