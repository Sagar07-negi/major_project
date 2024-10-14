import pandas as pd

# Function to load data from CSV files
def load_data():
    trainers = pd.read_csv('./Raw/trainers.csv')
    employees = pd.read_csv('./Raw/employees.csv')
    courses = pd.read_csv('./Raw/courses.csv')
    performance_metrics = pd.read_csv('./Raw/performance_metrics.csv')
    return trainers, employees, courses, performance_metrics

# Function to check for null values and remove unwanted data
def transform_data(trainers, employees, courses, performance_metrics):
    # Check for null values
    print("Checking for null values...")
    print("Trainers null values:\n", trainers.isnull().sum())
    print("Employees null values:\n", employees.isnull().sum())
    print("Courses null values:\n", courses.isnull().sum())
    print("Performance Metrics null values:\n", performance_metrics.isnull().sum())
    
    # Remove rows with null values (can be adjusted based on requirements)
    trainers = trainers.dropna()
    employees = employees.dropna()
    courses = courses.dropna()
    performance_metrics = performance_metrics.dropna()

    # Remove unwanted data (example: duplicates)
    trainers = trainers.drop_duplicates()
    employees = employees.drop_duplicates()
    courses = courses.drop_duplicates()
    performance_metrics = performance_metrics.drop_duplicates()

    # Additional cleaning (example: removing invalid entries)
    # Here we could add more specific cleaning logic based on the business rules
    # For example, ensuring valid email formats or specific ranges for numerical scores
    performance_metrics = performance_metrics[performance_metrics['quiz_score'].between(0, 10)]
    return trainers, employees, courses, performance_metrics

# Function to save transformed data to new CSV files
def save_transformed_data(trainers, employees, courses, performance_metrics):
    trainers.to_csv('./Preparation/cleaned_trainers.csv', index=False)
    employees.to_csv('./Preparation/cleaned_employees.csv', index=False)
    courses.to_csv('./Preparation/cleaned_courses.csv', index=False)
    performance_metrics.to_csv('./Preparation/cleaned_performance_metrics.csv', index=False)
    print("Transformed data saved to new CSV files.")

# Main ETL process
def etl_process():
    # Extract
    trainers, employees, courses, performance_metrics = load_data()
    
    # Transform
    trainers, employees, courses, performance_metrics = transform_data(trainers, employees, courses, performance_metrics)
    
    # Load
    save_transformed_data(trainers, employees, courses, performance_metrics)

# Run the ETL process
etl_process()