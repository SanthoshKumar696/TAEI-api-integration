import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, Default } from 'sequelize-typescript';

function createLookupModel(tableName: string) {
  @Table({ tableName, timestamps: false })
  class LookupModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING(256))
    name!: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    is_enabled!: boolean;
  }
  return LookupModel;
}

export const LkpTriageGender = createLookupModel("lkp_triage_gender");
export const LkpTriageMaritalStatus = createLookupModel("lkp_triage_marital_status");
export const LkpTriageEducation = createLookupModel("lkp_triage_education");
export const LkpTriageEmploymentStatus = createLookupModel("lkp_triage_employment_status");
export const LkpTriageOccupation = createLookupModel("lkp_triage_occupation");
export const LkpTriagePatientRecievedFrom = createLookupModel("lkp_triage_patienr_recieved_from");
export const LkpTriageModeOfArrival = createLookupModel("lkp_triage_mode_of_arrival");
export const LkpTriageSourceType = createLookupModel("lkp_triage_source_type");
export const LkpTriageSceneIft = createLookupModel("lkp_triage_scene_ift");
export const LkpTriageReasonForReferral = createLookupModel("lkp_triage_reason_for_referral");
export const LkpTriageConditionOfPatient = createLookupModel("lkp_triage_condition_of_patient");
export const LkpTriagePatientStable = createLookupModel("lkp_triage_patient_stable");
export const LkpTriagePlaceOfIncident = createLookupModel("lkp_triage_place_of_incident");

export const LkpTriageDtlsAccompaniedBy = createLookupModel("lkp_triage_dtls_accompanied_by");
export const LkpTriageDtlsBurns = createLookupModel("lkp_triage_dtls_burns");
export const LkpTriageDtlsPoisoningBitesStingsHanging = createLookupModel("lkp_triage_dtls_poisoning_bites_stings_hanging");
export const LkpTriageDtlsScript = createLookupModel("lkp_triage_dtls_script");
export const LkpTriageDtlsMiAcs = createLookupModel("lkp_triage_dtls_mi_acs");
export const LkpTriageDtlsPcMedicalEmergency = createLookupModel("lkp_triage_dtls_pc_medical_emergency");
export const LkpTriageDtlsPcSurgicalEmergency = createLookupModel("lkp_triage_dtls_pc_surgical_emergency");
export const LkpTriageDtlsPresentingComplaints = createLookupModel("lkp_triage_dtls_presenting_complaints");
export const LkpTriageDtlsCause = createLookupModel("lkp_triage_dtls_cause");
export const LkpTriageDtlsAvpu = createLookupModel("lkp_triage_dtls_avpu");
export const LkpTriageDtlsBreathingStatus = createLookupModel("lkp_triage_dtls_breathing_status");
export const LkpTriageDtlsTriageFlag = createLookupModel("lkp_triage_dtls_triage_flag");

export const lkpTriageDtlsWorkSpotInjury = createLookupModel("lkp_triage_dtls_work_spot_injury");
export const lkpTriageDtlsRta = createLookupModel("lkp_triage_dtls_rta");
export const lkpTriageDtlsRtaRiderType = createLookupModel("lkp_triage_dtls_rta_rider_type");


// import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';

// @Table({ tableName: 'lkp_triage_age', timestamps: false })
// export class LkpTriageAge extends Model<LkpTriageAge> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_gender', timestamps: false })
// export class LkpTriageGender extends Model<LkpTriageGender> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_marital_status', timestamps: false })
// export class LkpTriageMaritalStatus extends Model<LkpTriageMaritalStatus> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_education', timestamps: false })
// export class LkpTriageEducation extends Model<LkpTriageEducation> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_employment_status', timestamps: false })
// export class LkpTriageEmploymentStatus extends Model<LkpTriageEmploymentStatus> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_occupation', timestamps: false })
// export class LkpTriageOccupation extends Model<LkpTriageOccupation> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_mode_of_arrival', timestamps: false })
// export class LkpTriageModeOfArrival extends Model<LkpTriageModeOfArrival> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_source_type', timestamps: false })
// export class LkpTriageSourceType extends Model<LkpTriageSourceType> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_reason_for_referral', timestamps: false })
// export class LkpTriageReasonForReferral extends Model<LkpTriageReasonForReferral> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_condition_of_patient', timestamps: false })
// export class LkpTriageConditionOfPatient extends Model<LkpTriageConditionOfPatient> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_place_of_incident', timestamps: false })
// export class LkpTriagePlaceOfIncident extends Model<LkpTriagePlaceOfIncident> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_dtls_accompanied_by', timestamps: false })
// export class LkpTriageDtlsAccompaniedBy extends Model<LkpTriageDtlsAccompaniedBy> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_dtls_burns', timestamps: false })
// export class LkpTriageDtlsBurns extends Model<LkpTriageDtlsBurns> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_dtls_poisoning_bites_stings_hanging', timestamps: false })
// export class LkpTriageDtlsPoisoningBitesStingsHanging extends Model<LkpTriageDtlsPoisoningBitesStingsHanging> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_dtls_script', timestamps: false })
// export class LkpTriageDtlsScript extends Model<LkpTriageDtlsScript> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_dtls_mi_acs', timestamps: false })
// export class LkpTriageDtlsMiAcs extends Model<LkpTriageDtlsMiAcs> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_dtls_pc_medical_emergency', timestamps: false })
// export class LkpTriageDtlsPcMedicalEmergency extends Model<LkpTriageDtlsPcMedicalEmergency> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_dtls_pc_surgical_emergency', timestamps: false })
// export class LkpTriageDtlsPcSurgicalEmergency extends Model<LkpTriageDtlsPcSurgicalEmergency> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_dtls_avpu', timestamps: false })
// export class LkpTriageDtlsAvpu extends Model<LkpTriageDtlsAvpu> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_dtls_breathing_status', timestamps: false })
// export class LkpTriageDtlsBreathingStatus extends Model<LkpTriageDtlsBreathingStatus> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_triage_dtls_triage_flag', timestamps: false })
// export class LkpTriageDtlsTriageFlag extends Model<LkpTriageDtlsTriageFlag> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Column(DataType.TEXT) name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }
