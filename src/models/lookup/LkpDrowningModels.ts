import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Default,
  ForeignKey,
} from 'sequelize-typescript';

function createLookupModel(tableName: string) {
  @Table({ tableName, timestamps: false })
  class Lookup extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    name!: string;

  }
  return Lookup;
}

// Drowning Lookup Tables


export const LkpYesNo = createLookupModel('lkp_drw_yes_no');
export const LkpDrwPlaceOfIncident = createLookupModel('lkp_drw_place_of_incident');
export const LkpDrwTypeOfWater = createLookupModel('lkp_drw_type_of_water');
export const LkpDrwActivityDuringDrowning = createLookupModel('lkp_drw_activity_during_drowning');
export const LkpDrwAssessment = createLookupModel('lkp_drw_assessment');
export const LkpDrwIntervention = createLookupModel('lkp_drw_interventions');
// export const LkpDrwCounsellingBeforeDischarge = createLookupModel('lkp_drw_counselling_before_discharge');
export const LkpDrwComplicationsAdmission = createLookupModel('lkp_drw_complication_at_admission');
export const LkpDrwSupportiveCare = createLookupModel('lkp_drw_supportive_care');
export const LkpDrwComplicationsDeveloped = createLookupModel('lkp_drw_complications_developed');
export const LkpDrwHospitalType = createLookupModel('lkp_drowning_hospital_type');
export const LkpDrwOutcomeType = createLookupModel('lkp_drowning_outcome_type');
export const LkpDrwReferralReason = createLookupModel('lkp_drowning_referral_reason');
export const LkpDrwPatientCondition = createLookupModel('lkp_drowning_patient_condition');

