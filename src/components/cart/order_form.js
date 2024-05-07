'use client'

import { useEffect, useState } from 'react';
import OrderItem from "./order_item";
import GetItems from "../../app/helpers/get_items";


export default function OrderForm() {
    const [categorizedItems, setCategorizedItems] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        async function fetchItems() {
            const items = await GetItems();
            setCategorizedItems(items);
        }

        fetchItems();
    }, []);

    if (!categorizedItems) {
        // If categorizedItems is still null (fetching data), show a loading message.
        return <div>Loading...</div>;
    }
    
    const coffeeItemsArray = categorizedItems[0];
    const milkteaItemsArray = categorizedItems[1];
    const lemonadeItemsArray = categorizedItems[2];
    const getOrderIDFromURL = () => {
        const url = window.location.href;
        const orderIDIndex = url.lastIndexOf('/') + 1;
        return url.substring(orderIDIndex);
    };

    const orderID = getOrderIDFromURL();

    // Callback function to handle item selection and quantity changes
    const handleItemSelection = (itemId, quantity) => {
        const existingItemIndex = selectedItems.findIndex(item => item.item_id === itemId);

        if (existingItemIndex === -1) {
            // If the item is not already selected, add it to the selectedItems array
            setSelectedItems(prevItems => [...prevItems, { order_id: orderID, item_id: itemId, quantity: quantity }]);
        } else {
            // If the item is already selected, update its quantity in the selectedItems array
            setSelectedItems(prevItems => {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity = quantity;
                return updatedItems;
            });
        }
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // console.log(selectedItems)
            const response = await fetch('/api/order-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ records: selectedItems })
            });

            if (!response.ok) {
                throw new Error('Failed to create order items');
            }

            // Redirect to the same orderID page
            window.location.href = `/orders/${orderID}`;
        } catch (error) {
            // Handle error
            console.error('Error creating order items:', error.message);
        }
    };


    return (
        <form onSubmit={handleSubmit} className='basis-4/6 p-8'>
            <h1 className="text-[#43766C] font-bold text-2xl text-left mt-2 mb-2">Coffee Selection</h1>
            <div className='max-h-[250px] bg-white overflow-scroll p-6 mb-12 border-2 border-gray-500'>
                {coffeeItemsArray.map((item, index) => (
                    <OrderItem
                        id={item.item_id}
                        orderID={orderID}
                        onItemSelection={handleItemSelection}
                        name={item.item_name}
                        key={index}
                    />
                ))}
            </div>

            <h1 className="text-[#43766C] font-bold text-2xl text-left mt-2 mb-2">Milktea Flavors</h1>
            <div className='max-h-[250px] overflow-scroll bg-white p-6 mb-12 border-2 border-gray-500'>
                {milkteaItemsArray.map((item, index) => (
                    <OrderItem
                        id={item.item_id}
                        orderID={orderID}
                        onItemSelection={handleItemSelection}
                        name={item.item_name}
                        key={index}
                    />
                ))}
            </div>

            <h1 className="text-[#43766C] font-bold text-2xl text-left mt-2 mb-2">Lemonade Series</h1>
            <div className='max-h-[250px] overflow-scroll bg-white p-6 mb-6 border-2 border-gray-500'>
                {lemonadeItemsArray.map((item, index) => (
                    <OrderItem
                        id={item.item_id}
                        orderID={orderID}
                        onItemSelection={handleItemSelection}
                        name={item.item_name}
                        key={index}
                    />
                ))}
            </div>
            
            <button 
                type='submit'
                className="bg-[#43766C] block mx-auto mb-2 mt-10 text-white text-2xl rounded-full px-8 py-2"   
            >Add to Cart</button>
        </form>
    )
}