"use client";
import { useState, useEffect } from "react";
import AddressesList from "@/components/profilePage/AddressesList";
import UserForm from "@/components/profilePage/UserForm";
import { servicesApi } from "@/services";
import { Address } from "@/interfaces";
import Loading from "@/app/loading";
import { Plus, UserCircle } from "lucide-react";

export default function ProfilePage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); 

  async function fetchAddresses() {
    setLoading(true);
    try {
      const res = await servicesApi.getAddresses();
      if (res.status === "success") {
        setAddresses(res.data);
      }
    } catch(error){
    console.log("🚀 ~ fetchAddresses ~ error:", error)

    }
     finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr._id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto py-10 px-4">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <UserCircle className="h-10 w-10 text-primary animate-bounce" />
        <h1 className="text-3xl font-extrabold text-gray-900">
          User Profile
        </h1>
      </div>

      {/* Show form directly if no addresses */}
      {addresses.length === 0 && !showForm ? (
        <UserForm onAdded={fetchAddresses} />
      ) : (
        <>
          {/* List of addresses */}
          <AddressesList addresses={addresses} onDeleted={handleDelete} />

          {/* Button to show form for adding new address */}
          {!showForm && (
            <div
              className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer mt-6"
              onClick={() => setShowForm(true)}
            >
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Plus className="h-6 w-6 text-primary mb-1" />
                <span>Add New Address</span>
              </div>
            </div>
          )}

          {/* Show form if user clicked "Add New Address" */}
          {showForm && (
            <div className="mt-6 animate-fade-in">
              <UserForm
                onAdded={() => {
                  fetchAddresses();
                  setShowForm(false); 
                }}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
