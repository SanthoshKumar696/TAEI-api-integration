import { Table, PrimaryKey, AutoIncrement, Column, DataType, ForeignKey, Model, BelongsTo } from "sequelize-typescript";
import {
    LkpTraumaSpecialityOpinion, LkpTraumaMechIntubationDtls, LkpTraumaOthProcedureDone, LkpTraumaManagement, LkpTraumaTypeOfSurgery, LkpTraumaSurgeryDoneUnder,
    LkpTraumaCpr,
    LkpTraumaSurgeryType
} from "./lookup/LkpTraumaModels";
import { Trauma } from "./Trauma";

@Table({ tableName: 'trauma_final', timestamps: false })
export class TraumaFinal extends Model<TraumaFinal> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @ForeignKey(() => Trauma)
    @Column(DataType.INTEGER)
    trauma_id!: number;

    @BelongsTo(() => Trauma, { as: 'trauma' })
    trauma!: Trauma;

    @Column(DataType.ARRAY(DataType.INTEGER))
    speciality_opinion!: number[];

    // @Column(DataType.STRING(256))
    // procedure_done!: string;

    @Column(DataType.BOOLEAN)
    iscpr!: boolean;

    @ForeignKey(() => LkpTraumaCpr)
    @Column(DataType.INTEGER)
    cpr_done!: number;

    @Column(DataType.BOOLEAN)
    blood_transfusion_done!: boolean;

    @Column(DataType.BOOLEAN)
    on_arrival_nerve_blocks!: boolean;

    @Column(DataType.BOOLEAN)
    mech_intubation!: boolean;

    @ForeignKey(() => LkpTraumaMechIntubationDtls)
    @Column(DataType.INTEGER)
    mech_intubation_dtls!: number;

    @Column(DataType.BOOLEAN)
    first_pass_intubation!: boolean;

    @ForeignKey(() => LkpTraumaOthProcedureDone)
    @Column(DataType.INTEGER)
    other_procedure_done!: number;
    
    @Column(DataType.STRING(256))
    oth_procedure_done!: string;

    @Column(DataType.STRING(256))
    final_diagnosis!: string;

    // @Column(DataType.BOOLEAN)
    // admitted!: boolean;

    // @Column(DataType.STRING(256))
    // if_admitted_in_which_speciality_and_unit!: string;

    @ForeignKey(() => LkpTraumaManagement)
    @Column(DataType.INTEGER)
    management!: number;

    @ForeignKey(() => LkpTraumaTypeOfSurgery)
    @Column(DataType.INTEGER)
    type_of_surgery!: number;

    @ForeignKey(() => LkpTraumaSurgeryType)
    @Column(DataType.INTEGER)
    surgery_type!: number;

    @Column(DataType.STRING(256))
    surgery_name!: string;   

    @Column(DataType.DATE)
    date_time!: Date;
    
    @Column(DataType.INTEGER)
    surgery_takenup_from_incident_date!: number;
    
    @Column(DataType.INTEGER)
    surgery_takenup_from_triage_date!: number;
    
    @Column(DataType.STRING(256))
    name_of_surgery!: string;

    @Column(DataType.STRING(256))
    surgery_done_by!: string;
    
    @ForeignKey(() => LkpTraumaSurgeryDoneUnder)
    @Column(DataType.INTEGER)
    surgery_done_under!: number;

    @Column(DataType.BOOLEAN)
    rehabilitation_required!: boolean;
}
