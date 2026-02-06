import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateBaseEntryDto } from './dto/create-base-entry.dto';
import { CreateTranslationDto } from './dto/create-transation.dto';
import { Environment } from '@/core/contracts/Types';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  /**********************************************/
  /* Publisher                                  */
  /**********************************************/
  @Post(':sistema/publish')
  publish(@Param('sistema') sistema: string) {
    return this.service.publishToProd(sistema);
  }

  /**********************************************/
  /* Getters                                    */
  /**********************************************/
  @Get(':env/:sistema/:lang/:namespace')
  async getCatalog(
    @Param('env') env: Environment,
    @Param('sistema') sistema: string,
    @Param('lang') lang: string,
    @Param('namespace') namespace: string,
  ) {
    return await this.service.getCatalog(env, sistema, lang, namespace);
  }

  @Get(':env/:sistema/:lang/:namespace/missing')
  async getMissingKeys(
    @Param('env') env: Environment,
    @Param('sistema') sistema: string,
    @Param('lang') lang: string,
    @Param('namespace') namespace: string,
  ) {
    return await this.service.getMissingKeys(env, sistema, lang, namespace);
  }

  @Get(':env/:sistema/namespaces')
  async listNamespaces(@Param('env') env: Environment, @Param('sistema') sistema: string) {
    return await this.service.listNamespaces(env, sistema);
  }

  @Get(':env/:sistema/languages')
  async listLanguages(@Param('env') env: Environment, @Param('sistema') sistema: string) {
    return await this.service.listLanguages(env, sistema);
  }

  @Get(':env/:sistema/status/missing-keys')
  getMissingKeysStatus(@Param('env') env: Environment, @Param('sistema') sistema: string) {
    return this.service.getMissingKeysStatus(env, sistema);
  }

  @Post(':env/:sistema/:namespace/key/translations')
  async getKeyTranslations(
    @Param('env') env: Environment,
    @Param('sistema') sistema: string,
    @Param('namespace') namespace: string,
    @Body() body: { key: string },
  ) {
    return await this.service.getKeyTranslations(env, sistema, namespace, body.key);
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
