import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUser } from './DTO/createUser.dto';
import { UpdateUser } from './DTO/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private _UserService: UsersService) {}

  // register
  @Post('register')
  async register(@Body() createUser: CreateUser) {
    return this._UserService.registerUser(createUser);
  }

  @Get()
  find(): Promise<CreateUser[]> {
    return this._UserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CreateUser> {
    return this._UserService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true })) // strip undefiend propertiy
  create(@Body() user: CreateUser): Promise<CreateUser> {
    HttpCode(HttpStatus.CREATED); // 201
    return this._UserService.create(user);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(
    @Param('id') userId: string,
    @Body() updateUser: UpdateUser,
  ): Promise<CreateUser> {
    return this._UserService.update(userId, updateUser);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string): void {
    this._UserService.delete(id);
  }
}
