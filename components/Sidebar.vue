<script setup lang="ts">

import Logo from '@/components/img/logo-white.vue';

</script>

<template>
    <!--<link rel="stylesheet" href=
"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity=
"sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" 
        referrerpolicy="no-referrer" /> -->
    <div class="container-fluid p-0 d-flex h-100">
        <div id="dashboard-sidebar" class="d-flex flex-column flex-shrink-0 p-3 text-white offcanvas-md offcanvas-start dashboard-sidebar-color">
            <a href="#" class="navbar-brand">
                <Logo />
            </a><hr>
            <ul class="mynav nav nav-pills flex-column mb-auto">
                <li class="nav-item mb-1">
                    <a href="#">
                        <i class="fa-regular fa-user"></i>
                        Profile
                    </a>
                </li>

                <li class="nav-item mb-1">
                    <a href="#">
                        <i class="fa-regular fa-bookmark"></i>
                        Saved Articles  
                    </a>
                </li>
                <li class="nav-item mb-1">
                    <a href="#">
                        <i class="fa-regular fa-newspaper"></i>
                        Articles
                    </a>
                </li>
                <li class="nav-item mb-1">
                    <a href="#">
                        <i class="fa-solid fa-archway"></i>
                        Institutions
                    </a>
                </li>
                <li class="nav-item mb-1">
                    <a href="#">
                        <i class="fa-solid fa-graduation-cap"></i>
                        Organizations
                    </a>
                </li>

                <li class="sidebar-item nav-item mb-1">
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
                </li>
            </ul>
            <hr>
            <div class="d-flex">

                <i class="fa-solid fa-book  me-2"></i>
                <span>
                    <h6 class="mt-1 mb-0">
                          Geeks for Geeks Learning Portal
                      </h6>
                </span>
            </div>
        </div>

        <div class="flex-fill d-flex flex-column page-content-wrapper">
            <div class="p-2 d-md-none d-flex text-white dashboard-sidebar-color">
                <a href="#" class="text-white" data-bs-toggle="offcanvas" data-bs-target="#dashboard-sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 30 30">
                        <path stroke="#ffffff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M4 7h22M4 15h22M4 23h22"/>
                    </svg>
                </a>
                <Logo style="height: 30px;" />
            </div>
            <div class="page-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>

#dashboard-sidebar {
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

</style>