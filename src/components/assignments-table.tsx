"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Assignment {
  id: number
  name: string
  date: string
  weighting: number
  grade: string
}

interface AssignmentTableProps {
    assignment: Assignment[],
}

export function AssignmentsTable({assignment}: AssignmentTableProps) {
  const [assignments, setAssignments] = useState<Assignment[]>(assignment)
  const [tempGrades, setTempGrades] = useState<{ [key: number]: string }>({})

  const handleGradeChange = (id: number, grade: string) => {
    setTempGrades({ ...tempGrades, [id]: grade })
  }

  const handleSave = () => {
    setAssignments(assignments.map(assignment => ({
      ...assignment,
      grade: tempGrades[assignment.id] || assignment.grade
    })))
    setTempGrades({})
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Assignment Name</TableHead>
            <TableHead className="text-white">Due Date</TableHead>
            <TableHead className="text-white text-right">Weighting (%)</TableHead>
            <TableHead className="text-white">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium text-white">{assignment.name}</TableCell>
              <TableCell className="text-gray-300">{assignment.date}</TableCell>
              <TableCell className="text-right text-gray-300">{assignment.weighting}</TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={tempGrades[assignment.id] !== undefined ? tempGrades[assignment.id] : assignment.grade}
                  onChange={(e) => handleGradeChange(assignment.id, e.target.value)}
                  className="px-2 py-0 w-1/3 bg-gray-800 text-white border-gray-700"
                  placeholder="Grade"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          Save Grades
        </Button>
      </div>
    </div>
  )
}

