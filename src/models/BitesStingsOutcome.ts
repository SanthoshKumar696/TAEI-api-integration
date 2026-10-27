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
import { BitesStings } from './BitesStings';
import { LkpBiteOutcome } from './lookup/LkpBitesStingsModel';
import { LkpConditionOfPatient, LkpDestinationHospital, LkpHospitals, LkpHospitalType, LkpReasonForReferral } from './lookup/LkpCommonModel';

@Table({ tableName: 'bites_stings_outcome', timestamps: false })
export class BitesStingsOutcome extends Model<BitesStingsOutcome> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  // Parent reference
  @ForeignKey(() => BitesStings)
  @Column(DataType.INTEGER)
  bites_stings_id!: number;

  @BelongsTo(() => BitesStings)
  bitesStings!: BitesStings;

  // Lookup references
  @ForeignKey(() => LkpBiteOutcome)
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

  @Column(DataType.DATE)
  patient_exit_date!: Date;

  // Relation back to poisons
  @BelongsTo(() => BitesStings, { foreignKey: 'bites_stings_id', as: 'bites_stings' })
  poisons?: BitesStings;
}
