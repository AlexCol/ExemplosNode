import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateBaseEntryDto } from './dto/create-base-entry.dto';
import { CreateTranslationDto } from './dto/create-transation.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  /**********************************************/
  /* Getters                                    */
  /**********************************************/
  @Get(':sistema/:lang/:namespace')
  async getCatalog(
    @Param('sistema') sistema: string,
    @Param('lang') lang: string,
    @Param('namespace') namespace: string,
  ) {
    return await this.service.getCatalog(sistema, lang, namespace);
  }

  @Get(':sistema/:lang/:namespace/missing')
  async getMissingKeys(
    @Param('sistema') sistema: string,
    @Param('lang') lang: string,
    @Param('namespace') namespace: string,
  ) {
    return await this.service.getMissingKeys(sistema, lang, namespace);
  }

  @Get(':sistema/namespaces')
  async listNamespaces(@Param('sistema') sistema: string) {
    return await this.service.listNamespaces(sistema);
  }

  @Get(':sistema/languages')
  async listLanguages(@Param('sistema') sistema: string) {
    return await this.service.listLanguages(sistema);
  }

  @Get(':sistema/status/missing-keys')
  getMissingKeysStatus(@Param('sistema') sistema: string) {
    return this.service.getMissingKeysStatus(sistema);
  }

  /**********************************************/
  /* Setters                                    */
  /**********************************************/
  @Post(':sistema/:namespace/base')
  async createBaseEntry(
    @Param('sistema') sistema: string,
    @Param('namespace') namespace: string,
    @Body() body: CreateBaseEntryDto,
  ) {
    return await this.service.addBaseEntry(sistema, namespace, body.key);
  }

  @Post(':sistema/:namespace/:lang')
  async createTranslation(
    @Param('sistema') sistema: string,
    @Param('namespace') namespace: string,
    @Param('lang') lang: string,
    @Body() body: CreateTranslationDto,
  ) {
    return await this.service.addTranslation(sistema, namespace, lang, body.key, body.value);
  }

  @Post(':sistema/:namespace')
  async createNamespace(@Param('sistema') sistema: string, @Param('namespace') namespace: string) {
    return await this.service.createNamespace(sistema, namespace);
  }

  @Post(':sistema/language/:language')
  async createLanguage(@Param('sistema') sistema: string, @Param('language') language: string) {
    return await this.service.createLanguage(sistema, language);
  }

  /**********************************************/
  /* Deleters                                   */
  /**********************************************/
  @Delete(':sistema/:namespace/key')
  async removeKey(
    @Param('sistema') sistema: string,
    @Param('namespace') namespace: string,
    @Body() body: CreateBaseEntryDto,
  ) {
    const { key } = body;
    return await this.service.removeKey(sistema, namespace, key);
  }

  @Delete(':sistema/:namespace')
  async removeNamespace(@Param('sistema') sistema: string, @Param('namespace') namespace: string) {
    return await this.service.removeNamespace(sistema, namespace);
  }

  @Delete(':sistema/language/:lang')
  async deleteLanguage(@Param('sistema') sistema: string, @Param('lang') lang: string) {
    return await this.service.deleteLanguage(sistema, lang);
  }
}
