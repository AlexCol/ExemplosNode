"use client";

import { getApp } from "@/services/generated/app/app";
import { ResponseDto } from "@/services/generated/models";
import { getSearch } from "@/services/generated/search/search";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<ResponseDto | null>(null);
  const [searchCriteriaDataBody, setSearchCriteriaDataBody] = useState<ResponseDto[] | null>(null);
  const [searchCriteriaDataQuery, setSearchCriteriaDataQuery] = useState<ResponseDto[] | null>(null);

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
          { field: "grana", value: "10a0" },
          { field: "email", value: "email@busca", isLike: true },
        ],
        sort: [{ field: "email", order: "desc" }],
      });
      setSearchCriteriaDataBody(data2);

      const data3 = await getSearch().searchControllerSearchQuery({
        dataHora: "5",
      });
      setSearchCriteriaDataQuery(data3);

      const data4 = await getSearch().searchControllerSearchPaginated();
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

      {searchCriteriaDataBody && (
        <div>
          <h2>Search Criteria Response Data:</h2>
          <pre>{JSON.stringify(searchCriteriaDataBody, null, 2)}</pre>
        </div>
      )}

      {searchCriteriaDataQuery && (
        <div>
          <h2>Search Criteria Query Response Data:</h2>
          <pre>{JSON.stringify(searchCriteriaDataQuery, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
