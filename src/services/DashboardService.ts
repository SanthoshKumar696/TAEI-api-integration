import { LookupRepository } from "../repositories/LookupRepository";
import { BitesStingsRepository } from "../repositories/BitesStingsRepository";
import { LkpBiteTypeOfBiteSting, LkpBiteVenomousType, LkpBiteSiteOfBiteSting, LkpBiteSupportiveCareProvided, LkpBiteTypeOfOrganism, LkpBiteOutcome } from "../models/lookup/LkpBitesStingsModel";
import { LkpHospitalType, LkpDestinationHospital, LkpReasonForReferral, LkpConditionOfPatient } from "../models/lookup/LkpCommonModel";
import { LkpPoisonTransferredTo } from "../models/lookup/LkpPoisonsModel";
import { sequelize } from "../config/db";
import { Cases108 } from "../models/Cases108";
import { totalmem } from "os";
import { QueryTypes } from "sequelize";
const axios = require('axios');
const { Op } = require('sequelize');

export const DashboardService= {


    async get_hospital_by_district(req:any) {
        try 
        {
            //get_burns_dashboard
            //get_trauma_dashboard
            //get_stroke_dashboard
            //get_poison_dashboard
            //get_prem_dashboard
            //get_stemi_dashboard

            let funtion_name="";
            let dic_id=req.query.district_id==null?0:req.query.district_id,
                dme_id=req.query.directorate_id==null?0:req.query.directorate_id,
                hospital_id=req.query.hospital_id==null?0:req.query.hospital_id;
            

            const query = `select * from lkp_hospitals where ($1=0 OR district_id=$1) AND ($2=0 OR mainhospitaltype=$2) AND ($3=0 OR hospitalid=$3) order by hospitalname`;
            const result = await sequelize.query(query,{
                bind: [dic_id,dme_id,hospital_id],
                type: QueryTypes.SELECT
            }
            );
            return result;
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async get_district(req:any) {
        try 
        {
            //get_burns_dashboard
            //get_trauma_dashboard
            //get_stroke_dashboard
            //get_poison_dashboard
            //get_prem_dashboard
            //get_stemi_dashboard

            let funtion_name="";           

            const query = `select * from lkp_district where is_enabled is true order by name`;
            const result = await sequelize.query(query,{
                type: QueryTypes.SELECT
            }
            );
            return result;
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async get_directorate(req:any) {
        try 
        {
            //get_burns_dashboard
            //get_trauma_dashboard
            //get_stroke_dashboard
            //get_poison_dashboard
            //get_prem_dashboard
            //get_stemi_dashboard

            let funtion_name="";           

            const query = `select * from auth_directorate`;
            const result = await sequelize.query(query,{
                type: QueryTypes.SELECT
            }
            );
            return result;
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async get_poison_dashboard(req:any) {
        try 
        {
            //get_burns_dashboard
            //get_trauma_dashboard
            //get_stroke_dashboard
            //get_poison_dashboard
            //get_prem_dashboard
            //get_stemi_dashboard

            let funtion_name="";
            let report_type=req.report_type,inst_id=req.institution_id==null?0:req.institution_id,
                host_id=req.district_id==null?0:req.district_id,
                dic_id=req.directorate_id==null?0:req.directorate_id;

            if(report_type==3)
                funtion_name="get_trauma_dashboard";
            else if(report_type==4)
                funtion_name="get_burns_dashboard";
            else if(report_type==5 || report_type==6 ||report_type==7 || report_type==12)
                funtion_name="get_poison_dashboard";
            else if(report_type==8)
                funtion_name="get_stroke_dashboard";
            else if(report_type==9)
                funtion_name="get_prem_dashboard";
            else if(report_type==10)
                funtion_name="get_stemi_dashboard";

            const query = `SELECT ${funtion_name}(:from, :to, :inst, :host_id, :dic_id) AS data`;
            const [result] = await sequelize.query(query,{
                replacements: { from: req.from_date, 
                    to: req.to_date,
                    inst: inst_id ,
                    host_id:host_id,
                    dic_id:dic_id},
                type: QueryTypes.SELECT
            }
            );
            return result;
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async get_poison_dashboard_multi(req:any) {
        try 
        {
            //get_burns_dashboard
            //get_trauma_dashboard
            //get_stroke_dashboard
            //get_poison_dashboard
            //get_prem_dashboard
            //get_stemi_dashboard

            let funtion_name="";
            let report_type=req.report_type,
                dic_id=req.directorate_id==null?0:req.directorate_id;

            // ✅ inst_id handling (NULL or INT[])
            let inst_id: number[] | null = null;
            if (req.institution_id && req.institution_id !== '0') {
                inst_id = req.institution_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else{
                inst_id = [0];
            }
            let district_id: number[] | null = null;
            if (req.district_id && req.district_id !== '0') {
                district_id = req.district_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else
                district_id = [0];

            if(report_type==3)
                funtion_name="ins_report_trauma_dashboard";
            else if(report_type==4)
                funtion_name="ins_report_burns_dashboard";
            else if(report_type==5 || report_type==6 ||report_type==7 || report_type==12)
                funtion_name="ins_report_poison_dashboard";
            else if(report_type==8)
                funtion_name="ins_report_stroke_dashboard";
            else if(report_type==9)
                funtion_name="ins_report_prem_dashboard";
            else if(report_type==10)
                funtion_name="ins_report_stemi_dashboard";
            else if(report_type==20)
                funtion_name="prehospital_dashboard";
            else if(report_type==21)
                funtion_name="inhospital_dashboard";

            
            const query = `SELECT ${funtion_name}(
                                :from,
                                :to, 
                                CASE WHEN ARRAY[:inst_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:inst_id] END,
                                CASE WHEN ARRAY[:district_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:district_id] END,
                                :dic_id
                            ) AS data`;
            const [result] = await sequelize.query(query,{
                replacements: { from: req.from_date, 
                    to: req.to_date,
                    inst_id:inst_id ,
                    district_id:district_id,
                    dic_id:dic_id},
                type: QueryTypes.SELECT
            }
            );
            return result;
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async get_kpi_dashboard(req:any) {
        try 
        {
            let funtion_name="";
            let report_type=req.report_type,inst_id=req.institution_id==null?0:req.institution_id,host_id=req.district_id==null?0:req.district_id,
                dic_id=req.directorate_id==null?0:req.directorate_id;

            if(report_type==0)
                funtion_name="get_taei_kpi_dashboard";
            if(report_type==3)
                funtion_name="get_trauma__kpi_dashboard";
            else if(report_type==4)
                funtion_name="get_burns_kpi_dashboard";
            else if(report_type==5 || report_type==6 ||report_type==7 || report_type==12)
                funtion_name="get_poisoning_kpi_dashboard";
            else if(report_type==8)
                funtion_name="get_stroke_kpi_dashboard";
            else if(report_type==9)
                funtion_name="get_prem_kpi_dashboard";
            else if(report_type==10)
                funtion_name="get_stemi_kpi_dashboard";
            //get_prem_kpi_dashboard
            //get_stemi_kpi_dashboard
            
            // else if(report_type==5 || report_type==6 ||report_type==7 || report_type==12)
            //     funtion_name="get_poison_dashboard";
            
            

            const query = `SELECT ${funtion_name}(:from, :to, :inst, :host_id, :dic_id) AS data`;
            const [result] = await sequelize.query(query,{
                replacements: { from: req.from_date, to: req.to_date, inst: inst_id,host_id:host_id,
                    dic_id:dic_id },
                type: QueryTypes.SELECT
            }
            );
            console.log(result)
            return result;
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async get_kpi_dashboard_multi(req:any) {
        try 
        {
            let funtion_name="";
            let report_type=req.report_type,
                dic_id=req.directorate_id==null?0:req.directorate_id;

            let inst_id: number[] | null = null;

            if (req.institution_id && req.institution_id !== '0') {
                inst_id = req.institution_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else{
                inst_id = [0];
            }
            let district_id: number[] | null = null;
            if (req.district_id && req.district_id !== '0') {
                district_id = req.district_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else
                district_id = [0];

            if(report_type==0)
                funtion_name="kpi_taei_kpi_dashboard";
            if(report_type==3)
                funtion_name="kpi_trauma_kpi_dashboard";
            else if(report_type==4)
                funtion_name="kpi_burns_kpi_dashboard";
            else if(report_type==5 || report_type==6 ||report_type==7 || report_type==12)
                funtion_name="kpi_poisoning_dashboard";
            else if(report_type==8)
                funtion_name="kpi_stroke_dashboard";
            else if(report_type==9)
                funtion_name="kpi_prem_dashboard";
            else if(report_type==10)
                funtion_name="kpi_stemi_dashboard";
            //get_prem_kpi_dashboard
            //get_stemi_kpi_dashboard
            
            // else if(report_type==5 || report_type==6 ||report_type==7 || report_type==12)
            //     funtion_name="get_poison_dashboard";
            
            

            const query = `SELECT ${funtion_name}(:from, :to,
             CASE WHEN ARRAY[:inst_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:inst_id] END,
             CASE WHEN ARRAY[:district_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:district_id] END,
             :dic_id) AS data`;
            const [result] = await sequelize.query(query,{
                replacements: { 
                    from: req.from_date,
                    to: req.to_date,
                    inst_id: inst_id,
                    district_id:district_id,
                    dic_id:dic_id 
                },
                type: QueryTypes.SELECT
            }
            );
            console.log(result)
            return result;
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    
    async get_report_dashboard(req:any) {
        try 
        {
            let funtion_name="";
            let report_type=req.report_type,inst_id=req.institution_id==null?0:req.institution_id,host_id=req.district_id==null?0:req.district_id,
            dic_id=req.directorate_id==null?0:req.directorate_id;

            // if(report_type==0)
            //     funtion_name="get_taei_kpi_dashboard";
            if(report_type==3) //Single
                funtion_name="get_state_report_dashboard_trauma_optimized";
            else if(report_type==4) //Single
                funtion_name="get_state_report_dashboard_burns_optimized";
            else if(report_type==5) //Multiple Row
                 funtion_name="get_state_report_dashboard_poison";
            else if(report_type==6) //Multiple Row
                 funtion_name="get_state_report_dashboard_bitestings";
            else if(report_type==8) //Single
                funtion_name="get_state_report_dashboard_stroke_optimized";
            else if(report_type==9) //Single
                funtion_name="get_state_report_dashboard_prem_optimized";
            else if(report_type==10) //Stemi Single
                funtion_name="get_state_report_dashboard_stemi_optimized";
            //get_prem_kpi_dashboard
            //get_stemi_kpi_dashboard
            
            // else if(report_type==5 || report_type==6 ||report_type==7 || report_type==12)
            //     funtion_name="get_poison_dashboard";
            
            

            const query = `SELECT * from ${funtion_name}(:from, :to, :inst_id, :host_id, :dic_id) as data `;
            const result = await sequelize.query(query,{
                replacements: { 
                    from: req.from_date,
                    to: req.to_date,
                    inst_id: inst_id,
                    host_id: host_id ,
                    dic_id:dic_id
                 },
                type: QueryTypes.SELECT
            });
            // if(report_type==10)
            // {
                
            //     const query1 = `SELECT * from get_state_report_dashboard_stemi2(:from, :to) AS data`;
            //     const result1 = await sequelize.query(query1,{
            //         replacements: { from: req.from_date, to: req.to_date },
            //         type: QueryTypes.SELECT
            //     });
            //     return {
            //         "stemi":result[0],
            //         "cathlab":result1[0]
            //     };
            // }
            console.log(result)
            if ([3,4,8,9,10].includes(report_type)) {
                return {"data":result};
            }
            return result;
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async get_report_dashboard_multi(req:any) {
        try 
        {
            let funtion_name="";
            let report_type=req.report_type,
            dic_id=req.directorate_id==null?0:req.directorate_id;

            let inst_id: number[] | null = null;

            if (req.institution_id && req.institution_id !== '0') {
                inst_id = req.institution_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else
                inst_id = [0];

            let district_id: number[] | null = null;
            if (req.district_id && req.district_id !== '0') {
                district_id = req.district_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else
                district_id = [0];

            // if(report_type==0)
            //     funtion_name="get_taei_kpi_dashboard";
            if(report_type==3) //Single
                funtion_name="report_dashboard_trauma";
            else if(report_type==4) //Single
                funtion_name="report_dashboard_burns";
            else if(report_type==5) //Multiple Row
                 funtion_name="report_dashboard_poison";
            else if(report_type==6) //Multiple Row
                 funtion_name="report_dashboard_bites_stings";
            else if(report_type==8) //Single
                funtion_name="report_dashboard_stroke";
            else if(report_type==9) //Single
                funtion_name="report_dashboard_prem";
            else if(report_type==10) //Stemi Single
                funtion_name="report_dashboard_stemi";
            //get_prem_kpi_dashboard
            //get_stemi_kpi_dashboard
            
            // else if(report_type==5 || report_type==6 ||report_type==7 || report_type==12)
            //     funtion_name="get_poison_dashboard";
            
            

            const query = `SELECT * from ${funtion_name}(:from, :to,
                CASE WHEN ARRAY[:inst_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:inst_id] END,
                CASE WHEN ARRAY[:district_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:district_id] END,
                :dic_id
            ) as data `;
            const result = await sequelize.query(query,{
                replacements: { 
                    from: req.from_date,
                    to: req.to_date,
                    inst_id: inst_id,
                    district_id: district_id ,
                    dic_id:dic_id
                 },
                type: QueryTypes.SELECT
            });
            // if(report_type==10)
            // {
                
            //     const query1 = `SELECT * from get_state_report_dashboard_stemi2(:from, :to) AS data`;
            //     const result1 = await sequelize.query(query1,{
            //         replacements: { from: req.from_date, to: req.to_date },
            //         type: QueryTypes.SELECT
            //     });
            //     return {
            //         "stemi":result[0],
            //         "cathlab":result1[0]
            //     };
            // }
            if ([3,4,8,9,10].includes(report_type)) {
                return {"data":result};
            }
            return result;
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async get_report_dashboard2(req: any) 
    {
        try {
            const reportType = Number(req.report_type);
            const from = req.from_date;
            const to = req.to_date;

            // 1️⃣ Get institution list first
            const instList:any = await sequelize.query(
            `select hospitalid,hospitalname,districtname from lkp_hospitals`,
            { type: QueryTypes.SELECT }
            );

            if (!instList.length) {
            return { data: [], message: "No institutions found" };
            }

            // 2️⃣ Map report type → function name (MUST accept institution_id)
            const FUNCTION_MAP: Record<number, string> = {
            3:  'get_state_report_dashboard_trauma',
            4:  'get_state_report_dashboard_burns',
            5:  'get_state_report_dashboard_poison',
            6:  'get_state_report_dashboard_bitestings',
            8:  'get_state_report_dashboard_stroke',
            9:  'get_state_report_dashboard_prem',
            10: 'get_state_report_dashboard_stemi'
            };
            //get_state_report_dashboard_trauma_optimized
            //get_state_report_dashboard_burns_optimized
            //get_state_report_dashboard_stroke_optimized
            //get_state_report_dashboard_prem_optimized
            //get_state_report_dashboard_stemi_optimized

            const func = FUNCTION_MAP[reportType];
            if (!func) {
            throw new Error(`Unsupported report_type: ${reportType}`);
            }

            const finalResult: any[] = [];

            // 3️⃣ Call dashboard function for each institution
            for (const inst of instList) {

                const query = `SELECT * FROM ${func}(:from, :to, :inst_id) AS data`;

                const rows = await sequelize.query(query, {
                    replacements: { from, to, inst_id: inst.hospitalid },
                    type: QueryTypes.SELECT
                });

                finalResult.push({
                    institution_id: inst.hospitalid,
                    institution_name: inst.hospitalname,
                    districtname: inst.districtname,
                    dashboard: rows[0] ?? {}
                });
            }

            // 4️⃣ Special handling for STEMI (needs cathlab function also)
            if (reportType === 10) {
            for (const item of finalResult) {
                const query2 = `SELECT * FROM get_state_report_dashboard_stemi2(:from, :to, :inst_id) AS data`;
                const cathlabRes = await sequelize.query(query2, {
                replacements: { from, to, inst_id: item.institution_id },
                type: QueryTypes.SELECT
                });

                item.cathlab = cathlabRes[0] ?? {};
            }
            }

            return { data: finalResult };

        } catch (err) {
            console.error("Error generating dashboard:", err);
            return { error: true, message: err };
        }
    },

    //#region Entry Report Start
    async get_entry_report(req:any) {
        console.log(req)
        try 
        {
            let funtion_name="get_all_main_cases_by_institution2";
            //entry_report_institution
            let report_type=req.report_type,inst_id=req.institution_id==null?0:req.institution_id,host_id=req.district_id==null?0:req.district_id,
             dic_id=req.directorate_id==null?0:req.directorate_id;

            const query = `SELECT * from ${funtion_name}(:from, :to, :inst, :host_id,:dic_id) AS data`;
            const result = await sequelize.query(query,{
                replacements: { from: req.from_date, to: req.to_date, inst: inst_id ,host_id: host_id,dic_id:dic_id},
                type: QueryTypes.SELECT
            }
            );
            return {"data":result};
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async get_entry_report_multi(req:any) {
        console.log(req)
        try 
        {
            let funtion_name="entry_report_institution";
            //entry_report_institution
            let report_type=req.report_type,
             dic_id=req.directorate_id==null?0:req.directorate_id;

            let inst_id: number[] | null = null;

            if (req.institution_id && req.institution_id !== '0') {
                inst_id = req.institution_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else{
                inst_id = [0];
            }
            let district_id: number[] | null = null;

            if (req.district_id && req.district_id !== '0') {
                district_id = req.district_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else{
                district_id = [0];
            }
            const query = `SELECT * from ${funtion_name}(
                    :from,
                    :to,
                     CASE WHEN ARRAY[:inst_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:inst_id] END,
                     CASE WHEN ARRAY[:district_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:district_id] END,
                    :dic_id
            ) AS data`;
            const result = await sequelize.query(query,{
                replacements: {
                    from: req.from_date,
                    to: req.to_date,
                    inst_id: inst_id,
                    district_id: district_id,
                    dic_id:dic_id},
                type: QueryTypes.SELECT
            }
            );
            return {"data":result};
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    //get pillar wise patient list
    async get_entry_report_by_click(req:any) {
        try 
        {
            let funtion_name="get_all_main_cases_patient_list";
            // let report_type=req.report_type,inst_id=req.institution_id;           
            // let { offset = 1, limit = 20, ...filters } = req.query;
            const query = `SELECT * from ${funtion_name}(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date,:p_pillar_type,:p_report_type) AS data`;
            const result = await sequelize.query(query,{
                replacements: {
                    p_limit: req.query.limit ?? 10,
                    p_offset: (req.query.offset-1)*req.query.limit,
                    p_hospital_id: req.query.hospital_id,
                    p_start_date: req.query.start_date,
                    p_end_date: req.query.end_date,
                    
                    p_pillar_type: req.query.pillar_type,
                    p_report_type: req.query.report_type
                    
                },
                type: QueryTypes.SELECT
            }
            );
            return {"data":result};
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    //get 108 reports
     async get_entry_report_by_click_108(req:any) {
        console.log(req.query)
        try 
        {
            let funtion_name="get_all_main_cases_patient_list_108";
            // let report_type=req.report_type,inst_id=req.institution_id;           
            // let { offset = 1, limit = 20, ...filters } = req.query;
            const query = `SELECT * from ${funtion_name}( :p_start_date, :p_end_date,:p_limit, :p_offset, :p_hospital_id,:p_report_type) AS data`;
            const result = await sequelize.query(query,{
                replacements: {
                    p_limit: req.query.limit ?? 10,
                    p_offset: (req.query.offset-1)*req.query.limit,
                    p_hospital_id: req.query.hospital_name,
                    p_start_date: req.query.start_date,
                    p_end_date: req.query.end_date,
                    p_report_type: req.query.report_type
                    
                },
                type: QueryTypes.SELECT
            }
            );
            return {"data":result};
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    //#endregion Entry Report End

    // #region patient tracker
    async get_patient_tracker_search(req:any) {
        console.log(req.query)
        try 
        {
            let funtion_name="get_state_patient_tracker_search_triage";
            // let report_type=req.report_type,inst_id=req.institution_id;           
            // let { offset = 1, limit = 20, ...filters } = req.query;
            const query = `SELECT * from ${funtion_name}(:p_name,:p_mobile,:p_limit, :p_offset,:p_report_type,:p_case_id) AS data`;
            const [result] = await sequelize.query(query,{
                replacements: {
                    p_limit: req.query.limit ?? 10,
                    p_offset: (req.query.offset-1)*req.query.limit,                    
                    p_name: req.query.patient_name==null?'':req.query.patient_name,
                    p_mobile: req.query.mobile==null?'':req.query.mobile,
                    p_report_type:req.query.search_type,
                    p_case_id:req.query.case_id==null?'':req.query.case_id
                },
                type: QueryTypes.SELECT
            }
            );
            return {"data":result};
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async get_patient_tracker_details(req:any) {
        
        let funtion_name="get_triage_non_index_by_triage_id";
        if(req.query.emergency_category==1)
        {
            funtion_name="get_trauma_non_index_by_triage_id";
        }
        else if(req.query.emergency_category==2)
        {
            funtion_name="get_prem_non_index_by_triage_id";
        }
        else if(req.query.emergency_category==3)
        {
            funtion_name="get_burns_non_index_by_triage_id";
        }
        else if(req.query.emergency_category==5)
        {
            funtion_name="get_poison_non_index_by_triage_id";
        }
        else if(req.query.emergency_category==6)
        {
            funtion_name="get_bites_stings_non_index_by_triage_id";
        }
        else if(req.query.emergency_category==7)
        {
            funtion_name="get_hanging_non_index_by_triage_id";
        }
        else if(req.query.emergency_category==8)
        {
            funtion_name="get_drowning_non_index_by_triage_id";
        }
        else if(req.query.emergency_category==10)
        {
            funtion_name="get_stroke_non_index_by_triage_id";
        }
        else if(req.query.emergency_category==11)
        {
            funtion_name="get_stemi_non_index_by_op_id";
        }
        const query = `SELECT ${funtion_name}(:p_triage_id)::JSON as data`;  
        const [result] = await sequelize.query<any>(query,
          {
            replacements: {
              p_triage_id: req.query.triage_id
            }
            , type: QueryTypes.SELECT
          },
    
        );
        return {
          data: result.data,
        };
    },
    // #endregion 

    //#region 
    async get_dashboard_prehospital(req:any) {
        try 
        {
            // newly added
            let funtion_name="get_dashboard_prehospital"; //prehospital_dashboard
            // let report_type=req.report_type,inst_id=req.institution_id;           
            // let { offset = 1, limit = 20, ...filters } = req.query;
            const query = `SELECT * from ${funtion_name}(:p_start_date,:p_end_date,:p_hospital_name,:p_district_name) AS data`;
            const [result] = await sequelize.query(query,{
                replacements: {               
                    p_start_date: req.query.start_date,
                    p_end_date: req.query.end_date,
                    p_hospital_name:req.query.hospital_name==null?'':req.query.hospital_name,
                    p_district_name:req.query.district_name==null?'':req.query.district_name
                },
                type: QueryTypes.SELECT
            }
            );
            return {"data":result};
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    // pre hospital dashboard multi
    async get_dashboard_prehospital_multi(req:any) {
        try 
        {

            let inst_id: number[] | null = null;
            if (req.query.institution_id && req.query.institution_id !== '0') {
                inst_id = req.query.institution_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else{
                inst_id = [0];
            }
            let district_id: number[] | null = null;
            if (req.query.district_id && req.query.district_id !== '0') {
                district_id = req.query.district_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else
                district_id = [0];
            // newly added
            let funtion_name="prehospital_dashboard"; //prehospital_dashboard
            // let report_type=req.report_type,inst_id=req.institution_id;           
            // let { offset = 1, limit = 20, ...filters } = req.query;
            const query = `SELECT * from ${funtion_name}(
                :p_start_date,
                :p_end_date,
                CASE WHEN ARRAY[:inst_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:inst_id] END,
                CASE WHEN ARRAY[:district_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:district_id] END,
                :dic_id
            ) AS data`;
            const [result] = await sequelize.query(query,{
                replacements: {               
                    p_start_date: req.query.start_date,
                    p_end_date: req.query.end_date,
                    inst_id:inst_id,
                    district_id:district_id,
                    dic_id:req.query.directorate_id
                },
                type: QueryTypes.SELECT
            }
            );
            return {"data":result};
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async get_dashboard_main(req:any) {
        try 
        {
            let funtion_name="get_dashboard_main"; //inhospital_dashboard
            // let report_type=req.report_type,inst_id=req.institution_id;           
            // let { offset = 1, limit = 20, ...filters } = req.query;
            const query = `SELECT * from ${funtion_name}(:p_start_date,:p_end_date,:p_hospital_id,:p_district_id) AS data`;
            const [result] = await sequelize.query(query,{
                replacements: {               
                    p_start_date: req.query.start_date,
                    p_end_date: req.query.end_date,
                    p_hospital_id:req.query.hospital_id==null?0:req.query.hospital_id,
                    p_district_id:req.query.district_id==null?0:req.query.district_id
                },
                type: QueryTypes.SELECT
            }
            );
            return {"data":result};
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    // in hospital dashboard multi
    async get_dashboard_main_multi(req:any) {
        try 
        {

            let inst_id: number[] | null = null;
            if (req.query.institution_id && req.query.institution_id !== '0') {
                inst_id = req.query.institution_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else{
                inst_id = [0];
            }
            let district_id: number[] | null = null;
            if (req.query.district_id && req.query.district_id !== '0') {
                district_id = req.query.district_id
                    .split(',')
                    .map((id: string) => Number(id.trim()));
            }
            else
                district_id = [0];

            let funtion_name="inhospital_dashboard"; //inhospital_dashboard
            // let report_type=req.report_type,inst_id=req.institution_id;           
            // let { offset = 1, limit = 20, ...filters } = req.query;
            const query = `SELECT * from ${funtion_name}(
                :p_start_date,
                :p_end_date,
                CASE WHEN ARRAY[:inst_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:inst_id] END,
                CASE WHEN ARRAY[:district_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:district_id] END,
                :dic_id
            ) AS data`;
            const [result] = await sequelize.query(query,{
                replacements: {               
                    p_start_date: req.query.start_date,
                    p_end_date: req.query.end_date,
                    inst_id:inst_id,
                    district_id:district_id,
                    dic_id:req.query.directorate_id
                },
                type: QueryTypes.SELECT
            }
            );
            return {"data":result};
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },

    
    async get_dashboard_trauma(req:any) {
        try 
        {
            let funtion_name="get_dashboard_main_trauma";
            // let report_type=req.report_type,inst_id=req.institution_id;           
            // let { offset = 1, limit = 20, ...filters } = req.query;
            const query = `SELECT * from ${funtion_name}(:p_start_date,:p_end_date,:p_hospital_id,:p_district_id) AS data`;
            const [result] = await sequelize.query(query,{
                replacements: {               
                    p_start_date: req.query.start_date,
                    p_end_date: req.query.end_date,
                    p_hospital_id:req.query.hospital_id==null?0:req.query.hospital_id,
                    p_district_id:req.query.district_id==null?0:req.query.district_id
                },
                type: QueryTypes.SELECT
            }
            );
            return {"data":result};
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    //#endregion

    // #region triage list state


    async getTriageList(req:any){
    
        //inhospital_dashboard_triage_list
        const limit=req.pageSize||50;
        const offset=((req.pageNumber||1) -1) * limit;
        const result = await sequelize.query(
          "SELECT * FROM get_triage_list_state(:p_limit, :p_offset, :p_hospital_id, :p_start_date, :p_end_date,:p_district_id,:p_directorate_id)",
          {
            replacements: {
              p_limit: limit ?? 10,
              p_offset: offset ?? 0,
              p_hospital_id: 0,
              p_start_date: req.query.start_date,
              p_end_date: req.query.end_date,
              p_district_id: req.query.district_id==null?0:req.query.district_id,
              p_directorate_id: req.query.directorate_id==null?0:req.query.directorate_id,
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
    async getTriageList_multi(req:any){
    
        let inst_id: number[] | null = null;
        if (req.query.institution_id && req.query.institution_id !== '0') {
            inst_id = req.query.institution_id
                .split(',')
                .map((id: string) => Number(id.trim()));
        }
        else{
            inst_id = [0];
        }
        let district_id: number[] | null = null;
        if (req.query.district_id && req.query.district_id !== '0') {
            district_id = req.query.district_id
                .split(',')
                .map((id: string) => Number(id.trim()));
        }
        else
            district_id = [0];
        //inhospital_dashboard_triage_list
        const limit=req.pageSize||50;
        const offset=((req.pageNumber||1) -1) * limit;
        const query = `SELECT * FROM inhospital_dashboard_triage_list(
            :p_limit, 
            :p_offset, 
            CASE WHEN ARRAY[:p_hospital_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:p_hospital_id] END,
            :p_start_date, 
            :p_end_date,
            CASE WHEN ARRAY[:p_district_id]=ARRAY[0] THEN NULL::int[] ELSE ARRAY[:p_district_id] END,
            :p_directorate_id
        )`;
        const result = await sequelize.query(
          query,
          {
            replacements: {
              p_limit: limit ?? 10,
              p_offset: offset ?? 0,
              p_hospital_id: inst_id,
              p_start_date: req.query.start_date,
              p_end_date: req.query.end_date,
              p_district_id: district_id,
              p_directorate_id: req.query.directorate_id==null?0:req.query.directorate_id,
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
    // #endregion

}