import { Point } from "geojson";
import { Ctx, Field, Float, ID, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Mycontext } from "../types/Context";
import { User } from "./User";
@ObjectType()
@Entity()
export class Listing {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column("text")
  description: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  minimumHours: string;

  @Field()
  @Column()
  studioType: string;

  @Field()
  @Column()
  studioHours: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  pastClients: string;

  @Field()
  @Column("text")
  amenities: string;

  @Field()
  @Column("text")
  mainEquipments: string;

  @Field({ nullable: true })
  @Column("text")
  policyRules: string;

  @Field(() => Float)
  @Column("double precision")
  latitude: number;

  @Field(() => Float)
  @Column("double precision")
  longitude: number;

  @Field(() => [String])
  @Column("simple-array")
  pictureUrl: string[];

  @Field(() => Float)
  @Column("decimal")
  pricePerHour: number;

  @Field()
  @Column("text")
  address: string;

  @Field(() => ID)
  @Column("uuid")
  userId: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  @Column("geometry", {
    nullable: true,
    spatialFeatureType: "Point",
    srid: 4326
  })
  @Index({ spatial: true })
  geom: Point;

  @ManyToOne(() => User, user => user.listings)
  user: Promise<User>;

  @Field(() => User)
  creator(@Ctx() { userLoader }: Mycontext): Promise<User> {
    return userLoader.load(this.userId);
  }
}
