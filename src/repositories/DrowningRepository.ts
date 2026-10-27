import { DrowningOutcome } from "../models/DrowningOutcome";
import { DrowningCase } from "../models/Drowning";
import { sequelize } from "../config/db";
import { QueryTypes } from "sequelize";
// import { DrowningOutcome } from "../models/DrowningOutcome";

export class DrowningRepository {

  async create_drowning_all(data: any) {

    //drowning case
    const data_drw = await DrowningCase.findOne({
      where: { triage_id: data.drowning_cases.triage_id }
    });
    if (data_drw)
      await data_drw.update(data.drowning_cases);
    else
      await DrowningCase.create(data.drowning_cases);
    //drowning outcome
    const data_drowning_outcome = await DrowningOutcome.findOne({
      where: { triage_id: data.drowning_cases.triage_id }
    });
    if (data_drowning_outcome)
      await data_drowning_outcome.update(data.drowning_outcome);
    else
      await DrowningOutcome.create(data.drowning_outcome);
    return this.get_drowing_all(data.drowning_cases.triage_id);
  }
  async get_drowing_all(id: number) {

    const drowning_cases = await DrowningCase.findOne({
      where: { triage_id: id }
    });
    const drowning_outcome = await DrowningOutcome.findOne({
      where: { triage_id: id }
    });


    if(drowning_cases==null)
    {
      return {
        "error":"Not found"
      };

    }
    return {
      drowning_cases,
      drowning_outcome
    };
  }


  async create(data: any) {
    return DrowningCase.create(data);
  }

  async findAll() {
    return DrowningCase.findAll();
  }


  async list(offset: number, limit: number, filters: any, hospital_id: number,start_date: string,
    end_date: string): Promise<{ totalCount: number; rows: any[] }> {
    const result = await sequelize.query(
      "SELECT * FROM get_drowning_list(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date, :p_patient_name, :p_discharge_status)",
      {
        replacements: {
          p_limit: limit ?? 10,
          p_offset: offset ?? 0,
          p_hospital_id: hospital_id,
          p_start_date: start_date,
          p_end_date: end_date,
          p_patient_name: filters.patient_name===undefined?null:filters.patient_name,
          p_discharge_status: filters.discharge_status===undefined?null:filters.discharge_status
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
    return DrowningCase.findByPk(id);
  }

  async update(id: number, data: any) {
    const drowning = await DrowningCase.findByPk(id);
    if (!drowning) return null;

    const { dataDrowning } = data;
    await drowning.update(dataDrowning);

    // if (outcome) {
    //   if (drowning.outcome) {
    //     await drowning.outcome.update(outcome);
    //   } else {
    //     await DrowningOutcome.create({ ...outcome, drowning_id: id });
    //   }
    // }

    return drowning;
  }


  async outcome_create(data: any) {
    return DrowningOutcome.create(data);
  }

  async outcome_findAll() {
    return DrowningOutcome.findAll();
  }

  async outcome_findById(id: number) {
    return DrowningOutcome.findByPk(id);
  }

  async outcome_update(id: number, data: any) {
    const drowning = await DrowningOutcome.findByPk(id);
    if (!drowning) return null;

    const { dataDrowningOutcome } = data;
    await drowning.update(dataDrowningOutcome);

    // if (outcome) {
    //   if (drowning.outcome) {
    //     await drowning.outcome.update(outcome);
    //   } else {
    //     await DrowningOutcome.create({ ...outcome, drowning_id: id });
    //   }
    // }

    return drowning;
  }

  async delete(id: number) {
    return DrowningCase.destroy({ where: { id } });
  }
  async getNonIndex(id: number) {
          const [result] = await sequelize.query<any>(
            "SELECT get_drowning_non_index_by_triage_id(:p_triage_id)::JSON as data",
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
