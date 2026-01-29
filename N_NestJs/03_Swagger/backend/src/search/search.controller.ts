import { Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { ResponseDto } from '../dto/response.dto';
import { EntidadeTeste } from '../entities/usuario.entity';
import { AutoApiQuery } from './decorators/AutoApiQuery';
import { SearchCriteriaDto } from './dtos/SearchCriteriaDto';
import { BodySearchCriteria } from './param/body-search-criteria.param';
import { QuerySearchCriteria } from './param/query-search-criteria.param';

@Controller()
export class SearchController {
  constructor() {}

  @Post('search-body')
  @ApiBody({ type: SearchCriteriaDto })
  @ApiResponse({ status: 200, type: ResponseDto, isArray: true })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
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
  @AutoApiQuery(ResponseDto)
  @ApiResponse({ status: 200, type: ResponseDto, isArray: true })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
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
}
