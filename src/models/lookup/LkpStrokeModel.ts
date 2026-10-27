import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Default } from 'sequelize-typescript';

function createLookupModel(tableName: string) {
  @Table({ tableName, timestamps: false })
  class LookupModel extends Model<LookupModel> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column({
      type: DataType.STRING(256),
      allowNull: false,
    })
    name!: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    is_enabled!: boolean;
  }
  return LookupModel;
}

export const LkpStrokeArrivalTimeSymptoms = createLookupModel('lkp_stroke_arrival_time_symptoms');
export const LkpStrokeReasonForDelay = createLookupModel('lkp_stroke_reason_for_delay');
export const LkpStrokeReferredFrom = createLookupModel('lkp_stroke_referred_from');
export const LkpStrokeReasonForReferral = createLookupModel('lkp_stroke_reason_for_referral');
export const LkpStrokeSymptoms = createLookupModel('lkp_stroke_symptoms');
export const LkpStrokeAbsoluteContraindication = createLookupModel('lkp_stroke_absolute_contraindication');
export const LkpStrokeNihsScale = createLookupModel('lkp_stroke_nihs_scale');
export const LkpStrokeMriScanWakeupStroke = createLookupModel('lkp_stroke_mri_scan_wakeup_stroke');
export const LkpStrokeType = createLookupModel('lkp_stroke_type');
export const LkpStrokeThrombolysisByDrug = createLookupModel('lkp_stroke_thrombolysis_by_drug');
export const LkpStrokeOutcome = createLookupModel('lkp_stroke_outcome');
export const LkpStrokeTransferredTo = createLookupModel('lkp_stroke_transferred_to');
