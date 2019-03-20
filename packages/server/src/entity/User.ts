import * as GraphQLJSON from "graphql-type-json";
import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { SocialMedia } from "../types/SocialMedia";
import { Listing } from "./Listing";

@ObjectType()
@Entity("users")
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @Field()
  @Column({ length: 255, unique: true })
  email: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column("jsonb", { nullable: true })
  socialMedia: SocialMedia;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  biography: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  avatar: string;

  @Field()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column({ nullable: true })
  password: string;

  // todo : default to false
  @Column({ default: true })
  confirmed: boolean;

  @Column({ default: false })
  forgotPasswordLocked: boolean;

  @Column("text", { nullable: true, unique: true })
  googleId: string;

  @OneToMany(() => Listing, listing => listing.user)
  listings: Promise<Listing[]>;
}
