import {
  Body,
  Controller,
  Post,
  Get,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, VerifyOtpDto, ResetPasswordDto } from './auth.dto';
import { Public } from './auth.decorators';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() data: AuthDto) {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException(
        'Password and Confirm Password do not match.',
      );
    }
    delete data.confirmPassword;

    return this.authService.registerAuth(data);
  }

  @Public()
  @Post('/login')
  async login(
    @Body() { email, password }: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const { access_token } = await this.authService.signIn(email, password);

    response.cookie('jwt', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000,
    });

    return {
      message: 'Login successful',
    };
  }

  @Public()
  @Post('/send-otp')
  async sendOTP(
    @Body() { email }: { email: string },
    @Res() response: Response,
  ) {
    await this.authService.generateAndSendOTP(email);

    return response.status(200).json({
      message: 'OTP sent successfully. Please check your email.',
    });
  }

  @Post('/verify-otp')
  async verifyOTP(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string }> {
    const { email, otp } = verifyOtpDto;
  
    await this.authService.verifyOTP(email, otp);
  
    return {
      message: 'OTP verified successfully.',
    };
  }
  
  @Post('/reset-password')
  async resetPassword(
    @Body() { email, password, confirmPassword }: ResetPasswordDto ,
  ): Promise<{ message: string }> {
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and Confirm Password do not match.',
      );
    }
  
    await this.authService.resetPassword(email, password);
  
    return {
      message: 'Password reset successfully.',
    };
  }

  @Get('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'Logout successful',
    };
  }
}
