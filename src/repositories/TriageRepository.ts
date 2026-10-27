import { QueryTypes, Transaction, where } from "sequelize";
import { Triage } from "../models/Triage";
import { TriageBy108 } from "../models/TriageBy108";
import { TriageDtls } from "../models/TriageDtls";
import { sequelize } from "../config/db";
import { Cases108 } from "../models/Cases108";

export class TriageRepository {
  async create(data: any): Promise<any> {
    const t: Transaction = await Triage.sequelize!.transaction();

    try {
      const triage = await Triage.create(data.triage, { transaction: t });

      let triageBy108 = null;
      if (data.triage_by_108) {
        triageBy108 = await TriageBy108.create(
          {
            ...data.triage_by_108,
            triage_id: triage.id,
          },
          { transaction: t }
        );
        //Code to update cases_108 table
        try {
          var cases = await Cases108.update(
            { TriageId: triage.id },
            {
              where: { CaseId: data.triage_by_108.call_id }
            }
          );
        }
        catch (error) {

        }
        //code end
      }

      let triageDtls = null;
      if (data.triage_dtls) {
        triageDtls = await TriageDtls.create(
          {
            ...data.triage_dtls,
            triage_id: triage.id,
          },
          { transaction: t }
        );
      }

      await t.commit();

      return {
        message: "Triage created successfully",
        triage,
        triage_by_108: triageBy108,
        triage_dtls: triageDtls,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // async list(
  //   offset: number,
  //   limit: number,
  //   filters: Partial<Triage>
  // ): Promise<{ count: number; rows: Triage[] }> {
  //   const where = filters || {};
  //   const { count, rows } = await Triage.findAndCountAll({ where, offset, limit });
  //   return { count, rows };
  // }

  async getList(
    offset: number,
    limit: number,
    triageId: number,
    hospital_id: number,
    start_date: string,
    end_date: string, 
    is_age12: boolean
  ): Promise<{ totalCount: number; rows: any[] }> {

    const result = await sequelize.query(
      "SELECT * FROM get_triage_list(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date, :p_is_age12)",
      {
        replacements: {
          p_limit: limit ?? 10,
          p_offset: offset ?? 0,
          p_hospital_id: hospital_id,
          p_start_date: start_date,
          p_end_date: end_date,
          p_is_age12: is_age12
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


  async getTriageById(id: number) {
    return Triage.findOne({
      where: { id: id },
    });
  }

  async getTriageBy108ById(id: number) {
    return TriageBy108.findOne({
      where: { triage_id: id },
    });
  }

  async getTriageDetailsById(id: number) {
    return TriageDtls.findOne({
      where: { triage_id: id },
    });
  }

  async update(
    id: number, data: any
  ): Promise<object | null> {
    const t = await Triage.sequelize!.transaction();
    try {

      const triage = await Triage.findByPk(id, { include: [TriageBy108, TriageDtls] });

      if (!triage) return null;
      // Extract child data
      const { triage_by_108, triage_dtls, ...triageData } = data;
      console.log(JSON.stringify(data));

      // Check parent record exists
      const triageRecord = await Triage.findByPk(id, { transaction: t });
      if (!triageRecord) {
        await t.rollback();
        throw new Error(`Triage record with id ${id} not found`);
      }

      // Update Triage (parent)
      await Triage.update(triageData.triage, { where: { id }, transaction: t });

      // Handle TriageBy108 (child)
      if (triage_by_108) {
        const [affected] = await TriageBy108.update(triage_by_108, {
          where: { triage_id: id },
          transaction: t,
        });

        if (affected === 0) {
          // No row updated → create new
          await TriageBy108.create({ ...triage_by_108, triage_id: id }, { transaction: t });
        }
      }

      // Handle TriageDtls (child)
      if (triage_dtls) {
        const [affected] = await TriageDtls.update(triage_dtls, {
          where: { triage_id: id },
          transaction: t,
        });

        if (affected === 0) {
          // No row updated → create new
          await TriageDtls.create({ ...triage_dtls, triage_id: id }, { transaction: t });
        }
      }

      await t.commit();

      return {
        message: "Triage updated successfully",
        triage: triageData.triage,
        triage_by_108: triage_by_108,
        triage_dtls: triage_dtls,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }


  async delete(id: number): Promise<{ message: string }> {
    const t = await Triage.sequelize!.transaction();
    try {
      // First check if the triage record exists
      const triageRecord = await Triage.findByPk(id, { transaction: t });
      if (!triageRecord) {
        //        await t.rollback();
        throw new Error(`Triage record with id ${id} not found`);
      }

      // Delete child records first
      await TriageBy108.destroy({ where: { triage_id: id }, transaction: t });
      await TriageDtls.destroy({ where: { triage_id: id }, transaction: t });

      // Delete parent record
      await Triage.destroy({ where: { id }, transaction: t });

      await t.commit();
      return { message: "Triage and related records deleted successfully" };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getNonIndex(id: number) {
    const [result] = await sequelize.query<any>(
      "SELECT get_triage_non_index_by_triage_id(:p_triage_id)::JSON as data",
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
