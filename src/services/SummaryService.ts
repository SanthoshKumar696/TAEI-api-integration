import { SummaryRepository } from '../repositories/SummaryRepository';

export class SummaryService {
    private summaryRepository: SummaryRepository;

    constructor() {
        this.summaryRepository = new SummaryRepository();
    }

    async getTransitCareSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number) {
        return await this.summaryRepository.getTransitCareSummary(startDate, endDate, hospital_name, hospital_id);
    }

    async getTriageNurseSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number, is_age12: boolean) {
        return await this.summaryRepository.getTriageNurseSummary(startDate, endDate, hospital_name, hospital_id, is_age12);
    }

    async getEmoSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number, is_age12: boolean) {
        return await this.summaryRepository.getEmoSummary(startDate, endDate, hospital_name, hospital_id, is_age12);
    }

    async getTraumaSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number) {
        return await this.summaryRepository.getTraumaSummary(startDate, endDate, hospital_name, hospital_id);
    }

    async getBurnsSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number) {
        return await this.summaryRepository.getBurnsSummary(startDate, endDate, hospital_name, hospital_id);
    }

    async getStrokeSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number) {
        return await this.summaryRepository.getStrokeSummary(startDate, endDate, hospital_name, hospital_id);
    }

    async getPoisonSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number) {
        return await this.summaryRepository.getPoisonSummary(startDate, endDate, hospital_name, hospital_id);
    }

    async getBitesStingsSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number) {
        return await this.summaryRepository.getBitesStingsSummary(startDate, endDate, hospital_name, hospital_id);
    }

    async getHangingSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number) {
        return await this.summaryRepository.getHangingSummary(startDate, endDate, hospital_name, hospital_id);
    }

    async getPremSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number) {
        return await this.summaryRepository.getPremSummary(startDate, endDate, hospital_name, hospital_id);
    }

    async getStemiSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number) {
        return await this.summaryRepository.getStemiSummary(startDate, endDate, hospital_name, hospital_id);
    }
    async getDrowningSummary(startDate: string, endDate: string, hospital_name: string, hospital_id: number) {
        return await this.summaryRepository.getDrowningSummary(startDate, endDate, hospital_name, hospital_id);
    }
}
