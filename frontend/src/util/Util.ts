import { Nullable } from "primereact/ts-helpers";

export const formatCurrencyES = (value: number) => {
    return value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        useGrouping: true
    });
}

export const formatDateEs = (value: string | Date) => {
    return new Date(value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const convertDatetoISOString = (value: Nullable<Date>) => {
    if (value) {        
      return value.toLocaleDateString("fr-CA").replace(" ", "T").split(".")[0];
    }
};

export const getFirstDayOfMonth = (value :  Date) => {
    return new Date(
                    value.getFullYear(),
                    value.getMonth(),
                    1);
}

export const getLastDayOfMonth = (value : Date) => {
   return new Date(value.getFullYear(), value.getMonth() + 1, 0);
}