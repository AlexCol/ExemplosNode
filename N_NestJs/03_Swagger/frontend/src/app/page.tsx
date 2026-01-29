"use client";

import { getApp } from "@/services/generated/app/app";
import { ResponseDto } from "@/services/generated/models";
import { getSearch } from "@/services/generated/search/search";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<ResponseDto | null>(null);
  const [searchCriteriaData, setSearchCriteriaData] = useState<ResponseDto[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getApp().appControllerTesteOne({
        grana: "100",
        dataHora: new Date().toISOString(),
        email: "teste@example.com",
      });
      setData(data);

      const data2 = await getSearch().searchControllerSearchBody({
        pagination: { page: 1, limit: 10 },
        where: [
          { field: "grana", value: "100" },
          { field: "email", value: "email@busca", isLike: true },
        ],
        sort: [{ field: "email", order: "desc" }],
      });
      setSearchCriteriaData(data2);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to NestJS with Orval!</h1>
      <p>This is a sample Next.js page.</p>
      {data && (
        <div>
          <h2>Response Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {searchCriteriaData && (
        <div>
          <h2>Search Criteria Response Data:</h2>
          <pre>{JSON.stringify(searchCriteriaData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
