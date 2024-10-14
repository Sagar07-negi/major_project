from faker import Faker
import random
from datetime import datetime, timedelta
import pandas as pd

# Initialize Faker for dummy data generation
fake = Faker()

# Lists to hold the generated data
trainers = []
employees = []
courses = []
performance_metrics = []

# Generate dummy trainers
def generate_trainers(n=1000):
    for _ in range(n):
        trainer = {
            "trainer_id": fake.uuid4(),  # Unique ID for each trainer
            "name": fake.name(),
            "email": fake.email(),
            "password": fake.password(),
            "phone_num": fake.random_number(digits=10),
            "expertise_area": random.choice(['Software', 'Management', 'HR', 'Marketing']),
        }
        trainers.append(trainer)

# Generate dummy employees
def generate_employees(n=1000):
    for _ in range(n):
        employee = {
            "employee_id": fake.uuid4(),  # Unique ID for each employee
            "name": fake.name(),
            "email": fake.email(),
            "password": fake.password(),
            "phone_num": fake.random_number(digits=10),
            "designation": random.choice(['Developer', 'Manager', 'HR', 'Sales']),
            "hire_date": fake.date_this_decade(),
        }
        employees.append(employee)

# Generate dummy courses with matching trainer_id and employee_ids
def generate_courses(n=1000):
    for _ in range(n):
        assigned_employees = random.sample(employees, random.randint(1, 5))  # Pick random employees
        course = {
            "course_id": fake.uuid4(),  # Unique ID for each course
            "course_name": fake.word().capitalize() + " Training",
            "description": fake.text(),
            "trainer_name": random.choice(trainers)["trainer_id"],  # Match with trainer_id
            "start_date": fake.date_this_year(),
            "end_date": fake.date_between_dates(datetime.now(), datetime.now() + timedelta(days=60)),
            "employees_assigned": [emp["employee_id"] for emp in assigned_employees],  # Store employee_ids
            "createdAt": datetime.now(),
            "updatedAt": datetime.now(),
        }
        courses.append(course)

# Generate dummy performance metrics with matching employee_ids
def generate_performance_metrics(n=1000):
    for _ in range(n):
        course = random.choice(courses)  # Pick a random course for the performance metric
        metric = {
            "metric_id": fake.uuid4(),  # Unique ID for each metric
            "employee_id": random.choice(employees)["employee_id"],  # Match with employee_id
            "course_id": course["course_id"],  # Store course_id from the selected course
            "quiz_score": random.randint(0, 10),
            "behavioral_metrics": {
                "discipline": random.randint(0, 5),
                "punctuality": random.randint(0, 5),
                "teamwork": random.randint(0, 5),
                "communication": random.randint(0, 5),
                "problem_solving": random.randint(0, 5),
            },
            "date": datetime.now(),
            "comments": fake.sentence(),
        }
        performance_metrics.append(metric)

# Function to save data to CSV
def save_to_csv():
    pd.DataFrame(trainers).to_csv('trainers.csv', index=False)
    pd.DataFrame(employees).to_csv('employees.csv', index=False)
    pd.DataFrame(courses).to_csv('courses.csv', index=False)
    # Flatten performance_metrics for better structure
    flattened_metrics = []
    for metric in performance_metrics:
        flattened_metrics.append({
            "metric_id": metric["metric_id"],
            "employee_id": metric["employee_id"],
            "course_id": metric["course_id"],
            "quiz_score": metric["quiz_score"],
            **metric["behavioral_metrics"],
            "date": metric["date"],
            "comments": metric["comments"],
        })
    pd.DataFrame(flattened_metrics).to_csv('performance_metrics.csv', index=False)

# Run the data generation
generate_trainers(1000)
generate_employees(1000)
generate_courses(1000)
generate_performance_metrics(1000)

# Save the generated data to CSV files
save_to_csv()

print("Dummy data generated and saved to CSV files successfully!")
