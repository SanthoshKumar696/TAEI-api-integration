import { OpPatient } from "../models/OPPatient";
import { StemiClinicalAssessment } from "../models/StemiClinical";
import { StemiTreatment } from "../models/StemiTreatment";
import { StemiOutcome } from "../models/StemiOutcome";
import { NstemiOutcome } from "../models/NStemiOutcome";
import { NstemiTreatment } from "../models/NStemiTreatment";
import { UnstableAnginaOutcome } from "../models/UnstableanginaOutcome";
import { UnstableAnginaTreatment } from "../models/UnstableanginaTreatment";
import { StemiAdmission } from "../models/StemiAdmission";
import { sequelize } from "../config/db";
import { QueryTypes } from "sequelize";
import { StemiOthersTreatment } from "../models/StemiOthersTreatment";
import { buildNullObject } from '../utils/sequelize-helper';
// import { LkpStemiCvRiskFactorMaster,LkpStemiFmcMaster,LkpStemiEcgLocationMaster,LkpStemiDiagnosisMaster } from "../models/lookup/LkpStemiModels";


export const StemiRepository = {


    async createStemiadmission(data: any) {
        return await StemiAdmission.create(data);
    },

    async findAllStemiadmission() {
        return await StemiAdmission.findAll();
    },

    async list(offset: number, limit: number, filters: any, hospital_id: number,start_date:string,end_date:string): Promise<{ totalCount: number; rows: any[] }> {

        const result = await sequelize.query(
            "SELECT * FROM get_stemi_list(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date, :p_patient_name, :p_discharge_status)",
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
    },

    async findByIdStemiadmission(id: number) {
        return await StemiAdmission.findByPk(id);
    },
    async updateStemiadmission(id: number, data: any) {
        const stemi_clinical = await StemiAdmission.findByPk(id);
        if (!stemi_clinical) return null;
        const { Stemi_Admission } = data;
        
        // await StemiClinicalAssessment.update(Stemi_Admission);
        
        return await StemiAdmission.findByPk(id);
    },

    async deleteStemiadmission(id: number) {
        const record = await StemiAdmission.findByPk(id);
        if (!record) return null;
        await record.destroy();
        return true;
    },

    async createstemiop(data: any) {
        return await OpPatient.create(data);
    },
    async get_stemiop_by_id(id: number) {
        return await OpPatient.findByPk(id);
    },

    async op_list(offset: number, limit: number, filters: any, hospital_id: number,start_date:string,end_date:string): Promise<{ totalCount: number; rows: any[] }> {

        const result = await sequelize.query(
            "SELECT * FROM get_stemi_op_patient(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date)",
            {
                replacements: {
                    p_limit: limit ?? 10,
                    p_offset: offset ?? 0,
                    p_hospital_id: hospital_id,
                    p_start_date: start_date,
                    p_end_date: end_date
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
    //stemi clinical details

    async create_stemi_full(data: any) {
        
        //stemi_admission
        //stemi_clinical_assessment
        //stemi_treatment
        //stemi_outcome
        //nstemi_treatment
        //nstemi_outcome
        //unstableangina_treatment
        //unstableangina_outcome
        //Stemi Admission
        
        if(data.triage_id==0)
        {
            const data_patient = await OpPatient.findOne({
                where: { patient_id: data.patient_id }
            });
            if(data_patient){
                await data_patient.update(data.op_patient);
                data.patient_id=data_patient.patient_id;
            }
            else{
                data.op_patient = await OpPatient.create(data.op_patient);
                data.patient_id=data.op_patient.patient_id;
            }
        }

        if(data.stemi_admission==null)
        {
            const record = await StemiAdmission.findOne({
                where: { triage_id: data.triage_id }
            });
            if (record)
                await record.destroy();
        }
        else{
            const data_stemi_admission = await StemiAdmission.findOne({
                where: { triage_id: data.stemi_admission.triage_id }
            });
            if(data_stemi_admission)
                await data_stemi_admission.update(data.stemi_admission);
            else
                await StemiAdmission.create(data.stemi_admission);
        }

        //Stemi Clinical start
        if(data.stemi_clinical_assessment==null)
        {
            
        }
        else{
            const data_clinical = await StemiClinicalAssessment.findOne({
                where: { triage_id: data.triage_id }
            });
            if(data_clinical)
                await data_clinical.update(data.stemi_clinical_assessment);
            else
                await StemiClinicalAssessment.create(data.stemi_clinical_assessment);        
        }
        
        //Stemi Clinical end
        //Stemi Stemi Treatment start
        if(data.stemi_treatment==null)
        {
            const record = await StemiTreatment.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if (record)
                await record.destroy();
        }
        else{
            data.stemi_treatment.triage_id=data.triage_id;
            data.stemi_treatment.patient_id=data.patient_id;
            const data_st = await StemiTreatment.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if(data_st)
                await data_st.update(data.stemi_treatment);
            else
                await StemiTreatment.create(data.stemi_treatment);
        }
        

        //Stemi Outcome
        if(data.stemi_outcome==null)
        {
            const record = await StemiOutcome.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if(record)
                await record.destroy();
        }
        else{
            data.stemi_outcome.triage_id=data.triage_id;
            data.stemi_outcome.patient_id=data.patient_id;
            const data_so = await StemiOutcome.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if(data_so)
                await data_so.update(data.stemi_outcome);
            else
                await StemiOutcome.create(data.stemi_outcome);
        }
        //NStemi Treatment
        if(data.nstemi_treatment==null)
        {
            const record = await NstemiTreatment.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if (record)
                await record.destroy();
        }
        else{
            data.nstemi_treatment.triage_id=data.triage_id;
            data.nstemi_treatment.patient_id=data.patient_id;
            const data_nst = await NstemiTreatment.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if(data_nst)
                await data_nst.update(data.nstemi_treatment);
            else
                await NstemiTreatment.create(data.nstemi_treatment);
        }

        //NstemiOutcome
        if(data.nstemi_outcome==null)
        {
            const record = await NstemiOutcome.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if (record)
                await record.destroy();
        }
        else{
            data.nstemi_outcome.triage_id=data.triage_id;
            data.nstemi_outcome.patient_id=data.patient_id;
            const data_nso = await NstemiOutcome.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if(data_nso)
                await data_nso.update(data.nstemi_outcome);
            else
                await NstemiOutcome.create(data.nstemi_outcome);
        }
        
        //UnstableAnginaTreatment
        if(data.unstableangina_treatment==null)
        {
            const record = await UnstableAnginaTreatment.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if (record)
                await record.destroy();
        }
        else{
            data.unstableangina_treatment.triage_id=data.triage_id;
            data.unstableangina_treatment.patient_id=data.patient_id;
            const data_at = await UnstableAnginaTreatment.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if(data_at)
                await data_at.update(data.unstableangina_treatment);
            else
                await UnstableAnginaTreatment.create(data.unstableangina_treatment);
        }
        //UnstableAnginaOutcome
        if(data.unstableangina_outcome==null)
        {
            const record = await UnstableAnginaOutcome.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if (record)
                await record.destroy();
        }
        else{
            data.unstableangina_outcome.triage_id=data.triage_id;
            data.unstableangina_outcome.patient_id=data.patient_id;
            const data_ao = await UnstableAnginaOutcome.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if(data_ao)
                await data_ao.update(data.unstableangina_outcome);
            else
                await UnstableAnginaOutcome.create(data.unstableangina_outcome);
        }
        //Stemi Others Treatment
        if(data.others_treatment==null)
        {
            const record = await StemiOthersTreatment.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if (record)
                await record.destroy();
        }
        else{
            data.others_treatment.triage_id=data.triage_id;
            data.others_treatment.patient_id=data.patient_id;
            const data_ao = await StemiOthersTreatment.findOne({
                where: { triage_id: data.triage_id,patient_id:data.patient_id }
            });
            if(data_ao)
                await data_ao.update(data.others_treatment);
            else
                await StemiOthersTreatment.create(data.others_treatment);
        }
        return this.get_stemi_all(data.triage_id,data.patient_id);
    },

    async get_stemi_all(id:number,patient_id:number)
    {
        const stemi_admission = await StemiAdmission.findOne({
            where: { triage_id: id }
        });
        const op_patient=await OpPatient.findOne({
            where: { patient_id: patient_id }
        })
        const stemi_clinical_assessment = await StemiClinicalAssessment.findOne({
            where: { triage_id: id }
        });
        const stemi_treatment = await StemiTreatment.findOne({
            where: { triage_id: id ,patient_id:patient_id}
        }); 
        const stemi_outcome = await StemiOutcome.findOne({
            where: { triage_id: id ,patient_id:patient_id}
        });
        const nstemi_treatment = await NstemiTreatment.findOne({
            where: { triage_id: id ,patient_id:patient_id}
        });
        const nstemi_outcome = await NstemiOutcome.findOne({
            where: { triage_id: id ,patient_id:patient_id}
        });
        const unstableangina_treatment = await UnstableAnginaTreatment.findOne({
            where: { triage_id: id ,patient_id:patient_id}
        });
        const unstableangina_outcome = await UnstableAnginaOutcome.findOne({
            where: { triage_id: id ,patient_id:patient_id}
        });
        const others_treatment = await StemiOthersTreatment.findOne({
            where: { triage_id: id ,patient_id:patient_id}
        });
        
        // return {
        //     "triage_id":id,
        //     "patient_id":patient_id,
        //     // stemi_admission,
        //     "stemi_admission":stemi_admission,
        //     "op_patient":op_patient==null? buildNullObject(OpPatient) :op_patient,
        //     "stemi_clinical_assessmentstemi_clinical_assessment,
        //     stemi_treatment,
        //     stemi_outcome,
        //     nstemi_treatment,
        //     nstemi_outcome,
        //     unstableangina_treatment,
        //     unstableangina_outcome,
        //     others_treatment
        // };
        return {
            "triage_id":id,
            "patient_id":patient_id,
            // stemi_admission,
            "stemi_admission":stemi_admission==null? buildNullObject(StemiAdmission) :stemi_admission,
            "op_patient":op_patient==null? buildNullObject(OpPatient) :op_patient,
            "stemi_clinical_assessment": stemi_clinical_assessment==null? buildNullObject(StemiClinicalAssessment) :stemi_clinical_assessment,
            "stemi_treatment": stemi_treatment==null? buildNullObject(StemiTreatment) :stemi_treatment,
            "stemi_outcome": stemi_outcome==null? buildNullObject(StemiOutcome) :stemi_outcome,
            "nstemi_treatment": nstemi_treatment==null? buildNullObject(NstemiTreatment) :nstemi_treatment,
            "nstemi_outcome": nstemi_outcome==null? buildNullObject(NstemiOutcome) :nstemi_outcome,
            "unstableangina_treatment": unstableangina_treatment==null? buildNullObject(UnstableAnginaTreatment) :unstableangina_treatment,
            "unstableangina_outcome": unstableangina_outcome==null? buildNullObject(UnstableAnginaOutcome) :    unstableangina_outcome,
            "others_treatment": others_treatment==null? buildNullObject(StemiOthersTreatment) :others_treatment
        };
    },
    async create(data: any) {        
        
        return await StemiClinicalAssessment.create(data);
    },  
    async findAll() {
        return await StemiClinicalAssessment.findAll();
    },

    async findById(id: number) {
        return await StemiClinicalAssessment.findByPk(id);
    },
    async update(id: number, data: any) {
        const stemi_clinical = await StemiClinicalAssessment.findOne({
            where: { triage_id: id }
        });
        if (!stemi_clinical) return null;
        const { stemi_clinical_assessment } = data;
        
        await stemi_clinical.update(stemi_clinical_assessment);
        
        // return await StemiClinicalAssessment.findByPk(id);
        return await StemiClinicalAssessment.findOne({
            where: { triage_id: id }
        });
    },

    async delete(id: number) {
        const record = await StemiClinicalAssessment.findByPk(id);
        if (!record) return null;
        await record.destroy();
        return true;
    },
    // stemi treatment

    async createStemiTreatment(data: any) {
        return await StemiTreatment.create(data);
    },

    async findAllStemiTreatment() {
        return await StemiTreatment.findAll();
    },

    async findByIdStemiTreatment(id: number) {
        return await StemiTreatment.findByPk(id);
    },
    async updateStemiTreatment(id: number, data: any) {
        const stemi_clinical = await StemiClinicalAssessment.findByPk(id);
        if (!stemi_clinical) return null;
        const { stemi_clinical_assessment } = data;
        
        // await StemiTreatment.update(stemi_clinical_assessment);
        
        return await StemiTreatment.findByPk(id);
    },

    async deleteStemiTreatment(id: number) {
        const record = await StemiTreatment.findByPk(id);
        if (!record) return null;
        await record.destroy();
        return true;
    },

    //Stemi Outcome

    async createStemiOutcome(data: any) {
        console.log('data - ' + data);
        return await StemiOutcome.create(data);
    },

    async findAllStemiOutcome() {
        return await StemiOutcome.findAll();
    },

    async findByIdStemiOutcome(id: number) {
        return await StemiOutcome.findByPk(id);
    },
    async updateStemiOutcome(id: number, data: any) {
        const stemi_clinical = await StemiOutcome.findByPk(id);
        if (!stemi_clinical) return null;
        const { Stemi_Outcome } = data;
        
        // await StemiOutcome.update(Stemi_Outcome);
        
        return await StemiOutcome.findByPk(id);
    },

    async deleteStemiOutcome(id: number) {
        const record = await StemiOutcome.findByPk(id);
        if (!record) return null;
        await record.destroy();
        return true;
    },

    //NSTEMI Treatment

    async createNStemiTreatment(data: any) {
        console.log('data - ' + data);
        return await NstemiTreatment.create(data);
    },

    async findAllNStemiTreatment() {
        return await NstemiTreatment.findAll();
    },

    async findByIdNStemiTreatment(id: number) {
        return await NstemiTreatment.findByPk(id);
    },
    async updateNStemiTreatment(id: number, data: any) {
        const stemi_clinical = await NstemiTreatment.findByPk(id);
        if (!stemi_clinical) return null;
        const { Stemi_Outcome } = data;
        
        // await NstemiTreatment.update(Stemi_Outcome);
        
        return await NstemiTreatment.findByPk(id);
    },

    async deleteNStemiTreatment(id: number) {
        const record = await NstemiTreatment.findByPk(id);
        if (!record) return null;
        await record.destroy();
        return true;
    },


    //NonStemi Outcome

    async createNStemiOutcome(data: any) {
        console.log('data - ' + data);
        return await NstemiOutcome.create(data);
    },

    async findAllNStemiOutcome() {
        return await NstemiOutcome.findAll();
    },

    async findByIdNStemiOutcome(id: number) {
        return await NstemiOutcome.findByPk(id);
    },
    async updateNStemiOutcome(id: number, data: any) {
        const stemi_clinical = await NstemiOutcome.findByPk(id);
        if (!stemi_clinical) return null;
        const { Stemi_Outcome } = data;
        
        // await NstemiOutcome.update(Stemi_Outcome);
        
        return await NstemiOutcome.findByPk(id);
    },

    async deleteNStemiOutcome(id: number) {
        const record = await NstemiOutcome.findByPk(id);
        if (!record) return null;
        await record.destroy();
        return true;
    },

    //Unstable Treatment

    async createAnginaTreatment(data: any) {
        console.log('data - ' + data);
        return await UnstableAnginaTreatment.create(data);
    },

    async findAllAnginaTreatment() {
        return await UnstableAnginaTreatment.findAll();
    },

    async findByIdAnginaTreatment(id: number) {
        return await UnstableAnginaTreatment.findByPk(id);
    },
    async updateAnginaTreatment(id: number, data: any) {
        const stemi_clinical = await UnstableAnginaTreatment.findByPk(id);
        if (!stemi_clinical) return null;
        const { Unstable_AnginaTreatment } = data;
        
        // await UnstableAnginaTreatment.update(Stemi_Outcome);
        
        return await UnstableAnginaTreatment.findByPk(id);
    },

    async deleteAnginaTreatment(id: number) {
        const record = await UnstableAnginaTreatment.findByPk(id);
        if (!record) return null;
        await record.destroy();
        return true;
    },


    //Unstable Outcome

    async createAnginaOutcome(data: any) {
        console.log('data - ' + data);
        return await UnstableAnginaOutcome.create(data);
    },

    async findAllAnginaOutcome() {
        return await UnstableAnginaOutcome.findAll();
    },

    async findByIdAnginaOutcome(id: number) {
        return await UnstableAnginaOutcome.findByPk(id);
    },
    async updateAnginaOutcome(id: number, data: any) {
        const stemi_clinical = await UnstableAnginaOutcome.findByPk(id);
        if (!stemi_clinical) return null;
        const { Unstable_AnginaOutcome } = data;
        
        // await UnstableAnginaOutcome.update(Unstable_AnginaOutcome);
        
        return await UnstableAnginaOutcome.findByPk(id);
    },

    async deleteAnginaOutcome(id: number) {
        const record = await UnstableAnginaOutcome.findByPk(id);
        if (!record) return null;
        await record.destroy();
        return true;
    },
    async getNonIndex(id: number) {
        const [result] = await sequelize.query<any>(
          "SELECT get_stemi_non_index_by_triage_id(:p_triage_id)::JSON as data",
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
    },
    async getNonIndexOP(id: number) {
        const [result] = await sequelize.query<any>(
          "SELECT get_stemi_non_index_by_op_id(:p_triage_id)::JSON as data",
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
