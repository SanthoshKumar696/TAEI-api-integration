import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  HasOne,
  BelongsTo
} from 'sequelize-typescript';
import { BitesStingsOutcome } from './BitesStingsOutcome';
import { LkpBiteTypeOfBiteSting, LkpBiteTypeOfOrganism, LkpBiteVenomousType, LkpBiteSiteOfBiteSting, LkpBiteSupportiveCareProvided, LkpBiteTimeInterval } from './lookup/LkpBitesStingsModel';
import { Triage } from './Triage';

@Table({ tableName: 'bites_stings', timestamps: false })
export class BitesStings extends Model<BitesStings> {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER) id!: number;

  @ForeignKey(() => Triage)
  @Column(DataType.INTEGER) triage_id!: number;

  @Column(DataType.DATE) date_time_of_entry!: Date;

  @Column(DataType.BOOLEAN) patient_admitted!: boolean;
  @Column(DataType.STRING) name_of_dept!: string;
  @Column(DataType.DATE) date_of_admit!: Date;

  @ForeignKey(() => LkpBiteTypeOfBiteSting)
  @Column(DataType.INTEGER) type_of_bite_sting!: number;

  @ForeignKey(() => LkpBiteTypeOfOrganism)
  @Column(DataType.INTEGER) type_of_organism!: number;

  @ForeignKey(() => LkpBiteVenomousType)
  @Column(DataType.INTEGER) venomous_type!: number;
  
  @Column(DataType.STRING) oth_venomous_type!: string;
  
  @ForeignKey(() => LkpBiteSiteOfBiteSting)
  @Column(DataType.INTEGER) site_of_bite_sting!: number;

  @Column(DataType.ARRAY(DataType.INTEGER))
  symptoms_at_presentation!: number[];

  @Column(DataType.STRING) time_to_reach_after_bite_sting!: string; //TODO:- Need to check fot time data type with sequalize

  @ForeignKey(() => LkpBiteTimeInterval)
  @Column(DataType.INTEGER) time_interval!: number;

  @Column(DataType.STRING) signs_of_envenomation_allergic_reaction!: string;
  @Column(DataType.STRING) investigations_performed!: string;
  @Column(DataType.INTEGER) first_aid_given!: number;
  @Column(DataType.STRING) anti_venom_or_allergy_treatment_name!: string;
  @Column(DataType.STRING) anti_venom_or_allergy_treatment_dosage!: string;
  @Column(DataType.STRING) anti_venom_or_allergy_treatment_timing!: string;

  @ForeignKey(() => LkpBiteSupportiveCareProvided)
  @Column(DataType.INTEGER) supportive_care_provided!: number;

  @Column(DataType.INTEGER) counselling_provided_before_discharge!: number;
  @Column(DataType.INTEGER) duration_of_hospital_stay!: number;

  @Column(DataType.INTEGER) user_id!: number;
  @Column(DataType.DATE) inserted_date!: Date;
  @Column(DataType.INTEGER) ref_form_id!: number;
  @Column(DataType.INTEGER) ref_id!: number;

  @HasOne(() => BitesStingsOutcome, { foreignKey: 'bites_stings_id', as: 'outcome' })
  outcome?: BitesStingsOutcome;

  @BelongsTo(() => Triage) triage!: Triage;
}
