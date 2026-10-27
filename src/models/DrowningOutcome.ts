import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Default,
} from 'sequelize-typescript';

@Table({ tableName: 'drowning_outcome', timestamps: false })
export class DrowningOutcome extends Model<DrowningOutcome> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  triage_id!: number;

  @Column(DataType.INTEGER)
  outcome_type_id!: number;

  @Column(DataType.BOOLEAN)
  is_discharged!: boolean;
  
  @Column(DataType.DATE)
  discharge_datetime!: Date;

  @Column(DataType.DATE)
  absconded_datetime!: Date;

  @Column(DataType.DATE)
  death_datetime!: Date;

  @Column(DataType.TEXT)
  cause_of_death!: string;

  @Column(DataType.INTEGER)
  hospital_type_id!: number;

  @Column(DataType.STRING(255))
  destination_hospital!: string;

  @Column(DataType.INTEGER)
  referral_reason_id!: number;

  @Column(DataType.INTEGER)
  patient_condition_id!: number;

  @Column(DataType.STRING(150))
  referring_doctor!: string;

  @Column(DataType.BOOLEAN)
  documented_in_taei_case_sheet!: boolean;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updated_at!: Date;

  @Column(DataType.STRING(150))
  other_reason_referral!: string;

  @Column(DataType.INTEGER)
  destination_taei_hospital!: number;

}