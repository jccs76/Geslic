export type LayoutType = 'list' | 'grid';
export type SortOrderType = 1 | 0 | -1;


type SupportStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED';

declare namespace App {
    type Product = {
        id?: string;
        name: string;
        description?: string;
        price?: number;
        [key: string]: string | string[] | number | boolean | undefined;
    };

    type License = {
        id?: string;
        code: string;
        product: Product;
        customer: Customer;
        support?: Support;
        [key: string]: string | string[] | number | boolean | undefined;
    }

    type Suport = {
        id?: string;
        fromDate: string;
        toDate: string;
        status: SupportStatus;
        licenseId? : string;
        [key: string]: string | string[] | number | boolean | undefined;
    };

    interface Event extends EventInput {
        location?: string;
        description?: string;
        tag?: {
            name: string;
            color: string;
        };
    }

    // IconService
    type Icon = {
        icon?: {
            paths?: string[];
            attrs?: [{}];
            isMulticolor?: boolean;
            isMulticolor2?: boolean;
            grid?: number;
            tags?: string[];
        };
        attrs?: [{}];
        properties?: {
            order?: number;
            id: number;
            name: string;
            prevSize?: number;
            code?: number;
        };
        setIdx?: number;
        setId?: number;
        iconIdx?: number;
    };
}