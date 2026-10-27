import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, Default, ForeignKey } from 'sequelize-typescript';

function createLookupModel(tableName: string) {
  @Table({ tableName, timestamps: false })
  class Lookup extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @Column(DataType.STRING)
    name!: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    is_enabled!: boolean;
  }

  return Lookup;
}

export const LkpPremPresentingComplaints = createLookupModel('lkp_prem_presenting_complaints');
export const LkpPremAirway = createLookupModel('lkp_prem_airway');
export const LkpPremBreathing = createLookupModel('lkp_prem_breathing');
export const LkpPremCirculationHr = createLookupModel('lkp_prem_circulation_hr');
export const LkpPremPerfusion = createLookupModel('lkp_prem_perfusion');
export const LkpPremLiverSpan = createLookupModel('lkp_prem_liver_span');
export const LkpPremSystolicBp = createLookupModel('lkp_prem_systolic_bp');
export const LkpPremMap = createLookupModel('lkp_prem_map');
export const LkpPremDisability = createLookupModel('lkp_prem_disability');
export const LkpPremTonePosture = createLookupModel('lkp_prem_tone_posture');
export const LkpPremEyePositionMovements = createLookupModel('lkp_prem_eye_position_movements');
export const LkpPremPupils = createLookupModel('lkp_prem_pupils');
export const LkpPremDevelopment = createLookupModel('lkp_prem_development');
export const LkpPremDiagnosis = createLookupModel('lkp_prem_diagnosis');
//export const LkpPremDiagnosisRef = createLookupModel('lkp_prem_diagnosis_ref');
export const LkpPremTriageFlag = createLookupModel('lkp_prem_triage_flag');
export const LkpPremProceduresDone = createLookupModel('lkp_prem_procedures_done');
export const LkpPremOutcome = createLookupModel('lkp_prem_outcome');
export const LkpPremStabilisedReferral = createLookupModel('lkp_prem_stabilised_referral');
export const LkpStemiCoronoryAngiograpy = createLookupModel('lkp_stemi_coronory_angiography');


// Special case: organism has a foreign key 
@Table({ tableName: 'lkp_prem_diagnosis_ref', timestamps: false })
export class LkpPremDiagnosisRef extends Model<LkpPremDiagnosisRef> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @ForeignKey(() => LkpPremDiagnosis)
  @Column(DataType.INTEGER)
  diagnosis_id!: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}
