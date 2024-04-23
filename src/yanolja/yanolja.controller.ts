import { YanoljaService } from "./yanolja.service";
import { Controller, Get, Header, Param, ParseIntPipe, Post } from "@nestjs/common";

@Controller("yanolja")
export class YanoljaController {
    constructor(private readonly yanoljaService: YanoljaService) {}

    @Get(":orderNumber")
    async findOrderNumber(@Param("orderNumber", ParseIntPipe) orderNumber: number) {
        return "";
    }

    @Post()
    @Header("Cache-Control", "none")
    async create() {
        return "";
    }
}
