'use client'

import { useState } from 'react';

export default function CartItem({ name, quantity, price, cartItemID, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            // Make a delete request to remove the cart item
            await fetch(`/api/order-items/${cartItemID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // If successful, trigger the onDelete callback to update the UI
            onDelete(cartItemID);
            // Reload the page
            window.location.reload();
        } catch (error) {
            console.error('Error deleting cart item:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-row justify-around p-1 my-4 border-gray-300 rounded-xl">
            <div className="content-center basis-3/6 text-start text-sm pl-4">{name}</div>
            <div className="content-center basis-1/6 text-center text-sm">{quantity}</div>
            <div className="content-center basis-1/6 text-center text-sm">{price * quantity}.00</div>
            <button
                className="bg-[#B19470] m-1 basis-1/6 text-white text-xs rounded-full px-4 py-1"
                disabled={isDeleting} // Disable the button while the delete request is in progress
                onClick={handleDelete} // Attach the event handler to the click event
            >{isDeleting ? 'Removing...' : 'Remove'}</button>
        </div>
    );
}
