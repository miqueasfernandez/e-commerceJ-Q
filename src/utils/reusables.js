
export const fastResponse = (res, status, message) => {
    res.status(status).json({message})
}

export function totalvalue(products) {
    return products.reduce((total, item) => {
        const productPrice = item.product.price; 
        const quantity = item.quantity || 0; 
        return total + (productPrice * quantity);
    }, 0);
}