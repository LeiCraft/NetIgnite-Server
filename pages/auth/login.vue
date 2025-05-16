<template>
    <h2 class="mb-4">Login</h2>
    <form action="auth.php" method="post">
        <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" class="form-control" id="username" name="username" required>
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" class="form-control" id="password" name="password" required>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Login</button>
    </form>
</template>

<script setup lang="ts">

</script>

<style>
    body {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .container {
        min-width: 300px;
        max-width: 300px;
        padding: 16px;
        background-color: #1a1b2e;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    }
</style>

