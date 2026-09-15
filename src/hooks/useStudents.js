import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/students";

function toFrontend(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    grade: row.grade,
    currentDegree: row.current_degree,
    package: row.package,
    packageName: row.package_name,
    paymentDate: row.payment_date,
    currentStage: row.current_stage,
    nextDeadline: row.next_deadline,
    overallStatus: row.overall_status,
    gpa: row.gpa,
    action: row.action,
    picSso: row.pic_sso,
  };
}

export function useStudents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Gagal mengambil data students");
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

  return { items, loading, error, refresh };
}