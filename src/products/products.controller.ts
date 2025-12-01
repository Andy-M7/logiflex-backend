import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ProductsController {
  constructor(private readonly srv: ProductsService) {}

  // ========================================
  // 🔍 LISTAR (con búsqueda opcional)
  // GET /products?search=abc
  // ========================================
  @Get()
  async list(@Query('search') search?: string) {
    const products = await this.srv.findAll(search);
    return { ok: true, data: products };
  }

  // ========================================
  // ➕ CREAR PRODUCTO
  // POST /products
  // ========================================
  @Post()
  async create(@Body() dto: CreateProductDto) {
    const product = await this.srv.create(dto);
    return { ok: true, message: 'Producto creado correctamente', data: product };
  }

  // ========================================
  // ✏️ ACTUALIZAR PRODUCTO
  // PATCH /products/:id
  // ========================================
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const updated = await this.srv.update(id, dto);
    return { ok: true, message: 'Producto actualizado', data: updated };
  }

  // ========================================
  // 🔄 TOGGLE DE ESTADO (si usas active/inactive)
  // PATCH /products/:id/toggle
  // ========================================
  @Patch(':id/toggle')
  async toggle(@Param('id') id: string) {
    const product = await this.srv.toggle(id);
    return { ok: true, message: 'Estado actualizado', data: product };
  }

  // ========================================
  // 🗑️ ELIMINAR PRODUCTO
  // DELETE /products/:id
  // ========================================
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.srv.remove(id);
    return { ok: true, message: 'Producto eliminado correctamente' };
  }
}
