let currentDay = 1;
let weekTitle = "";
let tasks = [];

// Function to fade out an element
function fadeOut(element) {
    element.classList.add('fade-out');
    setTimeout(() => {
        element.classList.add('hidden');
        element.classList.remove('fade-out');
    }, 500); // Wait for 0.5 seconds before hiding
}

// Function to fade in an element
function fadeIn(element) {
    element.classList.remove('hidden', 'fade-out');
    setTimeout(() => {
        element.classList.add('fade-in');
    }, 10); // Small timeout to ensure the fade-in starts after removing hidden
}

// Event listener for week title submission
document.getElementById('submitTitle').addEventListener('click', () => {
    weekTitle = document.getElementById('weekTitle').value;
    if (weekTitle) {
        tasks = []; // Reset tasks for the new week
        const messageElement = document.getElementById('message');
        fadeOut(messageElement); // Fade out the week title message

        setTimeout(() => {
            document.getElementById('dayContainer').classList.remove('hidden');
            showDay();
            fadeIn(document.getElementById('dayContainer')); // Fade in the day container
        }, 500); // Wait for the fade-out to finish
    }
});

// Event listener for daily task submission
document.getElementById('submitTask').addEventListener('click', () => {
    let task = document.getElementById('dailyTask').value;
    if (task) {
        tasks.push(task);
        document.getElementById('dailyTask').value = '';
        currentDay++;

        if (currentDay > 7) {
            fadeOut(document.getElementById('dayContainer'));
            setTimeout(() => {
                document.getElementById('downloadContainer').classList.remove('hidden');
                fadeIn(document.getElementById('downloadContainer')); // Fade in the download container
            }, 500); // Wait for fade out to finish
        } else {
            fadeOut(document.getElementById('dayTitle'));
            setTimeout(() => {
                showDay();
                fadeIn(document.getElementById('dayTitle')); // Fade in the new day title
            }, 500); // Wait for fade out to finish
        }
    }
});

// Function to display the current day
function showDay() {
    document.getElementById('dayTitle').innerText = `Day ${currentDay}`;
    document.getElementById('dailyTask').placeholder = `What will you do on Day ${currentDay}?`;
}

// Event listener for PDF download
document.getElementById('downloadPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;  // Access jsPDF from the window object
    let doc = new jsPDF();

    // Set font size and style for the title
    doc.setFontSize(24); // Larger font size for the title
    doc.setFont("helvetica", "bold"); // Bold font style
    const titleWidth = doc.getTextWidth(weekTitle); // Width of the title text
    const pageWidth = doc.internal.pageSize.getWidth(); // Width of the page
    const x = (pageWidth - titleWidth) / 2; // Center the title

    // Add title to the PDF
    doc.text(weekTitle, x, 20); // Top center of the page

    // Set font size and style for the tasks
    doc.setFontSize(16); // Set font size for tasks
    doc.setFont("helvetica", "normal"); // Normal font style

    // Add tasks to the PDF
    for (let i = 0; i < tasks.length; i++) {
        doc.text(`Day ${i + 1}: ${tasks[i]}`, 10, 40 + (i * 10)); // Y position adjusted for tasks
    }

    // Get the current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Format hours
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Format minutes
    const timeString = `${hours}:${minutes}`; // Combine hours and minutes

    // Save the PDF with the title and current time as filename
    doc.save(`${weekTitle}${timeString}.pdf`);
});
