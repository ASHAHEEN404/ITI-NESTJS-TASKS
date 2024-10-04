import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProduct } from './DTO/createProduct.dto';
import { UpdateProduct } from './DTO/updateProduct.dto';
import { Products } from './Schemas/products.schema';

@Controller('users/:userId/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Retrieve all products for a specific user
  @Get()
  async getAllProducts(@Param('userId') userId: string): Promise<Products[]> {
    try {
      return await this.productsService.getAllProducts(userId);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching products');
    }
  }

  // Retrieve a product by user ID and product ID
  @Get(':productId')
  async getProductById(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<Products> {
    try {
      return await this.productsService.getProductsById(userId, productId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Product with ID ${productId} not found for user ${userId}`,
        );
      }
      throw new InternalServerErrorException('Error fetching product');
    }
  }

  // Create a new product for a specific user
  @Post()
  async createProduct(
    @Param('userId') userId: string,
    @Body() productData: CreateProduct,
  ): Promise<Products> {
    try {
      return await this.productsService.createProduct(userId, productData);
    } catch (error) {
      throw new InternalServerErrorException('Error creating product');
    }
  }

  // Update a specific product for a user
  @Patch(':productId')
  async updateProduct(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body() updatedProductData: UpdateProduct,
  ): Promise<Products> {
    try {
      return await this.productsService.updateProduct(
        userId,
        productId,
        updatedProductData,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Product with ID ${productId} not found for user ${userId}`,
        );
      }
      throw new InternalServerErrorException(
        `Error updating product with ID ${productId}`,
      );
    }
  }

  // Delete a specific product for a user
  @Delete(':productId')
  async deleteProduct(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    try {
      await this.productsService.deleteProduct(userId, productId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          `Product with ID ${productId} not found for user ${userId}`,
        );
      }
      throw new InternalServerErrorException(
        `Error deleting product with ID ${productId}`,
      );
    }
  }
}
