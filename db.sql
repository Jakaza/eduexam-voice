CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    start_date DATE,
    end_date DATE
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rsa_id VARCHAR(13) NOT NULL,
    user_role VARCHAR(20) NOT NULL,
    phone_number VARCHAR(10), 
    user_address VARCHAR(255),
    registration_date DATE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





