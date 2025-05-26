

<script setup lang="ts">

import { NuxtLink } from '#components';
import Logo from '@/components/img/logo-white.vue';


</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top border-bottom border-body" data-bs-theme="dark" style="background-color: #0b0c1b !important;">
        <div class="container justify-content-lg-center">
            <a class="navbar-brand" href="/">
                <Logo class="logo" style="height: 50px;" />
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse flex-lg-grow-0" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <NuxtLink class="nav-link active text" aria-current="page" to="/" style="cursor: pointer;">Home</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link" to="/about/">About</NuxtLink>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link external-link" href="https://github.com/LeiCoin-project/" target="_blank">Github</a>
                    </li>
                </ul>
            </div> 
        </div>
    </nav>
</template>

<style scoped>

a.external-link::after {
    content: "↗";
    font-size: 0.8em; 
    margin-left: 0.3em; 
    display: inline-block;
    color: inherit;
    text-decoration: none;
}


</style>
