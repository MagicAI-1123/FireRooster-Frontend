"use client";
import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { Category } from "@/services/types/settings.type";
import { settingsService } from "@/services/settings";
import { FilterPage } from "@/components/filter/FilterPage";

export default function Page() {
  const [data, setData] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState("");

  const fetchAlertsData = useCallback(async (category: string) => {
    try {
      const res = await settingsService.getSubCategoriesByCategory({
        category: String(category == "ALL" ? "" : category),
        search: search,
      });
      setData(
        (res as Category[]).sort((a, b) => {
          if (a.id < b.id) return -1;
          else if (a.id > b.id) return 1;
          return 0;
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [search]);

  useEffect(() => {
    fetchAlertsData(category);
  }, [page, rowsPerPage, search, category, fetchAlertsData]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
  };

  return (
    <>
      <FilterPage
        data={data}
        search={search}
        handleSearchChange={handleSearchChange}
      />
    </>
  );
}
