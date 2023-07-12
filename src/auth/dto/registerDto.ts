import { LoginDto } from "./loginDto";

export interface RegisterDto extends LoginDto {
  name: string;
  rule: string;
}
