import React, { createContext, useState, useEffect } from 'react';

// 1. Crear el Contexto
export const CartContext = createContext();

// Función auxiliar para obtener el carrito del localStorage
const getInitialCart = () => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : []; 
};

// 2. Crear el Proveedor del Contexto
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(getInitialCart);
    const [cartItemCount, setCartItemCount] = useState(0);

    // Efecto para guardar en localStorage y actualizar el contador cada vez que 'cart' cambia
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(totalItems);
    }, [cart]);

    // 3. Funciones de Manipulación

    const addItemToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeItemFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== productId));
    };

    const incrementQuantity = (productId) => {
        setCart((prevCart) => 
            prevCart.map(item => 
                item.id === productId 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            )
        );
    };

    const decrementQuantity = (productId) => {
        setCart((prevCart) => 
            prevCart.map(item => 
                item.id === productId 
                    ? { ...item, quantity: item.quantity - 1 } 
                    : item
            ).filter(item => item.quantity > 0) // Elimina si la cantidad es 0 o menos
        );
    };

    // Devuelve el número sin formatear para que Cart.jsx lo formatee
    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const contextValue = {
        cart,
        itemCount: cartItemCount, 
        addItemToCart,
        removeItemFromCart,
        incrementQuantity,
        decrementQuantity,
        getCartTotal,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};