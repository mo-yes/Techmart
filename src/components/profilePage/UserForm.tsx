"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import toast from "react-hot-toast"
import { servicesApi } from "@/services"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  details: z.string().min(5, "Details must be at least 5 characters."),
  phone: z.string().min(10, "Invalid phone number."),
  city: z.string().min(2, "City name is too short."),
})

export default function UserForm({ onAdded }: { onAdded?: () => void }) {
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      details: "",
      phone: "",
      city: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
  try {
    setLoading(true)

    const res = await servicesApi.addAddresses(values)

    if (res.status === "success") {
      toast.success("Address created successfully!")
      onAdded?.()
    } else {
      toast.error("Something went wrong!")
    }
  } catch (err) {
    console.log("🚀 ~ onSubmit ~ err:", err)
    toast.error("Network error!")
  } finally {
    setLoading(false)
  }
}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* 🏠 Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 📄 Details */}
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <Textarea placeholder="Home details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 📞 Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 🏙️ City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder=" Ex-Giza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} type="submit" className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Save"}
          </Button>

      </form>
    </Form>
  )
}
