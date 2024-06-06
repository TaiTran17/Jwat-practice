import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [];

  create(createUserDto: any) {
    this.users.push(createUserDto);
    return 'User created';
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, updateUserDto: any) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex > -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
      return 'User updated';
    }
    return 'User not found';
  }

  remove(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
    return 'User removed';
  }
}
