export type Customer = {
    id?: string;
    name: string;
    [key: string]: string | string[] | number | boolean | undefined;
};

export type Customers = Customer[];