import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasOne
} from 'sequelize-typescript';
import {
  LkpHangingNatureOfIncident,
  LkpHangingSuspensionOfBody,
  LkpHangingMaterialsUsed,
  LkpHangingInterventions,
  LkpHangingSupportiveCareProvided
} from './lookup/LkpHangingModel';
import { HangingOutcome } from './HangingOutcome';
import { Triage } from './Triage';

@Table({ tableName: 'hanging', timestamps: false })
export class Hanging extends Model<Hanging> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Triage)
  @Column(DataType.INTEGER) triage_id!: number;

  @Column(DataType.DATE)
  date_time_of_entry!: Date;

  @Column(DataType.BOOLEAN) patient_admitted!: boolean;
  @Column(DataType.STRING) name_of_dept!: string;
  @Column(DataType.DATE) date_of_admit!: Date;

  @ForeignKey(() => LkpHangingNatureOfIncident)
  @Column(DataType.INTEGER)
  nature_of_incident!: number;

  // @BelongsTo(() => LkpHangingNatureOfIncident, { as: 'natureOfIncident' })
  // natureOfIncident?: LkpHangingNatureOfIncident;

  @ForeignKey(() => LkpHangingSuspensionOfBody)
  @Column(DataType.INTEGER)
  suspension_of_body!: number;

  // @BelongsTo(() => LkpHangingSuspensionOfBody, { as: 'suspensionOfBody' })
  // suspensionOfBody?: LkpHangingSuspensionOfBody;

  @ForeignKey(() => LkpHangingMaterialsUsed)
  @Column(DataType.INTEGER)
  materials_used_for_hanging!: number;

  // @BelongsTo(() => LkpHangingMaterialsUsed, { as: 'materialsUsedForHanging' })
  // materialsUsedForHanging?: LkpHangingMaterialsUsed;

  @Column(DataType.ARRAY(DataType.INTEGER))
  symptoms_at_presentation!: number[];

  @ForeignKey(() => LkpHangingInterventions)
  @Column(DataType.INTEGER)
  interventions!: number;

  // @BelongsTo(() => LkpHangingInterventions, { as: 'interventionsInfo' })
  // interventionsInfo?: LkpHangingInterventions;

  @Column(DataType.STRING(256))
  oth_interventions?: string;

  @ForeignKey(() => LkpHangingSupportiveCareProvided)
  @Column(DataType.INTEGER)
  supportive_care_provided!: number;

  @Column(DataType.STRING(256))
  oth_supportive_care_provided?: string;
  // @BelongsTo(() => LkpHangingSupportiveCareProvided, { as: 'supportiveCareProvidedInfo' })
  // supportiveCareProvidedInfo?: LkpHangingSupportiveCareProvided;

  @Column(DataType.BOOLEAN)
  is_counselling_provided!: boolean;

  @Column(DataType.INTEGER)
  duration_of_hospital_stay!: number;

  @Column(DataType.INTEGER) user_id!: number;
  @Column(DataType.DATE) inserted_date!: Date;
  @Column(DataType.INTEGER) ref_form_id!: number;
  @Column(DataType.INTEGER) ref_id!: number;

  @HasOne(() => HangingOutcome, { foreignKey: 'hanging_id', as: 'outcome' })
  outcome?: HangingOutcome;

  @BelongsTo(() => Triage) triage!: Triage;
}
