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
    address VARCHAR(100),
    contact VARCHAR(20),
    DOB DATE,
    grade VARCHAR(20),
    username VARCHAR(255) UNIQUE,
    password VARCHAR(100),
    gender enum('M','F','Male','Female'),
    is_active BOOLEAN,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
);

select * from student_details ;
drop table student_details ;


-- not needed now
create table student_login(
    student_id int,
    username VARCHAR(255),
    is_active int,
    foreign key (student_id) references student_details(student_id) ON DELETE CASCADE,
    foreign key (username) references student_details(username) ON DELETE CASCADE
);

select * from student_login ;
drop table student_login ;


drop database studntManagement ;