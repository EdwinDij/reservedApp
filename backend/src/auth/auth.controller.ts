import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "../dto/index";
//import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post("register")
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    //@Res() res: Response => A décommenter quand la redirection sera en place et mettre en param de la fonction
    //const redirectUrl = await this.authService.login(loginDto);
    //res.redirect(redirectUrl.data.url);  // TODO: A décommenter quand la redirection sera en place
    return this.authService.login(loginDto); // TODO: A supprimer quand la redirection sera en place
  }
}
