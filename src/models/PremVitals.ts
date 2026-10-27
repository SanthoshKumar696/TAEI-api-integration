import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Prem } from './Prem';

@Table({ tableName: 'prem_vitals', timestamps: false })
export class PremVitals extends Model<PremVitals> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => Prem)
  @Column
  prem_id!: number;

  @Column(DataType.INTEGER) airway!: number;
  @Column(DataType.INTEGER) breathing!: number;
  @Column(DataType.INTEGER) circulation_hr!: number;
  @Column(DataType.INTEGER) perfusion!: number;
  @Column(DataType.INTEGER) liver_span!: number;
  @Column(DataType.INTEGER) systolic_bp!: number;
  @Column(DataType.INTEGER) map!: number;
  @Column(DataType.INTEGER) disability!: number;
  @Column(DataType.INTEGER) tone_posture!: number;
  @Column(DataType.INTEGER) eye_position_movements!: number;
  @Column(DataType.INTEGER) pupils!: number;
  @Column(DataType.INTEGER) diagnosis!: number;
  @Column(DataType.INTEGER) diagnosis_refvalue!: number;
  @Column(DataType.ARRAY(DataType.INTEGER)) procedures_done!: number[];
  @Column(DataType.STRING) treatment_given!: string;

  @BelongsTo(() => Prem)
  prem!: Prem;
}
