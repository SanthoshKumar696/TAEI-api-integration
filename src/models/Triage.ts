import {
  Table, Column, Model, DataType, HasOne,
  ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { TriageBy108 } from './TriageBy108';
import { TriageDtls } from './TriageDtls';
import { AbhaProfile } from './AbhaProfile';

@Table({ tableName: 'triage', timestamps: false })
export class Triage extends Model<Triage> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  //@Column(DataType.STRING) taei_id!: string;
  @Column(DataType.DATE) date_time_of_triage!: Date;
  @Column(DataType.BOOLEAN) type_of_patient!: boolean;
  @Column(DataType.STRING) name_of_patient!: string;
  @Column(DataType.INTEGER) age_year!: number;
  @Column(DataType.INTEGER) age_month!: number;
  @Column(DataType.STRING) fathername!: string;
  @Column(DataType.STRING) mothername!: string;
  @Column(DataType.INTEGER) gender!: number;
  @Column(DataType.INTEGER) marital_status!: number;
  @Column(DataType.STRING) patient_mobile_number!: string;
  @Column(DataType.INTEGER) education!: number;
  @Column(DataType.INTEGER) employment_status!: number;
  @Column(DataType.INTEGER) occupation!: number;
  @Column(DataType.STRING) income!: string;
  @Column(DataType.INTEGER) patient_ehr_id!: number;
  @Column(DataType.STRING) cmchis_card!: string;
  @Column(DataType.STRING) abha_card!: string;
  @Column(DataType.STRING) phr_id!: string;
  @Column(DataType.STRING) hmis_id!: string;
  @Column(DataType.STRING) esi_card!: string;
  @Column(DataType.STRING) address_line!: string;
  @Column(DataType.INTEGER) district!: number;
  @Column(DataType.INTEGER) state!: number;
  @Column(DataType.STRING) pincode!: string;
  @Column(DataType.INTEGER) patienr_recieved_from!: number;
  @Column(DataType.STRING) oth_patienr_recieved_from!: string;
  @Column(DataType.INTEGER) mode_of_arrival!: number;
  @Column(DataType.INTEGER) scene_ift!: number;
  @Column(DataType.INTEGER) source_type!: number;
  @Column(DataType.STRING) source_hospital!: string;
  @Column(DataType.STRING) destination_hospital!: string;
  @Column(DataType.INTEGER) reason_for_referral!: number;
  @Column(DataType.STRING) oth_reason_for_referral!: string;
  @Column(DataType.STRING) referral_doctor_name!: string;
  @Column(DataType.INTEGER) condition_of_patient!: number;
  @Column(DataType.INTEGER) is_patient_stable_ift!: number;
  @Column(DataType.DATE) date_and_time_of_incident!: Date;
  @Column(DataType.INTEGER) place_of_incident!: number;
  @Column(DataType.STRING) oth_place_of_incident!: string;
  @Column(DataType.INTEGER) institution_id!: number;
  @Column(DataType.INTEGER) user_id!: number;
  @Column(DataType.DATE) inserted_date!: Date;
  @ForeignKey(() => AbhaProfile)
  @Column({
  type: DataType.INTEGER,
  allowNull: true
})
abha_profile_id!: number;

@BelongsTo(() => AbhaProfile)
abhaProfile?: AbhaProfile;
  @HasOne(() => TriageBy108, { foreignKey: 'triage_id', as: 'triage_by_108' })
  triageBy108?: TriageBy108;

  @HasOne(() => TriageDtls, { foreignKey: 'triage_id', as: 'triage_dtls' })
  triageDtls?: TriageDtls;



}
