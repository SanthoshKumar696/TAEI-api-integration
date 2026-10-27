import { sequelize } from "../config/db";
import { QueryTypes } from "sequelize";

export class SummaryRepository {

    async getTransitCareSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_cases_108_summary(:p_start_date, :p_end_date, :p_hospital)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital: hospital_name,
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }

    async getTriageNurseSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number, is_age12: boolean):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_triage_summary(:p_start_date, :p_end_date, :p_hospital_id, :p_hospital_name, :p_is_age12)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital_id: hospital_id,
                    p_hospital_name: hospital_name,
                    p_is_age12: is_age12
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }

    async getEmoSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number, is_age12: boolean):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_emo_triage_summary(:p_start_date, :p_end_date, :p_hospital_id, :p_is_age12)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital_id: hospital_id,
                    p_is_age12: is_age12
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }

    async getTraumaSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_trauma_summary(:p_start_date, :p_end_date, :p_hospital_id)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital_id: hospital_id,
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }

    async getBurnsSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_burns_summary(:p_start_date, :p_end_date, :p_hospital_id)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital_id: hospital_id,
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }

    async getStrokeSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_stroke_summary(:p_start_date, :p_end_date, :p_hospital_id)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital_id: hospital_id,
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }

    async getPoisonSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_poison_summary(:p_start_date, :p_end_date, :p_hospital_id)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital_id: hospital_id,
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }

    async getBitesStingsSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_bites_stings_summary(:p_start_date, :p_end_date, :p_hospital_id)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital_id: hospital_id,
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }

    async getHangingSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_hanging_summary(:p_start_date, :p_end_date, :p_hospital_id)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital_id: hospital_id,
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }

    async getPremSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_prem_summary(:p_start_date, :p_end_date, :p_hospital_id)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital_id: hospital_id,
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }
    async getStemiSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_stemi_summary(:p_start_date, :p_end_date, :p_hospital_id)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital_id: hospital_id,
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }
    async getDrowningSummary(start_date: string, end_date: string, hospital_name: string, hospital_id: number):
        Promise<any> {

        const result = await sequelize.query(
            "SELECT * FROM get_drowning_summary(:p_start_date, :p_end_date, :p_hospital_id)",
            {
                replacements: {
                    p_start_date: start_date,
                    p_end_date: end_date,
                    p_hospital_id: hospital_id,
                }
                , type: QueryTypes.SELECT
            },

        );

        return result;
    }
}
