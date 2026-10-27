import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsTo,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';
import { Triage } from './Triage';
import { EmoTriageOutcome } from './EmoTriageOutcome';

@Table({
  tableName: 'emo_triage',
  timestamps: false,
})
export class EmoTriage extends Model<EmoTriage> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Triage)
  @Column(DataType.INTEGER) triage_id!: number;

  @Column(DataType.ARRAY(DataType.INTEGER))
  past_history!: number[]; // FK to lkp_emo_past_history

  @Column(DataType.STRING(256))
  diagnosis!: string;

  @Column(DataType.INTEGER)
  emergency_category!: number; // FK lkp_emo_emergency_category

  @Column(DataType.STRING(256))
  oth_emergency_category!: string;

  @Column(DataType.BOOLEAN)
  is_patient_smells_alcohol!: boolean;

  @Column(DataType.BOOLEAN)
  is_alcohol_consumption!: boolean;

  @Column(DataType.BOOLEAN)
  is_drunken_drive_history!: boolean;

  @Column(DataType.DATE)
  time_of_examination!: Date;

  @Column(DataType.INTEGER)
  memory!: number; // FK lkp_emo_recall_info

  @Column(DataType.INTEGER)
  self_control!: number; // FK lkp_emo_recall_info

  @Column(DataType.BOOLEAN)
  is_smell_in_breath!: boolean;

  @Column(DataType.BOOLEAN)
  is_urine_alchol_concentration!: boolean;

  @Column(DataType.INTEGER)
  speech!: number; // FK lkp_emo_speech

  @Column(DataType.INTEGER)
  general_disposition!: number; // FK lkp_emo_gen_disposition

  @Column(DataType.INTEGER)
  clothing!: number; // FK lkp_emo_clothing

  @Column(DataType.INTEGER)
  reaction_time!: number; // FK lkp_emo_recall_info

  @Column(DataType.INTEGER)
  orientation_time!: number; // FK lkp_emo_orientation_time

  @Column(DataType.BOOLEAN)
  is_drug_abuse!: boolean;

  @Column(DataType.BOOLEAN)
  is_mlc!: boolean;

  @Column(DataType.STRING(256))
  ar_number!: string;

  @Column(DataType.DATEONLY)
  mlc_date!: Date;

  @Column(DataType.TIME)
  mlc_time!: string;

  @Column(DataType.STRING(155))
  pain_scale!: string;

  @Column(DataType.STRING(25))
  pain_score!: string;

  @Column(DataType.STRING(256))
  treatment_given!: string;

  @Column(DataType.INTEGER)
  emo_trauma_treatment!: number; // FK lkp_emo_trauma_treatment

  @Column(DataType.STRING(256))
  name_of_the_emo!: string;

  @Column(DataType.INTEGER) user_id!: number;
  @Column(DataType.DATE) inserted_date!: Date;

  @BelongsTo(() => Triage) triage!: Triage;

  @HasOne(() => EmoTriageOutcome, { foreignKey: 'emo_id', as: 'outcome' })
  outcome?: EmoTriageOutcome;

}
