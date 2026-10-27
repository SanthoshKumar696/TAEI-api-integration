import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsTo,
  ForeignKey
} from 'sequelize-typescript';
import { Burns } from './Burns';

@Table({ tableName: 'burns_outcome', timestamps: false })
export class BurnsOutcome extends Model<BurnsOutcome> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Burns)
  @Column(DataType.INTEGER)
  burns_id!: number;

  @BelongsTo(() => Burns)
  burns!: Burns;

  @Column(DataType.INTEGER)
  outcome!: number;

  @Column(DataType.BOOLEAN)
  is_discharged!: boolean;

  @Column(DataType.DATE)
  discharge_date!: Date;

  @Column(DataType.DATE)
  absconded_date!: Date;

  @Column(DataType.DATE)
  death_date!: Date;

  @Column(DataType.STRING)
  causeofdeath!: string;

  @Column(DataType.INTEGER)
  transferred_to!: number;

  @Column(DataType.DATE)
  ward_datetime!: Date;

  @Column(DataType.STRING)
  ward_name!: string;

  @Column(DataType.DATE)
  icu_datetime!: Date;

  @Column(DataType.INTEGER)
  hospital_type!: number;

  @Column(DataType.STRING)
  destination_hospital!: string;

  @Column(DataType.INTEGER)
  destination_taei_hospital!: number;

  @Column(DataType.INTEGER)
  reason_for_referral!: number;

  @Column(DataType.INTEGER)
  condition_of_patient!: number;

  @Column(DataType.STRING)
  referring_doctor_name!: string;

  @Column(DataType.BOOLEAN)
  documented_taei_sheet!: boolean;

  @Column(DataType.DATE)
  patient_exit_date!: Date;
}