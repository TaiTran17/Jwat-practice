import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: User): User {
    return this.userService.createUser(user);
  }

  @Get()
  getUserList(@Query('search') search: string): User[] {
    return this.userService.getUserList(search);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string): boolean {
    return this.userService.deleteUserById(Number(id));
  }

  @Get(':id')
  getUserById(@Param('id') id: string): User {
    return this.userService.getUserById(Number(id));
  }

  @Patch(':id')
  updateUserById(@Param('id') id: string, @Body() updatedUser: User): boolean {
    return this.userService.updateUserById(Number(id), updatedUser);
  }
}
