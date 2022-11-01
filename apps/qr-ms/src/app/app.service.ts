import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from './item.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to qr-ms!' };
  }

  getItems() {
    return this.itemRepository.find();
  }

  getItemById(id: number) {
    return this.itemRepository.findOne({ where: { id } });
  }

  createItem({ name }: { name: string }) {
    const item = this.itemRepository.create({ name });

    return this.itemRepository.save(item);
  }
}
