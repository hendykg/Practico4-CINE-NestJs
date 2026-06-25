import { Global, Module } from '@nestjs/common';
import { AppAuthGuard, RolesGuard } from './auth.guard';

@Global()
@Module({
  providers: [AppAuthGuard, RolesGuard],
  exports: [AppAuthGuard, RolesGuard],
})
export class CommonModule {}
