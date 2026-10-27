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

export const LkpHospitalType = createLookupModel('lkp_hospital_type');
export const LkpDestinationHospital = createLookupModel('lkp_destination_hospital');
export const LkpReasonForReferral = createLookupModel('lkp_reason_for_referral');
export const LkpConditionOfPatient = createLookupModel('lkp_condition_of_patient');


@Table({ tableName: 'lkp_district', timestamps: false })
export class LkpDistrict extends Model<LkpDistrict> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  code!: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}


@Table({ tableName: 'lkp_state', timestamps: false })
export class LkpState extends Model<LkpState> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  code!: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_hospitals', timestamps: false })
export class LkpHospitals extends Model<LkpHospitals> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  hospitalid!: number;

  @Column(DataType.STRING)
  districtname!: string;

  @Column(DataType.STRING)
  hospitalname!: string;

  @Column(DataType.INTEGER)
  mainhospitaltype!: number;

  @Column(DataType.STRING)
  hospitaltype!: string;

  @Column(DataType.STRING)
  hospitalname108!: string;

  @Column(DataType.STRING)
  type_of_hospital!: string;

  @Column(DataType.STRING)
  institution_code!: string;

  @Column(DataType.INTEGER)
  statecode!: number;

  @Column(DataType.INTEGER)
  district_id!: number;
}

