import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
} from 'sequelize-typescript';
// import { LkpCardioCathLabProcedure } from './LkpCardioCathLabProcedure'; // assuming you created this model

@Table({ tableName: 'cath_lab', timestamps: false })
export class CathLab extends Model<CathLab> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  triage_id!: number;

  // Admission info
  @Column(DataType.BOOLEAN)
  patient_admitted!: boolean;

  @Column(DataType.STRING(150))
  admitting_department!: string;

  @Column(DataType.DATE)
  admission_datetime!: Date;

  // Diagnosis
  @Column(DataType.TEXT)
  diagnosis!: string;

  // Presenting complaints (storing IDs as array)
  @Column(DataType.ARRAY(DataType.INTEGER))
  presenting_complaints!: number[];

  // Cath Lab details
  @Column(DataType.DATE)
  cath_arrival_datetime!: Date;

//   @ForeignKey(() => LkpCardioCathLabProcedure)
  @Column(DataType.INTEGER)
  procedure_id!: number;

  @Column(DataType.STRING(255))
  procedure_other!: string;

  // Discharge info
  @Column(DataType.DATE)
  discharge_datetime!: Date;

  // Duration (not auto-generated in Sequelize, you can compute in query/service)
  @Column(DataType.INTEGER)
  hospital_stay_days!: number;
}
