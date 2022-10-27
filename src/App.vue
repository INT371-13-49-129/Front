<template>
  <div id="app" class="h-full w-full fixed font-sans-thai">
    <router-view />
  </div>
</template>

<style>
.vs-avatar img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}
.scroll::-webkit-scrollbar {
  display: none;
}

::-webkit-scrollbar {
  width: 0;
  height: 3px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #8181818b;
}

html {
  scroll-behavior: smooth;
}
</style>
