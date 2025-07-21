create database studntManagement ;
use studntManagement ;

create table student_details (
    student_id int primary key auto_increment,
    name VARCHAR(100),
    fatherName VARCHAR(100),
    email VARCHAR(100),
    address VARCHAR(100),
    contact VARCHAR(20),
    DOB DATE,
    grade VARCHAR(20),
    username VARCHAR(255) UNIQUE,
    password VARCHAR(100),
    gender enum('M','F','Male','Female'),
    is_active BOOLEAN,
    is_admin BOOLEAN DEFAULT false,
    provider varchar(100),
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
);

insert into student_details(username, password, is_admin) values("admin", "admin123", true) ; 

select * from student_details ;	
drop table student_details ;


drop database studntManagement ;