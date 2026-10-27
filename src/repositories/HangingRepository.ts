import { HangingOutcome } from "../models/HangingOutcome";
import { Hanging } from "../models/Hanging";
import { sequelize } from "../config/db";
import { QueryTypes, Transaction } from "sequelize";

export class HangingRepository {
  async create(data: any): Promise<any> {
    const t: Transaction = await Hanging.sequelize!.transaction();
    try {
      let record = await Hanging.findOne({ where: { triage_id: data.hanging.triage_id } });

      if (!record) {
        const hanging = await Hanging.create(data.hanging, { transaction: t });

        let hangingOutcome = null;
        if (data.outcome) {
          hangingOutcome = await HangingOutcome.create(
            { ...data.outcome, hanging_id: hanging.id },
            { transaction: t }
          );
        }
        await t.commit();

        return {
          message: "Hanging created successfully",
          hanging: hanging,
          outcome: hangingOutcome,
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

  async findAll(): Promise<Hanging[]> {
    return await Hanging.findAll({
      include: [
        { model: HangingOutcome, as: 'outcome' },
        // { association: 'natureOfIncident' },
        // { association: 'suspensionOfBody' },
        // { association: 'materialsUsedForHanging' },
        // { association: 'interventionsInfo' },
        // { association: 'supportiveCareProvidedInfo' }
      ]
    });
  }

  async getHangingById(id: number) {
    return Hanging.findOne({
      where: { id: id },
    });
  }

  async getHangingOutcomeById(id: number) {
    return HangingOutcome.findOne({
      where: { hanging_id: id },
    });
  }

  async list(offset: number, limit: number, filters: any, hospital_id: number,
    start_date: string,
    end_date: string): Promise<{ totalCount: number; rows: any[] }> {

    const result = await sequelize.query(
      "SELECT * FROM get_hanging_list_filter(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date, :p_patient_name, :p_discharge_status)",
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

  async findById(id: number): Promise<Hanging | null> {
    return await Hanging.findByPk(id, {
      include: [
        { model: HangingOutcome, as: 'outcome' },
        // { association: 'natureOfIncident' },
        // { association: 'suspensionOfBody' },
        // { association: 'materialsUsedForHanging' },
        // { association: 'interventionsInfo' },
        // { association: 'supportiveCareProvidedInfo' }
      ]
    });
  }

  async update(id: number, data: any): Promise<any | null> {
    const hanging = await Hanging.findByPk(id, { include: [HangingOutcome] });
    if (!hanging) return null;

    const { outcome, ...dataHanging } = data;

    await hanging.update(dataHanging.hanging);

    if (outcome) {
      if (hanging.outcome) {
        await hanging.outcome.update(outcome);
      } else {
        await HangingOutcome.create({ ...outcome, bites_stings_id: id });
      }
    }
    return {
      message: "Hanging updated successfully",
      hanging: dataHanging.hanging,
      outcome: outcome,
    };
  }

  async delete(id: number): Promise<number> {
    return await Hanging.destroy({ where: { id } });
  }

  async getNonIndex(id: number) {
    const [result] = await sequelize.query<any>(
      "SELECT get_hanging_non_index_by_triage_id(:p_triage_id)::JSON as data",
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
