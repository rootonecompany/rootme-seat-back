import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
    host: process.env.APP_HOST || "localhost",
    port: parseInt(process.env.APP_PORT, 10) || 3000,
}));
