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
  
  import { LkpStemiNstemiLoadingDoseLocation ,LkpStemiNstemiLoadingDoseDrug ,LkpStemiTimiRiskScore ,LkpStemiNstemiTreatmentStrategy,LkpStemiStentType ,LkpStemiTransferLocation } from '../models/lookup/LkpStemiModels';
  
  @Table({ tableName: 'nstemi_treatment', timestamps: false })
  export class NstemiTreatment extends Model<NstemiTreatment> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @Column(DataType.INTEGER)
    triage_id!: number;
  
    @Column(DataType.INTEGER)
    patient_id!: number;

    @Column(DataType.DATE)
    nstemi_confirmed_at!: Date;
  
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
  
    @ForeignKey(() => LkpStemiNstemiTreatmentStrategy)
    @Column(DataType.INTEGER)
    treatment_strategy_id!: number;
  
    @BelongsTo(() => LkpStemiNstemiTreatmentStrategy)
    treatmentStrategy!: LkpStemiNstemiTreatmentStrategy;
  
    @Column(DataType.DATE)
    cath_lab_arrival!: Date;
  
    @Column(DataType.DATE)
    balloon_inflation!: Date;
  
    @ForeignKey(() => LkpStemiStentType)
    @Column(DataType.INTEGER)
    stent_type_id!: number;
  
    @BelongsTo(() => LkpStemiStentType)
    stentType!: LkpStemiStentType;
  
    @Column(DataType.TEXT)
    complications!: string;
  
    @ForeignKey(() => LkpStemiTransferLocation)
    @Column(DataType.INTEGER)
    transfer_location_id!: number;
  
    @BelongsTo(() => LkpStemiTransferLocation)
    transferLocation!: LkpStemiTransferLocation;
  
    @Column(DataType.STRING(255))
    symptom_to_fmc!: string;
  
    @Column(DataType.STRING(255))
    fmc_to_ecg!: string;
  
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
    door_to_balloon!: string;    
    
  }
  