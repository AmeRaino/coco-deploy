const express = require('express');
const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const courseRoutes = require('./couresRoutes');
const mentorRegistrationRoutes = require('./mentorRegistrationRoutes');
const bannerRoutes = require('./bannerRoutes');
const notificationRoutes = require('./notificationRoutes');
const consultingFieldRoutes = require('./consultingFieldRoutes');

module.exports = (path, app) => {
    app.use(`${path}/users`, userRoutes);
    app.use(`${path}/roles`, roleRoutes);
    app.use(`${path}/courses`, courseRoutes);
    app.use(`${path}/mentorRegistrations`, mentorRegistrationRoutes);
    app.use(`${path}/banners`, bannerRoutes);
    app.use(`${path}/notifications`, notificationRoutes);
    app.use(`${path}/consultingFields`, consultingFieldRoutes);
};
