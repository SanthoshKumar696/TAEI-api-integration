import { sequelize } from "../config/db";
import { Prem } from "../models/Prem";
import { PremOutcome } from "../models/PremOutcome";
import { PremVitals } from "../models/PremVitals";
import { QueryTypes, Transaction } from "sequelize";

export class PremRepository {
  async create(data: any): Promise<any> {
    const t: Transaction = await Prem.sequelize!.transaction();
    try {
      let record = await Prem.findOne({ where: { triage_id: data.prem.triage_id } });

      if (!record) {
        const prem = await Prem.create(data.prem, { transaction: t });

        let vitals = null;
        if (data.vitals) {
          vitals = await PremVitals.create(
            { ...data.vitals, prem_id: prem.id },
            { transaction: t }
          );
        }

        let outcome = null;
        if (data.outcome) {
          outcome = await PremOutcome.create(
            { ...data.outcome, prem_id: prem.id },
            { transaction: t }
          );
        }

        await t.commit();

        return {
          message: "Prem created successfully",
          prem: prem,
          vitals: vitals,
          outcome: outcome
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

  async findAll(): Promise<Prem[]> {
    return await Prem.findAll({
      include: [
        { model: PremVitals, as: "vitals" },
        { model: PremOutcome, as: "outcome" },
      ],
    });
  }

  async list(offset: number, limit: number, filters: any, hospital_id: number,
    start_date: string,
    end_date: string): Promise<{ totalCount: number; rows: any[] }> {

    const result = await sequelize.query(
      "SELECT * FROM get_prem_list_filter(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date, :p_patient_name, :p_discharge_status)",
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

  async findById(id: number): Promise<Prem | null> {
    return await Prem.findByPk(id, {
      include: [
        { model: PremVitals, as: "vitals" },
        { model: PremOutcome, as: "outcome" },
      ],
    });
  }
  async getPremById(id: number) {
    return Prem.findOne({
      where: { id: id },
    });
  }

  async getPremVitalsById(id: number) {
    return PremVitals.findOne({
      where: { prem_id: id },
    });
  }
  async getPremOutcomeById(id: number) {
    return PremOutcome.findOne({
      where: { prem_id: id },
    });
  }

  async update(id: number, data: any): Promise<any | null> {
    const prem = await Prem.findByPk(id, {
      include: [PremVitals, PremOutcome],
    });

    console.log('all + ' + JSON.stringify(prem));

    if (!prem) return null;

    // Extract child data
    const { vitals, outcome, ...premData } = data;

    await prem.update(premData.prem);

    // Update or create prem_vitals
    if (vitals) {
      if (prem.vitals) {
        await prem.vitals.update(vitals);
      } else {
        await PremVitals.create({ ...vitals, prem_id: prem.id });
      }
    }

    // Update or create prem_outcome
    if (outcome) {
      if (prem.outcome) {
        await prem.outcome.update(outcome);
      } else {
        await PremOutcome.create({ ...outcome, prem_id: prem.id });
      }
    }

    return {
      message: "Prem updated successfully",
      prem: premData.prem,
      vitals: vitals,
      outcome: outcome
    };
  }

  async delete(id: number): Promise<number> {
    return await Prem.destroy({ where: { id } });
  }

  async getNonIndex(id: number) {
    const [result] = await sequelize.query<any>(
      "SELECT get_prem_non_index_by_triage_id(:p_triage_id)::JSON as data",
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
