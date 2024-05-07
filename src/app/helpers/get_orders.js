export default async function GetOrders() {
    let ordersArray = null;

    try {
        const response = await fetch(`http://localhost:3000/api/orders`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        ordersArray = data;
  
        // console.log(cartItemsArray);
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Optionally, rethrow the error to propagate it
        throw error;
    }
  
    return ordersArray;
  }
  