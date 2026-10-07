import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/scholarships";

function toFrontend(row) {
  return {
    id: row.id,
    name: row.name,
    provider: row.provider,
    coverage: row.coverage,
    level: row.level,
    programCategory: row.program_category ?? "",
    university: row.university ?? "",
    continent: row.continent ?? "",
    country: row.country ?? "",
    openRegistration: row.open_registration ?? "",
    earliestDeadline: row.earliest_deadline ?? "",
    currency: row.currency ?? "",
    scholarshipType: row.scholarship_type ?? "",
    fundingType: row.funding_type ?? "",
    benefitNotes: row.benefit_notes ?? "",
    documentCategory: row.document_category ?? "",
    documentDetail: row.document_detail ?? "",
    eligibilityNotes: row.eligibility_notes ?? "",
    eligibilityCriteria: row.eligibility_criteria ?? {},
    sourceUrl: row.source_url ?? "",
    sourceCheckedAt: row.source_checked_at ?? "",
    status: row.status ?? "active",
    recordType: row.record_type ?? "scholarship",
    sourceData: row.raw_source_record ?? {},
    sourceScholarship: row.scholarship ?? "",
    sourceDegree: row.degree ?? "",
    sourceGrade: row.grade ?? "",
    sourceCurrency: row.currency_beasiswa ?? "",
    sourceBenefitNotes: row.notes_benefit ?? "",
    sourceDocumentDetail: row.notes_document_detail ?? "",
    sourceMinGpa100: row.min__gpa__scale_100_ ?? "",
    sourceMinGpa4: row.min__gpa__scale_4_0_ ?? "",
    sourceMinAge: row.min_age ?? "",
    sourceStandardizedTest: row.standardized_test ?? "",
    sourceALevel: row.a_level ?? "",
    sourceNationality: row.nationality ?? "",
    sourceMinReportGrade: row.min_gpa_raport ?? "",
    sourceIelts: row.ielts__overall_ ?? "",
    sourceSat: row.minimum_total_score_sat ?? "",
    sourceDelfDalf: row.min_score_delf_dalf ?? "",
    sourceDshGermany: row.min_score_dsh__germany_ ?? "",
    sourceHsk: row.min_score_hsk ?? "",
    sourceJlpt: row.min_score_jlpt ?? "",
    sourceTocfl: row.min_score_tocfl ?? "",
    sourceToefl: row.min_score_toefl_ibt ?? "",
    sourceAct: row.minimum_score_act ?? "",
    sourceEligibilityNotes: row.eligibility__notes_ ?? "",
  };
}

function toApiPayload(item) {
  return {
    name: item.name,
    provider: item.provider,
    coverage: item.coverage,
    level: item.level,
    programCategory: item.programCategory,
    university: item.university,
    continent: item.continent,
    country: item.country,
    openRegistration: item.openRegistration,
    earliestDeadline: item.earliestDeadline,
    currency: item.currency,
    scholarshipType: item.scholarshipType,
    fundingType: item.fundingType,
    benefitNotes: item.benefitNotes,
    documentCategory: item.documentCategory,
    documentDetail: item.documentDetail,
    eligibilityNotes: item.eligibilityNotes,
    eligibilityCriteria: item.eligibilityCriteria,
    sourceUrl: item.sourceUrl,
    sourceCheckedAt: item.sourceCheckedAt,
    status: item.status,
  };
}

export function useScholarships() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Gagal mengambil data scholarships");
      const data = await res.json();
      setItems(data.map(toFrontend));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (item) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiPayload(item)),
    });
    if (!res.ok) throw new Error("Gagal menambah scholarship");
    const created = await res.json();
    setItems((prev) => [toFrontend(created), ...prev]);
  }, []);

  const updateItem = useCallback(async (id, patch) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiPayload(patch)),
    });
    if (!res.ok) throw new Error("Gagal mengubah scholarship");
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === id ? toFrontend(updated) : i)));
  }, []);

  const removeItem = useCallback(async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) throw new Error("Gagal menghapus scholarship");
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { items, loading, error, addItem, updateItem, removeItem };
}
