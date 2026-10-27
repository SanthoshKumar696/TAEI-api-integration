import { AbhaProfile } from "../models/AbhaProfile";
import { Triage } from "../models/Triage";

export class AbhaProfileRepository {

  // Create
  async create(data: any) {
    return await AbhaProfile.create(data);
  }

  //  Find by ID
  async findById(id: number) {
    return await AbhaProfile.findByPk(id);
  }

  //  Find by ABHA Number 
  async findByAbhaNumber(abhaNumber: string) {
    return await AbhaProfile.findOne({
      where: { abha_number: abhaNumber }
    });
  }
// ✅ NEW — update all token fields after refresh
  async updateTokens(
    profileId: number,
    xToken: string,
    refreshToken: string  ,
    xTokenExpiry: Date,
    refreshTokenExpiry: Date
  ) {
    return await AbhaProfile.update(
      {
        x_token: xToken,
        refresh_token: refreshToken,
        x_token_expiry: xTokenExpiry,
        refresh_token_expiry: refreshTokenExpiry,
        updated_on: new Date()
      },
      { where: { id: profileId } }
    );
  }
  //  UPSERT 
  async upsertByAbhaNumber(abhaNumber: string, data: any) {

    const existing = await this.findByAbhaNumber(abhaNumber);

    if (existing) {
      console.log(" ABHA already exists → updating");
      await existing.update(data);
      return existing;
    }

    console.log(" New ABHA → creating");
    return await AbhaProfile.create(data);
  }

async getTriagePatientDetails(triageId: number) {
  return await Triage.findOne({
    where: { id: triageId },
    attributes: [
      "abha_card",
      "gender",
      "name_of_patient",
      "age_year"
    ]
  });
}

}

export default new AbhaProfileRepository();