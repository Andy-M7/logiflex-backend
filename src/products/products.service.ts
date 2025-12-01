import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  // LISTAR (con búsqueda opcional)
  async findAll(search?: string) {
    if (search) {
      return this.repo.find({
        where: [
          { nombre: ILike(`%${search}%`) },
          { lote: ILike(`%${search}%`) },
        ],
        order: { nombre: 'ASC' },
      });
    }

    return this.repo.find({
      order: { nombre: 'ASC' },
    });
  }

  // CREAR PRODUCTO
  async create(dto: CreateProductDto) {
    const product = this.repo.create(dto);
    return this.repo.save(product);
  }

  //  ACTUALIZAR PRODUCTO
  async update(id: string, dto: UpdateProductDto) {
    const product = await this.repo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    Object.assign(product, dto);
    return this.repo.save(product);
  }

  // =====================================
  // 🔄 TOGGLE ACTIVO/INACTIVO
  // =====================================
  async toggle(id: string) {
    const product = await this.repo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    product.active = !product.active;
    return this.repo.save(product);
  }

  // =====================================
  // 🗑️ ELIMINAR PRODUCTO
  // =====================================
  async remove(id: string) {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Producto no encontrado');
    }

    return { ok: true, message: 'Producto eliminado correctamente' };
  }
}
