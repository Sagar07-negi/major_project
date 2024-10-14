import pandas as pd

# Load cleaned data
trainers = pd.read_csv('cleaned_trainers.csv')
employees = pd.read_csv('cleaned_employees.csv')
courses = pd.read_csv('cleaned_courses.csv')
performance_metrics = pd.read_csv('cleaned_performance_metrics.csv')

# Generate Dimensions
def create_dimensions():
    # Employee Dimension
    employee_dimension = employees[['employee_id', 'name', 'email', 'phone_num', 'designation', 'hire_date']]
    
    # Trainer Dimension
    trainer_dimension = trainers[['trainer_id', 'name', 'email', 'phone_num', 'expertise_area']]
    
    # Course Dimension
    course_dimension = courses[['course_id', 'course_name', 'description', 'trainer_name', 'start_date', 'end_date']]
    
    # Performance Dimension
    performance_dimension = performance_metrics[['employee_id', 'course_id', 'quiz_score', 'discipline', 
                                                 'punctuality', 'teamwork', 'communication', 
                                                 'problem_solving', 'date', 'comments']]
    
    return employee_dimension, trainer_dimension, course_dimension, performance_dimension

# Generate Facts
def create_facts():
    # Create a fact table from performance metrics
    fact_table = performance_metrics.groupby('employee_id').agg({
        'quiz_score': 'mean',
        'discipline': 'mean',
        'punctuality': 'mean',
        'teamwork': 'mean',
        'communication': 'mean',
        'problem_solving': 'mean'
    }).reset_index()
    
    # Rename columns to be clear
    fact_table.rename(columns={
        'quiz_score': 'average_quiz_score',
        'discipline': 'average_discipline',
        'punctuality': 'average_punctuality',
        'teamwork': 'average_teamwork',
        'communication': 'average_communication',
        'problem_solving': 'average_problem_solving'
    }, inplace=True)

    return fact_table

# Save the dimensions and facts
def save_kpis():
    employee_dimension, trainer_dimension, course_dimension, performance_dimension = create_dimensions()
    fact_table = create_facts()

    employee_dimension.to_csv('employee_dimension.csv', index=False)
    trainer_dimension.to_csv('trainer_dimension.csv', index=False)
    course_dimension.to_csv('course_dimension.csv', index=False)
    performance_dimension.to_csv('performance_dimension.csv', index=False)
    fact_table.to_csv('employee_performance_fact.csv', index=False)

    print("KPI dimensions and facts generated successfully!")

# Run the KPI generation
save_kpis()
