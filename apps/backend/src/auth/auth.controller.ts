import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserSchema } from '@opendevelopment/shared-types';
import { AuthService } from './auth.service.js';
import { CurrentUser, Public } from './decorators.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { z } from 'zod';

const LoginSchema = z.object({ email: z.string().email() });

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body(new ZodValidationPipe(CreateUserSchema)) body: z.infer<typeof CreateUserSchema>) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  login(@Body(new ZodValidationPipe(LoginSchema)) body: z.infer<typeof LoginSchema>) {
    return this.authService.login(body.email);
  }

  @Get('me')
  me(@CurrentUser() user: any) {
    return { user };
  }
}
