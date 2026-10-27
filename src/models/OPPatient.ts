import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
} from 'sequelize-typescript';

// Import your lookup tables once you have models for them
import { LkpTriageGender } from '../models/lookup/LkpTriageModels';
import { LkpTriageMaritalStatus } from '../models/lookup/LkpTriageModels';
import { LkpTriageEducation } from '../models/lookup/LkpTriageModels';
import { LkpTriageEmploymentStatus } from '../models/lookup/LkpTriageModels';
import { LkpTriageOccupation } from '../models/lookup/LkpTriageModels';
import { LkpDistrict } from '../models/lookup/LkpCommonModel';
import { LkpState } from '../models/lookup/LkpCommonModel';
import { LkpStemiEcgLocationMaster } from '../models/lookup/LkpStemiModel';
import { LkpStemiDiagnosisMasterOp } from '../models/lookup/LkpStemiModels';

@Table({ tableName: 'op_patient', timestamps: false })
export class OpPatient extends Model<OpPatient> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  patient_id!: number;

  @Column(DataType.DATE)
  date_time_of_triage!: Date;

  @Column(DataType.STRING(256))
  name_of_patient!: string;

  @Column(DataType.INTEGER)
  age!: number;

  @Column(DataType.INTEGER)
  age_year!: number;

  @Column(DataType.INTEGER)
  age_month!: number;

  @Column(DataType.STRING(256))
  fathername!: string;

  @Column(DataType.STRING(256))
  mothername!: string;

  // Gender
  // @ForeignKey(() => LkpTriageGender)
  @Column(DataType.INTEGER)
  gender!: number;

  @Column(DataType.STRING(100))
  patient_op_number!: string;

  // Marital status
  // @ForeignKey(() => LkpTriageMaritalStatus)
  @Column(DataType.INTEGER)
  marital_status!: number;

  @Column(DataType.STRING(15))
  patient_mobile_number!: string;

  // Education
  // @ForeignKey(() => LkpTriageEducation)
  @Column(DataType.INTEGER)
  education!: number;

  // Employment status
  // @ForeignKey(() => LkpTriageEmploymentStatus)
  @Column(DataType.INTEGER)
  employment_status!: number;

  // Occupation
  // @ForeignKey(() => LkpTriageOccupation)
  @Column(DataType.INTEGER)
  occupation!: number;

  @Column(DataType.STRING(10))
  income!: string;

  @Column(DataType.BOOLEAN)
  patient_ehr_id!: boolean;

  @Column(DataType.STRING(155))
  cmchis_card!: string;

  @Column(DataType.STRING(155))
  abha_card!: string;

  @Column(DataType.STRING(155))
  phr_id!: string;

  @Column(DataType.STRING(155))
  hmis_id!: string;

  @Column(DataType.STRING(256))
  address_line!: string;

  // District
  // @ForeignKey(() => LkpDistrict)
  @Column(DataType.INTEGER)
  district!: number;

  // State
  // @ForeignKey(() => LkpState)
  @Column(DataType.INTEGER)
  state!: number;

  @Column(DataType.STRING(8))
  pincode!: string;

  @Column(DataType.INTEGER)
  institution_id!: number;

  @Column(DataType.STRING(10))
  patient_admitted!: string;

  @Column(DataType.STRING(200))
  name_of_dept!: string;

  @Column(DataType.DATE)
  date_time_admission!: Date;

  @Column(DataType.DATE)
  date_time_admitting_dep!: Date;

  @Column(DataType.DATE)
  date_time_symptom_onset!: Date;

  @Column(DataType.STRING(200))
  presenting_complaints!: string; // You may want JSON/ARRAY if multiple IDs

  @Column(DataType.STRING(200))
  known_cardiovascular_risk!: string;

  @Column(DataType.DATE)
  ecg_datetime!: Date;

  // ECG performed by
  // @ForeignKey(() => LkpStemiEcgLocationMaster)
  @Column(DataType.INTEGER)
  ecg_performed_by!: number;

  // Diagnosis
  // @ForeignKey(() => LkpStemiDiagnosisMasterOp)
  @Column(DataType.INTEGER)
  dignosis_id!: number;

  @Column(DataType.STRING(255))
  other_risk_factors!: string;
  
  @Column(DataType.STRING(255))
  other_dignosis!: string;

  @Column(DataType.BOOLEAN)
  is_discharged!: boolean;  

}
