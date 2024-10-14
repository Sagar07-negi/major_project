import React, { useEffect, useState } from "react";
import axios from "axios";
import TopPerformersChart from "../components/TopPerformersChart";
import GenderPieCharts from "../components/GenderPieCharts"; 

const Home = () => {
  const [scores, setScores] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalMaleEmployees, setTotalMaleEmployees] = useState(0);
  const [totalFemaleEmployees, setTotalFemaleEmployees] = useState(0);
  const [totalOtherEmployees, setTotalOtherEmployees] = useState(0);
  const [error, setError] = useState(null);
  const [totalEnrolledEmployees, setTotalEnrolledEmployees] = useState(0);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [coursePerformance, setCoursePerformance] = useState([]);
  const [topDisciplines, setTopDisciplines] = useState([]);
  const [topPunctuality, setTopPunctuality] = useState([]);
  const [topLeadership, setTopLeadership] = useState([]);
  const [topCommunication, setTopCommunication] = useState([]);

  const fetchCounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/total-counts');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTotalEmployees(data.totalEmployees);
      setTotalTrainers(data.totalTrainers);
      setTotalCourses(data.totalCourses);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch counts");
    }
  };

  const fetchData = async () => {
    try {
      const [employeesResponse, scoresResponse] = await Promise.all([
        axios.get("http://localhost:5000/admin/employees"),
        axios.get("http://localhost:5000/admin/scores"),
      ]);

      const processedScores = scoresResponse.data.map((score) => ({
        ...score,
        employeeId: score.employeeId?._id || null,
      }));

      setEmployees(employeesResponse.data);
      setScores(processedScores);

      const maleCount = employeesResponse.data.filter(employee => employee.gender === 'Male').length;
      const femaleCount = employeesResponse.data.filter(employee => employee.gender === 'Female').length;
      const otherCount = employeesResponse.data.filter(employee => employee.gender === 'Other').length;

      setTotalMaleEmployees(maleCount);
      setTotalFemaleEmployees(femaleCount);
      setTotalOtherEmployees(otherCount);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data.");
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchData();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
      calculateTotalEnrolledEmployees(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const calculateTotalEnrolledEmployees = (courses) => {
    const totalCount = courses.reduce((count, course) => count + course.employees.length, 0);
    setTotalEnrolledEmployees(totalCount);
  };

  const calculateScores = (type) => {
    return employees
      .filter(employee => employee.employeeId) // Filter out employees with null employeeId
      .map((employee) => {
        const employeeScores = scores.filter(score => score.employeeId === employee._id);
        const totalScore = employeeScores.reduce((acc, score) => acc + (score.feedback[type] || 0), 0); // Access the correct feedback score
        return {
          employeeId: employee.employeeId,
          name: employee.name,
          totalScore,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 5);
  };

  useEffect(() => {
    if (scores.length > 0 && employees.length > 0) {
      setTopDisciplines(calculateScores("discipline"));
      setTopPunctuality(calculateScores("punctuality"));
      setTopLeadership(calculateScores("Leadership"));
      setTopCommunication(calculateScores("communication"));
    }
  }, [scores, employees]);
  console.log("hey",topCommunication)

  const handleCourseChange = async (courseId) => {
    setSelectedCourseId(courseId);
    if (courseId) {
      try {
        const response = await axios.get(`http://localhost:5000/trainer/courses/${courseId}`);
  
        if (response.data && Array.isArray(response.data.employees)) {
          setCoursePerformance(response.data.employees);
        } else {
          console.error("Expected employees array but got:", response.data);
          setCoursePerformance([]); // Reset if the structure is unexpected
        }
      } catch (error) {
        console.error("Error fetching course performance:", error);
        setCoursePerformance([]); // Reset on error
      }
    } else {
      setCoursePerformance([]); // Reset if no course is selected
    }
  };

  const getTopPerformers = () => {
    const performers = employees.map((employee) => {
      const employeeScores = scores.filter(score => score.employeeId === employee._id);
      const totalScore = employeeScores.reduce((acc, score) => acc + score.score, 0);
      
      return {
        employeeId: employee.employeeId,
        name: employee.name,
        totalScore,
      };
    });

    return performers.filter(performer => performer.totalScore > 0).sort((a, b) => b.totalScore - a.totalScore).slice(0, 5);
  };

  const topPerformers = getTopPerformers();

  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="dashboard-cards">
        <div className="card">
          <p>{totalEmployees}</p>
          <h3>Total Employees</h3>
        </div>
        <div className="card">
          <p>{totalTrainers}</p>
          <h3>Total Trainers</h3>
        </div>
        <div className="card">
          <p>{totalCourses}</p>
          <h3>Total Courses</h3>
        </div>
        <div className="card">
          <p>{totalEnrolledEmployees}</p>
          <h3>Total Enrollments</h3>
        </div>
      </div>

      <div className="course-performance-section">
        <h3>Course-wise Performance</h3>
        <select onChange={(e) => handleCourseChange(e.target.value)}>
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>{course.name}</option>
          ))}
        </select>

        {selectedCourseId && (
          <div className="course-performance-table">
            <table>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Employee Email</th>
                  <th>Total Score</th>
                  <th>Discipline Score</th>
                  <th>Punctuality Score</th>
                  <th>Leadership Score</th>
                  <th>Communication Score</th>
                </tr>
              </thead>
              <tbody>
                {coursePerformance.map((employee) => {
                  const { score } = employee;
                  const discipline = score ? score.feedback.discipline : 'N/A';
                  const punctuality = score ? score.feedback.punctuality : 'N/A';
                  const communication = score ? score.feedback.communication : 'N/A';
                  const leadership = score ? score.feedback.Leadership : 'N/A';
                  const totalScore = score ? score.score : 'N/A';

                  if (discipline === 'N/A' && punctuality === 'N/A' && communication === 'N/A' && leadership === 'N/A' && totalScore === 'N/A') {
                    return null; // Do not render this row
                  }

                  return (
                    <tr key={employee._id}>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{totalScore}</td>
                      <td>{discipline}</td>
                      <td>{punctuality}</td>
                      <td>{leadership}</td>
                      <td>{communication}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="scores-section">
        <div className="distribution">
          <div>
            <h3>Top 5 Performers by Total Score</h3>
            <TopPerformersChart topPerformers={topPerformers} title="Total Score" scoreType="totalScore" />
          </div>
          <div className="gender-div">
            <h3>Gender Distribution</h3>
            <GenderPieCharts 
              maleCount={totalMaleEmployees} 
              femaleCount={totalFemaleEmployees} 
              otherCount={totalOtherEmployees} 
            />
          </div>
        </div>

        <div className="performers">
          <div className="perform">
            <div>
              <h3>Top 5 in Discipline</h3>
              <TopPerformersChart topPerformers={topDisciplines} title="Discipline Score" scoreType="discipline" />
            </div>
            <div>
              <h3>Top 5 in Communication</h3>
              <TopPerformersChart topPerformers={topCommunication} title="Communication Score" scoreType="communication" />
            </div>
          </div>

          <div className="perform">
            <div>
              <h3>Top 5 in Punctuality</h3>
              <TopPerformersChart topPerformers={topPunctuality} title="Punctuality Score" scoreType="punctuality" />
            </div>
            <div>
              <h3>Top 5 in Leadership</h3>
              <TopPerformersChart topPerformers={topLeadership} title="Leadership Score" scoreType="leadership" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
