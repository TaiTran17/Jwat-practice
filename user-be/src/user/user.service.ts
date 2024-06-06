import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private currentId = 1;
  private users: User[] = [];

  createUser(user: User): User | null {
    if (!user.username) {
      throw new Error('Username cannot be null or undefined.');
    }

    const existingUser = this.users.find((u) => u.username === user.username);
    if (existingUser) {
      throw new Error('Username already exists.');
    }

    const newUser: User = {
      id: this.currentId++,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
      project: user.project,
      activeYn: user.activeYn,
    };

    console.log('Current ID:', this.currentId); // Log currentId
    console.log('New User:', newUser); // Log newUser

    this.users.push(newUser);
    return newUser;
  }

  getUserList(search: string = ''): User[] {
    if (!search.trim()) {
      return this.users;
    }

    const lowerSearch = search.toLowerCase();
    return this.users.filter(
      (user) =>
        user.username.toLowerCase().includes(lowerSearch) ||
        user.role.toLowerCase().includes(lowerSearch) ||
        user.project.toLowerCase().includes(lowerSearch) ||
        user.fullname.toLowerCase().includes(lowerSearch),
    );
  }

  deleteUserById(id: number): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  getUserById(id: number): User | undefined {
    console.log(this.users);
    return this.users.find((user) => user.id === id);
  }

  updateUserById(id: number, updatedUser: User): boolean {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updatedUser };
      return true;
    }
    return false;
  }
}
