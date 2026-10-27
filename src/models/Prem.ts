import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, HasOne, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { PremVitals } from './PremVitals';
import { PremOutcome } from './PremOutcome';
import { Triage } from './Triage';

@Table({ tableName: 'prem', timestamps: false })
export class Prem extends Model<Prem> {
  @PrimaryKey
  @AutoIncrement
  @Column
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

  @Column(DataType.BOOLEAN)
  is_prem_casesheet_used!: boolean;

  @Column(DataType.ARRAY(DataType.INTEGER))
  presenting_complaints_prem!: number[];

  @Column(DataType.STRING)
  oth_presenting_complaints_prem!: string;

  @Column(DataType.DECIMAL(5, 2))
  temperature!: number;

  @Column(DataType.DECIMAL(5, 2))
  approx_weight!: number;

  @Column(DataType.DECIMAL(6, 2))
  cbg!: number;

  @Column(DataType.INTEGER)
  development!: number;

  @Column(DataType.BOOLEAN)
  co_morbid_conditions!: boolean;

  @Column(DataType.INTEGER)
  triage_flag!: number;

  @Column(DataType.INTEGER) user_id!: number;
  @Column(DataType.DATE) inserted_date!: Date;
  @Column(DataType.INTEGER) ref_form_id!: number;
  @Column(DataType.INTEGER) ref_id!: number;

  // Relation
  @HasOne(() => PremVitals, { foreignKey: 'prem_id', as: 'vitals' })
  vitals?: PremVitals;

  // Relation
  @HasOne(() => PremOutcome, { foreignKey: 'prem_id', as: 'outcome' })
  outcome?: PremOutcome;

  @BelongsTo(() => Triage) triage!: Triage;
}
