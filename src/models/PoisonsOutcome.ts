import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { Poisons } from './Poisons';


@Table({
  tableName: 'poisons_outcome',
  timestamps: false
})
export class PoisonsOutcome extends Model<PoisonsOutcome> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Poisons)
  @Column(DataType.INTEGER)
  poison_id!: number;

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

  @Column(DataType.INTEGER)
  hospital_type!: number;

  @Column(DataType.STRING)
  destination_hospital!: string;

  @Column(DataType.INTEGER)
  destination_taei_hospital!: number;

  @Column(DataType.INTEGER)
  reason_for_referral!: number;

  @Column(DataType.STRING)
  oth_reason_for_referral!: string;

  @Column(DataType.INTEGER)
  condition_of_patient!: number;

  @Column(DataType.STRING)
  referring_doctor!: string;

  @Column(DataType.INTEGER)
  documented_taei_sheet!: number;

  @Column(DataType.DATE)
  patient_exit_date!: Date;

  // Relation back to poisons
  @BelongsTo(() => Poisons, { foreignKey: 'poison_id', as: 'poisons' })
  poisons?: Poisons;
}