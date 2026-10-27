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

@Table({
    tableName: 'burns_tbsa',
    timestamps: false,
})
export class BurnsTbsa extends Model<BurnsTbsa> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Burns)
    @Column(DataType.INTEGER)
    burns_id!: number;

    @BelongsTo(() => Burns)
    burns!: Burns;

    // Helper function for inline getter
    private decimalValue(field: keyof BurnsTbsa): number | null {
        const value = this.getDataValue(field); // field is correctly typed
        return value === null ? null : parseFloat(value as unknown as string);
    }

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('head'); },
    })
    head!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('neck'); },
    })
    neck!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('anterior_trunk'); },
    })
    anterior_trunk!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('posterior_trunk'); },
    })
    posterior_trunk!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('right_gluteal'); },
    })
    right_gluteal!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('left_gluteal'); },
    })
    left_gluteal!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('genital'); },
    })
    genital!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('right_arm'); },
    })
    right_arm!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('left_arm'); },
    })
    left_arm!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('right_forearm'); },
    })
    right_forearm!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('left_forearm'); },
    })
    left_forearm!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('right_hand'); },
    })
    right_hand!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('left_hand'); },
    })
    left_hand!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('right_thigh'); },
    })
    right_thigh!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('left_thigh'); },
    })
    left_thigh!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('right_leg'); },
    })
    right_leg!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('left_leg'); },
    })
    left_leg!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('right_foot'); },
    })
    right_foot!: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        get() { return (this as BurnsTbsa).decimalValue('left_foot'); },
    })
    left_foot!: number;
}
