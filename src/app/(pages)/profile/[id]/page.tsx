"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { servicesApi } from "@/services";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Address } from "@/interfaces";
import { Button } from "@/components";
import Loading from "@/app/loading";

export default function AddressDetailsPage() {
  const { id } = useParams();
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAddress() {
      try {
        const res = await servicesApi.getSpecificAddress(id as string);
        console.log(res)
        if (res.status === "success") {
          setAddress(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAddress();
  }, [id]);

  if (loading) {
    return <Loading/>;
  }

  if (!address) {
    return <p>No address found.</p>;
  }

  return (
    <Card className="w-full border rounded-xl shadow-sm hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
      <CardContent className="flex flex-col h-full p-6 gap-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{address.name}</h2>
          <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
            Address
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2 text-base text-gray-700">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 text-primary">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 2C6.686 2 4 4.686 4 8c0 4.418 5.25 9.25 5.477 9.477a.75.75 0 0 0 1.046 0C10.75 17.25 16 12.418 16 8c0-3.314-2.686-6-6-6Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="currentColor" /></svg>
            </span>
            <span className="truncate">{address.details}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 text-primary">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M2.5 4.5A2.5 2.5 0 0 1 5 2h2A2.5 2.5 0 0 1 9.5 4.5v11A2.5 2.5 0 0 1 7 18H5a2.5 2.5 0 0 1-2.5-2.5v-11ZM15 2a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Z" fill="currentColor" /></svg>
            </span>
            <span>{address.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 text-primary">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 2a6 6 0 0 1 6 6c0 4.418-5.25 9.25-5.477 9.477a.75.75 0 0 1-1.046 0C5.25 17.25 0 12.418 0 8a6 6 0 0 1 6-6Zm0 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="currentColor" /></svg>
            </span>
            <span>{address.city}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-2 pt-2 mt-auto">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
          <Button variant="default" size="sm" className="bg-primary text-white hover:bg-primary/90">
            Select Address
          </Button>
        </div>
      </CardContent>
    </Card>

  );
}
