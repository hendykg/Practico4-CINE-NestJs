import { Global, Module } from '@nestjs/common';
import { AppAuthGuard, RolesGuard } from './auth.guard';
import { DataStoreService } from './data-store.service';

@Global()
@Module({
  providers: [DataStoreService, AppAuthGuard, RolesGuard],
  exports: [DataStoreService, AppAuthGuard, RolesGuard],
})
export class CommonModule {}
