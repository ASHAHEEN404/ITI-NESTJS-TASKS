import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUser } from './DTO/createUser.dto';
import { v4 as uuid } from 'uuid';
import { UpdateUser } from './DTO/updateUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Schemas/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  // inject the Modal => name , member Variable
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  users: CreateUser[] = [];

  async findAll(): Promise<CreateUser[]> {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  // FIND One
  async findOne(id: string): Promise<CreateUser> {
    // Find by ID
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Error fetching user');
    }
  }

  // CREATE
  async create(userData: CreateUser): Promise<CreateUser> {
    try {
      const newUser = await this.userModel.create(userData);
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  // UPDATE
  async update(id: string, updateUser: UpdateUser): Promise<CreateUser> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUser,
        {
          new: true,
          runValidators: true,
        },
      );
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating user with ID ${id}`,
      );
    }

    // const userIndex = this.users.findIndex((userIndx) => userIndx.id === id);

    // if (!userIndex) throw new NotFoundException('user not Found');

    // this.users[userIndex] = { ...this.users[userIndex], ...updateUser };
    // return this.users[userIndex];
  }

  // Delete
  async delete(id: string): Promise<void> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id);
      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting user with ID ${id}`,
      );
    }
  }

  // Register User
  async registerUser(dto: CreateUser): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = this.userModel.create({
      ...dto,
      password: hashedPassword,
    });

    return (await user).save();
  }

  // Method to find a user by their username
  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ username });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user by username');
    }
  }
}
