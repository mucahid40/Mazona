import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column
} from "typeorm";
import { Exclude } from "class-transformer";
import { MinLength, IsString, IsEmail, IsNumber, IsDate } from "class-validator";
import * as bcrypt from "bcrypt";

//table creation
@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @IsEmail()
  @Column("text")
  email!: string;

  @IsString()
  @MinLength(8, { message: "Too short, you're at $value out of $constraint1"})
  @Column("text")
  @Exclude({ toPlainOnly: true })
  password!: string;

  @IsString()
  @MinLength(2, { message: "Too short to call it a name"})
  @Column("text")
  firstName!: string;

  @IsString()
  @MinLength(2, { message : "Too short to call it a lastname"})
  @Column("text")
  lastName!: string;

  @IsNumber()
  @Column({type: "numeric", nullable: true})
  phoneNumber?: number;

  @IsString()
  @Column("text")
  country!: string

  @IsString()
  @Column("text")
  city!: string

  @IsString()
  @Column({type: "text", nullable: true})
  street?: string

  @IsString()
  @Column("text")
  postalCode!: string

  @IsNumber()
  @Column("numeric")
  houseNumber!: number

  @IsString()
  @Column({type: "text", nullable: true})
  picture?: string

  //initial creation date
  @CreateDateColumn({ type: "timestamp with time zone", nullable: true })
  created!: Date;

  //hashing given password to make passwords more protected
  async setPassword(rawPassword: string) {
    const hash = await bcrypt.hash(rawPassword, 10);
    this.password = hash;
  }

  checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password);
  }
}
