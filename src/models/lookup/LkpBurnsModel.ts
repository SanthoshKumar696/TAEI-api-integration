import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';

const baseOptions = {
  timestamps: false
};

function createLookupModel(tableName: string) {
  @Table({ tableName, ...baseOptions })
  class LookupModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @Column(DataType.STRING)
    name!: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_enabled!: boolean;
  }
  return LookupModel;
}

// Export all models
export const LkpBurnsTypeOfBurn = createLookupModel('lkp_burns_type_of_burn');
export const LkpBurnsModeOfInjury = createLookupModel('lkp_burns_mode_of_injury');
export const LkpBurnsPlaceOfIncident = createLookupModel('lkp_burns_place_of_incident');
export const LkpBurnsTbsa = createLookupModel('lkp_burns_tbsa');
export const LkpBurnsDegreeOfBurn = createLookupModel('lkp_burns_degree_of_burn');
export const LkpBurnsCoMorbidities = createLookupModel('lkp_burns_co_morbidities');
export const LkpBurnsWoundManagement = createLookupModel('lkp_burns_wound_management');
export const LkpBurnsConservative = createLookupModel('lkp_burns_conservative');
export const LkpBurnsSurgeryEmergency = createLookupModel('lkp_burns_surgery_emergency');
export const LkpBurnsSurgeryElective = createLookupModel('lkp_burns_surgery_elective');
export const LkpBurnsSupportiveMeasures = createLookupModel('lkp_burns_supportive_measures');
export const LkpBurnsStayComplications = createLookupModel('lkp_burns_stay_complications');
export const LkpBurnsMultidisciplinarySupport = createLookupModel('lkp_burns_multidisciplinary_support');
export const LkpBurnsNoOfHospitalStay = createLookupModel('lkp_burns_no_of_hospital_stay');
export const LkpBurnsOutcome = createLookupModel('lkp_burns_outcome');
export const LkpBurnsTransferredTo = createLookupModel('lkp_burns_transferred_to');
// export const LkpHospitalType = createLookupModel('lkp_hospital_type');
// export const LkpDestinationHospital = createLookupModel('lkp_destination_hospital');
// export const LkpReasonForReferral = createLookupModel('lkp_reason_for_referral');
// export const LkpConditionOfPatient = createLookupModel('lkp_condition_of_patient');
