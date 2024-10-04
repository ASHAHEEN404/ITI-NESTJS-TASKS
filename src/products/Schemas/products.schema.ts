import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Types } from 'mongoose';
@Schema({ timestamps: true })
export class Products {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // Reference to the User who owns this product

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  category: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop([String])
  images: string[];

  @Prop({ default: 0 })
  stock: number;
  @Prop()
  sku: string;

  @Prop({ default: Date.now })
  addedDate: Date; // Date the product was added
}

export const ProductSchema = SchemaFactory.createForClass(Products);
