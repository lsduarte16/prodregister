const utilsFunctions = {
    showAlert: (type, message) => {
        const alertDiv = document.getElementById('alert');
        alertDiv.textContent = message;
        alertDiv.classList.remove('hidden');
        alertDiv.classList.add(type);
        setTimeout(() => {
            alertDiv.textContent = '';
            alertDiv.classList.add('hidden');
            alertDiv.classList.remove(type);
        }, 3000);
    },
    showSuccessMessage: (message) => {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = message;
        successMessage.classList.remove('hidden');
    }
};


