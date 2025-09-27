/**
 * USERS SERVICE - Database operations for user management
 */
import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";   // 👈 changed here

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
  const existing = await this.findByEmail(createUserDto.email);
  if (existing) {
    throw new ConflictException("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

  const user = this.usersRepository.create({
    ...createUserDto,
    password: hashedPassword,
  });

  return this.usersRepository.save(user);
}


  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
}
