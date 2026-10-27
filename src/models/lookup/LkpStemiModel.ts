import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    Default,
    ForeignKey
  } from 'sequelize-typescript';
  
  // Factory for simple lookup tables
  function createLookupModel(tableName: string) {
    @Table({ tableName, timestamps: false })
    class LookupModel extends Model {
      @PrimaryKey
      @AutoIncrement
      @Column(DataType.INTEGER)
      id!: number;
  
      @Column({
        type: DataType.STRING(256),
        allowNull: false
      })
      name!: string;
      
    }
    return LookupModel;
  }
  
  // ====== Lookup Models ======
  
  // Simple lookups
  export const LkpStemiCvRiskFactorMaster = createLookupModel('lkp_stemi_cv_risk_factor_master');
  export const LkpStemiFmcMaster = createLookupModel('lkp_stemi_fmc_master');
  export const LkpStemiEcgLocationMaster = createLookupModel('lkp_stemi_ecg_location_master');
  export const LkpStemiDiagnosisMaster = createLookupModel('lkp_stemi_diagnosis_master');
  export const LkpStemiSignSymptom = createLookupModel('lkp_stemi_sign_symptom');

  export const LkpStemiInfarctionLocation = createLookupModel('lkp_stemi_infarction_location');
  export const LkpStemiLoadingDoseLocation = createLookupModel('lkp_stemi_loading_dose_location');
  export const LkpStemiLoadingDoseDrug = createLookupModel('lkp_stemi_loading_dose_drug');
  export const LkpStemiThrombolysisLocation = createLookupModel('lkp_stemi_thrombolysis_location');
  export const LkpStemiThrombolyticAgent = createLookupModel('lkp_stemi_thrombolytic_agent');
  export const LkpStemiThrombolysisOutcome = createLookupModel('lkp_stemi_thrombolysis_outcome');
  export const LkpStemiTreatmentStrategy = createLookupModel('lkp_stemi_treatment_strategy');
  export const LkpStemiConservativeManagement = createLookupModel('lkp_stemi_conservative_management');
  export const LkpStemiKillipRiskScore = createLookupModel('lkp_stemi_killip_risk_score');
  export const LkpStemiTransferLocation = createLookupModel('lkp_stemi_transfer_location');
  export const LkpStemiPreDischargeCounselling = createLookupModel('lkp_stemi_pre_discharge_counselling');
  export const LkpStemiStentType = createLookupModel('lkp_stemi_stent_type');
  export const LkpStemiOutcomeType = createLookupModel('lkp_stemi_outcome_type');
  export const LkpStemiDeathTiming = createLookupModel('lkp_stemi_death_timing');
  export const LkpStemiHospitalType = createLookupModel('lkp_stemi_hospital_type');
  export const LkpStemiReferralReason = createLookupModel('lkp_stemi_referral_reason');
  export const LkpStemiPatientCondition = createLookupModel('lkp_stemi_patient_condition');
  export const LkpStemiNstemiLoadingDoseLocation = createLookupModel('lkp_stemi_nstemi_loading_dose_location');
  export const LkpStemiNstemiLoadingDoseDrug = createLookupModel('lkp_stemi_nstemi_loading_dose_drug');
  export const LkpStemiTimiRiskScore = createLookupModel('lkp_stemi_timi_risk_score');
  export const LkpStemiNstemiTreatmentStrategy = createLookupModel('lkp_stemi_nstemi_treatment_strategy');
  export const LkpStemiNstemiOutcomeType = createLookupModel('lkp_stemi_nstemi_outcome_type');
  export const LkpStemiNstemiDeathTiming = createLookupModel('lkp_stemi_nstemi_death_timing');
  export const LkpStemiCoronoryAngiograpy = createLookupModel('lkp_stemi_coronory_angiography');
  export const LkpStemiComplications = createLookupModel('lkp_stemi_complications');
  export const LkpStemiCathLabProcedure = createLookupModel('lkp_stemi_others_catlab_procedure');

  

  

  
