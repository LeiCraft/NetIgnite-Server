
export interface NotificationToastSettings {
    type: "success" | "error" | "info" | "warning";
    message: string;
}

const toastTypes = {
    success: {
        backgroundColor: '#28a745',
        borderColor: '#155724',
        icon: 'check-circle-fill'
    },
    error: {
        backgroundColor: '#dc3545',
        borderColor: '#721c24',
        icon: 'exclamation-triangle-fill'
    },
    info: {
        backgroundColor: '#17a2b8',
        borderColor: '#0c5460',
        icon: 'info-circle-fill'
    },
    warning: {
        backgroundColor: '#ffc107',
        borderColor: '#856404',
        icon: 'exclamation-circle-fill'
    }
}

export function useNotificationToast(settings: NotificationToastSettings): void {

    let toastContainer = document.getElementById('notification-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'notification-toast-container';
        // toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3 text-white';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3 text-white';

        // document.getElementById('dashboard-page')?.appendChild(toastContainer);
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast text-white d-flex p-2 align-items-center';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('data-bs-delay', '2000');

    toast.style.backgroundColor = toastTypes[settings.type].backgroundColor;
    toast.style.border = '1px solid #343a40';
    toast.style.borderRadius = '0.5rem';

    toast.innerHTML = `
        <i class="bi bi-${toastTypes[settings.type].icon} me-2"></i>
        <div class="me-auto fs-6 fw-bold">${settings.message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    `;

    toastContainer.appendChild(toast);

    // @ts-ignore
    const ti = bootstrap.Toast.getOrCreateInstance(toast).show();


    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    }, { once: true });
}
