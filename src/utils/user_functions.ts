import { Request } from "express";

export function getHospitalId(req: Request): number {
  const user = (req as any).user;
  if (user?.hospital?.hospitalid) {
    return Number(user.hospital.hospitalid);
  }

  // Local dev/test fallback when no authenticated user is available
  if (process.env.NODE_ENV !== "production") {
    const fallbackHospitalId = Number(process.env.DEV_HOSPITAL_ID || 1);
    return Number.isNaN(fallbackHospitalId) ? 1 : fallbackHospitalId;
  }

  throw new Error("Hospital Id details not found in token");
}

export function getHospitalName(req: Request): string {
  const user = (req as any).user;
  if (!user || !user.hospital) {
    throw new Error("Hospital Name details not found in token");
  }
  return user.hospital.hospitalname108;
}

export function getUserName(req: Request): string {
  const user = (req as any).user;
  if (!user) {
    throw new Error("User details not found in token");
  }
  
  return user.username;
}

export function getUserId(req: Request): string {
  const user = (req as any).user;
  if (user?.id) {
    return String(user.id);
  }

  // Local dev/test fallback when no authenticated user is available
  if (process.env.NODE_ENV !== "production") {
    return process.env.DEV_USER_ID || "1";
  }

  throw new Error("User details not found in token");
}

export function getFilters(filters: any): any {
  if (!filters?.patient_name || filters?.patient_name === "null" || filters?.patient_name.length === 0) filters.patient_name = null;
  if (!filters?.discharge_status || filters?.discharge_status === "null" || filters?.discharge_status.length === 0) filters.discharge_status = null;
  
  filters.is_age12 = toBoolean(filters.is_age12);

  return filters;
}

export function toBoolean(value: any): boolean {
  if (value === 'true' || value === '1')
    return true;
  return false;
};
