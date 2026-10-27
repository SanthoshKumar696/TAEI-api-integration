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
  
  import { LkpStemiNstemiLoadingDoseLocation ,LkpStemiNstemiLoadingDoseDrug ,LkpStemiTimiRiskScore } from '../models/lookup/LkpStemiModels';
  
  @Table({ tableName: 'unstableangina_treatment', timestamps: false })
  export class UnstableAnginaTreatment extends Model<UnstableAnginaTreatment> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @Column(DataType.INTEGER)
    triage_id!: number;
    
    @Column(DataType.INTEGER)
    patient_id!: number;

    @Column(DataType.DATE)
    ua_confirmed_at!: Date;
  
    @ForeignKey(() => LkpStemiNstemiLoadingDoseLocation)
    @Column(DataType.INTEGER)
    loading_dose_location_id!: number;
  
    @BelongsTo(() => LkpStemiNstemiLoadingDoseLocation)
    loadingDoseLocation!: LkpStemiNstemiLoadingDoseLocation;
  
    @ForeignKey(() => LkpStemiNstemiLoadingDoseDrug)
    @Column(DataType.INTEGER)
    loading_dose_drug_id!: number;
  
    @BelongsTo(() => LkpStemiNstemiLoadingDoseDrug)
    loadingDoseDrug!: LkpStemiNstemiLoadingDoseDrug;
  
    @Column(DataType.DATE)
    loading_dose_time!: Date;
  
    @ForeignKey(() => LkpStemiTimiRiskScore)
    @Column(DataType.INTEGER)
    timi_risk_score_id!: number;
  
    @BelongsTo(() => LkpStemiTimiRiskScore)
    timiRiskScore!: LkpStemiTimiRiskScore;
  
    @Column(DataType.STRING(300))
    management_id!: string;
  
    @Column(DataType.STRING(300))
    counselling_id!: string;
  
    @Column(DataType.BOOLEAN)
    icu_admission!: boolean;
  
    @Column(DataType.INTEGER)
    hospital_stay_days!: number;
  
    @Column(DataType.TEXT)
    in_hospital_complications!: string;
  
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    created_at!: Date;
  
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updated_at!: Date;

    @Column(DataType.DATE)
    loading_dose_administration_date!:Date;
    @Column(DataType.STRING(255))
    other_complications!: string;
    
    @Column(DataType.INTEGER)
    coronory_angiography_id!: number;
    
    @Column(DataType.BOOLEAN)
    planned_cag!: boolean;

    @Column(DataType.STRING(255))
    symptom_to_fmc!: string;  
    @Column(DataType.STRING(255))
    fmc_to_ecg!: string;
    
    @Column(DataType.STRING(255))
    door_to_balloon!: string;
  }
  