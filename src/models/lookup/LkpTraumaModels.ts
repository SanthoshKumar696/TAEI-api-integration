import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, Default, Unique } from 'sequelize-typescript';

@Table({ tableName: 'lkp_trauma_mechanism_of_injury', timestamps: false })
export class LkpTraumaMechanismOfInjury extends Model<LkpTraumaMechanismOfInjury> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_type_of_injury', timestamps: false })
export class LkpTraumaTypeOfInjury extends Model<LkpTraumaTypeOfInjury> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_rta', timestamps: false })
export class LkpTraumaRta extends Model<LkpTraumaRta> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_assault', timestamps: false })
export class LkpTraumaAssault extends Model<LkpTraumaAssault> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_workspot_injury', timestamps: false })
export class LkpTraumaWorkspotInjury extends Model<LkpTraumaWorkspotInjury> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_injuries_identified', timestamps: false })
export class LkpTraumaInjuriesIdentified extends Model<LkpTraumaInjuriesIdentified> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_part_of_the_body_injured', timestamps: false })
export class LkpTraumaPartOfTheBodyInjured extends Model<LkpTraumaPartOfTheBodyInjured> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_gcs_eye', timestamps: false })
export class LkpTraumaGcsEye extends Model<LkpTraumaGcsEye> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_gcs_verbal', timestamps: false })
export class LkpTraumaGcsVerbal extends Model<LkpTraumaGcsVerbal> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_gcs_motor', timestamps: false })
export class LkpTraumaGcsMotor extends Model<LkpTraumaGcsMotor> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_flag', timestamps: false })
export class LkpTraumaFlag extends Model<LkpTraumaFlag> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_speciality_opinion', timestamps: false })
export class LkpTraumaSpecialityOpinion extends Model<LkpTraumaSpecialityOpinion> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_cpr', timestamps: false })
export class LkpTraumaCpr extends Model<LkpTraumaCpr> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_mech_intubation_dtls', timestamps: false })
export class LkpTraumaMechIntubationDtls extends Model<LkpTraumaMechIntubationDtls> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_oth_procedure_done', timestamps: false })
export class LkpTraumaOthProcedureDone extends Model<LkpTraumaOthProcedureDone> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_management', timestamps: false })
export class LkpTraumaManagement extends Model<LkpTraumaManagement> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_type_of_surgery', timestamps: false })
export class LkpTraumaTypeOfSurgery extends Model<LkpTraumaTypeOfSurgery> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_surgery_type', timestamps: false })
export class LkpTraumaSurgeryType extends Model<LkpTraumaSurgeryType> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_surgery_done_under', timestamps: false })
export class LkpTraumaSurgeryDoneUnder extends Model<LkpTraumaSurgeryDoneUnder> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_outcome', timestamps: false })
export class LkpTraumaOutcome extends Model<LkpTraumaOutcome> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

// @Table({ tableName: 'lkp_trauma_transferred_to', timestamps: false })
// export class LkpTraumaTransferredTo extends Model<LkpTraumaTransferredTo> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;
//   @Unique @Column(DataType.STRING(256))
//   name!: string;
//   @Default(true) @Column(DataType.BOOLEAN)
//   is_enabled!: boolean;
// }

@Table({ tableName: 'lkp_trauma_hospital_type', timestamps: false })
export class LkpTraumaHospitalType extends Model<LkpTraumaHospitalType> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_destination_hospital', timestamps: false })
export class LkpTraumaDestinationHospital extends Model<LkpTraumaDestinationHospital> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_reason_for_referral', timestamps: false })
export class LkpTraumaReasonForReferral extends Model<LkpTraumaReasonForReferral> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}

@Table({ tableName: 'lkp_trauma_condition_of_patient', timestamps: false })
export class LkpTraumaConditionOfPatient extends Model<LkpTraumaConditionOfPatient> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  id!: number;
  @Unique @Column(DataType.STRING(256))
  name!: string;
  @Default(true) @Column(DataType.BOOLEAN)
  is_enabled!: boolean;
}
