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

// Factory function to generate lookup models
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

    @Default(true)
    @Column(DataType.BOOLEAN)
    is_enabled!: boolean;
  }

  return LookupModel;
}

// Export each lookup model
export const LkpPoisonTypeOfPoisoning = createLookupModel('lkp_poison_type_of_poisoning');
export const LkpPoisonRouteOfExposure = createLookupModel('lkp_poison_route_of_exposure');
export const LkpPoisonSubstanceInvolved = createLookupModel('lkp_poison_substance_involved');
export const LkpPoisonSourceOfSubstance = createLookupModel('lkp_poison_source_of_substance');
export const LkpPoisonSymptomsPresentation = createLookupModel('lkp_poison_symptoms_presentation');
export const LkpPoisonSeverityOfPoisoning = createLookupModel('lkp_poison_severity_of_poisoning');
//export const LkpPoisonSkinDecontamination = createLookupModel('lkp_poison_skin_decontamination');
export const LkpPoisonDecontamination = createLookupModel('lkp_poison_decontamination');
export const LkpPoisonSupportiveCareProvided = createLookupModel('lkp_poison_supportive_care_provided');
//export const LkpPoisonCounsellingProvided = createLookupModel('lkp_poison_counselling_provided');
export const LkpPoisonOutcome = createLookupModel('lkp_poison_outcome');
export const LkpPoisonTransferredTo = createLookupModel('lkp_poison_transferred_to'); //seems not required
// export const LkpHospitalType = createLookupModel('lkp_hospital_type');
// export const LkpDestinationHospital = createLookupModel('lkp_destination_hospital');
// export const LkpReasonForReferral = createLookupModel('lkp_reason_for_referral');
// export const LkpConditionOfPatient = createLookupModel('lkp_condition_of_patient');


// Special case: organism has a foreign key to type_of_bite_sting
@Table({ tableName: 'lkp_poison_substance_involved_sub', timestamps: false })
export class LkpPoisonSubstanceInvolvedSub extends Model<LkpPoisonSubstanceInvolvedSub> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @ForeignKey(() => LkpPoisonSubstanceInvolved)
  @Column(DataType.INTEGER)
  substance_involved_id!: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}
