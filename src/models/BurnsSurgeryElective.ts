import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    AutoIncrement,
    PrimaryKey,
} from 'sequelize-typescript';
import { Burns } from './Burns';
import { LkpBurnsSurgeryElective } from './lookup/LkpBurnsModel';

@Table({
    tableName: 'burns_surgery_elective',
    timestamps: false,
})
export class BurnsSurgeryElective extends Model<BurnsSurgeryElective> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)

    id!: number;

    @ForeignKey(() => Burns)
    @Column(DataType.INTEGER)
    burns_id!: number;

    @BelongsTo(() => Burns)
    burns!: Burns;

    @ForeignKey(() => LkpBurnsSurgeryElective)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    surgery_elective!: number;

    @Column(DataType.STRING)
    oth_surgery_elective!: string;

    @Column(DataType.DATE)
    surgery_elective_date!: Date;

    // @Column(DataType.INTEGER)
    // surgery_elective!: number;

    // @Column(DataType.DATE)
    // surgery_elective_date!: Date;
}
