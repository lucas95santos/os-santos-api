import { EntityRepository, Repository } from 'typeorm';
// model
import User from '../models/User';

@EntityRepository(User)
class UserRepository extends Repository<User> {}

export default UserRepository;
