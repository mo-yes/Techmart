"use client";
import { useState, useEffect } from "react";
import AddressesList from "@/components/profilePage/AddressesList";
import UserForm from "@/components/profilePage/UserForm";
import { servicesApi } from "@/services";
import { Address } from "@/interfaces";
import Loading from "@/app/loading";

export default function ProfilePage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAddresses() {
    setLoading(true);
    try {
      const res = await servicesApi.getAddresses();
      if (res.status === "success") {
        setAddresses(res.data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">User Information</h1>

      {loading ? (
        <Loading />
      ) : addresses.length === 0 ? (
        <UserForm onAdded={fetchAddresses} />
      ) : (
        <div className="my-5">
          <AddressesList addresses={addresses} onDeleted={setAddresses} />
        </div>
      )}
    </div>
  );
}
