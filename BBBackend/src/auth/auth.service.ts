import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CustomersService } from '../customers/customers.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterCustomerDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private customersService: CustomersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async validateCustomer(username: string, pass: string): Promise<any> {
    const customer = await this.customersService.findByUsername(username);
    if (customer && customer.passwordHash) {
      const isMatch = await bcrypt.compare(pass, customer.passwordHash);
      if (isMatch) {
        const { passwordHash, ...result } = customer;
        return result;
      }
    }
    return null;
  }

  async loginUser(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role, 
      tenantId: user.tenantId,
      type: 'USER'
    };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      tenantId: user.tenantId,
    };
  }

  async loginCustomer(customer: any) {
    const payload = {
      username: customer.username,
      sub: customer.id,
      role: 'CUSTOMER',
      tenantId: customer.tenantId,
      type: 'CUSTOMER'
    };
    return {
      access_token: this.jwtService.sign(payload),
      role: 'CUSTOMER',
      tenantId: customer.tenantId,
    };
  }

  async registerCustomer(dto: RegisterCustomerDto) {
    const customer = await this.customersService.create(dto);
    return this.loginCustomer(customer);
  }
}
