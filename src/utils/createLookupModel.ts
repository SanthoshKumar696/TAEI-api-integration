import { Model } from "sequelize";
import { Table, Column, DataType, AutoIncrement, Default, PrimaryKey } from "sequelize-typescript";

export function createLookupModel(tableName: string) {
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
