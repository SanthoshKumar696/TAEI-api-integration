import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasOne,
  BelongsTo,
  ForeignKey
} from 'sequelize-typescript';
import { StrokeOutcome } from './Stroke_Outcome';
import { Triage } from './Triage';

@Table({ tableName: 'stroke', timestamps: false })
export class Stroke extends Model<Stroke> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Triage)
  @Column(DataType.INTEGER) triage_id!: number;

  @Column(DataType.DATE)
  date_time_of_entry!: Date;

  @Column(DataType.INTEGER)
  arrival_time_symptoms!: number;

  @Column(DataType.INTEGER)
  reason_for_delay!: number;

  @Column(DataType.STRING)
  oth_reason_for_delay?: string;

  @Column(DataType.INTEGER)
  scene_ift!: number;

  @Column(DataType.INTEGER)
  referred_from!: number;

  @Column(DataType.INTEGER)
  reason_for_referral!: number;

  @Column(DataType.STRING)
  oth_reason_for_referral?: string;

  @Column(DataType.BOOLEAN)
  admitted?: boolean;

  @Column(DataType.DATE)
  admitted_date_time?: Date;

  @Column(DataType.BOOLEAN)
  lysis_done_outside?: boolean;

  @Column(DataType.DATE)
  lysis_done_outside_date?: Date;

  @Column(DataType.ARRAY(DataType.INTEGER))
  symptoms?: number[];

  @Column(DataType.ARRAY(DataType.INTEGER))
  risk_factors?: number[];

  @Column(DataType.STRING)
  oth_risk_factors?: string;

  @Column(DataType.STRING)
  nihs_scale!: string;

  @Column(DataType.STRING)
  pre_morbit_scroe?: string;

  @Column(DataType.BOOLEAN)
  is_absolute_contraindication?: boolean;

  @Column(DataType.STRING)
  oth_absolute_contraindication?: string;

  @Column(DataType.BOOLEAN)
  cbg?: boolean;

  @Column(DataType.DATE)
  cbg_date?: Date;

  @Column(DataType.STRING)
  cbg_txt?: string;

  @Column(DataType.BOOLEAN)
  history_of_anticoagulant?: boolean;

  @Column(DataType.BOOLEAN)
  bp_sbp?: boolean;

  @Column(DataType.BOOLEAN)
  bp_dbp?: boolean;
  
  @Column(DataType.BOOLEAN)
  aspect_score?: string;

  @Column(DataType.BOOLEAN)
  ct_scan?: boolean;

  @Column(DataType.DATE)
  ct_scan_date?: Date;

  @Column(DataType.STRING)
  ct_scan_findings?: string;

  @Column(DataType.BOOLEAN)
  mri_scan?: boolean;

  @Column(DataType.DATE)
  mri_scan_date?: Date;

  @Column(DataType.INTEGER)
  mri_scan_eligibility?: number;

  @Column(DataType.BOOLEAN)
  mri_scan_eligility_status?: boolean;

  @Column(DataType.BOOLEAN)
  cath_lab_procedure?: boolean;

  @Column(DataType.DATE)
  cath_lab_procedure_date?: Date;

  @Column(DataType.STRING)
  cath_lab_findings?: string;

  @Column(DataType.BOOLEAN)
  procedure_done?: boolean;

  @Column(DataType.STRING)
  name_of_procedure?: string;

  @Column(DataType.INTEGER)
  type?: number;

  @Column(DataType.STRING)
  hemorrhagic_specify?: string;

  @Column(DataType.BOOLEAN)
  lysis_done?: boolean;

  @Column(DataType.DATE)
  lysis_date?: Date;

  @Column(DataType.INTEGER)
  thrombolysis_by_drug?: number;

  @Column(DataType.BOOLEAN)
  thrombectomy?: boolean;

  @Column(DataType.STRING)
  thrombectomy_dtls?: string;

  @Column(DataType.BOOLEAN)
  decompression_craniectomy?: boolean;

  @Column(DataType.STRING)
  decompression_craniectomy_dtls?: string;

  @Column(DataType.STRING)
  drug_prescribed?: string;

  @Column(DataType.INTEGER) user_id!: number;
  @Column(DataType.DATE) inserted_date!: Date;
  @Column(DataType.INTEGER) ref_form_id!: number;
  @Column(DataType.INTEGER) ref_id!: number;

  // Relations
  @HasOne(() => StrokeOutcome, { foreignKey: 'stroke_id', as: 'outcome' })
  outcome?: StrokeOutcome;

  @BelongsTo(() => Triage) triage!: Triage;
}