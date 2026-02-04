import { Module } from '@nestjs/common';
import { CatalogModule } from './infra/catalog/catalog.module';
import { GlobalErrorFilter } from './filters/globalError.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [CatalogModule],
  providers: [{ provide: APP_FILTER, useClass: GlobalErrorFilter }],
})
export class AppModule {}
