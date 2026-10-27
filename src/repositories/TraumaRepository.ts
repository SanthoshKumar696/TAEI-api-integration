import { TraumaOutcome } from '../models/TraumaOutcome';
import { Trauma } from '../models/Trauma';
import { TraumaFinal } from '../models/TraumaFinal';
import { TraumaValues } from '../models/TraumaValues';
import { sequelize } from '../config/db';
import { QueryTypes, Transaction } from 'sequelize';

export default class TraumaRepository {

  async create(data: any): Promise<any> {
    const t: Transaction = await Trauma.sequelize!.transaction();

    try {
      const existing = await Trauma.findOne({
        where: { triage_id: data.trauma.triage_id },
        transaction: t,
      });

      if (existing) {
        throw new Error("Triage record already exists for this triage_id");
      }

      // Create trauma main record
      const trauma = await Trauma.create(data.trauma, { transaction: t });

      let traumaValues = null;
      if (data.trauma_values) {
        traumaValues = await TraumaValues.create(
          { ...data.trauma_values, trauma_id: trauma.id },
          { transaction: t }
        );
      }

      let traumaFinal = null;
      if (data.trauma_final) {
        traumaFinal = await TraumaFinal.create(
          { ...data.trauma_final, trauma_id: trauma.id },
          { transaction: t }
        );
      }

      let traumaOutcome = null;
      if (data.trauma_outcome) {
        traumaOutcome = await TraumaOutcome.create(
          { ...data.trauma_outcome, trauma_id: trauma.id },
          { transaction: t }
        );
      }

      await t.commit();

      return {
        message: "Trauma created successfully",
        trauma: trauma,
        trauma_values: traumaValues,
        trauma_final: traumaFinal,
        trauma_outcome: traumaOutcome,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async list(offset: number, limit: number, filters: any, hospital_id: number,
    start_date: string,
    end_date: string): Promise<{ totalCount: number; rows: any[] }> {

    const result = await sequelize.query(
      "SELECT * FROM get_trauma_list_filter(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date, :p_patient_name, :p_discharge_status)",
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

  // async list(offset: number, limit: number, filters: any) {
  //   return Trauma.findAndCountAll({
  //     where: { ...filters },
  //     limit,
  //     offset,
  //     order: [['id', 'DESC']],
  //     include: [{ model: TraumaValues, as: 'trauma_values' }
  //       , { model: TraumaFinal, as: 'trauma_final' }
  //       , { model: TraumaOutcome, as: 'trauma_outcome' }]
  //   });
  // }

  async getTraumaById(id: number) {
    return Trauma.findOne({
      where: { id: id },
    });
  }

  async getTraumaValuesById(id: number) {
    return TraumaValues.findOne({
      where: { trauma_id: id },
    });
  }

  async getTraumaFinalById(id: number) {
    return TraumaFinal.findOne({
      where: { trauma_id: id },
    });
  }

  async getTraumaOutcomeById(id: number) {
    return TraumaOutcome.findOne({
      where: { trauma_id: id },
    });
  }


  async findById(id: number): Promise<Trauma | null> {
    return await Trauma.findByPk(id, {
      include: [{ model: TraumaValues, as: 'trauma_values' }
        , { model: TraumaFinal, as: 'trauma_final' }
        , { model: TraumaOutcome, as: 'trauma_outcome' }]
    });
  }

  async update(id: number, data: any): Promise<any | null> {
    const trauma = await Trauma.findByPk(id, { include: [TraumaValues, TraumaFinal, TraumaOutcome] });

    if (!trauma) return null;
    // Extract child data
    const { trauma_values, trauma_final, trauma_outcome, ...traumaData } = data;

    await trauma.update(traumaData.trauma);

    if (trauma_values) {
      if (trauma.trauma_values) {
        await trauma.trauma_values.update(trauma_values);
      } else {
        await TraumaValues.create({ ...trauma_values, trauma_id: id });
      }
    }
    if (trauma_final) {
      if (trauma.trauma_final) {
        await trauma.trauma_final.update(trauma_final);
      } else {
        await TraumaFinal.create({ ...trauma_final, trauma_id: id });
      }
    }
    if (trauma_outcome) {
      if (trauma.trauma_outcome) {
        await trauma.trauma_outcome.update(trauma_outcome);
      } else {
        await TraumaOutcome.create({ ...trauma_outcome, trauma_id: id });
      }
    }

    return {
      message: "Trauma updated successfully",
      trauma: traumaData.trauma,
      trauma_values: trauma_values,
      trauma_final: trauma_final,
      trauma_outcome: trauma_outcome,
    };
  }

  async delete(id: number): Promise<number> {
    return await Trauma.destroy({ where: { id } });
  }

  async getNonIndex(id: number) {
    const [result] = await sequelize.query<any>(
      "SELECT get_trauma_non_index_by_triage_id(:p_triage_id)::JSON as data",
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
