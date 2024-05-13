package com.jccs.geslic.product;

import org.mapstruct.Mapper;

import com.jccs.geslic.common.CommonMapper;

@Mapper(componentModel = "spring")
interface ProductMapper extends CommonMapper<ProductDTO, Product>{
/*     ProductDTO productToDTO(Product product);
    Product dtoToProduct(ProductDTO productDTO);
    List<ProductDTO> map(List<Product> products);
 */
}
