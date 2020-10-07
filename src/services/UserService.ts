import { getCustomRepository } from 'typeorm';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
// config
import authConfig from '../config/auth';
// model
import User from '../models/User';
// repository
import UserRepository from '../repositories/UserRepository';
// error
import AppError from '../exceptions/AppError';

interface CreateData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthData {
  email: string;
  password: string;
}

interface UpdateData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = getCustomRepository(UserRepository);
  }

  public async createUser({
    email,
    password,
    confirmPassword,
  }: CreateData): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new AppError('O endereço de e-mail já existe');
    }

    if (password !== confirmPassword) {
      throw new AppError('As senhas não são iguais');
    }

    const hashedPassword = await hash(password, 8);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return user;
  }

  public async authUser({
    email,
    password,
  }: AuthData): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('E-mail ou senha incorretos', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('E-mail ou senha incorretos', 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }

  public async updateUser({id, firstName, lastName, phone}: UpdateData): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new AppError('Usuário não existe');
    }

    user.first_name = firstName;
    user.last_name = lastName;
    user.phone = phone;

    await this.userRepository.save(user);

    return user;
  }
}

export default UserService;
