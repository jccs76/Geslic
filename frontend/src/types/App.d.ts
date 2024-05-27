export type LayoutType = 'list' | 'grid';
export type SortOrderType = 1 | 0 | -1;



declare namespace App {
    
    type SupportStatusType = 'ACTIVE' | 'CANCELED' | 'EXPIRED' | null;

    type CustomerType = {
        id?: string;
        name: string;
        address? : string;
        zipCode? : string;
        state? :  string;
        city? : string;
        phoneNumber? : string;
        email? : string;
        [key: string]: string | string[] | number | boolean | undefined;
    } | null;

    type CustomersType = [CustomerType] | null;

    type ProductType = {
        id?: string;
        name: string;
        description?: string;
        price?: number;
        [key: string]: string | string[] | number | boolean | undefined;
    } | null;

    type ProductsType = [ProducType] | null;

    type LicenseType = {
        id?: string;
        code: string;
        purchaseDate? : string;
        price?: number;        
        product?: Product ;
        customer?: Customer ;
        lastSupport?: Support;
        [key: string]: string | Product |Customer | Support | undefined;
    } | null;

    type LicensesType = [LicenseType] | null;

    type SupportType = {
        id?: string;
        price: number;        
        fromDate: string;
        toDate: string;
        status: SupportStatus;
        licenseId? : string;
        [key: string]: string | string[] | number | boolean | undefined;
    } | null;

    type SupportsType = [SupportType] | null;

    type UserType = {
        id?: string;
        firstName: string;
        lastName?: string;
        email: string;
        password: string;
        isAdmin : boolean;
        [key: string]: string | string[] | number | boolean | undefined;
    }

    type UsersType = [UserType] | null;
    
    type LoginType =  {
        email : string;
        password : string;
    };

    interface Event extends EventInput {
        location?: string;
        description?: string;
        tag?: {
            name: string;
            color: string;
        }
    };

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