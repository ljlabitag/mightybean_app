export default async function GetItems() {
  let items = null;
  // Initialize arrays for each category
  let categorizedItems = [[], [], []]; 
  
  try {
      const response = await fetch(`http://localhost:3000/api/items`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      items = data;

      // Filter items array based on item category
      categorizedItems[0] = items.filter(item => item.item_category === "Coffee Selection");
      categorizedItems[1] = items.filter(item => item.item_category === "Milktea Flavors");
      categorizedItems[2] = items.filter(item => item.item_category === "Lemonade Series");

      console.log(categorizedItems);
      
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      // Optionally, rethrow the error to propagate it
      throw error;
  }

  return categorizedItems;
}
