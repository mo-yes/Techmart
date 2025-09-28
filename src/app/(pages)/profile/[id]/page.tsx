"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { servicesApi } from "@/services";
import { Card, CardContent } from "@/components/ui/card";
import { Address } from "@/interfaces";
import { Button } from "@/components";
import Loading from "@/app/loading";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AddressDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); 

  useEffect(() => {
  async function fetchAddress() {
    try {
      const res = await servicesApi.getSpecificAddress(id as string);
      if (res.status === "success") {
        setAddress(res.data); 
      }
    } catch (err) {
    console.log("🚀 ~ fetchAddress ~ err:", err)
    } finally {
      setLoading(false);
    }
  }
  fetchAddress();
}, [id]);



const handleDelete = async () => {
  if (!address) return;

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This address will be deleted permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (!result.isConfirmed) return;

  setActionLoading(true);
  try {
    const res = await servicesApi.removeAddress(address._id);
    if (res.status === "success") {
      Swal.fire("Deleted!", "Address has been deleted.", "success");
      router.back(); 
    } else {
      Swal.fire("Error!", "Failed to delete address.", "error");
    }
  } catch (err) {
    console.log("🚀 ~ handleDelete ~ err:", err)
    Swal.fire("Error!", "Failed to delete address.", "error");
  } finally {
    setActionLoading(false);
  }
};


  const handleSelect = () => {
    if (!address) return;
    toast.success("Address selected!");
  };

  if (loading) return <Loading />;

  if (!address) return <p className="text-center mt-10">No address found.</p>;

  return (
    <section>
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
              {/* أيقونة المكان */}
              📍
            </span>
            <span className="truncate">{address.details}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 text-primary">📞</span>
            <span>{address.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 text-primary">🏙️</span>
            <span>{address.city}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-2 pt-2 mt-auto">
          <Button variant="outline" size="sm" disabled={actionLoading}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={actionLoading}>
            {actionLoading ? "Deleting..." : "Delete"}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-white hover:bg-primary/90"
            onClick={handleSelect}
            disabled={actionLoading}
          >
            Select Address
          </Button>
        </div>
      </CardContent>
    </Card>
    </section>
  );
}
