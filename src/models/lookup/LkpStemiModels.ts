import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    Unique,
    Default,
  } from 'sequelize-typescript';
  
  // =================== STEMI Lookups ===================
  
  @Table({ tableName: 'lkp_stemi_cv_risk_factor_master', timestamps: false })
  export class LkpStemiCvRiskFactorMaster extends Model<LkpStemiCvRiskFactorMaster> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_fmc_master', timestamps: false })
  export class LkpStemiFmcMaster extends Model<LkpStemiFmcMaster> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_ecg_location_master', timestamps: false })
  export class LkpStemiEcgLocationMaster extends Model<LkpStemiEcgLocationMaster> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_diagnosis_master', timestamps: false })
  export class LkpStemiDiagnosisMaster extends Model<LkpStemiDiagnosisMaster> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_sign_symptom', timestamps: false })
  export class LkpStemiSignSymptom extends Model<LkpStemiSignSymptom> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_infarction_location', timestamps: false })
  export class LkpStemiInfarctionLocation extends Model<LkpStemiInfarctionLocation> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_loading_dose_location', timestamps: false })
  export class LkpStemiLoadingDoseLocation extends Model<LkpStemiLoadingDoseLocation> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_loading_dose_drug', timestamps: false })
  export class LkpStemiLoadingDoseDrug extends Model<LkpStemiLoadingDoseDrug> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_thrombolysis_location', timestamps: false })
  export class LkpStemiThrombolysisLocation extends Model<LkpStemiThrombolysisLocation> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_thrombolytic_agent', timestamps: false })
  export class LkpStemiThrombolyticAgent extends Model<LkpStemiThrombolyticAgent> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_thrombolysis_outcome', timestamps: false })
  export class LkpStemiThrombolysisOutcome extends Model<LkpStemiThrombolysisOutcome> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_treatment_strategy', timestamps: false })
  export class LkpStemiTreatmentStrategy extends Model<LkpStemiTreatmentStrategy> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_conservative_management', timestamps: false })
  export class LkpStemiConservativeManagement extends Model<LkpStemiConservativeManagement> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_killip_risk_score', timestamps: false })
  export class LkpStemiKillipRiskScore extends Model<LkpStemiKillipRiskScore> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_transfer_location', timestamps: false })
  export class LkpStemiTransferLocation extends Model<LkpStemiTransferLocation> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_pre_discharge_counselling', timestamps: false })
  export class LkpStemiPreDischargeCounselling extends Model<LkpStemiPreDischargeCounselling> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_stent_type', timestamps: false })
  export class LkpStemiStentType extends Model<LkpStemiStentType> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_outcome_type', timestamps: false })
  export class LkpStemiOutcomeType extends Model<LkpStemiOutcomeType> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_death_timing', timestamps: false })
  export class LkpStemiDeathTiming extends Model<LkpStemiDeathTiming> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_hospital_type', timestamps: false })
  export class LkpStemiHospitalType extends Model<LkpStemiHospitalType> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_referral_reason', timestamps: false })
  export class LkpStemiReferralReason extends Model<LkpStemiReferralReason> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_patient_condition', timestamps: false })
  export class LkpStemiPatientCondition extends Model<LkpStemiPatientCondition> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  // =================== NSTEMI Lookups ===================
  
  @Table({ tableName: 'lkp_stemi_nstemi_loading_dose_location', timestamps: false })
  export class LkpStemiNstemiLoadingDoseLocation extends Model<LkpStemiNstemiLoadingDoseLocation> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_nstemi_loading_dose_drug', timestamps: false })
  export class LkpStemiNstemiLoadingDoseDrug extends Model<LkpStemiNstemiLoadingDoseDrug> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_timi_risk_score', timestamps: false })
  export class LkpStemiTimiRiskScore extends Model<LkpStemiTimiRiskScore> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_nstemi_treatment_strategy', timestamps: false })
  export class LkpStemiNstemiTreatmentStrategy extends Model<LkpStemiNstemiTreatmentStrategy> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_nstemi_outcome_type', timestamps: false })
  export class LkpStemiNstemiOutcomeType extends Model<LkpStemiNstemiOutcomeType> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  @Table({ tableName: 'lkp_stemi_nstemi_death_timing', timestamps: false })
  export class LkpStemiNstemiDeathTiming extends Model<LkpStemiNstemiDeathTiming> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  @Table({ tableName: 'lkp_stemi_coronory_angiography', timestamps: false })
  export class LkpStemiCoronoryAngiograpy extends Model<LkpStemiCoronoryAngiograpy> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }

  @Table({ tableName: 'lkp_stemi_diagnosis_master_op', timestamps: false })
  export class LkpStemiDiagnosisMasterOp extends Model<LkpStemiDiagnosisMasterOp> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }

    @Table({ tableName: 'lkp_stemi_complications', timestamps: false })
  export class LkpStemiComplications extends Model<LkpStemiComplications> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }

  @Table({ tableName: 'lkp_stemi_others_catlab_procedure', timestamps: false })
  export class LkpStemiCathLabProcedure extends Model<LkpStemiCathLabProcedure> {
    @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
    @Unique @Column(DataType.STRING(256)) name!: string;
    @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  }
  
  

  // @Table({ tableName: 'lkp_stemi_coronory_angiography', timestamps: false })
  // export class LkpStemiCoronoryAngiograpy extends Model<LkpStemiCoronoryAngiograpy> {
  //   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;
  //   @Unique @Column(DataType.STRING(256)) name!: string;
  //   @Default(true) @Column(DataType.BOOLEAN) is_enabled!: boolean;
  // }
  