import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasOne,
  BelongsTo,
  ForeignKey,
  HasMany
} from 'sequelize-typescript';
import { BurnsOutcome } from './BurnsOutcome';
import { BurnsValues } from './BurnsValues';
import { Triage } from './Triage';
import { BurnsTbsa } from './BurnsTbsa';
import { BurnsSurgeryElective } from './BurnsSurgeryElective';

@Table({ tableName: 'burns', timestamps: false })
export class Burns extends Model<Burns> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Triage)
  @Column(DataType.INTEGER) triage_id!: number;

  @Column(DataType.BOOLEAN)
  admitted!: boolean;

  @Column(DataType.DATE)
  admission_date!: Date;

  @Column(DataType.INTEGER)
  type_of_burn!: number;

  @Column(DataType.BOOLEAN)
  inhalation!: boolean;

  @Column(DataType.STRING)
  oth_type_of_burn!: string;

  @Column(DataType.INTEGER)
  mode_of_injury!: number;
  
  @Column(DataType.STRING)
  oth_mode_of_injury!: string;

  @Column(DataType.INTEGER)
  place_of_incident!: number;

  @Column(DataType.STRING)
  oth_place_of_incident!: string;

  @Column(DataType.ARRAY(DataType.INTEGER))
  tbsa!: number[];

  @Column(DataType.STRING)
  tbsa_total_per!: string;

  @Column(DataType.INTEGER)
  degree_of_burn!: number;

  @Column(DataType.STRING)
  associated_injuries!: string;

  @Column(DataType.ARRAY(DataType.INTEGER))
  co_morbidities!: number[];

  @Column(DataType.BOOLEAN)
  is_pregnant!: boolean;

  @Column(DataType.BOOLEAN)
  is_fluid_resuscitation_given!: boolean;

  @Column(DataType.BOOLEAN)
  is_mechanical_ventillation!: boolean;

  @Column(DataType.INTEGER) user_id!: number;
  @Column(DataType.DATE) inserted_date!: Date;
  @Column(DataType.INTEGER) ref_form_id!: number;
  @Column(DataType.INTEGER) ref_id!: number;

  // Associations
  @HasOne(() => BurnsValues, { foreignKey: 'burns_id', as: 'burns_values' })
  burns_values?: BurnsValues;

  @HasOne(() => BurnsOutcome, { foreignKey: 'burns_id', as: 'burns_outcome' })
  burns_outcome?: BurnsOutcome;

  @HasOne(() => BurnsTbsa, { foreignKey: 'burns_id', as: 'burns_tbsa' })
  burns_tbsa?: BurnsTbsa;

  @HasMany(() => BurnsSurgeryElective, { foreignKey: 'burns_id', as: 'burns_surgery_elective' })
  burns_surgery_elective?: BurnsSurgeryElective;

  @BelongsTo(() => Triage) triage!: Triage;
}