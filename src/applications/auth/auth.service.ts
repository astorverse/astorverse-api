import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dayjs } from 'dayjs';
import { GetTokensUseCase } from 'src/applications/auth/useCases/GetTokensUseCase/GetTokensUseCase';

@Injectable()
export class AuthService {
  constructor(
    private readonly getTokensUseCase: GetTokensUseCase,
    private readonly configService: ConfigService,
  ) {}

  async login(
    kakaoId: number,
  ): Promise<{ accessToken: string; accessTokenExpiresAt: Dayjs }> {
    const allowedUser = this.configService.get<number>('allowedUser');
    if (kakaoId !== allowedUser) {
      throw new UnauthorizedException('Invalid user');
    }
    const tokens = await this.getTokensUseCase.execute({
      payload: { kakaoId: String(kakaoId) },
    });
    return tokens;
  }
}
