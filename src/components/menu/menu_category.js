'use client'

import { useEffect, useState } from 'react';
import GetItems from "../../app/helpers/get_items";
import ItemCard from "./item_card";

export default function MenuCategory({ category }) {
    const [categorizedItems, setCategorizedItems] = useState(null);

    useEffect(() => {
        async function fetchItems() {
            const items = await GetItems();
            setCategorizedItems(items);
        }

        fetchItems();
    }, []);

    if (!categorizedItems) {
        // If categorizedItems is still null (fetching data), you can show a loading spinner or message.
        return <div>Loading...</div>;
    }

    if (category === "coffee") {
        const coffeeItemsArray = categorizedItems[0];
        return (
            <div className="grid grid-cols-5 gap-4">
                {coffeeItemsArray.map((item, index) => (
                    <ItemCard
                        key={index} // Consider using a unique key, like item ID if available
                        category="coffee.jpeg"
                        name={item.item_name}
                        price={item.price}
                    />
                ))}
            </div>
        );
    } 
    
    if (category === "milktea") {
        const milkteaItemsArray = categorizedItems[1];
        return (
            <div className="grid grid-cols-5 gap-4">
                {milkteaItemsArray.map((item, index) => (
                    <ItemCard
                        key={index}
                        category="milktea.png"
                        name={item.item_name}
                        price={item.price}
                    />
                ))}
            </div>
        );
    }    
    
    if (category === "lemonade") {
        const lemonadeItemsArray = categorizedItems[0];
        return (
            <div className="grid grid-cols-5 gap-4">
                {lemonadeItemsArray.map((item, index) => (
                    <ItemCard
                        key={index} // Consider using a unique key, like item ID if available
                        category="lemonade.jpeg"
                        name={item.item_name}
                        price={item.price}
                    />
                ))}
            </div>
        );
    }     
    
    
    else {
        return null;
    }
}
