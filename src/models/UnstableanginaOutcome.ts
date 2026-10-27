import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
  } from 'sequelize-typescript';
  
  import { LkpStemiNstemiOutcomeType,LkpStemiNstemiDeathTiming ,LkpStemiHospitalType,LkpStemiReferralReason
,LkpStemiPatientCondition } from '../models/lookup/LkpStemiModels';
  
  @Table({ tableName: 'unstableangina_outcome', timestamps: false })
  export class UnstableAnginaOutcome extends Model<UnstableAnginaOutcome> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @Column(DataType.INTEGER)
    triage_id!: number;
    
    @Column(DataType.INTEGER)
    patient_id!: number;

    @ForeignKey(() => LkpStemiNstemiOutcomeType)
    @Column(DataType.INTEGER)
    outcome_type_id!: number;
  
    @BelongsTo(() => LkpStemiNstemiOutcomeType)
    outcomeType!: LkpStemiNstemiOutcomeType;
  
    @Column(DataType.DATE)
    discharge_datetime!: Date;
  
    @Column(DataType.DATE)
    absconded_datetime!: Date;
  
    @Column(DataType.DATE)
    death_datetime!: Date;
  
    @ForeignKey(() => LkpStemiNstemiDeathTiming)
    @Column(DataType.INTEGER)
    death_timing_id!: number;
  
    @BelongsTo(() => LkpStemiNstemiDeathTiming)
    deathTiming!: LkpStemiNstemiDeathTiming;
  
    @Column(DataType.TEXT)
    cause_of_death!: string;
  
    @ForeignKey(() => LkpStemiHospitalType)
    @Column(DataType.INTEGER)
    hospital_type_id!: number;
  
    @BelongsTo(() => LkpStemiHospitalType)
    hospitalType!: LkpStemiHospitalType;
  
    @Column(DataType.STRING(255))
    destination_hospital!: string;
  
    @ForeignKey(() => LkpStemiReferralReason)
    @Column(DataType.INTEGER)
    referral_reason_id!: number;
  
    @BelongsTo(() => LkpStemiReferralReason)
    referralReason!: LkpStemiReferralReason;
  
    @ForeignKey(() => LkpStemiPatientCondition)
    @Column(DataType.INTEGER)
    patient_condition_id!: number;
  
    @BelongsTo(() => LkpStemiPatientCondition)
    patientCondition!: LkpStemiPatientCondition;
  
    @Column(DataType.STRING(150))
    referring_doctor!: string;
  
    @Column(DataType.BOOLEAN)
    documented_in_taei_case_sheet!: boolean;
  
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    created_at!: Date;
  
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updated_at!: Date;
    
    @Column(DataType.STRING(255))
    other_death_timing!: string;

    @Column(DataType.INTEGER)
    destination_taei_hospital!: number;
  }
  