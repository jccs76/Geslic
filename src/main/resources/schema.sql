create table customers (
    id number(19,0) not null,
    address varchar2(255 char),
    city varchar2(255 char),
    email varchar2(255 char),
    name varchar2(255 char),
    phone_number varchar2(255 char),
    state varchar2(255 char),
    zip_code varchar2(255 char),
    created_date timestamp(6),
    last_modified_date timestamp(6),
    created_by varchar2(255 char),
    modified_by varchar2(255 char),
    primary key (id)
);
create sequence customers_seq start with 1 increment by 1;

create table products (
    id number(19,0) not null,
    description varchar2(255 char),
    name varchar2(255 char),
    price number(38,2),
    created_date timestamp(6),
    last_modified_date timestamp(6),
    created_by varchar2(255 char),
    modified_by varchar2(255 char),
    primary key (id)
);
create sequence products_seq start with 1 increment by 1;

create table licenses (
    id number(19,0) not null,
    code varchar2(255 char),
    price number(38,2),
    purchase_date date,
    customer_id number(19,0),
    lastsupport_id number(19,0) unique,
    product_id number(19,0),
    created_date timestamp(6),
    last_modified_date timestamp(6),
    created_by varchar2(255 char),
    modified_by varchar2(255 char),
    primary key (id)
);
create sequence licenses_seq start with 1 increment by 1;

create table supports (
    id number(19,0) not null,
    from_date date,
    price number(38,2),
    status varchar2(255 char) check (status in ('ACTIVE','CANCELED','EXPIRED')),
    to_date date,
    license_id number(19,0) not null,
    created_date timestamp(6),
    last_modified_date timestamp(6),
    created_by varchar2(255 char),
    modified_by varchar2(255 char),
    primary key (id)    
);
create sequence supports_seq start with 1 increment by 1;

create table users (
    id number(19,0) not null,
    email varchar2(100 char) unique not null,
    first_name varchar2(255 char) not null,
    last_name varchar2(255 char),
    user_password varchar2(255 char) not null,
    is_admin number(1,0) default 0 not null,
    created_date timestamp(6),
    last_modified_date timestamp(6),
    created_by varchar2(255 char),
    modified_by varchar2(255 char),
    primary key (id)
);
create sequence users_seq start with 1 increment by 1;

alter table licenses add constraint FK_licenses_customer_id foreign key (customer_id) references customers;
alter table licenses add constraint FK_licenses_lastsupport_id foreign key (lastsupport_id) references supports;
alter table licenses add constraint FK_licenses_product_id foreign key (product_id) references products;
alter table supports add constraint FK_supports_license_id foreign key (license_id) references licenses;

insert into users (id, first_name, email, user_password, is_admin)values (1, 'Admin', 'admin@geslic.com', '$2a$10$aFFN9tA68poV/AOK2qi8VOnpdH5NBIvpHdp/46mZXZuRYaoKX8YIm', 1);