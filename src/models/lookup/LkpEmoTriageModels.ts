import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Default,
} from 'sequelize-typescript';

function createLookupModel(tableName: string, nameLength: number = 50) {
  @Table({
    tableName,
    timestamps: false,
  })
  class LookupModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING(nameLength))
    name!: string;

    @Column({
      type: DataType.BOOLEAN,
      defaultValue: true,
    })
    is_enabled!: boolean;
  }

  return LookupModel;
}

export const LkpEmoPastHistory = createLookupModel('lkp_emo_past_history', 50);
//export const LkpEmoEmergencyCategory = createLookupModel('lkp_emo_emergency_category', 25);
export const LkpEmoTraumaTreatment = createLookupModel('lkp_emo_trauma_treatment', 10);
export const LkpEmoRecallInfo = createLookupModel('lkp_emo_recall_info', 50);
export const LkpEmoSpeech = createLookupModel('lkp_emo_speech', 50);
export const LkpEmoGenDisposition = createLookupModel('lkp_emo_gen_disposition', 50);
export const LkpEmoClothing = createLookupModel('lkp_emo_clothing', 50);
export const LkpEmoOrientationTime = createLookupModel('lkp_emo_orientation_time', 50);
export const LkpEmoOutcome = createLookupModel('lkp_emo_outcome', 50);

@Table({ tableName: 'lkp_emo_emergency_category', timestamps: false })
export class LkpEmoEmergencyCategory extends Model<LkpEmoEmergencyCategory> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  is_enabled!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_adult!: boolean;
}

// import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';

// @Table({ tableName: 'lkp_past_history', timestamps: false })
// export class LkpPastHistory extends Model<LkpPastHistory> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;

//   @Column(DataType.TEXT)
//   name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_emergency_category', timestamps: false })
// export class LkpEmergencyCategory extends Model<LkpEmergencyCategory> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;

//   @Column(DataType.TEXT)
//   name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }

// @Table({ tableName: 'lkp_ed_disposition', timestamps: false })
// export class LkpEdDisposition extends Model<LkpEdDisposition> {
//   @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
//   id!: number;

//   @Column(DataType.TEXT)
//   name!: string;
//   @Column({ type: DataType.BOOLEAN, defaultValue: true }) is_enabled!: boolean;
// }
