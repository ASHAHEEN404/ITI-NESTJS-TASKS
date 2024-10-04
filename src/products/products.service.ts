import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Products } from './Schemas/products.schema';
import { Model } from 'mongoose';
import { CreateProduct } from './DTO/createProduct.dto';
import { UpdateProduct } from './DTO/updateProduct.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products.name) private ProductModel: Model<Products>,
  ) {}

  products: CreateProduct[] = [];

  // Retrieve all products for a specific user
  async getAllProducts(userId: string): Promise<Products[]> {
    try {
      const products = await this.ProductModel.find({ userId });
      return products;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching products for user',
      );
    }
  }

  // Retrieve a specific product by user ID and product ID
  async getProductsById(userId: string, productId: string): Promise<Products> {
    try {
      const product = await this.ProductModel.findOne({
        userId,
        _id: productId,
      });
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${productId} not found for user ${userId}`,
        );
      }
      return product;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Error fetching product');
    }
  }

  // Create a new product for a specific user
  async createProduct(
    userId: string,
    productData: CreateProduct,
  ): Promise<Products> {
    try {
      const newProduct = new this.ProductModel({ ...productData, userId });
      return await newProduct.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating product');
    }
  }

  // Update a specific product for a user
  async updateProduct(
    userId: string,
    productId: string,
    updatedProductData: UpdateProduct,
  ): Promise<Products> {
    try {
      const updatedProduct = await this.ProductModel.findOneAndUpdate(
        { userId, _id: productId },
        updatedProductData,
        {
          new: true,
          runValidators: true,
        },
      );
      if (!updatedProduct) {
        throw new NotFoundException(
          `Product with ID ${productId} not found for user ${userId}`,
        );
      }
      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating product with ID ${productId}`,
      );
    }
  }

  // Delete a specific product
  async deleteProduct(userId: string, productId: string): Promise<void> {
    try {
      const deletedProduct = await this.ProductModel.findOneAndDelete({
        userId,
        _id: productId,
      });
      if (!deletedProduct) {
        throw new NotFoundException(
          `Product with ID ${productId} not found for user ${userId}`,
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting product with ID ${productId}`,
      );
    }
  }
}
