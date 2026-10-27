import { Table, PrimaryKey, AutoIncrement, Column, DataType, ForeignKey, Model, BelongsTo } from "sequelize-typescript";
import {
    LkpTraumaFlag
} from "./lookup/LkpTraumaModels";
import { Trauma } from "./Trauma";

@Table({ tableName: 'trauma_values', timestamps: false })
export class TraumaValues extends Model<TraumaValues> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Trauma)
    @Column(DataType.INTEGER)
    trauma_id!: number;

    @BelongsTo(() => Trauma, { as: 'trauma' })
    trauma!: Trauma;

    @Column(DataType.INTEGER)
    bp_systolic!: number;

    @Column(DataType.INTEGER)
    bp_diastolic!: number;

    @Column(DataType.DECIMAL(10, 2))
    rr!: number;

    @Column(DataType.DECIMAL(10, 2))
    rts_autogenerate!: number;

    @ForeignKey(() => LkpTraumaFlag)
    @Column(DataType.INTEGER)
    trauma_flag!: number;

    @Column(DataType.BOOLEAN)
    admitted!: boolean;

    // @Column(DataType.STRING(256))
    // investigations!: string;

    @Column(DataType.BOOLEAN)
    ecg!: boolean;

    @Column(DataType.STRING(256))
    ecgfindings!: string;

    @Column(DataType.BOOLEAN)
    xray!: boolean;

    @Column(DataType.DATE)
    xray_date_time!: Date;

    @Column(DataType.STRING(256))
    xrayfindings!: string;

    @Column(DataType.BOOLEAN)
    efast!: boolean;

    @Column(DataType.DATE)
    efast_date_time!: Date;

    @Column(DataType.STRING(256))
    efastfindings!: string;

    @Column(DataType.BOOLEAN)
    ct!: boolean;

    @Column(DataType.DATE)
    ct_date_time!: Date;

    @Column(DataType.STRING(256))
    ctfindings!: string;

    @Column(DataType.BOOLEAN)
    mri!: boolean;

    @Column(DataType.DATE)
    mri_date_time!: Date;

    @Column(DataType.STRING(256))
    mrifindings!: string;

    @Column(DataType.BOOLEAN)
    abg!: boolean;

    @Column(DataType.DATE)
    abg_date_time!: Date;

    @Column(DataType.STRING(256))
    abgfindings!: string;

    @Column(DataType.BOOLEAN)
    blood_investigation!: boolean;

    @Column(DataType.DATE)
    blood_date_time!: Date;

    @Column(DataType.BOOLEAN)
    hcg!: boolean;

    @Column(DataType.DATE)
    hcg_date_time!: Date;

    @Column(DataType.BOOLEAN)
    urine_test!: boolean;

    @Column(DataType.DATE)
    urine_date_time!: Date;

    @Column(DataType.STRING(256))
    oth_specify!: string;

    @Column(DataType.DATE)
    oth_date_time!: Date;
}
