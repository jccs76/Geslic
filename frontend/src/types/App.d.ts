type Product = {
    id?: string;
    name: string;
    description: string;
    price?: number;
    [key: string]: string | string[] | number | boolean | undefined;
};
