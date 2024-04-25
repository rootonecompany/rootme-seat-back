import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */
export function initSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .setTitle("코울슬로")
        .setDescription("예매 백엔드 API")
        .setVersion("1.0.0")
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api-docs", app, document);
}
