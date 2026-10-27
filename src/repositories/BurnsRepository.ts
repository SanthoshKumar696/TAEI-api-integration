import { QueryTypes, Transaction } from "sequelize";
import { Burns } from "../models/Burns";
import { BurnsOutcome } from "../models/BurnsOutcome";
import { BurnsValues } from "../models/BurnsValues";
import { sequelize } from "../config/db";
import { BurnsSurgeryElective } from "../models/BurnsSurgeryElective";
import { BurnsTbsa } from "../models/BurnsTbsa";

export const BurnsRepository = {
    async create(data: any) {
        const t: Transaction = await Burns.sequelize!.transaction();
        try {
            let record = await Burns.findOne({ where: { triage_id: data.burns.triage_id } });

            if (!record) {
                const burns = await Burns.create(data.burns, { transaction: t });

                let burnsValues = null;
                if (data.burns_values) {
                    burnsValues = await BurnsValues.create(
                        { ...data.burns_values, burns_id: burns.id },
                        { transaction: t }
                    );
                }
                let burnsOutcome = null;
                if (data.burns_outcome) {
                    burnsOutcome = await BurnsOutcome.create(
                        { ...data.burns_outcome, burns_id: burns.id },
                        { transaction: t }
                    );
                }
                let burnsTbsa = null;
                if (data.burns_tbsa) {
                    burnsTbsa = await BurnsTbsa.create(
                        { ...data.burns_tbsa, burns_id: burns.id },
                        { transaction: t }
                    );
                }
                let burnsSurgeryElective = null;
                if (data.burns_surgery_elective && data.burns_surgery_elective.length > 0) {
                    const electiveData = data.burns_surgery_elective.map((item: any) => ({
                        ...item,
                        burns_id: burns.id,
                    }));
                    burnsSurgeryElective = await BurnsSurgeryElective.bulkCreate(electiveData, { transaction: t });
                }

                await t.commit();

                return {
                    message: "Burns created successfully",
                    burns: burns,
                    burns_values: burnsValues,
                    burns_outcome: burnsOutcome,
                    burns_tbsa: burnsTbsa,
                    burns_surgery_elective: burnsSurgeryElective
                }

            }
            else {
                throw new Error("Triage record already exists for this triage_id");
            }
        } catch (error) {
            await t.rollback();
            throw error;
        }
    },

    async findAll() {
        return await Burns.findAll({
            include: [BurnsValues, BurnsOutcome, BurnsTbsa, BurnsSurgeryElective]
        });
    },

    async list(offset: number, limit: number, filters: any, hospital_id: number,
        start_date: string,
        end_date: string): Promise<{ totalCount: number; rows: any[] }> {

        const result = await sequelize.query(
            "SELECT * FROM get_burns_list_filter(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date, :p_patient_name, :p_discharge_status)",
            {
                replacements: {
                    p_limit: limit ?? 10,
                    p_offset: offset ?? 0,
                    p_hospital_id: hospital_id,
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_patient_name: filters.patient_name,
                    p_discharge_status: filters.discharge_status
                }
                , type: QueryTypes.SELECT
            },

        );

        if (!result || result.length === 0) {
            return { totalCount: 0, rows: [] };
        }

        const totalCount = (result[0] as any).total_count ?? 0;

        // remove duplicate column from rows
        const rows = result.map((row: any) => {
            const { total_count, ...rest } = row;
            return rest;
        });

        return {
            totalCount,
            rows: rows,
        };
    },

    async getBurnsById(id: number) {
        return Burns.findOne({
            where: { id: id },
        });
    },

    async getBurnsByTriageId(id: number) {
        return Burns.findOne({
            where: { triage_id: id },
        });
    },

    async getBurnsValuesById(id: number) {
        return BurnsValues.findOne({
            where: { burns_id: id },
        });
    },

    async getBurnsOutcomeById(id: number) {
        return BurnsOutcome.findOne({
            where: { burns_id: id },
        });
    },

    async getBurnsTbsaById(id: number) {
        return BurnsTbsa.findOne({
            where: { burns_id: id },
        });
    },
    async getBurnsSurgeryElectiveById(id: number) {
        return BurnsSurgeryElective.findAll({
            where: { burns_id: id },
        });
    },

    async findById(id: number) {
        return await Burns.findByPk(id, {
            include: [BurnsValues, BurnsOutcome, BurnsTbsa, BurnsSurgeryElective]
        });
    },

    async update(id: number, data: any) {
        const burn = await Burns.findByPk(id, {
            include: [BurnsValues, BurnsOutcome, BurnsTbsa, BurnsSurgeryElective],
        });
        if (!burn) return null;

        const { burns_values, burns_outcome, burns_tbsa, burns_surgery_elective, ...burns } = data;
        // Update main burns table columns
        await burn.update(burns.burns);

        // Update burns_values if present in data
        if (burns_values) {
            if (burn.burns_values) {
                await burn.burns_values.update(burns_values);
            } else {
                // create new burns_values associated with burns
                await BurnsValues.create({ ...burns_values, burns_id: id });
            }
        }

        // Update burns_tbsa if present in data
        if (burns_tbsa) {
            if (burn.burns_tbsa) {
                await burn.burns_tbsa.update(burns_tbsa);
            } else {
                // create new burns_tbsa associated with burns
                await BurnsTbsa.create({ ...burns_tbsa, burns_id: id });
            }
        }

        // Update burns_surgery_elective if present in data
        if (Array.isArray(burns_surgery_elective)) {
            // Step 1: fetch current electives
            const existingElectives = await BurnsSurgeryElective.findAll({
                where: { burns_id: id }
            });

            // Collect IDs from request
            const requestIds = burns_surgery_elective
                .filter((e) => e.id)
                .map((e) => e.id);

            // Step 2: delete electives not in request
            const toDelete = existingElectives.filter(
                (e) => !requestIds.includes(e.id)
            );

            if (toDelete.length > 0) {
                await BurnsSurgeryElective.destroy({
                    where: { id: toDelete.map((e) => e.id), burns_id: id }
                });
            }

            // Step 3: update or insert
            for (const electiveData of burns_surgery_elective) {
                if (electiveData.id) {
                    // Update existing elective
                    await BurnsSurgeryElective.update(
                        {
                            surgery_elective: electiveData.surgery_elective,
                            oth_surgery_elective: electiveData.oth_surgery_elective,
                            surgery_elective_date: electiveData.surgery_elective_date,
                        },
                        { where: { id: electiveData.id, burns_id: id } }
                    );
                } else {
                    // Insert new elective
                    await BurnsSurgeryElective.create(
                        { ...electiveData, burns_id: id }
                    );
                }
            }
        } else {
            // If no array is passed, delete all electives for this burns_id
            await BurnsSurgeryElective.destroy({ where: { burns_id: id } });
        }

        // Update burns_outcome if present in data
        if (burns_outcome) {
            if (burn.burns_outcome) {
                await burn.burns_outcome.update(burns_outcome);
            } else {
                // create new burns_outcome associated with burns
                await BurnsOutcome.create({ ...burns_outcome, burns_id: id });
            }
        }

        return {
            message: "Burns updated successfully",
            burns: burns.burns,
            burns_values: burns_values,
            burns_outcome: burns_outcome,
            burns_tbsa: burns_tbsa,
            burns_surgery_elective: burns_surgery_elective
        }
    },

    async delete(id: number) {
        const record = await Burns.findByPk(id);
        if (!record) return null;
        await record.destroy();
        return true;
    },

    async getNonIndex(id: number) {
        const [result] = await sequelize.query<any>(
            "SELECT get_burns_non_index_by_triage_id(:p_triage_id)::JSON as data",
            {
                replacements: {
                    p_triage_id: id
                }
                , type: QueryTypes.SELECT
            },

        );

        return {
            data: result.data,
        };
    }
};
