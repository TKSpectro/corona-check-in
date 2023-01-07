import { IsArray } from 'class-validator';
import { Repository } from 'typeorm';
import { PageMetaDto } from './page-meta.dto';
import { PageOptionsDto } from './page-options.dto';

export class PageDto<T> {
  @IsArray()
  readonly data: T[];

  readonly _meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this._meta = meta;
  }
}

export async function findWithMeta(
  repository: Repository<any>,
  pageOptionsDto: PageOptionsDto,
  orderBy = 'createdAt'
) {
  const queryBuilder = repository.createQueryBuilder();

  queryBuilder
    .orderBy(orderBy, pageOptionsDto.order)
    .skip((pageOptionsDto.page - 1) * pageOptionsDto.take)
    .take(pageOptionsDto.take);

  const itemCount = await queryBuilder.getCount();
  const { entities } = await queryBuilder.getRawAndEntities();

  const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

  return new PageDto(entities, pageMetaDto);
}
