import { Table, PrimaryKey, AutoIncrement, Column, DataType, ForeignKey, Model, HasOne, BelongsTo } from "sequelize-typescript";
import {
    LkpTraumaMechanismOfInjury, LkpTraumaTypeOfInjury, LkpTraumaRta, LkpTraumaAssault, LkpTraumaWorkspotInjury,
    LkpTraumaGcsEye, LkpTraumaGcsVerbal, LkpTraumaGcsMotor
} from "./lookup/LkpTraumaModels";
import { TraumaValues } from "./TraumaValues";
import { TraumaFinal } from "./TraumaFinal";
import { TraumaOutcome } from "./TraumaOutcome";
import { Triage } from "./Triage";

@Table({ tableName: 'trauma', timestamps: false })
export class Trauma extends Model<Trauma> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Triage)
    @Column(DataType.INTEGER) triage_id!: number;

    @Column(DataType.BOOLEAN)
    patient_admitted!: boolean;

    @Column(DataType.STRING(256))
    name_of_dept!: string;

    @Column(DataType.DATE)
    date_time_of_entry!: Date;

    @ForeignKey(() => LkpTraumaMechanismOfInjury)
    @Column(DataType.INTEGER)
    mechanism_of_injury!: number;

    @ForeignKey(() => LkpTraumaTypeOfInjury)
    @Column(DataType.INTEGER)
    type_of_injury!: number;

    @Column(DataType.STRING(256))
    oth_type_of_injury!: string;

    @ForeignKey(() => LkpTraumaRta)
    @Column(DataType.INTEGER)
    rta!: number;

    @Column(DataType.BOOLEAN)
    rta_helmet!: boolean;

    @Column(DataType.BOOLEAN)
    rta_seatbelt!: boolean;

    @Column(DataType.BOOLEAN)
    ikt_availed!: boolean;

    @ForeignKey(() => LkpTraumaAssault)
    @Column(DataType.INTEGER)
    assault!: number;

    @ForeignKey(() => LkpTraumaWorkspotInjury)
    @Column(DataType.INTEGER)
    workspot_injury!: number;

    // @ForeignKey(() => LkpTraumaInjuriesIdentified)
    // @Column(DataType.INTEGER)
    // injuries_identified!: number;

    @Column(DataType.ARRAY(DataType.INTEGER))
    injuries_identified!: number[];

    @Column(DataType.STRING(256))
    oth_injuries_identified!: string;

    // @ForeignKey(() => LkpTraumaPartOfTheBodyInjured)
    // @Column(DataType.INTEGER)
    // part_of_the_body_injured!: number;

    @Column(DataType.ARRAY(DataType.INTEGER))
    part_of_the_body_injured!: number[];

    @Column(DataType.STRING(256))
    oth_body_injured!: string;

    @ForeignKey(() => LkpTraumaGcsEye)
    @Column(DataType.INTEGER)
    gcs_eye!: number;

    @ForeignKey(() => LkpTraumaGcsVerbal)
    @Column(DataType.INTEGER)
    gcs_verbal!: number;

    @ForeignKey(() => LkpTraumaGcsMotor)
    @Column(DataType.INTEGER)
    gcs_motor!: number;

    @Column(DataType.STRING(256))
    gcs_total!: string;

    @Column(DataType.INTEGER) user_id!: number;
    @Column(DataType.DATE) inserted_date!: Date;


    // @HasOne(() => TraumaValues, { foreignKey: 'trauma_id', as: 'traumaValues' })
    // traumaValues?: TraumaValues;

    // Association
    @HasOne(() => TraumaValues, { foreignKey: 'trauma_id', as: 'trauma_values' })
    trauma_values?: TraumaValues;

    @HasOne(() => TraumaFinal, { foreignKey: 'trauma_id', as: 'trauma_final' })
    trauma_final?: TraumaFinal;
    // Association
    @HasOne(() => TraumaOutcome, { foreignKey: 'trauma_id', as: 'trauma_outcome' })
    trauma_outcome?: TraumaOutcome;

    @BelongsTo(() => Triage) triage!: Triage;
}
