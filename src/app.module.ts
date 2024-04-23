import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { YanoljaModule } from "./yanolja/yanolja.module";
import { WanderlustModule } from "./wanderlust/wanderlust.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderModule } from "./order/order.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import appConfig from "./config/app.config";
import { yanoljaTypeOrmConfig } from "./config/yanoljaTypeOrm.config";
import { wanderlustTypeOrmConfig } from "./config/wanderlustTypeOrm.config";
import { TheaterModule } from "./theater/theater.module";
import yanoljaDatabaseConfig from "./config/yanoljaDatabase.config";
import wanderlustDatabaseConfig from "./config/wanderlustDatabase.config";
import { DataSource } from "typeorm";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
            load: [appConfig, yanoljaDatabaseConfig, wanderlustDatabaseConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: yanoljaTypeOrmConfig,
            dataSourceFactory: async (options) => {
                const dataSource = await new DataSource(options).initialize();
                return dataSource;
            },
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: wanderlustTypeOrmConfig,
            dataSourceFactory: async (options) => {
                const dataSource = await new DataSource(options).initialize();
                return dataSource;
            },
        }),
        // TypeOrmModule.forRoot({
        //     type: "mysql",
        //     host: "localhost",
        //     port: 3306,
        //     username: "test",
        //     password: "test",
        //     database: "yanolja",
        //     synchronize: true,
        //     logging: true,
        //     entities: [__dirname + "/**/*.entity.{js,ts}"],
        // }),
        // TypeOrmModule.forRoot({
        //     type: "mysql",
        //     host: "localhost",
        //     port: 3306,
        //     username: "test",
        //     password: "test",
        //     database: "wanderlust",
        //     synchronize: true,
        //     logging: true,
        //     name: "wanderlust",
        //     entities: [__dirname + "/**/*.entity.{js,ts}"],
        // }),
        YanoljaModule,
        WanderlustModule,
        OrderModule,
        TheaterModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
