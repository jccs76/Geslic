import { Dispatch, SetStateAction, createContext, useEffect, useReducer, useState } from 'react';

import { ChildContainerProps, Customer, Customers } from '@/types';
//import { CustomerActionType, CustomerReducer } from '../reducer/CustomerReducer';
import { CustomerService } from '../services/CustomerService';

const emptyCustomer : Customer = { 
    id : '',
    name: '',  
};
const initialState : Customers = [emptyCustomer];
const emptyCustomers = {
  customers : [emptyCustomer]
};

export interface CustomerContextProps {
  customers: Customers;
  setCustomers: Dispatch<SetStateAction<Customers>>;
  getCustomers: (customer : Customer) => void;
  addCustomer: (customer : Customer) => void;
  editCustomer: (customer : Customer) => void;
  removeCustomer: ( customer : Customer) => void;
}

export const CustomerContext = createContext({} as CustomerContextProps);

export const CustomerProvider = ({ children }: ChildContainerProps) => {
  
  //const { SET_CUSTOMERS, ADD_CUSTOMER, EDIT_CUSTOMER, REMOVE_CUSTOMER } = CustomerActionType;

  //const [state, dispatch] = useReducer(CustomerReducer, emptyCustomers);

  const [customers, setCustomers] = useState(initialState);

  const getCustomers =  () => {
  }


  const addCustomer = (customer : Customer )  => {
  }

  const editCustomer = (customer : Customer)  => {
  }

  const removeCustomer = (customer : Customer) => {
  }
  
  const value : CustomerContextProps = {
      customers,
      setCustomers,
      getCustomers,
      addCustomer,
      editCustomer,
      removeCustomer
  }

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};