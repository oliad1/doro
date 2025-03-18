interface CourseInfoProps {
    courseCode: string
    courseName: string
  }
  
  export function CourseInfo({ courseCode, courseName }: CourseInfoProps) {
    return (
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">{courseCode}</h1>
        <h2 className="text-2xl text-gray-400">{courseName}</h2>
      </div>
    )
  }
  
  