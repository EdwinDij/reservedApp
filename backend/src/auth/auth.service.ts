import { SignupDto } from "./dto/signup.dto";
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "../entity/users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signup(signupDto: SignupDto) {
    const user = new User();
    user.username = signupDto.username;
    user.email = signupDto.email;
    user.password = await bcrypt.hash(signupDto.password, 10);
    return this.usersRepository.save(user);
  }
}
