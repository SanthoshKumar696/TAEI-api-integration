import { QueryTypes, Transaction } from "sequelize";
import { EmoTriage } from "../models/EmoTriageModel";
import { sequelize } from "../config/db";
import { EmoTriageOutcome } from "../models/EmoTriageOutcome";

export class EmoTriageRepository {
  async findAll(): Promise<EmoTriage[]> {
    return await EmoTriage.findAll();
  }

  async list(offset: number, limit: number, filters: any, hospital_id: number,
    start_date: string,
    end_date: string): Promise<{ totalCount: number; rows: any[] }> {
    const result = await sequelize.query(
      "SELECT * FROM get_emo_triage_list_filter(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date, :p_patient_name, :p_discharge_status, :p_is_age12)",
      {
        replacements: {
          p_limit: limit ?? 10,
          p_offset: offset ?? 0,
          p_hospital_id: hospital_id,
          p_start_date: start_date,
          p_end_date: end_date,
          p_patient_name: filters.patient_name,
          p_discharge_status: filters.discharge_status,
          p_is_age12: filters.is_age12
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

  async findById(id: number): Promise<EmoTriage | null> {
    return await EmoTriage.findByPk(id);
  }

  async getEmoTriageById(id: number) {
    return EmoTriage.findOne({
      where: { id: id },
    });
  }

  async getEmoTriageOutcomeById(id: number) {
    return EmoTriageOutcome.findOne({
      where: { emo_id: id },
    });
  }

  async create(data: any): Promise<any> {
    const t: Transaction = await EmoTriage.sequelize!.transaction();
    try {
      let record = await EmoTriage.findOne({ where: { triage_id: data.emo.triage_id } });

      if (!record) {
        const emo = await EmoTriage.create(data.emo, { transaction: t });

        let emoOutcome = null;
        if (data.emo_outcome) {
          emoOutcome = await EmoTriageOutcome.create(
            { ...data.emo_outcome, emo_id: emo.id },
            { transaction: t }
          );
        }
        await t.commit();
        return {
          message: "EMo Triage created successfully",
          emo: emo,
          outcome: emoOutcome,
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

  // async update(id: number, data: Partial<EmoTriage>): Promise<EmoTriage | null> {
  //   const record = await EmoTriage.findByPk(id);
  //   if (!record) return null;
  //   await record.update(data);
  //   return record;
  // }

  async update(id: number, data: any): Promise<any | null> {
    const emo = await EmoTriage.findByPk(id, { include: [EmoTriageOutcome] });
    if (!emo) return null;

    const { emo_outcome, ...dataEmo } = data;
    await emo.update(dataEmo.emo);

    if (emo_outcome) {
      if (emo.outcome) {
        await emo.outcome.update(emo_outcome);
      } else {
        await EmoTriageOutcome.create({ ...emo_outcome, emo_id: id });
      }
    }

    return {
      message: "EMO Triage updated successfully",
      emo: dataEmo.emo,
      outcome: emo_outcome,
    };
  }


  async delete(id: number): Promise<boolean> {
    const deletedCount = await EmoTriage.destroy({ where: { id } });
    return deletedCount > 0;
  }

  async getNonIndex(id: number) {
    const [result] = await sequelize.query<any>(
      "SELECT get_emo_triage_non_index_by_triage_id(:p_triage_id)::json AS data",
      {
        replacements: {
          p_triage_id: id
        }
        , type: QueryTypes.SELECT
      },

    );

    return {
      data: result.data
    };
  }
}
