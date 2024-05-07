
export default async function GetUserCredentials(email) {
  let user = null
  const response = await fetch(`http://localhost:3000//api/personnel?email=${email}`)
  .then(response => {
     if (!response.ok) {
       throw new Error('Network response was not ok');
     }
     return response.json();
   })
   .then(data => {
    //  console.log('Data received:', data[0]);
     user = data[0];
 
   })
   .catch(error => {
     console.error('There was a problem with the fetch operation:', error);
   });
   
  return user
}