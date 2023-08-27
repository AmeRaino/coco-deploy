const express = require('express');
const router = express.Router();
const userTodoListController = require('../controllers/userTodoListController');
const authController = require('./../controllers/authController');

router.use(authController.protect);

router.get('/date-by-month-year', userTodoListController.findAllDateTodoListByMonthYearOfUser);

router.get('/todo-by-date', userTodoListController.findAllTodoListByDateOfUser);

router.post('/', userTodoListController.createTodoListOfUser);

router.put('/change-complete/:id', userTodoListController.changeCompleteTodo);

router.put('/update-todo-task/:id', userTodoListController.updateTodoTask);

router.delete('/delete-todo-task/:id', userTodoListController.deleteTodoTask);

module.exports = router;
