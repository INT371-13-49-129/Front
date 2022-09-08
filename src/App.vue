<template>
  <div id="app" class="h-full w-full fixed font-sans-thai">
    <router-view />
  </div>
</template>

<style>
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
</style>
