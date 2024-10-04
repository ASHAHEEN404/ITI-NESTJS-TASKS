import { CreateUser } from './createUser.dto';

declare const UpdateUser_base: import('@nestjs/mapped-types').MappedType<
  Partial<Omit<CreateUser, 'password'>>
>;
export declare class UpdateUser extends UpdateUser_base {}
export {};
