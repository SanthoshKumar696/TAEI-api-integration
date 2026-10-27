import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Hanging } from './Hanging';
import { LkpHangingOutcome } from './lookup/LkpHangingModel';
import { LkpHospitalType, LkpDestinationHospital, LkpReasonForReferral, LkpConditionOfPatient, LkpHospitals } from './lookup/LkpCommonModel';

@Table({ tableName: 'hanging_outcome', timestamps: false })
export class HangingOutcome extends Model<HangingOutcome> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  // Parent reference
  @ForeignKey(() => Hanging)
  @Column(DataType.INTEGER)
  hanging_id!: number;

  // Lookup references
  @ForeignKey(() => LkpHangingOutcome)
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

  @Column(DataType.STRING(256))
  cause_of_death!: string;

  @ForeignKey(() => LkpHospitalType)
  @Column(DataType.INTEGER)
  hospital_type?: number;

  @Column(DataType.STRING)
  destination_hospital!: string;

  @ForeignKey(() => LkpHospitals)
  @Column(DataType.INTEGER)
  destination_taei_hospital!: number;

  @ForeignKey(() => LkpReasonForReferral)
  @Column(DataType.INTEGER)
  reason_for_referral?: number;

  @ForeignKey(() => LkpConditionOfPatient)
  @Column(DataType.INTEGER)
  condition_of_patient?: number;

  @Column(DataType.STRING(256))
  referring_doctor?: string;

  @Column(DataType.BOOLEAN)
  documented_taei_sheet?: boolean;

  @BelongsTo(() => Hanging, { as: 'hanging' })
  hanging!: Hanging;
}
