const PRICES = {
    'Rock Concert': 50,
    'Tech Conference': 100,
    'Comedy Show': 30,
    'Theater Play': 40
};

// Backend URL - FIXED: using port 8088
const BACKEND_URL = 'http://localhost:8088';

// Calculate total price
document.getElementById('eventName').addEventListener('change', updateTotalPrice);
document.getElementById('quantity').addEventListener('input', updateTotalPrice);

function updateTotalPrice() {
    const eventName = document.getElementById('eventName').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    
    if (eventName && PRICES[eventName]) {
        const total = PRICES[eventName] * quantity;
        document.getElementById('totalPrice').textContent = `$${total}`;
    } else {
        document.getElementById('totalPrice').textContent = '$0';
    }
}

// Form submission
document.getElementById('ticketForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const eventName = document.getElementById('eventName').value;
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = PRICES[eventName] * quantity;
    
    const ticketData = {
        eventName,
        customerName,
        customerEmail,
        quantity,
        totalPrice
    };
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData)
        });
        
        if (response.ok) {
            alert('Ticket booked successfully!');
            document.getElementById('ticketForm').reset();
            updateTotalPrice();
            loadAllTickets();
        } else {
            alert('Error booking ticket');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to server. Make sure backend is running on port 8088.');
    }
});

// Load all tickets
async function loadAllTickets() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/tickets`);
        const tickets = await response.json();
        displayTickets(tickets);
    } catch (error) {
        console.error('Error loading tickets:', error);
        document.getElementById('ticketsContainer').innerHTML = 
            '<p>Error loading tickets. Make sure backend is running on port 8088.</p>';
    }
}

// Search tickets by email
async function searchTickets() {
    const email = document.getElementById('searchEmail').value;
    if (!email) {
        loadAllTickets();
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/tickets/email/${email}`);
        const tickets = await response.json();
        displayTickets(tickets);
    } catch (error) {
        console.error('Error searching tickets:', error);
    }
}

// Display tickets
function displayTickets(tickets) {
    const container = document.getElementById('ticketsContainer');
    
    if (!tickets || tickets.length === 0) {
        container.innerHTML = '<p>No tickets found</p>';
        return;
    }
    
    container.innerHTML = tickets.map(ticket => `
        <div class="ticket-card">
            <div class="ticket-header">
                <div class="ticket-event">${ticket.eventName}</div>
                <div class="ticket-status">${ticket.status}</div>
            </div>
            <div class="ticket-details">
                <p><strong>Customer:</strong> ${ticket.customerName}</p>
                <p><strong>Email:</strong> ${ticket.customerEmail}</p>
                <p><strong>Quantity:</strong> ${ticket.quantity}</p>
                <p class="price-display"><strong>Total:</strong> $${ticket.totalPrice}</p>
                <p><strong>Booked on:</strong> ${new Date(ticket.bookingDate).toLocaleString()}</p>
            </div>
            <button class="delete-btn" onclick="deleteTicket(${ticket.id})">Delete Booking</button>
        </div>
    `).join('');
}

// Delete ticket
async function deleteTicket(ticketId) {
    if (!confirm('Are you sure you want to delete this booking?')) {
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/tickets/${ticketId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Ticket deleted successfully!');
            loadAllTickets();
        } else {
            alert('Error deleting ticket');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to server');
    }
}

// Load tickets when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadAllTickets();
    updateTotalPrice();
});
