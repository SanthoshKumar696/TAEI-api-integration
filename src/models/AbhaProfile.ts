import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";
import { Triage } from "./Triage";

@Table({
  tableName: "abha_profile",
  timestamps: false
})
export class AbhaProfile extends Model<AbhaProfile> {

  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id!: number;

  

  @Column(DataType.STRING)
  abha_number!: string;

@Column(DataType.TEXT)
encrypted_profile!: string;

@Column(DataType.TEXT)
iv!: string;

@Column(DataType.TEXT)
salt!: string;

  @Column(DataType.STRING)
  created_by!: string;

  @Column(DataType.STRING)
  updated_by!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  created_on!: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  updated_on!: Date;

   @Column(DataType.TEXT)
  x_token!: string;

  @Column(DataType.TEXT)
  refresh_token!: string;

  // ✅ NEW — x_token expiry (30 min from login)
  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  x_token_expiry!: Date | null;

  // ✅ NEW — refresh token expiry (15 days from login)
  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  refresh_token_expiry!: Date | null;
}