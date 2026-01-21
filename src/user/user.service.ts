import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    // 检查用户名是否已存在
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('用户名或邮箱已存在');
    }

    // 创建新用户
    // 密码加密会在 Schema 的 pre('save') 钩子里自动进行
    const newUser = new this.userModel({
      username,
      email,
      password,
    });

    await newUser.save();

    // 返回用户信息（不返回密码）
    const result = newUser.toObject();
    delete result.password;

    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const token = this.jwtService.sign({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    const userInfo = user.toObject();
    delete userInfo.password;

    return {
      user: userInfo,
      token,
    };
  }
}
