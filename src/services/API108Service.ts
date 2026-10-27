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
import { getISTDate } from "../utils/formatDateToLocalString";

import ExcelJS from "exceljs";
const fs = require("fs");
interface TAEIRawRow {
    result: any;
}

export const API108Service= {



    async fetchAndSaveCases() {
        try 
        {
            // 🔹 Call external API
            const today = getISTDate();//new Date();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const yyyy = today.getFullYear();
            const todayStr = `${mm}/${dd}/${yyyy}`;

            // const response1 = await axios.get('https://taei.co.in/WebAPI108/TransitCareLinelist_v2?Page_Number=1&FromDate='+todayStr+'&ToDate='+todayStr+'&Search_Text=&Hospital=null&DistrictId=0&HospitalType=null');
            // const pagenumber = response1.data.Page_Count;

            const response = await axios.get('https://web.taei.co.in/WebAPI108/TransitCareLinelist_v2?Page_Number=1&FromDate='+todayStr+'&ToDate='+todayStr+'&Search_Text=&Hospital=null&DistrictId=0&HospitalType=null');
            const caseList = response.data.data;
            // if (!Array.isArray(caseList)) {
            //     throw new Error('API did not return an array');
            // }
            for (const caseObj of caseList) {
                try {
                    const inserted = this.insertEmergencyCase(caseObj);
                } catch (err) {
                    console.error(`Failed to insert CaseId ${caseObj.CaseId}:`, err);
                }
            }
            // for (let i = 1; i <= pagenumber; i++) {
            //     // this.sync_all_data(i,todayStr);
            //     const response = await axios.get('https://taei.co.in/WebAPI108/TransitCareLinelist_v2?Page_Number='+i+'&FromDate='+todayStr+'&ToDate='+todayStr+'&Search_Text=&Hospital=null&DistrictId=0&HospitalType=null');
            //     const caseList = response.data.data;
            //     // if (!Array.isArray(caseList)) {
            //     //     throw new Error('API did not return an array');
            //     // }
            //     for (const caseObj of caseList) {
            //         try {
            //             const inserted = this.insertEmergencyCase(caseObj);
            //         } catch (err) {
            //             console.error(`Failed to insert CaseId ${caseObj.CaseId}:`, err);
            //         }
            //     }
            // }
            console.log('Sync completed');
        }
        catch (err) {
            console.error('API fetch failed:', err);
        }
        return "";
    },
    async sync_all_data(page_number:number,todayStr:string)
    {
        
        const response = await axios.get('https://taei.co.in/WebAPI108/TransitCareLinelist_v2?Page_Number='+page_number+'&FromDate='+todayStr+'&ToDate='+todayStr+'&Search_Text=&Hospital=null&DistrictId=0&HospitalType=null');
        const caseList = response.data.data;
        // if (!Array.isArray(caseList)) {
        //     throw new Error('API did not return an array');
        // }
        for (const caseObj of caseList) {
            try {
                const inserted = this.insertEmergencyCase(caseObj);
            } catch (err) {
                console.error(`Failed to insert CaseId ${caseObj.CaseId}:`, err);
            }
        }
        return 1;
    }, 
    async add_calls(caseObj:any) {
        
        try {
            const data_stemi_admission = await Cases108.findOne({
                where: { CaseId: caseObj.CaseId }
            });

            if (!data_stemi_admission) {
                // Create a new record
                const created = await Cases108.create(caseObj);
                return {
                    ResponseCode: 1,
                    Status: "Success",
                    Message: "Record created successfully",
                    Data: { RefNo: created.id || 0 }
                };
            } else {
                // Update existing record
                await Cases108.update(caseObj, {
                    where: { CaseId: caseObj.CaseId }
                });
                return {
                    ResponseCode: 1,
                    Status: "Success",
                    Message: "Record updated successfully",
                    Data: { RefNo: data_stemi_admission.id || 0 }
                };
            }

        } catch (error) {
            console.error("Error in add_calls:", error);
            return {
                ResponseCode: 2,
                Status: "Failed",
                Message: "Unable to process the request",
                Data: { RefNo: 0 }
            };
        }
        // const result = await sequelize.crea(query, values);        
    }   ,
    async insertEmergencyCase(caseObj:any) {
        
        const data_stemi_admission = await Cases108.findOne({
                    where: { CaseId: caseObj.CaseId }
                });
        if(!data_stemi_admission)
            await Cases108.create(caseObj);
        else
            await Cases108.update(caseObj,{
                    where: { CaseId: caseObj.CaseId }
                });
        return "";
        // const result = await sequelize.crea(query, values);        
    },
    getdate_format(req:any)
    {
        // const dateStr = req.date; // MM/DD/YYYY

        const [month, day, year] = req.split('/').map(Number);
        const dateObj = new Date(year, month - 1, day);
        dateObj.setHours(0, 0, 0, 0);
        return dateObj;
    },
    async get_all_cases(req:any)
    {
        const limit=req.pageSize||50;
        const offset=((req.pageNumber||1) -1) * limit;
        const dateStr = req.date; // MM/DD/YYYY
        let case_id=null;
        let hospital_name=null,district_id=0,directorate_id=0;
        if(req.hospital_name)
            hospital_name=req.hospital_name;
        if(req.caseId)
            case_id=req.caseId;
        if(req.district_id)
            district_id=req.district_id;
        if(req.directorate_id)
            directorate_id=req.directorate_id;

        //get_cases108_filtered_list
        const [resultset]:any = await sequelize.query(
                    "SELECT get_cases108_filtered_list(:p_start_date, :p_end_date, :p_hospital,:p_case_id,:p_limit,:p_offset,:p_district_id,:p_directorate_id) ",
            {
                replacements: {
                    p_start_date: req.date,
                    p_end_date: req.to_date,
                    p_hospital: hospital_name,
                    p_case_id:case_id,
                    p_limit:limit,
                    p_offset:offset,
                    p_district_id:district_id,
                    p_directorate_id:directorate_id
                }
                , type: QueryTypes.SELECT
            },
        
        );
        const data = resultset.get_cases108_filtered_list;
        return data;
        // const [month, day, year] = dateStr.split('/').map(Number);
        // const dateObj = new Date(year, month - 1, day);
        // dateObj.setHours(0, 0, 0, 0);
        // const tomorrow = new Date(dateObj);
        // tomorrow.setDate(dateObj.getDate() + 1);  // start of next day
        
        const fromdate=this.getdate_format(req.date);
        const todate=this.getdate_format(req.to_date);
        const tomorrow=todate.setDate(todate.getDate() + 1);
        const filters: any = {};
        if(req.hospital_name)
            filters.HospitalName=req.hospital_name;
        filters.InsertedDate= {
                    [Op.gte]: fromdate,   // greater than or equal to start of today
                    [Op.lt]: tomorrow  // less than start of tomorrow
        }
        if(req.caseId)
            filters.CaseId=req.caseId;

        filters.Emergency_Type = { [Op.ne]: 'Pregnancy related' };
        const result = await Cases108.findAndCountAll({
            limit:limit,
            offset:offset,
            where:filters
        });
        return {
            totalItems: result.count,
            totalPages: Math.ceil(result.count / limit),
            currentPage: (req.pageNumber||1),
            data: result.rows,
        };
        // return {caselist};
    },
    async get_taei_report(date:any,to_date:any)
    {
        const rows = await sequelize.query(
        "SELECT * FROM get_state_taei_full_export(:p_start_date, :p_end_date, :p_hospital)",
        {
            replacements: {
                p_start_date: date,
                p_end_date: to_date,
                p_hospital: 0
            },
            type: QueryTypes.SELECT
        }
        );
        const flatRows = rows;

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("TAEI Report");

        if (flatRows.length === 0) {
            sheet.addRow(["No Data"]);
        } else {

            // Excel header = keys of the row (in RETURNS TABLE order)
            const headers = Object.keys(flatRows[0]);

            sheet.columns = headers.map(col => ({
                header: col,
                key: col,
                width: col.length < 20 ? 20 : col.length
            }));

            flatRows.forEach(row => sheet.addRow(row));

            // Bold headers
            sheet.getRow(1).eachCell(cell => {
                cell.font = { bold: true };
            });

            // Freeze top row
            sheet.views = [{ state: "frozen", ySplit: 1 }];
        }

        const filePath = `TAEI_Report_${Date.now()}.xlsx`;
        await workbook.xlsx.writeFile(filePath);

        return filePath;
        // return data;
    }


//     async function insertEmergencyCase(caseObj) {
//   const query = `
//     INSERT INTO emergency_cases(
//       "row_num", "IsCritical", "CaseId", "NotReceivedCase108", "PatientName",
//       "DistrictName", "BaseLocation", "VehicleNumber", "ChiefComplaint",
//       "HospitalName", "PersonalInfoId", "RTS_Color", "VehicleAssignedTime",
//       "NurseTriageId", "TriageId", "RequestId", "CallerName", "Age",
//       "Emergency_Type", "Emergency_Sub_Type", "SPO2", "RR", "Temperature",
//       "BP_DBP", "BP_SBP", "CarotidPulse", "CallType", "SourceHospital",
//       "InsertedDate"
//     )
//     VALUES (
//       $1,$2,$3,$4,$5,
//       $6,$7,$8,$9,$10,
//       $11,$12,$13,$14,$15,
//       $16,$17,$18,$19,$20,
//       $21,$22,$23,$24,$25,
//       $26,$27,$28,$29
//     )
//     RETURNING "CaseId"
//   `;

//   const values = [
//     caseObj.row_num,
//     caseObj.IsCritical === "1",
//     caseObj.CaseId,
//     caseObj.NotReceivedCase108 === "1",
//     caseObj.PatientName,
//     caseObj.DistrictName,
//     caseObj.BaseLocation,
//     caseObj.VehicleNumber,
//     caseObj.ChiefComplaint,
//     caseObj.HospitalName,
//     caseObj.PersonalInfoId,
//     caseObj.RTS_Color,
//     caseObj.VehicleAssignedTime ? new Date(caseObj.VehicleAssignedTime) : null,
//     caseObj.NurseTriageId,
//     caseObj.TriageId,
//     caseObj.RequestId,
//     caseObj.CallerName,
//     caseObj.Age,
//     caseObj.Emergency_Type,
//     caseObj.Emergency_Sub_Type,
//     caseObj.SPO2 ? Number(caseObj.SPO2) : null,
//     caseObj.RR,
//     caseObj.Temperature ? Number(caseObj.Temperature) : null,
//     caseObj.BP_DBP,
//     caseObj.BP_SBP,
//     caseObj.CarotidPulse,
//     caseObj.CallType,
//     caseObj.SourceHospital,
//     caseObj.InsertedDate ? new Date(caseObj.InsertedDate) : null
//   ];

//   const result = await pool.query(query, values);
//   return result.rows[0];
// }
}

