CREATE DATABASE aprobdb;

CREATE TABLE users(
    uniqueuser VARCHAR(64) PRIMARY KEY,
     passwd VARCHAR(128) NOT NULL,
    email VARCHAR(320) NOT NULL,
    firstname VARCHAR(64),
    surname VARCHAR(64)
);

CREATE TABLE subscriptions(
    uniqueuser VARCHAR(64) references users(uniqueuser),
    subscription VARCHAR(64)
);