import { Module } from "@nestjs/common";
import { YanoljaController } from "./yanolja.controller";
import { YanoljaService } from "./yanolja.service";

@Module({
    controllers: [YanoljaController],
    providers: [YanoljaService],
})
export class YanoljaModule {}
