"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AssignmentFormProps {
  onAddAssignment: (assignment: { name: string; date: string; weighting: number }) => void
}

export function AssignmentForm({ onAddAssignment }: AssignmentFormProps) {
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [weighting, setWeighting] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && date && weighting) {
      onAddAssignment({ name, date, weighting: Number(weighting) })
      setName("")
      setDate("")
      setWeighting("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <Label htmlFor="name">Assignment Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter assignment name"
          className="bg-gray-800 text-white"
        />
      </div>
      <div>
        <Label htmlFor="date">Due Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-gray-800 text-white"
        />
      </div>
      <div>
        <Label htmlFor="weighting">Weighting (%)</Label>
        <Input
          id="weighting"
          type="number"
          value={weighting}
          onChange={(e) => setWeighting(e.target.value)}
          placeholder="Enter weighting"
          min="0"
          max="100"
          className="bg-gray-800 text-white"
        />
      </div>
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
        Add Assignment
      </Button>
    </form>
  )
}

