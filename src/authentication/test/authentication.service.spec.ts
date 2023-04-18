
import { AuthenticationService } from '../authentication.service';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import mockedConfigService from "../../utils/mocks/config.service"; 
import mockedJwtService from '../../utils/mocks/jwt.service';
describe('The AuthenticationService', () => {
  let authenticationService : AuthenticationService;

  beforeEach(async ()=>{
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide:getRepositoryToken(User),
          useValue:{}
        },
        {
          provide:ConfigService,
          useValue: mockedConfigService
        },
        {
          provide:JwtService,
          useValue:mockedJwtService
        }
      ],
    }).compile();
    authenticationService = await module.get<AuthenticationService>(AuthenticationService);
   
  })
  
  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId)
      ).toEqual('string')
    })
  });

 
});