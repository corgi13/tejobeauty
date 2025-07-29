import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma.service";
import { RolesGuard } from "./guards/roles.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || "hard-to-guess-secret",
        signOptions: { expiresIn: "1d" },
      }),
    }),
    // UsersModule will be imported here when created
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService, RolesGuard],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
