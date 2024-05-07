export default async function GetCartItems(orderID) {
    let cartItemsArray = null;

    try {
        const response = await fetch(`http://localhost:3000/api/orders/${orderID}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        cartItemsArray = data.order_items;
  
        // console.log(cartItemsArray);
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Optionally, rethrow the error to propagate it
        throw error;
    }
  
    return cartItemsArray;
  }
  