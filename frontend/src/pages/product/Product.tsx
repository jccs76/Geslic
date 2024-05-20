import Layout from "../../layout/layout";
import { ProductService } from "../../services/ProductService";
import { App } from "@/types";
import {  useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";


const Product = () => {

    let emptyProduct: App.ProductType= {
        id: '',
        name: '',
        description: ''
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

    const onInputNumberChange = (e : any) => {
        console.log(e.value)
        let _product = { ...product};
        _product['price'] = e.value;
        setProduct(_product);
    }

    
    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(product);
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
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="name" className="">Nombre</label>                        
                                <InputText id="product.name" name="name"  value={product.name} autoFocus type="text" onChange={onInputChange} />
                            </div>
                            <div className="field col-12">                    
                                <label htmlFor="description" className="">Descripción</label>
                                <InputText id="product.description" name="description"  value={product.description} type="text" onChange={onInputChange} />
                            </div>
                            <div className="field col-12 md:col-2">                    
                                <label htmlFor="price" className="">Precio</label>                    
                                <InputNumber inputId="product.price" value={product.price} mode="currency" currency="EUR" locale="es-ES" onValueChange={onInputNumberChange}/>
                            </div>                                                          
                        </div>
                        <div className="col-2 col-offset-5">
                                <Button type="submit" icon="pi pi-save" label="Guardar" severity="info"  />                    
                            </div>
                    </form>
                </div>
            </div>        
    </div>
    </Layout>
  )
}


export default Product;