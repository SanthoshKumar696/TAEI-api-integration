import { Stroke } from "../models/Stroke";
import { StrokeOutcome } from "../models/Stroke_Outcome";
import { sequelize } from '../config/db';
import { QueryTypes, Transaction } from "sequelize";

export class StrokeRepository {
  async create(data: any): Promise<any> {
    const t: Transaction = await Stroke.sequelize!.transaction();
    try {
      let record = await Stroke.findOne({ where: { triage_id: data.stroke.triage_id } });

      if (!record) {
        const stroke = await Stroke.create(data.stroke, { transaction: t });

        let strokeOutcome = null;
        if (data.outcome) {
          strokeOutcome = await StrokeOutcome.create(
            { ...data.outcome, stroke_id: stroke.id },
            { transaction: t }
          );
        }
        await t.commit();

        return {
          message: "Stroke created successfully",
          stroke: stroke,
          outcome: strokeOutcome,
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

  async findAll(): Promise<Stroke[]> {
    return await Stroke.findAll({ include: [{ model: StrokeOutcome, as: 'outcome' }] });
  }

  async list(offset: number, limit: number, filters: any, hospital_id: number,
    start_date: string,
    end_date: string): Promise<{ totalCount: number; rows: any[] }> {

    const result = await sequelize.query(
      "SELECT * FROM get_stroke_list_filter(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date, :p_patient_name, :p_discharge_status)",
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

  async findById(id: number): Promise<Stroke | null> {
    return await Stroke.findByPk(id, { include: [{ model: StrokeOutcome, as: 'outcome' }] });
  }

  async getstrokeById(id: number) {
    return Stroke.findOne({
      where: { id: id },
    });
  }

  async getstrokeOutcomeById(id: number) {
    return StrokeOutcome.findOne({
      where: { stroke_id: id },
    });
  }

  async update(id: number, data: any): Promise<any | null> {
    const stroke = await Stroke.findByPk(id, { include: [StrokeOutcome] });
    if (!stroke) return null;

    const { outcome, ...dataStroke } = data;
    await stroke.update(dataStroke.stroke);

    if (outcome) {
      if (stroke.outcome) {
        await stroke.outcome.update(outcome);
      } else {
        await StrokeOutcome.create({ ...outcome, stroke_id: id });
      }
    }

    return {
      message: "Stroke updated successfully",
      stroke: dataStroke.stroke,
      outcome: outcome,
    };
  }

  async delete(id: number): Promise<number> {
    return await Stroke.destroy({ where: { id } });
  }

  async getNonIndex(id: number) {
    const [result] = await sequelize.query<any>(
      "SELECT get_stroke_non_index_by_triage_id(:p_triage_id)::JSON as data",
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
