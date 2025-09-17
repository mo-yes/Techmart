"use client";

import Swal from "sweetalert2";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { servicesApi } from "@/services"; 
import toast from "react-hot-toast";
import { Address } from "@/interfaces";
import Link from "next/link";

export default function AddressesList({
  addresses,
  onDeleted,
}: {
  addresses: Address[];
  onDeleted: (newAddresses: Address[]) => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
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

    if (result.isConfirmed) {
      try {
        setDeletingId(id);
        const res = await servicesApi.removeAddress(id);
        if (res.status === "success") {
          Swal.fire("Deleted!", "Address has been deleted.", "success");
          onDeleted(res.data); 
        } else {
          toast.error(res.message || "Failed to delete address");
        }
      } catch (err) {
        toast.error("Network error while deleting");
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    }
  }

  if (addresses.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No addresses yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        
        <Card key={addr._id}>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{addr.name}</p>
              <p className="text-sm text-muted-foreground">{addr.details}</p>
              <p className="text-sm">{addr.phone}</p>
              <p className="text-sm">{addr.city}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={"/my-orders"}>
              <Button
                variant="default"
              >
                My Orders
              </Button>
              </Link>
                {/* 👇 هنا نضيف زرار View */}
              <Link href={`/profile/${addr._id}`}>
              <Button variant="outline">View</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => handleDelete(addr._id)}
                disabled={deletingId === addr._id}
              >
                {deletingId === addr._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
