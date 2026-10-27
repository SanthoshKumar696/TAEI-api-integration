import { Poisons } from "../models/Poisons";
import { PoisonsOutcome } from "../models/PoisonsOutcome";
import { sequelize } from "../config/db";
import { QueryTypes, Transaction } from "sequelize";

export class PoisonsRepository {
    async create(data: any) {
        const t: Transaction = await Poisons.sequelize!.transaction();
        try {
            let record = await Poisons.findOne({ where: { triage_id: data.poison.triage_id } });

            if (!record) {
                const poisons = await Poisons.create(data.poison, { transaction: t });

                let poisonsOutcome = null;
                if (data.poisons_outcome) {
                    poisonsOutcome = await PoisonsOutcome.create(
                        { ...data.poisons_outcome, poison_id: poisons.id },
                        { transaction: t }
                    );
                }
                await t.commit();

                return {
                    message: "Poison created successfully",
                    poison: poisons,
                    poisons_outcome: poisonsOutcome,
                };
            }
            else {
                throw new Error("Triage record already exists for this triage_id");
            }
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async findAll() {
        return await Poisons.findAll({ include: [{ model: PoisonsOutcome, as: 'poisons_outcome' }] });
    }

    async getPoisonsById(id: number) {
        return Poisons.findOne({
            where: { id: id },
        });
    }

    async getPoisonsByTriageId(id: number) {
        return Poisons.findOne({
            where: { triage_id: id },
        });
    }

    async getPoisonsOutcomeById(id: number) {
        return PoisonsOutcome.findOne({
            where: { poison_id: id },
        });
    }

    async list(offset: number, limit: number, filters: any, hospital_id: number,
        start_date: string,
        end_date: string): Promise<{ totalCount: number; rows: any[] }> {
        const result = await sequelize.query(
            "SELECT * FROM get_poison_list_filter(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date, :p_patient_name, :p_discharge_status)",
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
    }

    async findById(id: number) {
        return await Poisons.findByPk(id, { include: [{ model: PoisonsOutcome, as: 'poisons_outcome' }] });
    }

    async update(id: number, data: any) {
        const poisons = await Poisons.findByPk(id, { include: [{ model: PoisonsOutcome, as: 'poisons_outcome' }] });
        if (!poisons) return null;

        const { poisons_outcome, ...poison } = data;

        await poisons.update(poison.poison);

        if (poisons_outcome) {
            const existingPoison = await this.findById(id);

            if (existingPoison?.poisons_outcome != null) {
                await poisons?.poisons_outcome?.update(poisons_outcome);
            } else {
                await PoisonsOutcome.create({ ...poisons_outcome, poison_id: poisons.id });
            }
        }

        return {
            message: "Poison updated successfully",
            poison: poison.poison,
            poisons_outcome: poisons_outcome,
        };
    }

    async delete(id: number) {
        return await Poisons.destroy({ where: { id } });
    }

    async getNonIndex(id: number) {
        const [result] = await sequelize.query<any>(
            "SELECT get_poison_non_index_by_triage_id(:p_triage_id)::JSON as data",
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
}
