'use client'

import { useState } from "react";

export default function OrderItem({ id, name, onItemSelection }) {
    const [quantity, setQuantity] = useState(0);

    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value);
        setQuantity(newQuantity)

        onItemSelection(id, newQuantity)
    }
    
    return(
        <div className="flex flex-row items-center my-4 mr-8 border-2 shadow border-gray-400">
            <div className='basis-2/4 m-1 align-middle'>
                <input 
                    id={id} 
                    type="checkbox" 
                    value={name}
                    onChange={(event)=>onItemSelection(id, event.target.checked? 1: 0)} 
                    className="ml-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"/>
                <label htmlFor={id} className="ms-2 text-sm font-medium text-gray-900">{name}</label>
            </div>
            <div className='basis-1/4'>
                <label htmlFor="quantity" className="ms-2 text-sm font-medium text-gray-900">Quantity:</label>
                <input 
                    className='ml-2 border-gray-300 border-2 text-sm font-medium text-gray-900' 
                    type="number" 
                    id="quantity" 
                    name="quantity" 
                    min="0" 
                    max="50" 
                    value={quantity}
                    onChange={handleQuantityChange}
                />   
            </div>
        </div>
    )
};