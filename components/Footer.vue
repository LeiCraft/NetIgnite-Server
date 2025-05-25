<script setup lang="ts">

defineProps({
    withMargin: {
        type: Boolean,
        default: true,
    }
});

</script>

<template>
    <footer class="footer" :style="{ marginTop: withMargin ? '50px' : '0px' }">
        <div class="container-fluid footer-legal">
            <p class="legal-paragraph">
                <span class="copyright-text">&copy; 2021 - 2025 LeiCraft_MC. Alle Rechte vorbehalten</span><br>
            </p>
        </div>
    </footer>
</template>

<style scoped>

.footer {
    margin-bottom: 0;
}
.footer-legal {
    background-color: #1a1b2e;
	text-align: center;
}

.legal-paragraph {
	padding-top: 8px;
    padding-bottom: 8px;
    margin-bottom: 0;
}

.copyright-text {
    background-color: #1a1b2e;
}

.legal-text {
	text-decoration: none;
	color: rgb(255, 254, 255, 0.75);
}

</style>