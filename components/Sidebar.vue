<script setup lang="ts">

import Logo from '@/components/img/logo-white.vue';

const dashboard_sidebar = ref<HTMLElement | null>(null);

function closeSidebar() {
    // @ts-ignore
    const offcanvas = bootstrap.Offcanvas.getInstance(dashboard_sidebar.value);
    if (offcanvas) {
        offcanvas.hide();
    }
}

async function logoutUser() {
    const result = await useAPI("/api/auth/logout", {
        method: 'POST'
    });
    if (result.status !== "OK") {
        useNotificationToast({
            message: `Error logging out: ${result?.message || 'unknown error'}`,
            type: 'error'
        });
        return;
    }
    useNotificationToast({
        message: 'Logged out successfully',
        type: 'success'
    });

    navigateTo('/auth/login');
}

</script>

<template>
    <!--<link rel="stylesheet" href=
"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity=
"sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" 
        referrerpolicy="no-referrer" /> -->
    <div class="container-fluid p-0 d-flex h-100">
        <div id="dashboard-sidebar" ref="dashboard_sidebar" class="d-flex flex-column flex-shrink-0 p-3 text-white offcanvas-lg offcanvas-start dashboard-sidebar-color">
            <a href="#" class="navbar-brand">
                <Logo />
            </a><hr>
            <ul class="mynav nav nav-pills flex-column mb-auto">
                <li class="nav-item mb-1">
                    <NuxtLink to="/" @click="closeSidebar">
                        <!-- <i class="fa-regular fa-user"></i> -->
                        Home
                    </NuxtLink>
                </li>

                <li class="nav-item mb-1">
                    <NuxtLink to="/devices" @click="closeSidebar">
                        <!-- <i class="fa-regular fa-bookmark"></i> -->
                        Devices
                    </NuxtLink>
                </li>
                <li class="nav-item mb-1">
                    <NuxtLink to="/agents" @click="closeSidebar">
                        <!-- <i class="fa-regular fa-newspaper"></i> -->
                        Agents
                    </NuxtLink>
                </li>

                <!-- <li class="sidebar-item nav-item mb-1">
                    <a href="#" 
                       class="sidebar-link collapsed" 
                       data-bs-toggle="collapse"
                       data-bs-target="#settings"
                       aria-expanded="false"
                       aria-controls="settings">
                        <i class="fas fa-cog pe-2"></i>
                        <span class="topic">Settings </span>
                    </a>
                    <ul id="settings" 
                        class="sidebar-dropdown list-unstyled collapse" 
                        data-bs-parent="#sidebar">
                        <li class="sidebar-item">
                            <a href="#" class="sidebar-link">
                                <i class="fas fa-sign-in-alt pe-2"></i>
                                <span class="topic"> Login</span>
                            </a>
                        </li>
                        <li class="sidebar-item">
                            <a href="#" class="sidebar-link">
                                <i class="fas fa-user-plus pe-2"></i>
                                <span class="topic">Register</span>
                            </a>
                        </li>
                        <li class="sidebar-item">
                            <a href="#" class="sidebar-link">
                                <i class="fas fa-sign-out-alt pe-2"></i>
                                <span class="topic">Log Out</span>
                            </a>
                        </li>
                    </ul>
                </li> -->
            </ul>
            <hr>
            <div class="dropdown">
                <a class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <!-- <img src="https://github.com/mdo.png" alt="hugenerd" width="30" height="30" class="rounded-circle"> -->
                    <span>
                        {{ SessionStore.useUserInfo().username || 'unknown' }}
                    </span>
                </a>
                <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                    <li><NuxtLink to="/account/settings" @click="closeSidebar" class="dropdown-item">Settings</NuxtLink></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item" @click="logoutUser">Log out</a></li>
                </ul>
            </div>
        </div>

        <div class="flex-fill d-flex flex-column page-content-wrapper">
            <div class="p-2 d-lg-none d-flex text-white dashboard-sidebar-color mobile-header align-items-center">
                <a href="#" class="text-white" data-bs-toggle="offcanvas" data-bs-target="#dashboard-sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 30 30">
                        <path stroke="#ffffff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M4 7h22M4 15h22M4 23h22"/>
                    </svg>
                </a>
                <Logo style="height: 100%;" />
            </div>
            <div class="page-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>

#dashboard-sidebar {
    min-width: 230px;
    max-width: 250px;
}

.dashboard-sidebar-color {
    background-color: #1a1b2e !important;
}

.mynav {
    color: #fff;
}

.mynav li a {
    color: #fff;
    text-decoration: none;
    width: 100%;
    display: block;
    border-radius: 5px;
    padding: 8px 5px;
}

.mynav li a.active {
    background: rgba(255, 255, 255, 0.2);
}

.mynav li a:hover {
    background: rgba(255, 255, 255, 0.2);
}

.mynav li a i {
    width: 25px;
    text-align: center;
}

.page-content-wrapper {
    height: 100vh; /* Full screen height */
    overflow: hidden; /* Prevent page from scrolling */
}   

.page-content {
    flex: 1 1 auto;
    overflow-y: auto;
    height: 100%; /* Ensure it fills the remaining space */
}

.mobile-header {
    height: 55px;
}

.dropdown-menu {
    background-color: #1a1b2e;
    border: 1px solid rgba(255, 255, 255, 0.25);
}

.dropdown-divider {
    border-color: rgba(255, 255, 255, 0.25);
}

</style>