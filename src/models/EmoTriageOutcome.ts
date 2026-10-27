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
import { EmoTriage } from './EmoTriageModel';
import { LkpHospitalType, LkpHospitals, LkpReasonForReferral, LkpConditionOfPatient } from './lookup/LkpCommonModel';
import { LkpEmoOutcome } from './lookup/LkpEmoTriageModels';

@Table({
  tableName: 'emo_triage_outcome',
  timestamps: false,
})
export class EmoTriageOutcome extends Model<EmoTriageOutcome> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => EmoTriage)
  @Column(DataType.INTEGER)
  emo_id!: number;

  @BelongsTo(() => EmoTriage)
  emo_triage!: EmoTriage;

  @ForeignKey(() => LkpEmoOutcome)
  @Column(DataType.INTEGER)
  outcome!: number;

  @Column(DataType.BOOLEAN)
  is_discharged!: boolean;

  @Column(DataType.DATE)
  outcome_datetime!: Date;

  @Column(DataType.STRING(256))
  sent_to!: string;

  @ForeignKey(() => LkpHospitalType)
  @Column(DataType.INTEGER)
  hospital_type!: number;

  @Column(DataType.STRING(256))
  destination_hospital!: string;

  @ForeignKey(() => LkpHospitals)
  @Column(DataType.INTEGER)
  destination_taei_hospital!: number;

  @ForeignKey(() => LkpReasonForReferral)
  @Column(DataType.INTEGER)
  reason_for_referral!: number;

  @ForeignKey(() => LkpConditionOfPatient)
  @Column(DataType.INTEGER)
  condition_of_patient!: number;

  @Column(DataType.STRING(256))
  referring_doctor_name!: string;
}
