'use client'

import { useEffect, useState } from 'react';
import CartItem from "../cart/cart_item";
import GetCartItems from '../../app/helpers/get_cart_items';
import dynamic from 'next/dynamic';

export default function CartForm() {
    const [cartItemsArray, setCartItemsArray] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);

    const SectionHeader = dynamic(() => import('../general/section_header'), { ssr: false });

    const getOrderIDFromURL = () => {
        if (typeof window !== 'undefined') {
            const url = window.location.href;
            const orderIDIndex = url.lastIndexOf('/') + 1;
            return url.substring(orderIDIndex);
        }
        return null;
    };

    const orderID = getOrderIDFromURL();

    useEffect(() => {
        async function fetchItems() {
            const cartItems = await GetCartItems(orderID);
            setCartItemsArray(cartItems);
        }

        fetchItems();
    }, [orderID]);

    const handleDeleteCartItem = async (cartItemID) => {
        setIsDeleting(true);
        try {
            // Make a delete request to remove the cart item
            await fetch(`/api/order-items/${cartItemID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Update cart items after successful deletion
            const updatedCartItems = cartItemsArray.filter(item => item.id !== cartItemID);
            setCartItemsArray(updatedCartItems);
        } catch (error) {
            console.error('Error deleting cart item:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const finalizeOrder = async () => {
        setIsFinalizing(true);
        try {
            // Make a PUT request to modify order details
            const response = await fetch(`/api/orders/${orderID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_status: 'in_queue',
                    calculate_total: true
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to finalize order');
            }
    
            //Redirect to orders page
            window.location.href = "/orders";
        } catch (error) {
            console.error('Error finalizing order:', error);
        } finally {
            setIsFinalizing(false);
        }
    };    

    if (!cartItemsArray) {
        // If categorizedItems is still null (fetching data), show a loading message.
        return <div>Loading...</div>;
    }
    if (cartItemsArray.length === 0) {
        return(
            <h1 className='text-gray-400 bg-white align-center text-center text-2xl w-[450px] max-h-[500px] mx-auto mt-8 px-6 pt-4 rounded-2xl border-gray-300 border-2'>Your cart is empty</h1>
        )
    }

    let totalPrice = 0;
    cartItemsArray.forEach(cartItem => totalPrice += cartItem.item_price*cartItem.quantity)
    return (
        <form className="w-[450px] max-h-[500px] mx-auto mt-8 px-6 bg-white pt-4 rounded-2xl border-gray-300 border-2">
            <SectionHeader title='Cart'/>
            <div className=''>
            {cartItemsArray.map((cartItem, index) => (
                    <CartItem
                        name={cartItem.item_name}
                        quantity={cartItem.quantity}
                        price={cartItem.item_price}
                        cartItemID={cartItem.order_item_id}
                        onDelete={handleDeleteCartItem}
                        isDeleting={isDeleting}
                        key={index}
                    />
                ))}
            </div>
            <div className='flex justify-between mt-8'>
                <div className='text-xl pl-4 font-bold'>Total: </div>
                <div className='text-xl pr-24 font-bold'>{totalPrice}</div>
            </div>
            
            <button 
                type='button'
                className="bg-[#43766C] block mx-auto mb-2 mt-10 text-white text-2xl rounded-full px-6 py-2"   
                disabled={isFinalizing} // Disable the button while finalizing the order
                onClick={finalizeOrder} // Attach the event handler to the click event
            >{isFinalizing ? 'Finalizing...' : 'Finalize Order'}</button>
        </form>
    )}