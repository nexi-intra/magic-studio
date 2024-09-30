'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

interface BookingSiteItem {
  id: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: null;
  tenant: string;
  searchindex: string;
  name: string;
  description: string;
  code: string;
  country_id: number;
  parkingenabled: boolean;
  deskbookingenabled: boolean;
  koksmat_masterdataref: null;
  koksmat_bucket: null;
  koksmat_masterdata_id: null;
  koksmat_masterdata_etag: null;
  koksmat_state: null;
  koksmat_compliancetag: null;
}

type EditableFields = Pick<BookingSiteItem, 'name' | 'description' | 'code' | 'tenant' | 'searchindex' | 'country_id' | 'parkingenabled' | 'deskbookingenabled'>;

interface BookingSiteEditorProps {
  initialData: BookingSiteItem;
  onSave: (updateData: Partial<EditableFields>) => void;
}

export default function BookingSiteEditor({ initialData, onSave }: BookingSiteEditorProps): React.ReactElement {
  const [name, setName] = useState(initialData.name)
  const [description, setDescription] = useState(initialData.description)
  const [code, setCode] = useState(initialData.code)
  const [tenant, setTenant] = useState(initialData.tenant)
  const [searchindex, setSearchindex] = useState(initialData.searchindex)
  const [countryId, setCountryId] = useState(initialData.country_id)
  const [parkingEnabled, setParkingEnabled] = useState(initialData.parkingenabled)
  const [deskBookingEnabled, setDeskBookingEnabled] = useState(initialData.deskbookingenabled)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setter: React.Dispatch<React.SetStateAction<string>>): void => {
    setter(e.target.value)
  }

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCountryId(parseInt(e.target.value, 10))
  }

  const buildUpdateObject = (): Partial<EditableFields> => {
    const updates: Partial<EditableFields> = {}

    if (name !== initialData.name) updates.name = name
    if (description !== initialData.description) updates.description = description
    if (code !== initialData.code) updates.code = code
    if (tenant !== initialData.tenant) updates.tenant = tenant
    if (searchindex !== initialData.searchindex) updates.searchindex = searchindex
    if (countryId !== initialData.country_id) updates.country_id = countryId
    if (parkingEnabled !== initialData.parkingenabled) updates.parkingenabled = parkingEnabled
    if (deskBookingEnabled !== initialData.deskbookingenabled) updates.deskbookingenabled = deskBookingEnabled

    return updates
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const updates = buildUpdateObject()
    onSave(updates)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Edit Booking Site</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="booking-site-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleInputChange(e, setName)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => handleInputChange(e, setCode)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => handleInputChange(e, setDescription)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenant">Tenant</Label>
              <Input
                id="tenant"
                value={tenant}
                onChange={(e) => handleInputChange(e, setTenant)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchindex">Search Index</Label>
              <Input
                id="searchindex"
                value={searchindex}
                onChange={(e) => handleInputChange(e, setSearchindex)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country_id">Country ID</Label>
              <Input
                id="country_id"
                type="number"
                value={countryId}
                onChange={handleNumberChange}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="parkingenabled"
                checked={parkingEnabled}
                onCheckedChange={setParkingEnabled}
              />
              <Label htmlFor="parkingenabled">Parking Enabled</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="deskbookingenabled"
                checked={deskBookingEnabled}
                onCheckedChange={setDeskBookingEnabled}
              />
              <Label htmlFor="deskbookingenabled">Desk Booking Enabled</Label>
            </div>
          </div>

          {/* Read-only fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="created_at">Created At</Label>
              <Input id="created_at" value={initialData.created_at} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="created_by">Created By</Label>
              <Input id="created_by" value={initialData.created_by} readOnly />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="updated_at">Updated At</Label>
              <Input id="updated_at" value={initialData.updated_at} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="updated_by">Updated By</Label>
              <Input id="updated_by" value={initialData.updated_by} readOnly />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="booking-site-form">Save Changes</Button>
      </CardFooter>
    </Card>
  )
}