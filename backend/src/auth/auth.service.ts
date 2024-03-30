import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "../entity/users.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { SignupDto, LoginDto } from "./dto/index";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    try {
      const { email, password, username } = signupDto;
      const user = await this.usersRepository.findOne({ where: { email } });

      if (!email || !password || !username) {
        return { message: "Veuillez remplir tous les champs", status: 401 };
      }
      if (password.length < 8) {
        return {
          message: "Le mot de passe doit contenir au moins 8 caractères",
          status: 401,
        };
      }
      if (user) {
        return { message: "Un compte existe déjà avec cet email" };
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.usersRepository.save({
          email,
          password: hashedPassword,
          username,
        });

        return { message: "Utilisateur créé avec succès", status: 201 };
      }
    } catch (error: unknown) {
      console.log(error);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.usersRepository.findOne({ where: { email } });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!email || !password) {
        return { message: "Veuillez remplir tous les champs.", status: 401 };
      }
      if (!user) {
        return { messsage: "Cet utilisateur n'existe pas.", status: 401 };
      }
      if (!isPasswordValid) {
        return { message: "Mot de passe incorrect.", status: 401 };
      }
      if (user && isPasswordValid) {
        const payload = { sub: user.id, username: user.username };
        return {
          data: {
            message: "Connexion réussie",
            //url: "https://nestjs.com", modifier l'adresse de redirection une fois le front prêt
            token: await this.jwtService.signAsync(payload),
            status: 200,
          },
        };
      }
    } catch (error: unknown) {
      console.log(error);
    }
  }
}
