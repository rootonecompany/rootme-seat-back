export default () => ({
    yanolja: {
        type: process.env.YANOLJA_MYSQL_TYPE,
        host: process.env.YANOLJA_MYSQL_HOST,
        port: process.env.YANOLJA_MYSQL_PORT,
        username: process.env.YANOLJA_MYSQL_USERNAME,
        password: process.env.YANOLJA_MYSQL_PASSWORD,
        database: process.env.YANOLJA_MYSQL_DATABASE,
        synchronize: process.env.YANOLJA_MYSQL_DATABASE_SYNCHRONIZE,
        logging: process.env.YANOLJA_MYSQL_DATABASE_LOGGING,
        name: process.env.YANOLJA_MYSQL_NAME,
    },
});
