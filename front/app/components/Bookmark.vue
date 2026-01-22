<template>
  <div class="section">
    <img src="/bookmark.png" class="image show" alt="Bookmark" />
  </div>
</template>

<style scoped>
.section {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; 
}

.image {
  position: absolute;
  top: 0.5rem;   
  right: 0rem;  
  width: auto;    
  height: auto;
  max-width: calc(100vw - 1rem);
  max-height: calc(100vh - 1rem);
  pointer-events: auto;
  z-index: 1000;
}

@media (max-width: 770px) {
  .show{
    display: none;
  }
}
</style>