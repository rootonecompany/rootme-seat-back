import { Module } from '@nestjs/common';
import { WanderlustController } from './wanderlust.controller';
import { WanderlustService } from './wanderlust.service';

@Module({
  controllers: [WanderlustController],
  providers: [WanderlustService]
})
export class WanderlustModule {}
