document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-trick-form');
    
    postForm.addEventListener('submit', (event) => {
        // 1. Stop the form from reloading the page
        event.preventDefault();

        // 2. Get the content from the text boxes
        const trickDescription = document.getElementById('trick-description').value;
        const trickCode = document.getElementById('trick-code').value;

        // Simple validation
        if (!trickDescription) {
            alert("Please write a description for your trick!");
            return;
        }

        // 3. Package the data into an object
        const newTrick = {
            trick: trickDescription,
            code: trickCode
        };

        // 4. Send the data to the backend server using fetch()
        console.log("Sending new trick to server:", newTrick);

        fetch('http://localhost:3000/api/tricks', {
            method: 'POST', // We are creating something new
            headers: {
                'Content-Type': 'application/json', // We are sending JSON data
            },
            body: JSON.stringify(newTrick), // Convert the JS object to a JSON string
        })
        .then(response => {
            if (!response.ok) {
                // If the server sends an error, show it
                throw new Error('Server responded with an error!');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success! Server responded with:', data);
            alert('Your trick has been posted successfully!');
            // 5. Redirect the user back to the main page to see their post
            window.location.href = '/index.html';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Oh no! Something went wrong and we could not post your trick.');
        });
    });
});