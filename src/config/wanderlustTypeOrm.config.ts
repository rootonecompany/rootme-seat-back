import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const wanderlustTypeOrmConfig = (configService: ConfigService) => {
    if (!["development", "production"].includes(process.env.NODE_ENV)) {
        throw Error("development 또는 production 환경이어야 합니다.");
    }

    const option: TypeOrmModuleOptions = {
        type: configService.get<"mysql">("wanderlust.type"),
        host: configService.get<string>("wanderlust.host"),
        port: Number(configService.get<number>("wanderlust.port")),
        username: configService.get<string>("wanderlust.username"),
        password: configService.get<string>("wanderlust.password"),
        database: configService.get<string>("wanderlust.database"),
        synchronize: configService.get<string>("wanderlust.synchronize") === "true" ? true : false,
        logging: configService.get<string>("wanderlust.logging") === "true" ? true : false,
        name: configService.get<string>("wanderlust.name") ?? "wanderlust",
        entities: [process.cwd() + "/dist/wanderlust/" + "/**/*.entity.{js,ts}"],
    };

    return option;
};
