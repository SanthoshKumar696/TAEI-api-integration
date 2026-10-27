import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { LkpStemiHospitalType, LkpStemiNstemiDeathTiming, LkpStemiNstemiOutcomeType, LkpStemiPatientCondition, LkpStemiReferralReason } from './lookup/LkpStemiModel';

@Table({
  tableName: 'stemi_others_treatment',
  timestamps: false, // We'll manage created_at, updated_at manually
})
export class StemiOthersTreatment extends Model<StemiOthersTreatment> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  triage_id!: number;

  @Column(DataType.INTEGER)
  patient_id!: number;

  @Column(DataType.BOOLEAN)
  is_procedure_done!: boolean;

  @Column(DataType.DATE)
  cathlab_arrival_date!: Date;

  @Column(DataType.INTEGER)
  hospital_stay!: number;

  @Column(DataType.INTEGER)
  procedure_id!: number;

  @Column(DataType.STRING(255))
  other_procedure!: string;  

  @ForeignKey(() => LkpStemiNstemiOutcomeType) // Replace Object with model when you define lookup table
  @Column(DataType.INTEGER)
  outcome_type_id!: number;

  @Column(DataType.DATE)
  discharge_datetime!: Date;

  @Column(DataType.DATE)
  absconded_datetime!: Date;

  @Column(DataType.DATE)
  death_datetime!: Date;

  @ForeignKey(() => LkpStemiNstemiDeathTiming)
  @Column(DataType.INTEGER)
  death_timing_id!: number;

  @Column(DataType.TEXT)
  cause_of_death!: string;

  @ForeignKey(() => LkpStemiHospitalType)
  @Column(DataType.INTEGER)
  hospital_type_id!: number;

  @Column(DataType.STRING(255))
  destination_hospital!: string;

  @ForeignKey(() => LkpStemiReferralReason)
  @Column(DataType.INTEGER)
  referral_reason_id!: number;

  @ForeignKey(() => LkpStemiPatientCondition)
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
}
