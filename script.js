let passes = JSON.parse(localStorage.getItem('passHistory')) || [];

function generateTicket() {
    const route = document.getElementById("route-select").value;
    const tickets = document.getElementById("tickets-input").value;
    const fare = document.getElementById("fare-input").value;
    const bookingTime = document.getElementById("booking-time-input").value;

    if (!route || !tickets || !fare || !bookingTime) {
        alert("Please fill in all fields.");
        return;
    }

    const bookingDate = new Date(bookingTime);
    const validityDate = new Date(bookingDate);
    validityDate.setHours(23, 59, 0, 0);

    const ticketNumber = generateTicketNumber(bookingTime);

    const passData = {
        route,
        tickets,
        fare,
        bookingTime,
        validityDate: validityDate.toISOString(),
        ticketNumber,
        created: new Date().toISOString()
    };

    passes.unshift(passData);
    localStorage.setItem('passHistory', JSON.stringify(passes));

    displayTicket(passData);
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

function displayTicket(passData) {
    document.getElementById("route").textContent = passData.route;
    document.getElementById("tickets").textContent = passData.tickets;
    document.getElementById("fare").textContent = `₹${passData.fare}`;
    document.getElementById("booking-date").textContent = formatDate(passData.bookingTime);
    document.getElementById("booking-time").textContent = formatTime(passData.bookingTime);
    document.getElementById("validity-date").textContent = formatDate(passData.validityDate);
    document.getElementById("validity-time").textContent = formatTime(passData.validityDate);
    document.getElementById("ticket-number").textContent = passData.ticketNumber;
}

function showPassHistory() {
    const passList = document.getElementById("pass-list");
    passList.innerHTML = '';
    
    passes.forEach((pass, index) => {
        const passElement = document.createElement('div');
        passElement.className = 'pass-item';
        passElement.innerHTML = `
            <div class="pass-info" onclick="displayTicketFromHistory('${pass.ticketNumber}')">
                <div><strong>${pass.route}</strong></div>
                <div>${formatDate(pass.bookingTime)}</div>
                <div>Ticket #${pass.ticketNumber}</div>
            </div>
            <button class="delete-btn" onclick="deletePass('${pass.ticketNumber}', event)">Delete</button>
        `;
        passList.appendChild(passElement);
    });

    document.getElementById("history-modal").style.display = "block";
}

function displayTicketFromHistory(ticketNumber) {
    const pass = passes.find(p => p.ticketNumber === ticketNumber);
    if (pass) {
        displayTicket(pass);
        closeModal();
        document.getElementById("input-form").style.display = "none";
        document.getElementById("ticket-container").style.display = "block";
    }
}

function deletePass(ticketNumber, event) {
    event.stopPropagation();
    passes = passes.filter(p => p.ticketNumber !== ticketNumber);
    localStorage.setItem('passHistory', JSON.stringify(passes));
    showPassHistory();
}

function deleteAllPasses() {
    if (confirm("Are you sure you want to delete all passes?")) {
        passes = [];
        localStorage.removeItem('passHistory');
        showPassHistory();
    }
}

function closeModal() {
    document.getElementById("history-modal").style.display = "none";
}