'use client'

import { useState } from 'react';

export default function TableRow({queue_number, barista_name, time, amount, orderID, onDelete}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            // Make a delete request to remove order
            await fetch(`/api/orders/${orderID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // If successful, trigger the onDelete callback to update the UI
            onDelete(orderID);
            // Reload the page
            window.location.reload();
        } catch (error) {
            console.error('Error deleting order:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-row justify-around p-6 my-4 border-gray-300 rounded-xl">
            <div className="content-center basis-1/6 text-start text-md pl-4">Queue No. {queue_number}</div>
            <div className="content-center basis-1/6 text-center text-md">Prepared by: {barista_name}</div>
            <div className="content-center basis-1/6 text-center text-xs">{time}</div>
            <div className="content-center basis-1/6 text-center text-sm">{amount}.00</div>
            <button
                className="bg-[#B19470] m-1 basis-1/6 text-white text-xs rounded-full px-6 py-2"
                disabled={isDeleting} // Disable the button while the delete request is in progress
                onClick={handleDelete} // Attach the event handler to the click event
            >{isDeleting ? 'Deleting order...' : 'Delete order'}</button>
        </div>
    );
}
