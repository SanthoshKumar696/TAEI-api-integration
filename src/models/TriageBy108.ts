import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Triage } from './Triage';

@Table({ tableName: 'triage_by_108', timestamps: false  })
export class TriageBy108 extends Model<TriageBy108> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  @ForeignKey(() => Triage)
  @Column(DataType.INTEGER) triage_id!: number;

  @Column(DataType.STRING) call_id!: string;
  @Column(DataType.STRING) district_name!: string;
  @Column(DataType.STRING) taluk!: string;
  @Column(DataType.STRING) city_name!: string;
  @Column(DataType.STRING) base_location!: string;
  @Column(DataType.STRING) vehicle_number!: string;
  @Column(DataType.STRING) vehicle_assigned_date_time!: string;
  @Column(DataType.STRING) chief_complaint!: string;
  @Column(DataType.STRING) emergency_type!: string;
  @Column(DataType.STRING) emergency_sub_type!: string;
  @Column(DataType.STRING) temperature!: string;
  @Column(DataType.STRING) pulse!: string;
  @Column(DataType.STRING) rr!: string;
  @Column(DataType.STRING) bp_sbp!: string;
  @Column(DataType.STRING) bp_dbp!: string;
  @Column(DataType.STRING) pupil_right!: string;
  @Column(DataType.STRING) pupil_left!: string;
  @Column(DataType.STRING) loc!: string;
  @Column(DataType.STRING) condition_of_patient!: string;
  @Column(DataType.BOOLEAN) is_out_ar_mlc_number!: boolean;
  @Column(DataType.STRING) out_ar_mlc_number_tx!: string;

  @BelongsTo(() => Triage) triage!: Triage;
}
