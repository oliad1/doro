"use client"

import { useState, useMemo, useEffect } from "react"
import { parse, format, isValid } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Summative = {
  id: string
  date: string
  time: string
  course: string
  type: string
  isNew?: boolean
}

type SortKey = "date" | "course" | "type"

interface TableProps {
  summatives: Omit<Summative, 'id'>[],
  isLoading: boolean
}

export function UpcomingSummativesTable({ summatives = [], isLoading }: TableProps) {
  const [localSummatives, setLocalSummatives] = useState<Summative[]>([])
  const [newSummatives, setNewSummatives] = useState<Summative[]>([])
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [sortBy, setSortBy] = useState<SortKey>("date")
  const [showStrikethrough, setShowStrikethrough] = useState(true)

  useEffect(() => {
    if (summatives && summatives.length > 0) {
      setLocalSummatives(summatives.map((summative, index) => ({
        ...summative,
        id: `${summative.date}-${summative.time}-${summative.course}-${index}`
      })))
    }
  }, [summatives])

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const sortedAndFilteredSummatives = useMemo(() => {
    return localSummatives
      .filter((summative) => showStrikethrough || !checkedItems[summative.id])
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        }
        return a[sortBy].localeCompare(b[sortBy])
      })
  }, [localSummatives, sortBy, showStrikethrough, checkedItems])

  const handleAddRow = () => {
    const newId = `new-${Date.now()}`
    setNewSummatives([...newSummatives, { id: newId, date: '', time: '', course: '', type: '', isNew: true }])
  }

  const handleInputChange = (id: string, field: keyof Summative, value: string) => {
    const updateSummative = (summative: Summative) => {
      if (summative.id === id) {
        let correctedValue = value

        if (field === 'date') {
          const digitsOnly = value.replace(/\D/g, '')
          if (digitsOnly.length > 0) {
            correctedValue = digitsOnly.match(/^(\d{0,4})(\d{0,2})(\d{0,2}).*/)?.slice(1, 4).filter(Boolean).join('-') ?? ''
          }
          if (correctedValue.length === 10) {
            const parsedDate = parse(correctedValue, 'yyyy-MM-dd', new Date())
            if (isValid(parsedDate)) {
              correctedValue = format(parsedDate, 'yyyy-MM-dd')
            }
          }
        } else if (field === 'time') {
          // Remove any non-alphanumeric characters except colon
          const cleanedValue = value.replace(/[^a-zA-Z0-9:]/g, '').toUpperCase()
          
          // Add colon after the first two digits if not present
          const timeMatch = cleanedValue.match(/^(\d{1,2})(:?)(\d{0,2})\s*(AM|PM)?$/i)
          
          if (timeMatch) {
            let [, hours, colon, minutes, period] = timeMatch
            
            // Ensure two-digit hours
            hours = hours.padStart(2, '0')
            
            // Add colon if not present
            if (!colon && minutes) {
              correctedValue = `${hours}:${minutes}${period ? ' ' + period : ''}`
            } else {
              correctedValue = cleanedValue.replace(/(AM|PM)$/i, ' $1').trim()
            }
          } else {
            correctedValue = cleanedValue
          }
        }

        return { ...summative, [field]: correctedValue }
      }
      return summative
    }

    if (id.startsWith('new-')) {
      setNewSummatives(prevNew => prevNew.map(updateSummative))
    } else {
      setLocalSummatives(prevLocal => prevLocal.map(updateSummative))
    }
  }

  const handleConfirmNewRow = (id: string) => {
    const newSummative = newSummatives.find(s => s.id === id)
    if (newSummative) {
      setLocalSummatives(prevLocal => [...prevLocal, { ...newSummative, isNew: undefined }])
      setNewSummatives(prevNew => prevNew.filter(s => s.id !== id))
    }
  }

  const isNewRowComplete = (summative: Summative) => {
    const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9]\s(AM|PM)$/i
    return summative.date && 
           summative.time && 
           summative.course && 
           summative.type &&
           timeRegex.test(summative.time.trim())
  }

  if (isLoading) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Upcoming Deliverables</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Upcoming Deliverables</CardTitle>
        <CardDescription>Your next assessments</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow space-y-4">
        <div className="flex justify-between items-center">
          <Select onValueChange={(value) => setSortBy(value as SortKey)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-strikethrough"
              checked={showStrikethrough}
              onCheckedChange={setShowStrikethrough}
            />
            <Label htmlFor="show-strikethrough">Show completed</Label>
          </div>
        </div>
        <ScrollArea className="flex-grow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredSummatives.map((summative) => (
                <TableRow 
                  key={summative.id} 
                  className={checkedItems[summative.id] ? "line-through opacity-50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      id={`checkbox-${summative.id}`}
                      checked={checkedItems[summative.id] || false}
                      onCheckedChange={() => handleCheckboxChange(summative.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={summative.date}
                      onChange={(e) => handleInputChange(summative.id, 'date', e.target.value)}
                      placeholder="YYYY-MM-DD"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={summative.time}
                      onChange={(e) => handleInputChange(summative.id, 'time', e.target.value)}
                      placeholder="HH:MM AM/PM"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={summative.course}
                      onChange={(e) => handleInputChange(summative.id, 'course', e.target.value)}
                      placeholder="Course name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={summative.type}
                      onChange={(e) => handleInputChange(summative.id, 'type', e.target.value)}
                      placeholder="Assessment type"
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
              {newSummatives.map((summative) => (
                <TableRow key={summative.id}>
                  <TableCell>
                    <Checkbox
                      id={`checkbox-${summative.id}`}
                      checked={checkedItems[summative.id] || false}
                      onCheckedChange={() => handleCheckboxChange(summative.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={summative.date}
                      onChange={(e) => handleInputChange(summative.id, 'date', e.target.value)}
                      placeholder="YYYY-MM-DD"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={summative.time}
                      onChange={(e) => handleInputChange(summative.id, 'time', e.target.value)}
                      placeholder="HH:MM AM/PM"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={summative.course}
                      onChange={(e) => handleInputChange(summative.id, 'course', e.target.value)}
                      placeholder="Course name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={summative.type}
                      onChange={(e) => handleInputChange(summative.id, 'type', e.target.value)}
                      placeholder="Assessment type"
                    />
                  </TableCell>
                  <TableCell>
                    {isNewRowComplete(summative) && (
                      <Button onClick={() => handleConfirmNewRow(summative.id)}>
                        Confirm
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <Button onClick={handleAddRow}>Add Row</Button>
      </CardContent>
    </Card>
  )
}

