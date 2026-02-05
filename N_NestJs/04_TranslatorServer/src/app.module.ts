import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalErrorFilter } from './filters/globalError.filter';
import { CatalogModule } from './infra/catalog/catalog.module';

@Module({
  imports: [CatalogModule],
  providers: [{ provide: APP_FILTER, useClass: GlobalErrorFilter }],
})
export class AppModule {}
