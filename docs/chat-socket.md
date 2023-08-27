# Chat Socket

## Client Events

Danh sách các events được phía client gửi lên

### `client-connection`

-   **Ý nghĩa**: Kiểm tra kết nối giữa client và socket

```js
socket.emit('client-connection');
```

### `client-active-user`

-   **Ý nghĩa**: Thông báo người dùng hiện tại đã online

```js
socket.emit('client-active-user', {
    userId: 1
});
```

-   **Ghi chú:** Emit event này khi người dùng login vào app/ ngay khi load màn hình Chat List.

### `client-inactive-user`

-   **Ý nghĩa**: Thông báo người dùng hiện tại đã offline

```js
socket.emit('client-inactive-user', {
    userId: 1
});
```

-   **Ghi chú:** Emit event này khi người dùng logout app/ chạy ngầm app/ rời khỏi màn hình Chat List.

### `client-message`

-   **Ý nghĩa**: Gửi tin nhắn trong một cuộc trò chuyện

```js
socket.emit('client-message', {
    conversationId: 1,
    memberId: 1,
    userId: 1,
    content: 'Hello, World!'
});
```

## Server Events

Danh sách các events được phía server trả về

### `server-connection`

-   **Ý nghĩa**: Thông báo trạng thái kết nối giữa client và socket, nếu kết quả trả về là `{ status: "OK" }` thì việc kết nối đã thành công.

```js
socket.on('server-connection', (data) => {
    console.log(data); // { status: "OK" }
});
```

### `server-active-user`

-   **Ý nghĩa**: Thông báo có một người dùng nào vừa online

```js
socket.on('server-active-user', (data) => {
    console.log(data); // { userId: 1 }
});
```

### `server-inactive-user`

-   **Ý nghĩa**: Thông báo có một người dùng vừa offline

```js
socket.on('server-inactive-user', (data) => {
    console.log(data); // { userId: 1 }
});
```

### `server-message`

-   **Ý nghĩa**: Thông báo có một tin nhắn mới

```js
socket.on('server-message', (data) => {
    console.log(data);

    /*
  {
    conversationId: 1,
    member: {
      id: 1,
      user: {
        "id": 1,
        "email": "owner@gmail.com",
        "fullname": "Owner",
        "phone": "0932221911",
        "avatar": null
      }
    },
    content: "Hello, World"
    createdAt: "",
  }
  */
});
```
