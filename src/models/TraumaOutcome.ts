import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';

import {
  LkpTraumaOutcome, LkpTraumaHospitalType, LkpTraumaDestinationHospital, LkpTraumaReasonForReferral
  , LkpTraumaConditionOfPatient
} from './lookup/LkpTraumaModels';
import { Trauma } from './Trauma';
import { LkpHospitals } from './lookup/LkpCommonModel';

@Table({ tableName: 'trauma_outcome', timestamps: false })
export class TraumaOutcome extends Model<TraumaOutcome> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Trauma)
  @Column(DataType.INTEGER)
  trauma_id!: number;

  @BelongsTo(() => Trauma, { as: 'trauma' })
  trauma!: Trauma;

  @ForeignKey(() => LkpTraumaOutcome)
  @Column(DataType.INTEGER)
  outcome!: number;

  @Column(DataType.BOOLEAN)
  is_discharged!: boolean;

  // @ForeignKey(() => LkpTraumaTransferredTo)
  // @Column(DataType.INTEGER)
  // transferred_to!: number;

  @Column(DataType.DATE)
  discharge_datetime!: Date;

  @Column(DataType.STRING(256))
  discharge_details!: string;

  @ForeignKey(() => LkpTraumaHospitalType)
  @Column(DataType.INTEGER)
  hospital_type!: number;

  @Column(DataType.STRING(256))
  destination_hospital!: string;

  @ForeignKey(() => LkpHospitals)
  @Column(DataType.INTEGER)
  destination_taei_hospital!: number;

  @ForeignKey(() => LkpTraumaReasonForReferral)
  @Column(DataType.INTEGER)
  reason_for_referral!: number;

  @ForeignKey(() => LkpTraumaConditionOfPatient)
  @Column(DataType.INTEGER)
  condition_of_patient!: number;

  @Column(DataType.STRING(256))
  referring_doctor_name!: string;

  @Column(DataType.BOOLEAN)
  taei_case_documented!: boolean;

  @Column(DataType.STRING)
  name_of_doctor!: string;

  @Column(DataType.INTEGER)
  stayed_duration!: number;
}
