const API_URL = 'https://customer-data-bknd.onrender.com/api/customers';

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    const tableBody = document.querySelector('#customer-table tbody');
    data.forEach(customer => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${customer.Cust_ID}</td>
        <td>${customer.Name}</td>
        <td>${customer.Email}</td>
        <td>${customer.Ph_No}</td>
        <td>${customer.Ship_Ad}</td>
        <td>${customer.Billing_Ad}</td>
        <td>${customer.Account_Creation_Date}</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => console.error('Error fetching data:', error));
