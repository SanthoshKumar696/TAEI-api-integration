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
import { PoisonsOutcome } from './PoisonsOutcome';
import { Triage } from './Triage';

@Table({
  tableName: 'poisons',
  timestamps: false
})
export class Poisons extends Model<Poisons> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Triage)
  @Column(DataType.INTEGER) triage_id!: number;

  @Column(DataType.DATE)
  date_time_of_entry!: Date;

  @Column(DataType.BOOLEAN)
  patient_admitted!: boolean;

  @Column(DataType.STRING)
  name_of_dept!: string;

  @Column(DataType.DATE)
  date_of_admit!: Date;

  @Column(DataType.INTEGER)
  type_of_poisoning!: number;

  @Column(DataType.INTEGER)
  route_of_exposure!: number;

  @Column(DataType.INTEGER)
  substance_involved!: number;

  @Column(DataType.INTEGER)
  substance_involved_sub!: number;

  @Column(DataType.STRING)
  oth_substance_involved!: string;

  @Column(DataType.STRING)
  brand_or_product_name!: string;

  @Column(DataType.STRING)
  quantity!: string;

  @Column(DataType.INTEGER)
  source_of_substance!: number;

  @Column(DataType.ARRAY(DataType.INTEGER))
  symptoms_at_presentation!: number[];

  @Column(DataType.DATE)
  time_of_onset_of_symptoms!: Date;

  @Column(DataType.STRING)
  time_elapsed_exposure_symptom!: string;

  @Column(DataType.STRING)
  investigations_performed!: string;

  @Column(DataType.INTEGER)
  severity_of_poisoning!: number;

  @Column(DataType.ARRAY(DataType.INTEGER))
  decontamination!: number[];

  @Column(DataType.STRING)
  antidote_administered_name!: string;

  @Column(DataType.STRING)
  antidote_administered_dosage!: string;

  @Column(DataType.DATE)
  antidote_administered_timing!: Date;

  @Column(DataType.ARRAY(DataType.INTEGER))
  supportive_care_provided!: number[];

  @Column(DataType.INTEGER)
  no_of_cycles_performed!: number;

  @Column(DataType.BOOLEAN)
  counselling_provided!: boolean;

  @Column(DataType.INTEGER)
  duration_of_hospital_stay!: number;

  @Column(DataType.INTEGER) user_id!: number;
  @Column(DataType.DATE) inserted_date!: Date;
  @Column(DataType.INTEGER) ref_form_id!: number;
  @Column(DataType.INTEGER) ref_id!: number;

  // Association with poisons_outcome
  @HasOne(() => PoisonsOutcome, { foreignKey: 'poison_id', as: 'poisons_outcome' })
  poisons_outcome?: PoisonsOutcome;

  @BelongsTo(() => Triage) triage!: Triage;
}