import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const yanoljaTypeOrmConfig = (configService: ConfigService) => {
    if (!["development", "production"].includes(process.env.NODE_ENV)) {
        throw Error("development 또는 production 환경이어야 합니다.");
    }

    const option: TypeOrmModuleOptions = {
        type: configService.get<"mysql">("yanolja.type"),
        host: configService.get<string>("yanolja.host"),
        port: Number(configService.get<number>("yanolja.port")),
        username: configService.get<string>("yanolja.username"),
        password: configService.get<string>("yanolja.password"),
        database: configService.get<string>("yanolja.database"),
        synchronize: configService.get<string>("yanolja.synchronize") === "true" ? true : false,
        logging: configService.get<string>("yanolja.logging") === "true" ? true : false,
        name: configService.get<string>("yanolja.name") ?? "",
        cache: true,
        entities: [process.cwd() + "/dist/yanolja/" + "/**/*.entity.{js,ts}"],
    };

    return option;
};
