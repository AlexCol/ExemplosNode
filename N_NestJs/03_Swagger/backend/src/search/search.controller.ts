import { Controller, Get, Post } from '@nestjs/common';
import { ResponseDto } from '../dto/response.dto';
import { EntidadeTeste } from '../entities/usuario.entity';
import { ApiDoc } from './decorators/ApiDoc';
import { PaginatedReturn } from './dtos/PaginatedReturn';
import { SearchCriteriaDto } from './dtos/SearchCriteriaDto';
import { BodySearchCriteria } from './param/body-search-criteria.param';
import { QuerySearchCriteria } from './param/query-search-criteria.param';

@Controller()
export class SearchController {
  constructor() {}

  @Post('search-body')
  @ApiDoc({
    summary: 'Busca com critérios via body',
    body: SearchCriteriaDto,
    response: ResponseDto,
    isResponseArray: true,
  })
  //!EntidadeTeste usara apenas para verificar campos (não valida VO)
  searchBody(@BodySearchCriteria(EntidadeTeste) search: SearchCriteriaDto): ResponseDto[] {
    const searchResult: ResponseDto[] = [
      {
        id: '1',
        dataHora: search.where?.filter((w) => w.field === 'dataHora')[0]?.value as string,
        email: search.where?.filter((w) => w.field === 'email')[0]?.value as string,
        grana: search.where?.filter((w) => w.field === 'grana')[0]?.value as string,
      },
    ];
    return searchResult;
  }

  @Get('search-query')
  @ApiDoc({
    summary: 'Busca com critérios via query parameters',
    query: ResponseDto,
    //query: [{ name: 'idade', type: Number, required: false, description: 'Número da página.' }],
    response: ResponseDto,
    isResponseArray: false,
  })
  //!EntidadeTeste usara apenas para verificar campos (não valida VO)
  searchQuery(@QuerySearchCriteria(EntidadeTeste) search: SearchCriteriaDto): ResponseDto[] {
    const searchResult: ResponseDto[] = [
      {
        id: '1',
        dataHora: search.where?.filter((w) => w.field === 'dataHora')[0]?.value as string,
        email: search.where?.filter((w) => w.field === 'email')[0]?.value as string,
        grana: search.where?.filter((w) => w.field === 'grana')[0]?.value as string,
      },
    ];
    return searchResult;
  }

  @Get('search-paginated')
  @ApiDoc({
    summary: 'Busca paginada com critérios via query parameters',
    response: ResponseDto,
    isPaginated: true,
  })
  //!EntidadeTeste usara apenas para verificar campos (não valida VO)
  searchPaginated(): PaginatedReturn<ResponseDto> {
    const searchResult: PaginatedReturn<ResponseDto> = {
      data: [
        {
          id: '1',
          dataHora: '2024-01-01T00:00:00Z',
          email: 'example@example.com',
          grana: '1000',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    };
    return searchResult;
  }
}
