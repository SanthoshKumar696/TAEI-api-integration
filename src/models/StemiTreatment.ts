import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  
  import { LkpStemiInfarctionLocation ,LkpStemiLoadingDoseLocation,LkpStemiLoadingDoseDrug,LkpStemiThrombolysisLocation,LkpStemiThrombolyticAgent,
LkpStemiThrombolysisOutcome,
 LkpStemiTreatmentStrategy,
 LkpStemiKillipRiskScore,
 LkpStemiStentType, LkpStemiTransferLocation,LkpStemiCoronoryAngiograpy } from './lookup/LkpStemiModels';
  
  @Table({ tableName: 'stemi_treatment', timestamps: false })
  export class StemiTreatment extends Model<StemiTreatment> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
  
    @Column(DataType.INTEGER)
    triage_id!: number;
    
    @Column(DataType.INTEGER)
    patient_id!: number;

    @Column(DataType.DATE)
    stemi_confirmed_at!: Date;
  
    @ForeignKey(() => LkpStemiInfarctionLocation)
    @Column(DataType.INTEGER)
    infarction_location_id!: number;
  
    @BelongsTo(() => LkpStemiInfarctionLocation)
    infarctionLocation!: LkpStemiInfarctionLocation;
  
    @ForeignKey(() => LkpStemiLoadingDoseLocation)
    @Column(DataType.INTEGER)
    loading_dose_location_id!: number;
  
    @BelongsTo(() => LkpStemiLoadingDoseLocation)
    loadingDoseLocation!: LkpStemiLoadingDoseLocation;

    @Column(DataType.DATE)
    loading_dose_administration_date!:Date;
    
    @ForeignKey(() => LkpStemiLoadingDoseDrug)
    @Column(DataType.INTEGER)
    loading_dose_drug_id!: number;
  
    @BelongsTo(() => LkpStemiLoadingDoseDrug)
    loadingDoseDrug!: LkpStemiLoadingDoseDrug;
  
    @Column(DataType.DATE)
    loading_dose_time!: Date;
  
    @ForeignKey(() => LkpStemiThrombolysisLocation)
    @Column(DataType.INTEGER)
    thrombolysis_location_id!: number;
  
    @BelongsTo(() => LkpStemiThrombolysisLocation)
    thrombolysisLocation!: LkpStemiThrombolysisLocation;
  
    @Column(DataType.STRING(255))
    thrombolysis_not_done_reason!: string;

    @ForeignKey(() => LkpStemiThrombolyticAgent)
    @Column(DataType.INTEGER)
    thrombolytic_agent_id!: number;
  
    @BelongsTo(() => LkpStemiThrombolyticAgent)
    thrombolyticAgent!: LkpStemiThrombolyticAgent;
  
    @Column(DataType.DATE)
    thrombolysis_date!: Date;

    @Column(DataType.DATE)
    thrombolysis_start!: Date;
  
    @Column(DataType.DATE)
    thrombolysis_end!: Date;
  
    @ForeignKey(() => LkpStemiThrombolysisOutcome)
    @Column(DataType.INTEGER)
    thrombolysis_outcome_id!: number;
  
    @BelongsTo(() => LkpStemiThrombolysisOutcome)
    thrombolysisOutcome!: LkpStemiThrombolysisOutcome;
  
    @ForeignKey(() => LkpStemiTreatmentStrategy)
    @Column(DataType.INTEGER)
    treatment_strategy_id!: number;
  
    @BelongsTo(() => LkpStemiTreatmentStrategy)
    treatmentStrategy!: LkpStemiTreatmentStrategy;
  
    @Column(DataType.STRING(200))
    management_id!: string; // multiple ids, probably CSV or JSON string
  
    @ForeignKey(() => LkpStemiKillipRiskScore)
    @Column(DataType.INTEGER)
    killip_risk_score_id!: number;
  
    @BelongsTo(() => LkpStemiKillipRiskScore)
    killipRiskScore!: LkpStemiKillipRiskScore;
  
    @Column(DataType.BOOLEAN)
    planned_cag!: boolean;
  
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

    @Column(DataType.TEXT)
    other_complications!: string;

  
    @ForeignKey(() => LkpStemiTransferLocation)
    @Column(DataType.INTEGER)
    transfer_location_id!: number;
  
    @BelongsTo(() => LkpStemiTransferLocation)
    transferLocation!: LkpStemiTransferLocation;
  
    @Column(DataType.STRING(200))
    counselling_id!: string; // multiple ids
  
    @Column(DataType.STRING(255))
    symptom_to_fmc!: string;
  
    @Column(DataType.STRING(255))
    fmc_to_ecg!: string;
  
    @Column(DataType.STRING(255))
    door_to_needle!: string;
  
    @Column(DataType.STRING(255))
    door_to_balloon!: string;
  
    @Column(DataType.INTEGER)
    total_ischemic_time!: number;
  
    @Column(DataType.BOOLEAN)
    icu_admission!: boolean;
  
    @Column(DataType.INTEGER)
    hospital_stay_days!: number;
  
    @Column(DataType.TEXT)
    in_hospital_complication!: string;
    
    @ForeignKey(() => LkpStemiCoronoryAngiograpy)
    @Column(DataType.INTEGER)
    coronory_angiography_id!: number;
  
    @BelongsTo(() => LkpStemiCoronoryAngiograpy)
    coronory_angiography!: LkpStemiCoronoryAngiograpy;

  }
  