// Ticket Generation Functions
function generateTicket() {
    // Handle default times
    let bookingTime = document.getElementById("booking-time-input").value;
    let validityTime = document.getElementById("validity-time-input").value;
    
    // Set default booking time to current time if empty
    if (!bookingTime) {
        const now = new Date();
        bookingTime = now.toISOString().slice(0, 16);
        document.getElementById("booking-time-input").value = bookingTime;
    }
    
    // Set default validity time to 1 hour after booking time
    if (!validityTime) {
        const bookingDate = new Date(bookingTime);
        bookingDate.setHours(bookingDate.getHours() + 1);
        validityTime = bookingDate.toISOString().slice(0, 16);
        document.getElementById("validity-time-input").value = validityTime;
    }

    // Get form values
    const route = handleSelectValue('route-select', 'route-input');
    const tickets = document.getElementById("tickets-input").value;
    const fare = parseInt(document.getElementById("fare-input").value);
    const startPoint = handleSelectValue('start-point-select', 'start-point-input');
    const endPoint = handleSelectValue('end-point-select', 'end-point-input');

    // Validate required fields
    if (!route || !tickets || !fare || !startPoint || !endPoint) {
        alert("Please fill in all required fields.");
        return;
    }

    // Generate and display ticket
    const ticketNumber = generateTicketNumber(bookingTime);
    displayTicket({
        route,
        tickets,
        fare,
        startPoint,
        endPoint,
        bookingTime,
        validityTime,
        ticketNumber
    });

    // Save to history and storage
    saveTicketToHistory({
        route,
        tickets,
        fare,
        startPoint,
        endPoint,
        bookingTime,
        validityTime,
        ticketNumber,
        displayDate: formatDate(bookingTime),
        displayTime: formatTime(bookingTime)
    });
    saveInputs();

    // Switch view to ticket
    showView('ticket-container');
}

// Helper Functions
function handleSelectValue(selectId, inputId) {
    const select = document.getElementById(selectId);
    const input = document.getElementById(inputId);
    return select.value === 'other' ? input.value : select.value;
}

function generateTicketNumber(bookingTime) {
    const date = new Date(bookingTime);
    return [
        date.getFullYear().toString().slice(-2),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getDate().toString().padStart(2, '0'),
        (date.getHours() % 12 || 12).toString().padStart(2, '0'),
        date.getMinutes().toString().padStart(2, '0'),
        generateRandomChars(6)
    ].join('');
}

function generateRandomChars(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    return Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('') +
           digits[Math.floor(Math.random() * digits.length)] +
           chars[Math.floor(Math.random() * chars.length)];
}

// Date/Time Formatting
function formatDate(dateTime) {
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('en-US', { month: 'short' })}, ${date.getFullYear().toString().slice(-2)}`;
}

function formatTime(dateTime) {
    const date = new Date(dateTime);
    const hours = date.getHours() % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
}

// Fare Calculation
function updateFare() {
    const farePerTicket = document.getElementById('fare-per-ticket').value;
    const tickets = parseInt(document.getElementById('tickets-input').value) || 0;
    
    let fareValue = farePerTicket === 'other' ?
        parseInt(prompt("Enter custom fare per ticket:") || 0) :
        parseInt(farePerTicket);

    document.getElementById('fare-input').value = fareValue * tickets;
}

// History Management
function showHistory() {
    const history = loadTicketHistory();
    const historyList = document.getElementById("history-list");
    
    historyList.innerHTML = history.length ? 
        history.map(ticket => `
            <div class="ticket-item" onclick="showTicketFromHistory('${ticket.ticketNumber}')">
                <strong>${ticket.ticketNumber}</strong><br>
                ${ticket.route} | ${ticket.displayDate}
                <button onclick="event.stopPropagation(); deleteTicket('${ticket.ticketNumber}')" 
                        class="delete-button">Delete</button>
            </div>
        `).join('') : 
        "<p>No tickets generated yet</p>";

    showView('history-container');
}

function deleteTicket(ticketNumber) {
    const history = loadTicketHistory().filter(t => t.ticketNumber !== ticketNumber);
    localStorage.setItem('ticketHistory', JSON.stringify(history));
    showHistory();
}

function deleteAllTickets() {
    localStorage.removeItem('ticketHistory');
    showHistory();
}

// Storage Handlers
function saveInputs() {
    const inputs = {
        route: document.getElementById("route-select").value,
        tickets: document.getElementById("tickets-input").value,
        fare: document.getElementById("fare-input").value,
        startPoint: document.getElementById("start-point-select").value,
        endPoint: document.getElementById("end-point-select").value,
        bookingTime: document.getElementById("booking-time-input").value,
        validityTime: document.getElementById("validity-time-input").value
    };
    
    Object.entries(inputs).forEach(([key, value]) => 
        localStorage.setItem(key, value));
}

function loadTicketHistory() {
    return JSON.parse(localStorage.getItem('ticketHistory') || '[]');
}

function saveTicketToHistory(ticket) {
    const history = loadTicketHistory();
    history.unshift(ticket);
    localStorage.setItem('ticketHistory', JSON.stringify(history));
}

// View Management
function showView(viewId) {
    ['input-form', 'ticket-container', 'history-container'].forEach(id => 
        document.getElementById(id).style.display = id === viewId ? 'block' : 'none');
}

function showForm() {
    showView('input-form');
}

// Select Handlers
function handleRouteSelect() {
    toggleOtherInput('route-select', 'route-input');
}

function handleStartPointSelect() {
    toggleOtherInput('start-point-select', 'start-point-input');
}

function handleEndPointSelect() {
    toggleOtherInput('end-point-select', 'end-point-input');
}

function toggleOtherInput(selectId, inputId) {
    const select = document.getElementById(selectId);
    const input = document.getElementById(inputId);
    input.style.display = select.value === 'other' ? 'block' : 'none';
    if (select.value !== 'other') input.value = select.value;
}

// Ticket Display
function displayTicket(ticket) {
    document.getElementById("route").textContent = ticket.route;
    document.getElementById("tickets").textContent = `${ticket.tickets}F`;
    document.getElementById("fare").textContent = `₹${ticket.fare}`;
    document.getElementById("start-point").textContent = ticket.startPoint;
    document.getElementById("end-point").textContent = ticket.endPoint;
    document.getElementById("booking-date").textContent = formatDate(ticket.bookingTime);
    document.getElementById("booking-time").textContent = formatTime(ticket.bookingTime);
    document.getElementById("validity-date").textContent = formatDate(ticket.validityTime);
    document.getElementById("validity-time").textContent = formatTime(ticket.validityTime);
    document.getElementById("ticket-number").textContent = ticket.ticketNumber;
}

// Initialization
window.onload = function() {
    // Load saved inputs
    ['route-select', 'start-point-select', 'end-point-select'].forEach(id => 
        document.getElementById(id).value = localStorage.getItem(id.replace('-select', '')) || '');
    
    ['tickets-input', 'fare-input', 'booking-time-input', 'validity-time-input'].forEach(id => 
        document.getElementById(id).value = localStorage.getItem(id.replace('-input', '')) || '');

    // Initialize select inputs
    handleRouteSelect();
    handleStartPointSelect();
    handleEndPointSelect();

    // Handle deep linking
    if (location.hash === '#ticket') showView('ticket-container');
};
// Add this function to handle ticket opening from history
function showTicketFromHistory(ticketNumber) {
    const history = loadTicketHistory();
    const ticket = history.find(t => t.ticketNumber === ticketNumber);
    
    if (ticket) {
        // Update ticket display
        document.getElementById("route").textContent = ticket.route;
        document.getElementById("tickets").textContent = `${ticket.tickets}F`;
        document.getElementById("fare").textContent = `₹${ticket.fare}`;
        document.getElementById("start-point").textContent = ticket.startPoint;
        document.getElementById("end-point").textContent = ticket.endPoint;
        document.getElementById("booking-date").textContent = formatDate(ticket.bookingTime);
        document.getElementById("booking-time").textContent = formatTime(ticket.bookingTime);
        document.getElementById("validity-date").textContent = formatDate(ticket.validityTime);
        document.getElementById("validity-time").textContent = formatTime(ticket.validityTime);
        document.getElementById("ticket-number").textContent = ticket.ticketNumber;

        // Switch view to ticket
        document.getElementById("history-container").style.display = "none";
        document.getElementById("ticket-container").style.display = "block";
    }
}

// Update the history generation code in showHistory()
function showHistory() {
    const history = loadTicketHistory();
    const historyList = document.getElementById("history-list");
    
    historyList.innerHTML = history.length ? 
        history.map(ticket => `
            <div class="ticket-item">
                <strong>${ticket.ticketNumber}</strong><br>
                ${ticket.route} | ${ticket.displayDate}
                <button onclick="event.stopPropagation(); deleteTicket('${ticket.ticketNumber}')" 
                        class="delete-button">Delete</button>
            </div>
        `).join('') : 
        "<p>No tickets generated yet</p>";

    // Add click handlers for ticket items
    document.querySelectorAll('.ticket-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            showTicketFromHistory(history[index].ticketNumber);
        });
    });

    showView('history-container');
}