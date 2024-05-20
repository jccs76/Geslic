import Layout from "../../layout/layout";
import { ProductService } from "../../services/ProductService";
import { App } from "@/types";
import {  useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";


const Product = () => {

    let emptyProduct: App.ProductType= {
        id: '',
        name: ''
    };
    
    const navigate = useNavigate();

    const {id} = useParams();    
    
    const [product, setProduct] = useState<App.ProductType>(emptyProduct);    

    useEffect(() => {        
        {id && (
            ProductService.getProduct(id).then((data) => setProduct(data as any))
        )};    
    }, []);


    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {        
        e.preventDefault();

        const name = e.target.name;
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const handleSave = () => {
      
    }

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (id){
            ProductService.updateProduct(id, product).then((data) => setProduct(data as any))
            
        } else {
            ProductService.createProduct(product).then((data) => setProduct(data as any))
        }
        navigate(-1);
    }

  return (
    <Layout>
    <div className="grid">
            <div className="col-12">
                <h5>{id ? 'Editar' : 'Nuevo'} Producto</h5>
                <div className="card p-fluid">
                    <form onSubmit={handleSubmit}>                                  
                    <div className="field grid">
                        <label htmlFor="name" className="">Name</label>
                        <InputText id="product.name" name="name"  value={product.name} autoFocus type="text" onChange={onInputChange} />
                    </div>
                    <div className="col-2 col-offset-5">
                        <Button type="submit" icon="pi pi-save" label="Guardar" severity="info" onClick={handleSave} />                    
                    </div>
                    </form>
                </div>
            </div>        
    </div>
    </Layout>
  )
}

export default Product;