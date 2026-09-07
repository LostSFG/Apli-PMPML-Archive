function generateTicket() {
    const route = document.getElementById("route-select").value;
    const tickets = document.getElementById("tickets-input").value;
    const fare = document.getElementById("fare-input").value;
    const bookingTime = document.getElementById("booking-time-input").value;

    if (!route || !tickets || !fare || !bookingTime) {
        alert("Please fill in all fields.");
        return;
    }

    // Calculate validity time as 23:59 on the same day as booking time
    const bookingDate = new Date(bookingTime);
    const validityDate = new Date(bookingDate);
    validityDate.setHours(23, 59, 0, 0); // Set time to 23:59

    const ticketNumber = generateTicketNumber(bookingTime);

    document.getElementById("route").textContent = route;
    document.getElementById("tickets").textContent = `${tickets}`;
    document.getElementById("fare").textContent = `₹${fare}`;
    document.getElementById("booking-date").textContent = formatDate(bookingTime);
    document.getElementById("booking-time").textContent = formatTime(bookingTime);
    document.getElementById("validity-date").textContent = formatDate(validityDate.toISOString());
    document.getElementById("validity-time").textContent = formatTime(validityDate.toISOString());
    document.getElementById("ticket-number").textContent = ticketNumber;

    document.getElementById("input-form").style.display = "none";
    document.getElementById("ticket-container").style.display = "block";
}

function setFare() {
    const route = document.getElementById("route-select").value;
    const fareMap = {
        "Only PMC": 40,
        "Only PCMC": 40,
        "PMC AND PCMC": 50,
        "All Routes": 120,
    };
    document.getElementById("fare-input").value = fareMap[route] || 0;
}

function generateTicketNumber(bookingTime) {
    const date = new Date(bookingTime);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const randomChars = generateRandomChars(6);
    return `${year}${month}${day}${hours}${minutes}${randomChars}`;
}

function generateRandomChars(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    result += digits.charAt(Math.floor(Math.random() * digits.length));
    result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}

function formatDate(datetime) {
    const date = new Date(datetime);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month}, ${year}`;
}

function formatTime(datetime) {
    const date = new Date(datetime);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}