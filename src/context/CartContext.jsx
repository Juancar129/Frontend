import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { addToCart, clearBackendCart, getCart, removeFromCart } from "../api/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const LOCAL_CART_KEY = "cart";

const getInitialCart = () => {
    const savedCart = localStorage.getItem(LOCAL_CART_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
};

const mapBackendCartToUi = (backendCart) => {
    if (!backendCart?.items) {
        return [];
    }

    return backendCart.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        description: item.product.description,
        category: item.product.category,
        categoria: item.product.categoria,
        stock: item.product.stock,
        quantity: item.quantity,
        image: item.product.images?.[0]?.url
            ? `http://localhost:3333${item.product.images[0].url}`
            : "https://via.placeholder.com/100",
        images: (item.product.images || []).map((image) => ({
            ...image,
            fullUrl: `http://localhost:3333${image.url}`,
        })),
    }));
};

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState(getInitialCart);
    const [cartItemCount, setCartItemCount] = useState(0);
    const previousUserRef = useRef(user);
    const isBackendCartUser = user?.role === "user";

    useEffect(() => {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        setCartItemCount(totalItems);

        if (!isBackendCartUser) {
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
        }
    }, [cart, isBackendCartUser]);

    useEffect(() => {
        const syncCart = async () => {
            if (!isBackendCartUser) {
                return;
            }

            const guestCart = getInitialCart();

            if (guestCart.length > 0) {
                for (const item of guestCart) {
                    for (let i = 0; i < item.quantity; i += 1) {
                        await addToCart(item.id);
                    }
                }

                localStorage.removeItem(LOCAL_CART_KEY);
            }

            const backendCart = await getCart();
            setCart(mapBackendCartToUi(backendCart));
        };

        syncCart().catch((error) => {
            console.error("Error sincronizando carrito:", error);
        });
    }, [isBackendCartUser]);

    useEffect(() => {
        const previousUser = previousUserRef.current;

        if (previousUser && !user) {
            localStorage.removeItem(LOCAL_CART_KEY);
            setCart([]);
        }

        previousUserRef.current = user;
    }, [user]);

    const addItemToCart = async (product) => {
        if (isBackendCartUser) {
            const backendCart = await addToCart(product.id);
            setCart(mapBackendCartToUi(backendCart));
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }

            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeItemFromCart = async (productId) => {
        if (isBackendCartUser) {
            const currentItem = cart.find((item) => item.id === productId);

            if (!currentItem) {
                return;
            }

            for (let i = 0; i < currentItem.quantity; i += 1) {
                try {
                    await removeFromCart(productId);
                } catch (error) {
                    break;
                }
            }

            const backendCart = await getCart();
            setCart(mapBackendCartToUi(backendCart));
            return;
        }

        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const incrementQuantity = async (productId) => {
        if (isBackendCartUser) {
            const backendCart = await addToCart(productId);
            setCart(mapBackendCartToUi(backendCart));
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
            ),
        );
    };

    const decrementQuantity = async (productId) => {
        if (isBackendCartUser) {
            try {
                const backendCart = await removeFromCart(productId);
                setCart(mapBackendCartToUi(backendCart));
            } catch (error) {
                const backendCart = await getCart();
                setCart(mapBackendCartToUi(backendCart));
            }
            return;
        }

        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
    };

    const clearCart = async () => {
        if (isBackendCartUser) {
            await clearBackendCart();
        }

        localStorage.removeItem(LOCAL_CART_KEY);
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const contextValue = {
        cart,
        itemCount: cartItemCount,
        addItemToCart,
        removeItemFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        getCartTotal,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};
