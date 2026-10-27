import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Prem } from './Prem';

@Table({ tableName: 'prem_outcome', timestamps: false })
export class PremOutcome extends Model<PremOutcome> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => Prem)
  @Column
  prem_id!: number;

  @Column(DataType.INTEGER) outcome!: number;
  @Column(DataType.BOOLEAN) shifted_to_picu!: boolean;
  @Column(DataType.BOOLEAN) is_discharged!: boolean;
  @Column(DataType.DATE) discharge_date!: Date;
  @Column(DataType.DATE) absconded_date!: Date;
  @Column(DataType.DATE) death_date!: Date;
  @Column(DataType.STRING) cause_of_death!: string;
  @Column(DataType.INTEGER) hospital_type!: number;
  @Column(DataType.STRING) destination_hospital!: string;
  @Column(DataType.INTEGER) destination_taei_hospital!: number;
  @Column(DataType.INTEGER) reason_for_referral!: number;
  @Column(DataType.INTEGER) condition_of_patient!: number;
  @Column(DataType.STRING) referring_doctor!: string;
  @Column(DataType.INTEGER) patient_stabilised_referral!: number;
  @Column(DataType.DATE) patient_exit_date!: Date;

  @BelongsTo(() => Prem)
  prem!: Prem;
}
