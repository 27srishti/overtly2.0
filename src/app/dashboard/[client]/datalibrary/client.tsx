"use client";

import React from "react";
import { useClientStore } from "@/store";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const Client = () => {
  const { client } = useClientStore();
  const params = useParams<{ client: string }>();
  return (
    <>{client?.name ? client.name : <Skeleton className="h-10 w-[100px]" />}</>
  );
};

export default Client;
