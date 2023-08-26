const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointFiles = [
    './routes/admin/indexRoutes.js',
    './routes/indexRoutes.js'
    // './routes/accountRequestRoutes.js',
    // './routes/addressRoutes.js',
    // './routes/consultingFieldRoutes.js',
    // './routes/conversationRoutes.js',
    // './routes/courseReviewsRoutes.js',
    // './routes/courseReviewSuggestionTagRoutes.js',
    // './routes/courseRoutes.js',
    // './routes/menteeRoutes.js',
    // './routes/mentorRegistrationRoutes.js',
    // './routes/mentorRoutes.js',
    // './routes/organizationRoutes.js',
    // './routes/permissionRoutes.js',
    // './routes/rolesRoutes.js',
    // './routes/userAppointmentRoutes.js',
    // './routes/userConnectionRoutes.js',
    // './routes/userProfileRoutes.js',
    // './routes/userReviewsRoutes.js',
    // './routes/userReviewSuggestionTagFieldRoutes.js',
    // './routes/userRoutes.js',
    // './routes/userTodoListRoutes.js',
];

swaggerAutogen(outputFile, endpointFiles);
