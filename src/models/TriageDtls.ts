import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { Triage } from './Triage';

@Table({ tableName: 'triage_dtls', timestamps: false  })
export class TriageDtls extends Model<TriageDtls> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  @ForeignKey(() => Triage)
  @Column(DataType.INTEGER) triage_id!: number;

  @Column(DataType.INTEGER) accompanied_by!: number;
  @Column(DataType.ARRAY(DataType.INTEGER)) pc_medical_emergency!: number[];
  @Column(DataType.STRING) oth_pc_medical_emergency!: string;
  @Column(DataType.INTEGER) pc_surgical_emergency!: number;
  @Column(DataType.STRING) oth_pc_surgical_emergency!: string;
  @Column(DataType.ARRAY(DataType.INTEGER)) presenting_complaints_prem!: number[];
  @Column(DataType.BOOLEAN) mass_casuality!: boolean;
  @Column(DataType.INTEGER) mass_casuality_tx!: number;
  @Column(DataType.INTEGER) cause!: number;
  @Column(DataType.INTEGER) avpu!: number;
  @Column(DataType.INTEGER) pulse!: number;
  @Column(DataType.INTEGER) bp_systolic!: number;
  @Column(DataType.INTEGER) bp_diastolic!: number;
  @Column(DataType.INTEGER) spo2!: number;
  @Column(DataType.DECIMAL(5, 2)) temperature!: number;
  @Column(DataType.BOOLEAN) brought_dead!: boolean;
  @Column(DataType.INTEGER) triage_flag!: number;
  @Column(DataType.BOOLEAN) if_red_team_call_out!: boolean;
  @Column(DataType.BOOLEAN) is_patient_triaged_queue!: boolean;
  @Column(DataType.BOOLEAN) prem_op_ticket_docs!: boolean;
  @Column(DataType.STRING) triage_done_by!: string;
  @Column(DataType.INTEGER) work_spot_injury!: number;
  @Column(DataType.INTEGER) rta!: number;
  @Column(DataType.BOOLEAN) rta_helmet!: boolean;
  @Column(DataType.INTEGER) rta_rider_type!: number;

  @BelongsTo(() => Triage) triage!: Triage;
}
