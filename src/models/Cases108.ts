import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'cases_108', timestamps: false })
export class Cases108 extends Model<Cases108> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  row_num!: number;

  @Column(DataType.BOOLEAN)
  IsCritical!: boolean;

  @Column(DataType.BIGINT)
  CaseId!: number;

  @Column(DataType.BOOLEAN)
  NotReceivedCase108!: boolean;

  @Column(DataType.STRING(255))
  PatientName!: string;

  @Column(DataType.STRING(255))
  DistrictName!: string;

  @Column(DataType.STRING(255))
  BaseLocation!: string;

  @Column(DataType.STRING(255))
  VehicleNumber!: string;

  @Column(DataType.STRING(255))
  ChiefComplaint!: string;

  @Column(DataType.STRING(255))
  HospitalName!: string;

  @Column(DataType.BIGINT)
  PersonalInfoId!: number;

  @Column(DataType.STRING(255))
  RTS_Color!: string;

  @Column(DataType.DATE)
  VehicleAssignedTime!: Date;

  @Column(DataType.BIGINT)
  NurseTriageId!: number;

  @Column(DataType.BIGINT)
  TriageId!: number;

  @Column(DataType.BIGINT)
  RequestId!: number;

  @Column(DataType.STRING(255))
  CallerName!: string;

  @Column(DataType.INTEGER)
  Age!: number;

  @Column(DataType.STRING(255))
  Emergency_Type!: string;

  @Column(DataType.STRING(255))
  Emergency_Sub_Type!: string;

  @Column(DataType.DECIMAL(8,2))
  SPO2!: number;

  @Column(DataType.INTEGER)
  RR!: number;

  @Column(DataType.DECIMAL(8,2))
  Temperature!: number;

  @Column(DataType.INTEGER)
  BP_DBP!: number;

  @Column(DataType.INTEGER)
  BP_SBP!: number;

  @Column(DataType.INTEGER)
  CarotidPulse!: number;

  @Column(DataType.STRING(255))
  CallType!: string;

  @Column(DataType.STRING(255))
  SourceHospital!: string;

  @Column(DataType.DATE)
  InsertedDate!: Date;

  @Column(DataType.STRING(255))
  taluk_name!: string;
  @Column(DataType.STRING(255))
  city_name!: string;
  @Column(DataType.STRING(100))
  PupilSize_Left!: string;
  @Column(DataType.STRING(100))
  PupilSize_Right!: string;
  @Column(DataType.STRING(255))
  loc!: string;

}
