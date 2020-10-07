import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
// model
import User from '../models/User';
// repository
import UserRepository from '../repositories/UserRepository';
// service
import UserService from '../services/UserService';

class UserController {
  // private userService: UserService;

  // constructor() {
  //   this.userService = new UserService();
  // }

  public async store(
    request: Request,
    response: Response,
  ): Promise<Response<User>> {
    const { email, password, confirmPassword } = request.body;
    const userService = new UserService();

    const user = await userService.createUser({
      email,
      password,
      confirmPassword,
    });

    const formattedUser = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    return response.json(formattedUser);
  }

  public async index(
    request: Request,
    response: Response,
  ): Promise<Response<User[]>> {
    const userRepository = getCustomRepository(UserRepository);
    const users = await userRepository.find();

    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));

    return response.json(formattedUsers);
  }

  public async auth(
    request: Request,
    response: Response,
  ): Promise<Response<{ user: User; token: string }>> {
    const { email, password } = request.body;
    const userService = new UserService();

    const { user, token } = await userService.authUser({
      email,
      password,
    });

    const formattedUser = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    return response.json({ user: formattedUser, token });
  }

  public async update(
    request: Request,
    response: Response,
  ): Promise<Response<User>> {
    const { firstName, lastName, phone } = request.body;
    const userService = new UserService();

    const user = await userService.updateUser({
      id: request.requestUser.id,
      firstName,
      lastName,
      phone
    });

    const formattedUser = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    return response.json(formattedUser);
  }
}

export default UserController;
