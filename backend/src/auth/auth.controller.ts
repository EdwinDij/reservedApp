import { Body, Controller, Post } from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("register")
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
