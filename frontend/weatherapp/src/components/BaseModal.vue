<template>
    <Teleport to="body">
        <Transition name="modal-outer">
            <div v-show="modalActive" class="absolute w-full bg-black bg-opacity-30 h-screen top-0 left-0 flex justify-center px-8">
                <Transition name="modal-inner">
                    <div v-if="modalActive" class="p-4 bg-white self-start lg:mt-32 mt-10 max-w-screen-md">
                        <slot />
                        <button @click="$emit('close-modal')" class="text-secondary-content mt-8 bg-secondary py-2 px-6">Close</button>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
defineEmits(['close-modal'])
defineProps({
    modalActive: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>

.modal-outer-enter-active,
.modal-outer-leave-active {
    transition: opacity 0.3s ease-in-out;
}

.modal-outer-enter-from,
.modal-outer-leave-to {
    opacity: 0;
}

.modal-inner-enter-active,
.modal-inner-leave-active {
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.modal-inner-enter-from,
.modal-inner-leave-to {
    transform: translateY(-20px);
}

.modal-container {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
}


</style>
