function generateTicket() {
    // Get user inputs
    const route = document.getElementById("route-input").value;
    const tickets = document.getElementById("tickets-input").value;
    const fare = document.getElementById("fare-input").value;
    const startPoint = document.getElementById("start-point-input").value;
    const endPoint = document.getElementById("end-point-input").value;
    const bookingTime = document.getElementById("booking-time-input").value;
    const validityTime = document.getElementById("validity-time-input").value;

    // Validate inputs
    if (!route || !tickets || !fare || !startPoint || !endPoint || !bookingTime || !validityTime) {
        alert("Please fill in all fields.");
        return;
    }

    // Generate the ticket number based on the specified format
    const ticketNumber = generateTicketNumber(bookingTime);

    // Display ticket details
    document.getElementById("route").textContent = route;
    document.getElementById("tickets").textContent = `${tickets}F`; // Add F after the number of tickets
    document.getElementById("fare").textContent = `₹${fare}`;  // Automatically add rupee sign
    document.getElementById("start-point").textContent = startPoint;
    document.getElementById("end-point").textContent = endPoint;
    document.getElementById("booking-date").textContent = formatDate(bookingTime);
    document.getElementById("booking-time").textContent = formatTime(bookingTime);
    document.getElementById("validity-date").textContent = formatDate(validityTime);
    document.getElementById("validity-time").textContent = formatTime(validityTime);
    document.getElementById("ticket-number").textContent = ticketNumber;

    // Show ticket and hide form
    document.getElementById("input-form").style.display = "none";
    document.getElementById("ticket-container").style.display = "block";
}

// Function to generate ticket number in the specified format
function generateTicketNumber(bookingTime) {
    const date = new Date(bookingTime);
    const year = date.getFullYear().toString().slice(-2); // Last two digits of year
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month (01-12)
    const day = date.getDate().toString().padStart(2, '0'); // Day (01-31)

    // Get the hours and minutes in 12-hour format with AM/PM
    const hours = date.getHours() % 12; // Convert to 12-hour format
    const formattedHours = hours === 0 ? '12' : hours.toString().padStart(2, '0'); // Convert 0 to 12

    const minutes = date.getMinutes().toString().padStart(2, '0'); // Minutes (00-59)

    // Generate random characters for the ticket number
    const randomChars = generateRandomChars(6);

    // Construct the ticket number
    return `${year}${month}${day}${formattedHours}${minutes}${randomChars}`;
}

// Function to generate random characters (4 letters, 1 digit, 1 letter)
function generateRandomChars(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    // Generate 4 random letters
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Generate 1 random digit
    result += digits.charAt(Math.floor(Math.random() * digits.length));

    // Generate 1 random letter
    result += chars.charAt(Math.floor(Math.random() * chars.length));

    return result;
}

// Function to format date (date only)
function formatDate(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleDateString(); // Format as date (MM/DD/YYYY)
}

// Function to format time (12-hour format with AM/PM)
function formatTime(dateTime) {
    const date = new Date(dateTime);
    const hours = date.getHours() % 12; // Convert to 12-hour format
    const formattedHours = hours === 0 ? 12 : hours; // Convert 0 to 12
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Minutes (00-59)

    // Determine AM or PM
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    // Return formatted time in 12-hour format with AM/PM
    return `${formattedHours}:${minutes} ${ampm}`;
}

// Save inputs to local storage
function saveInputs() {
    localStorage.setItem('route', document.getElementById("route-input").value);
    localStorage.setItem('tickets', document.getElementById("tickets-input").value);
    localStorage.setItem('fare', document.getElementById("fare-input").value);
    localStorage.setItem('startPoint', document.getElementById("start-point-input").value);
    localStorage.setItem('endPoint', document.getElementById("end-point-input").value);
    localStorage.setItem('bookingTime', document.getElementById("booking-time-input").value);
    localStorage.setItem('validityTime', document.getElementById("validity-time-input").value);
}

// Load inputs from local storage
function loadInputs() {
    document.getElementById("route-input").value = localStorage.getItem('route') || '';
    document.getElementById("tickets-input").value = localStorage.getItem('tickets') || '';
    document.getElementById("fare-input").value = localStorage.getItem('fare') || '';
    document.getElementById("start-point-input").value = localStorage.getItem('startPoint') || '';
    document.getElementById("end-point-input").value = localStorage.getItem('endPoint') || '';
    document.getElementById("booking-time-input").value = localStorage.getItem('bookingTime') || '';
    document.getElementById("validity-time-input").value = localStorage.getItem('validityTime') || '';
}

// Call loadInputs on page load
window.onload = loadInputs;