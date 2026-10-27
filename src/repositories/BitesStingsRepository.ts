import { sequelize } from "../config/db";
import { BitesStings } from "../models/BitesStings";
import { BitesStingsOutcome } from "../models/BitesStingsOutcome";
import { QueryTypes, Transaction } from "sequelize";

export class BitesStingsRepository {
  async create(data: any) {
    const t: Transaction = await BitesStings.sequelize!.transaction();
    try {
      let record = await BitesStings.findOne({ where: { triage_id: data.bites_stings.triage_id } });

      if (!record) {
        const bitesStings = await BitesStings.create(data.bites_stings, { transaction: t });

        let outcome = null;
        if (data.outcome) {
          outcome = await BitesStingsOutcome.create(
            { ...data.outcome, bites_stings_id: bitesStings.id },
            { transaction: t }
          );
        }
        await t.commit();

        return {
          message: "Bites & Stings created successfully",
          bites_stings: bitesStings,
          outcome: outcome,
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
    return BitesStings.findAll({ include: [{ model: BitesStingsOutcome, as: 'outcome' }] });
  }

  async list(offset: number, limit: number, filters: any, hospital_id: number,
    start_date: string,
    end_date: string): Promise<{ totalCount: number; rows: any[] }> {

    const result = await sequelize.query(
      "SELECT * FROM get_bites_sting_list_filter(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date, :p_patient_name, :p_discharge_status)",
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
    return BitesStings.findByPk(id, { include: [{ model: BitesStingsOutcome, as: 'outcome' }] });
  }

  async getBitesStingsById(id: number) {
    return BitesStings.findOne({
      where: { id: id },
    });
  }

  async getBitesStingsByTriageId(id: number) {
    return BitesStings.findOne({
      where: { triage_id: id },
    });
  }

  async getBitesStingsOutcomeById(id: number) {
    return BitesStingsOutcome.findOne({
      where: { bites_stings_id: id },
    });
  }


  async update(id: number, data: any) {
    const bite = await BitesStings.findByPk(id, { include: ['outcome'] });
    if (!bite) return null;

    const { outcome, ...dataBite } = data;
    await bite.update(dataBite.bites_stings);

    if (outcome) {
      if (bite.outcome) {
        await bite.outcome.update(outcome);
      } else {
        await BitesStingsOutcome.create({ ...outcome, bites_stings_id: id });
      }
    }

    return {
      message: "Bites & Stings updated successfully",
      bites_stings: dataBite.bites_stings,
      outcome: outcome,
    };
  }

  async delete(id: number) {
    return BitesStings.destroy({ where: { id } });
  }

  async getNonIndex(id: number) {
    const [result] = await sequelize.query<any>(
      "SELECT get_bites_stings_non_index_by_triage_id(:p_triage_id)::JSON as data",
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
