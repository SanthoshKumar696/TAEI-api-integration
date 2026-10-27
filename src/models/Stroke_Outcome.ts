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
import { Stroke } from './Stroke';


// ==================== StrokeOutcome ====================
@Table({ tableName: 'stroke_outcome', timestamps: false })
export class StrokeOutcome extends Model<StrokeOutcome> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Stroke)
  @Column(DataType.INTEGER)
  stroke_id!: number;

  @Column(DataType.INTEGER)
  outcome!: number;

  @Column(DataType.BOOLEAN)
  is_discharged!: boolean;

  @Column(DataType.DATE)
  discharge_date!: Date;

  @Column(DataType.DATE)
  discharge_static_date!: Date;

  @Column(DataType.DATE)
  dama_date!: Date;

  @Column(DataType.DATE)
  absconded_date!: Date;

  @Column(DataType.DATE)
  death_date!: Date;

  @Column(DataType.DATE)
  transferred_ward_date!: Date;

  @Column(DataType.DATE)
  transferred_icu_date!: Date;

  @Column(DataType.STRING)
  cause_of_death!: string;

  @Column(DataType.INTEGER)
  transferred_to?: number;

  @Column(DataType.INTEGER)
  hospital_type?: number;

  @Column(DataType.STRING)
  destination_hospital!: string;

  @Column(DataType.INTEGER)
  destination_taei_hospital!: number;

  @Column(DataType.INTEGER)
  reason_for_referral?: number;

  @Column(DataType.INTEGER)
  condition_of_patient?: number;

  @Column(DataType.STRING)
  referring_doctor?: string;

  @Column(DataType.INTEGER)
  documented_taei_sheet?: number;

  @Column(DataType.STRING)
  treatment_given?: string;

  @Column(DataType.STRING)
  drug_prescribed?: string;

  @Column(DataType.NUMBER)
  duration_stay?: number;

  @BelongsTo(() => Stroke, { as: 'stroke' })
  stroke!: Stroke;
}
