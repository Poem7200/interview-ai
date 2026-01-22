import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseUtil } from 'src/common/utils/response.util';
import { Public } from 'src/auth/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Public()
  register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Post('login')
  @Public()
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Get('info')
  async getUserInfo(@Req() req: any) {
    const { userId } = req.user;
    const userInfo = await this.userService.getUserInfo(userId);
    return ResponseUtil.success(userInfo, '获取成功')
  }

  /**
   * 获取用户消费记录（包括简历押题、专项面试、综合面试）
   */
  @Get('consumption-records')
  @UseGuards(JwtAuthGuard)
  async getUserConsumptionRecords(
    @Req() req: any,
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 20,
  ) {
    const { userId } = req.user;
    const result = await this.userService.getUserConsumptionRecords(userId, {
      skip,
      limit,
    });
    return ResponseUtil.success(result, '获取成功');
  }
}
