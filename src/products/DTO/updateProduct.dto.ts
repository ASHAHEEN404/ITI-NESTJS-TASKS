import { PartialType } from '@nestjs/mapped-types';
import { CreateProduct } from './createProduct.dto';

export class UpdateProduct extends PartialType(CreateProduct) {}
