import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Engine } from '@/core/translation/engine/Engine';
import { FileSystemProvider } from '@/core/translation/providers/filesystem/FileSystemProvider';

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogService,
    {
      provide: Engine,
      useFactory: () => {
        const provider = new FileSystemProvider(process.cwd() + '/translations');
        //const provider = new BunnyStorageProvider('', 'sys-tradutor', 'translations');
        return new Engine(provider);
      },
    },
  ],
})
export class CatalogModule {}
