'use client'

import { useEffect, useState } from 'react';
import TableRow from './table_row';
import GetOrders from '../../app/helpers/get_orders';
import dynamic from 'next/dynamic';


export default function OrderTable() {
    const [ordersArray, setOrdersArray] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const SectionHeader = dynamic(() => import('../general/section_header'), { ssr: false });

    useEffect(() => {
        async function fetchItems() {
            const orders = await GetOrders();
            setOrdersArray(orders);
        }

        fetchItems();
    }, []);

    const handleDeleteOrder = async (orderID) => {
        setIsDeleting(true);
        try {
            // Make a delete request to remove the cart item
            await fetch(`/api/orders/${orderID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Update cart items after successful deletion
            const updatedOrders = ordersArray.filter(order => order.order_id !== orderID);
            setOrdersArray(updatedOrders);
        } catch (error) {
            console.error('Error deleting cart item:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const completeOrder = async (orderID) => {
        setIsCompleted(true);
        try {
            // Make a PUT request to modify order details
            const response = await fetch(`/api/orders/${orderID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_status: 'completed',
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to finalize order');
            }
    
            //Redirect to orders page
            window.location.href = "/orders";
        } catch (error) {
            console.error('Error completing order:', error);
        } finally {
            setIsCompleted(false);
        }
    };    


    if (!ordersArray) {
        // If categorizedItems is still null (fetching data), show a loading message.
        return <div>Loading...</div>;
    }

    if (ordersArray.length === 0) {
        return(
            <h1 className='text-gray-400 align-center text-center text-2xl w-[450px] max-h-[500px] mx-auto mt-8 px-6 pt-4 rounded-2xl border-gray-300 border-2'>You have no existing order.</h1>
        )
    }

    return (
        <section className='min-w-full min-h-[400px] px-20 py-6 bg-white'>
            <SectionHeader text="Order History"/>
            <div>
            {ordersArray.map((order, index) => (
                    <TableRow
                        queue_number={order.queue_number}
                        barista_name={order.barista_name}
                        time={order.creation_timestamp}
                        amount={order.total_amount}
                        orderID={order.order_id}
                        onDelete={handleDeleteOrder}
                        isDeleting={isDeleting}
                        key={index}
                    />
                ))}
            </div>
        </section>
    )
}