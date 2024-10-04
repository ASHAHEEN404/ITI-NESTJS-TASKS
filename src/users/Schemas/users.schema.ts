import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, match: emailRegex })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  roles: string[];

  @Prop({ required: true })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
