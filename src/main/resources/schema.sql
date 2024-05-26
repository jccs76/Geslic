create table customers (
    id number(19,0) not null,
    created_date timestamp(6),
    last_modified_date timestamp(6),
    address varchar2(255 char),
    city varchar2(255 char),
    email varchar2(255 char),
    name varchar2(255 char),
    phone_number varchar2(255 char),
    state varchar2(255 char),
    zip_code varchar2(255 char),
    primary key (id)
);
create sequence customers_seq start with 1 increment by 1;

create table products (
    id number(19,0) not null,
    created_date timestamp(6),
    last_modified_date timestamp(6),
    description varchar2(255 char),
    name varchar2(255 char),
    price number(38,2),
    primary key (id)
);
create sequence products_seq start with 1 increment by 1;

create table users (
    id number(19,0) not null,
    created_date timestamp(6),
    last_modified_date timestamp(6),
    email varchar2(100 char) unique not null,
    first_name varchar2(255 char) not null,
    last_name varchar2(255 char),
    password varchar2(255 char) not null,
    primary key (id)
);
create sequence users_seq start with 1 increment by 1;


create table licenses (
    id number(19,0) not null,
    created_date timestamp(6),
    last_modified_date timestamp(6),
    code varchar2(255 char),
    price number(38,2),
    purchase_date date,
    customer_id number(19,0),
    lastsupport_id number(19,0) unique,
    product_id number(19,0),
    primary key (id)
);
create sequence licenses_seq start with 1 increment by 1;


create table supports (
    id number(19,0) not null,
    created_date timestamp(6),
    last_modified_date timestamp(6),
    from_date date,
    price number(38,2),
    status varchar2(255 char) check (status in ('ACTIVE','CANCELED','EXPIRED')),
    to_date date,
    license_id number(19,0) not null,
    primary key (id)
    
);
create sequence supports_seq start with 1 increment by 1;

alter table licenses add constraint FK_licenses_customer_id foreign key (customer_id) references customers;
alter table licenses add constraint FK_licenses_lastsupport_id foreign key (lastsupport_id) references supports;
alter table licenses add constraint FK_licenses_product_id foreign key (product_id) references products;
alter table supports add constraint FK_supports_license_id foreign key (license_id) references licenses;