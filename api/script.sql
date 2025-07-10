create database studntManagement ;
use studntManagement ;

create table admin(
	admin_id int primary key auto_increment,
    Username varchar(100),
    Password varchar(100)
);

insert into admin(username, password) values("admin", "admin123") ;
select * from admin ;
drop table admin ;

create table student_details (
    student_id int primary key auto_increment,
    name VARCHAR(100),
    fatherName VARCHAR(100),
    email VARCHAR(100),
    contact VARCHAR(20),
    grade VARCHAR(20),
    username VARCHAR(255) UNIQUE,
    password VARCHAR(100),
    gender enum('M','F','Male','Female'),
    login_count int,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
);

select * from student_details ;
drop table student_details ;


drop database studntManagement ;