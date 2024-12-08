"use client";
import { SettingsPage } from "@/components/settings/SettingsPage";
import { useEffect, useState, useCallback } from "react";
import { Category } from "@/services/types/settings.type";
import { settingsService } from "@/services/settings";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [category, setCategory] = useState<string>("");

  const fetchAlertsData = useCallback(async (category: string) => {
    try {
      const res = await settingsService.getSubCategoriesByCategory({
        category: String(category == "ALL" ? "" : category),
      });
      setData(res as Category[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchAlertsData(category);
  }, [page, rowsPerPage, category, fetchAlertsData]);

  return (
    <>
      <SettingsPage
        data={data}
        fetchAlertData={fetchAlertsData}
        scanner_id={Number(id)}
      />
    </>
  );
}
