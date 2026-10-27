import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsTo,
  ForeignKey
} from 'sequelize-typescript';
import { Burns } from './Burns';

@Table({ tableName: 'burns_values', timestamps: false })
export class BurnsValues extends Model<BurnsValues> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Burns)
  @Column(DataType.INTEGER)
  burns_id!: number;

  @BelongsTo(() => Burns)
  burns!: Burns;

  @Column(DataType.INTEGER)
  wound_management!: number;

  @Column(DataType.BOOLEAN)
  wound_management_conservative!: boolean;

  @Column(DataType.INTEGER)
  conservative!: number;

  @Column(DataType.BOOLEAN)
  hyper_baric!: boolean;

  @Column(DataType.INTEGER)
  hyper_baric_nos!: number;

  @Column(DataType.STRING)
  oth_conservative!: string;

  @Column(DataType.INTEGER)
  surgery_emergency!: number;

  @Column(DataType.STRING)
  oth_surgery_emergency!: string;

  @Column(DataType.BOOLEAN)
  is_surgery_emergency!: boolean;

  @Column(DataType.DATE)
  surgery_performed_date!: Date;

  @Column(DataType.BOOLEAN)
  is_surgery_elective_performed!: boolean;

  // @Column(DataType.INTEGER)
  // surgery_elective!: number;

  // @Column(DataType.DATE)
  // surgery_elective_date!: Date;

  @Column(DataType.ARRAY(DataType.INTEGER))
  supportive_measures!: number[];

  @Column(DataType.ARRAY(DataType.INTEGER))
  complications_hospital_stay!: number[];

  @Column(DataType.ARRAY(DataType.INTEGER))
  multidisciplinary_support!: number[];

  @Column(DataType.STRING)
  oth_multidisciplinary_support!: string;

  @Column(DataType.BOOLEAN)
  skin_bank_available!: boolean;

  @Column(DataType.STRING)
  skin_bank_available_value!: string;
}