import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt_constant:
    process.env.JWT_CONSTANT || 'SUPER SECRET SUPER AMAZING AUTH TOKEN',
}));
