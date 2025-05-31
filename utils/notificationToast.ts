
export function fireNotificationToast() {

    let toastContainer = document.getElementById('notification-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'notification-toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3 text-white';

        document.getElementById('dashboard-page')?.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast text-white d-flex p-2';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.style.backgroundColor = '#1a1b2e';
    toast.style.border = '1px solid #343a40';
    toast.style.borderRadius = '0.5rem';

    toast.innerHTML = `
        <div class="me-auto fs-6 fw-bold">Bootstrap</div>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    `;

    toastContainer.appendChild(toast);

    // @ts-ignore
    bootstrap.Toast.getOrCreateInstance(toast).show();

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    }, { once: true });
}
