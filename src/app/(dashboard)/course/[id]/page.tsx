"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";

interface JSONType {
    course_code: string,
    course_description: string,
    course_name: string,
    id: string,
    personnel: personnel[],
    schemes: schemes[],
}

interface personnel {
    name: string,
    role: string,
    email: string,
}

interface condition {
    symbol: string,
    lowerBound: number,
    upperBound: number,
}

interface assessment {
    date: string[],
    drop: number,
    name: string,
    count: number,
    grade: number[],
    symbol: string,
    weight: number,
    assessmentType: string
}

interface schemes {
    condition: condition,
    schemeNum: number,
    assessments: assessment[],
}

interface ChartData {
    assessmentType: string,
    weight: number,
    fill: string
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    // const courseId = params.id
    const [courseId, setCourseId] = useState<string>()
    const [courseMetadata, setCourseMetadata] = useState<JSONType>();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [average, setAverage] = useState<Number>(0);
    const [chartData, setChartData] = useState();
    const [chartConfig, setChartConfig] = useState<ChartConfig>();

    useEffect(()=>{

        const fetchCourseData = async () => {
            const value = (await params).id
            setCourseId(value)

            const payload = {
                value: {id: value} 
            }

            //Practically a GET but GET's can't have a body
            const response = await fetch('/api/courses/pages/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const { data, error } = await response.json()

            console.log("DATA FETCHED: ", data)

            if (error){
                console.error("ERROR: ", error.message)
                return;
            }

            if (!data) {
                console.error("No course data returned")
                return;
            }

            console.log("DATA DATA: ", data)
            setCourseMetadata(data)

            const chartData = data.schemes[0].assessments.map((assessment: any, index: number)=> { return {assessmentType: assessment.assessmentType, weight: Number.parseFloat(assessment.weight)*100, fill: `hsl(var(--chart-${index+1}))` } })

            setChartData(chartData);

            const chartData1: ChartData[] = [
                { assessmentType: "chrome", weight: 275, fill: "var(--color-chrome)" },
                { assessmentType: "safari", weight: 200, fill: "var(--color-safari)" },
                { assessmentType: "firefox", weight: 187, fill: "var(--color-firefox)" },
                { assessmentType: "edge", weight: 173, fill: "var(--color-edge)" },
                { assessmentType: "other", weight: 90, fill: "var(--color-other)" },
            ]

            const chartConfig = {
                chrome: {
                    label: "Chrome",
                    color: "hsl(var(--chart-1))",
                },
                safari: {
                    label: "Safari",
                    color: "hsl(var(--chart-2))",
                },
                firefox: {
                    label: "Firefox",
                    color: "hsl(var(--chart-3))",
                },
                edge: {
                    label: "Edge",
                    color: "hsl(var(--chart-4))",
                },
                other: {
                    label: "Other",
                    color: "hsl(var(--chart-5))",
                },
            } satisfies ChartConfig

            console.log("OLD DATA:", chartData1);
            console.log("OLD CHART CONFIG: ", chartConfig)

            // Initialize an empty object for chartConfig
            const updatedChartConfig: ChartConfig = {};

            // Loop over the assessments and populate the chartConfig
            data.schemes[0].assessments.forEach((assessment: any) => {
                updatedChartConfig[assessment.assessmentType] = {
                    label: assessment.assessmentType,
                    color: "hsl(var(--chart-5))",
                };
            }); 

            console.log("UPDATED CHART DATA: ", chartData)
            console.log("UPDATED CHART CONFIG: ", updatedChartConfig)

            // setChartData(chartData);
            setChartConfig(updatedChartConfig);

            setLoading(false);
        }

        fetchCourseData();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-7 lg:gap-4 lg:gap-y-0 gap-y-4 p-4">
            <div className="col-span-4">
                {isLoading ?
                    <>
                        <Skeleton className="h-8 w-1/2 mb-4" />
                        <Skeleton className="h-6 w-1/5" />
                    </>
                    : <Card>

                        <CardHeader>
                            <CardTitle>
                                <h2 className="text-3xl font-semibold text-white">
                                    {courseMetadata!.course_code}: {courseMetadata!.course_name}
                                </h2>
                            </CardTitle>
                            <CardDescription>
                                <p className="text-muted-foreground">
                                    {courseMetadata!.course_description}
                                </p>
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Assignment Name</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead className="text-right">Weighting (%)</TableHead>
                                        <TableHead className="text-right">Grade</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courseMetadata!.schemes[0].assessments?.map((assessment) =>
                                        Array.from({ length: assessment.count }).map((_, i) => (
                                            <TableRow key={assessment.assessmentType + i}>
                                                <TableCell className="font-medium">
                                                    {(assessment.count > 1) ?
                                                        <>
                                                            {assessment.name.slice(0, -1)} #{i + 1}
                                                        </>
                                                        : <>
                                                            {assessment.name}
                                                        </>
                                                    }
                                                </TableCell>

                                                {/* Date */}
                                                <TableCell className="text-gray-300">
                                                    {(assessment.date[0] == "none") ? "N/A" : assessment.date}
                                                </TableCell>

                                                {/* Weighting */}
                                                <TableCell className="text-right text-gray-300">
                                                    {((100 * assessment.weight) / (assessment.count)).toPrecision(2)}
                                                </TableCell>

                                                {/* Grade Input */}
                                                <TableCell className="flex flex-row justify-end items-end">
                                                    <div className="w-1/3">
                                                        <Input
                                                            type="text"
                                                            className="text-right"
                                                            // value={tempGrades[assignment.id] !== undefined ? tempGrades[assignment.id] : assignment.grade}
                                                            // onChange={(e) => handleGradeChange(assignment.id, e.target.value)}
                                                            // className="px-2 self-end ml-auto py-0 w-1/3 bg-gray-800 text-white border-gray-700"
                                                            placeholder="Grade"
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>

                        <CardFooter>
                            <div className="mt-4 flex justify-end">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Save Grades
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                }
            </div>
            <div className="col-span-3 space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Stats</CardTitle>
                        <CardDescription>All of your statistics for this class.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-row justify-between items-center mx-16">
                            <div className="flex flex-col justify-center items-center">
                                <p className="text-sm text-muted-foreground">
                                    Your Average
                                </p>
                                <h2 className="text-3xl font-semibold">
                                    82%
                                </h2>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <h2 className="text-sm text-muted-foreground">
                                    Your cGPA
                                </h2>
                                <h2 className="text-3xl font-semibold">
                                    4.0
                                </h2>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <h2 className="text-sm text-muted-foreground">
                                    Course Completion 
                                </h2>
                                <h2 className="text-3xl font-semibold">
                                    40%
                                </h2>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>

                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Weighting Distribution</CardTitle>
                        <CardDescription>The weightings of all your deliverables, graphed.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {isLoading?
                        <>
                            <Skeleton className="w-4 h-4"/>
                        </>
                        :<ChartContainer config={chartConfig!}>
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie 
                                    data={chartData}
                                    dataKey="weight"
                                    label 
                                    nameKey="assessmentType"/>
                            </PieChart>
                        </ChartContainer>
                        }
                    </CardContent>
                    <CardFooter>

                    </CardFooter>
                </Card>
            </div>
        </div>
        // <div className="container py-10 min-h-screen">
        //     <CourseInfo courseCode="CS101" courseName="Introduction to Computer Science" />
        //     <h2 className="text-2xl font-semibold mb-4 text-white">{params.slug}</h2>
        //     <AssignmentsTable />
        // </div>
    )
}