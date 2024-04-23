export default () => ({
    wanderlust: {
        type: process.env.WANDERLUST_MYSQL_TYPE,
        host: process.env.WANDERLUST_MYSQL_HOST,
        port: process.env.WANDERLUST_MYSQL_PORT,
        username: process.env.WANDERLUST_MYSQL_USERNAME,
        password: process.env.WANDERLUST_MYSQL_PASSWORD,
        database: process.env.WANDERLUST_MYSQL_DATABASE,
        synchronize: process.env.WANDERLUST_MYSQL_DATABASE_SYNCHRONIZE,
        logging: process.env.WANDERLUST_MYSQL_DATABASE_LOGGING,
        name: process.env.WANDERLUST_MYSQL_NAME,
    },
});
