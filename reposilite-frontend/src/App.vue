<!--
  - Copyright (c) 2023 dzikoysk
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<script setup>
import { onBeforeUnmount, onMounted, nextTick, watchEffect } from 'vue'
import { useHead } from '@vueuse/head'
import { useSession } from "./store/session"
import useTheme from "./store/theme"
import useQualifier from "./store/qualifier"
import usePlaceholders from './store/placeholders'

const { title, description, icpLicense, privacyPolicy } = usePlaceholders()
const { theme, fetchColorMode } = useTheme()
const { initializeSession } = useSession()
const { qualifier } = useQualifier()

const easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
let cardsObserver
let domObserver

const bindCardsReveal = () => {
  if (!cardsObserver) {
    return
  }

  const cards = document.querySelectorAll('.glass-panel, .glass-soft, .card-enter')
  let order = 0

  cards.forEach((card) => {
    if (card.dataset.revealBound) {
      return
    }

    card.dataset.revealBound = 'true'
    card.style.opacity = '0'
    card.style.transform = 'translateY(20px)'
    card.style.transition = `opacity 480ms ${easing} ${order * 120}ms, transform 480ms ${easing} ${order * 120}ms`
    cardsObserver.observe(card)
    order += 1
  })
}

onMounted(() => {
  cardsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return
      }

      entry.target.style.opacity = '1'
      entry.target.style.transform = 'translateY(0)'
      cardsObserver.unobserve(entry.target)
    })
  }, { threshold: 0.12 })

  nextTick(() => bindCardsReveal())

  domObserver = new MutationObserver(() => bindCardsReveal())
  domObserver.observe(document.body, { childList: true, subtree: true })
})

watchEffect(() => {
  document.documentElement.classList.toggle('dark', theme.isDark)
})

onBeforeUnmount(() => {
  cardsObserver?.disconnect()
  domObserver?.disconnect()
})

useHead({
  title, 
  description
})
fetchColorMode()
initializeSession().catch(() => {})
</script>

<template>
  <div v-bind:class="{ 'dark': theme.isDark }">
    <div class="app-shell min-h-screen dark:text-white">
      <router-view 
        class="router-view-full "
        :qualifier="qualifier"
      />
      <div v-if="icpLicense || privacyPolicy" class="absolute h-8 pb-2 w-full text-center text-xs text-[#777777]">
        <a v-if="icpLicense" href="https://beian.miit.gov.cn" target="_blank">{{ icpLicense }}</a>
        <span v-if="icpLicense && privacyPolicy" class="mx-1">·</span>
        <a v-if="privacyPolicy" :href="privacyPolicy" target="_blank">Privacy Policy</a>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800;900&display=swap');

:root {
  --bg-main: #f4f5f7;
  --bg-main-soft: #e9ecf2;
  --bg-panel: #ffffff;
  --bg-panel-soft: #f8f9fc;
  --text-main: #1d2430;
  --text-muted: #5f6b7c;
  --text-note: #7d8796;
  --accent: #d8ad3d;
  --accent-strong: #ffb800;
  --border-soft: rgba(17, 24, 39, 0.11);
  --input-bg: rgba(255, 255, 255, 0.95);
  --input-border: rgba(17, 24, 39, 0.14);
  --btn-primary-from: #4f46e5;
  --btn-primary-to: #4338ca;
  --btn-primary-border: rgba(55, 48, 163, 0.35);
  --btn-secondary-bg: #eef1f7;
  --btn-secondary-border: rgba(17, 24, 39, 0.14);
  --btn-secondary-text: #2a3342;
  --btn-danger-bg: #fee2e2;
  --btn-danger-border: rgba(220, 38, 38, 0.28);
  --btn-danger-text: #991b1b;
}

.dark {
  --bg-main: #101215;
  --bg-main-soft: #171a1f;
  --bg-panel: #1d2128;
  --bg-panel-soft: #1f242b;
  --text-main: #f2f2f2;
  --text-muted: #9aa0aa;
  --text-note: #747b86;
  --border-soft: rgba(255, 255, 255, 0.08);
  --input-bg: rgba(24, 28, 34, 0.95);
  --input-border: rgba(255, 255, 255, 0.1);
  --btn-primary-from: #6366f1;
  --btn-primary-to: #4f46e5;
  --btn-primary-border: rgba(129, 140, 248, 0.35);
  --btn-secondary-bg: #1d232d;
  --btn-secondary-border: rgba(255, 255, 255, 0.12);
  --btn-secondary-text: #e5e7eb;
  --btn-danger-bg: #3f1a1a;
  --btn-danger-border: rgba(248, 113, 113, 0.32);
  --btn-danger-text: #fee2e2;
}

html, body {
  background: radial-gradient(circle at 50% 18%, rgba(88, 108, 132, 0.08) 0%, transparent 36%),
    radial-gradient(circle at 48% 10%, rgba(216, 173, 61, 0.06) 0%, transparent 28%),
    linear-gradient(180deg, var(--bg-main) 0%, var(--bg-main-soft) 100%);
  color: var(--text-main);
}

.dark html, .dark body {
  background: radial-gradient(circle at 50% 22%, rgba(88, 108, 132, 0.13) 0%, transparent 40%),
    radial-gradient(circle at 48% 12%, rgba(216, 173, 61, 0.1) 0%, transparent 32%),
    linear-gradient(180deg, var(--bg-main) 0%, var(--bg-main-soft) 100%);
}

#app {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-shell {
  position: relative;
  background: transparent;
  color: var(--text-main);
}

.app-shell > * {
  position: relative;
  z-index: 1;
}

.glass-panel,
.glass-soft {
  background: linear-gradient(180deg, var(--bg-panel) 0%, var(--bg-panel-soft) 100%);
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.36);
}

.glass-input {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--text-main);
}

.glass-modal {
  background: var(--bg-panel);
  border: 1px solid var(--border-soft);
  border-radius: 14px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.42);
}

h1, h2, h3, .title, .tabs .tab {
  font-family: 'Montserrat', sans-serif;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  font-weight: 800;
}

.page-title {
  font-weight: 900;
  color: var(--text-main);
  letter-spacing: -0.02em;
  text-shadow: 2px 3px 0 rgba(0, 0, 0, 0.5);
}

.section-divider {
  position: relative;
  width: min(460px, 86%);
  height: 16px;
  margin: 10px auto 24px;
}

.section-divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 1px solid rgba(200, 160, 60, 0.4);
}

.section-divider::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9px;
  height: 9px;
  background: rgba(200, 160, 60, 0.4);
  border: 1px solid rgba(200, 160, 60, 0.45);
  transform: translate(-50%, -50%) rotate(45deg);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-main);
}

.card-body {
  color: var(--text-muted);
  line-height: 1.7;
}

.card-note {
  color: var(--text-note);
  font-size: 13px;
}

.glass-accent {
  border-left: 4px solid var(--accent-strong);
}

.accent-icon {
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: var(--accent-strong);
  color: #1a1a1a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  line-height: 1;
}

.btn-discord,
.btn-youtube {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-weight: 600;
  border-radius: 8px;
}

.btn-discord {
  background: #5865f2;
  color: #ffffff;
}

.btn-youtube {
  background: #1e1e1e;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

a, button {
  transition: color 200ms ease, background-color 200ms ease, transform 150ms ease;
}

.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(180deg, var(--btn-primary-from) 0%, var(--btn-primary-to) 100%);
  color: #ffffff;
  font-weight: 700;
  border-radius: 10px;
  border: 1px solid var(--btn-primary-border);
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(67, 56, 202, 0.28);
}

.primary-action:hover {
  filter: brightness(1.07);
  transform: translateY(-2px);
}

.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--btn-secondary-bg);
  color: var(--btn-secondary-text);
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid var(--btn-secondary-border);
  cursor: pointer;
}

.secondary-action:hover {
  border-color: rgba(255, 184, 0, 0.45);
  color: #ffb800;
  transform: translateY(-1px);
}

.dark .secondary-action {
  background: var(--btn-secondary-bg);
  color: var(--btn-secondary-text);
}

.danger-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--btn-danger-bg);
  color: var(--btn-danger-text);
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid var(--btn-danger-border);
  cursor: pointer;
}

.danger-action:hover {
  filter: brightness(1.03);
  transform: translateY(-2px);
}

.icon-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
  cursor: pointer;
}

.icon-action:hover {
  color: var(--text-main);
  border-color: rgba(255, 255, 255, 0.2);
}

.link-action {
  background: transparent;
  border: none;
  color: #9aa0aa;
  font-size: 12px;
  padding: 0;
  cursor: pointer;
}

.link-action:hover {
  color: #ffb800;
}

.is-disabled,
.primary-action:disabled,
.secondary-action:disabled,
.danger-action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.router-view-full {
  min-height: calc(100vh - 2rem);
}

.container {
  @apply px-10 <sm:px-2;
}

.active {
  border-color: var(--accent-strong) !important;
}

.bg-default {
  @apply bg-transparent;
}

.hero-logo,
.hero-headline,
.hero-subtext,
.hero-cta {
  opacity: 0;
  animation: hero-reveal 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.hero-logo { animation-delay: 0ms; }
.hero-headline { animation-delay: 150ms; }
.hero-subtext { animation-delay: 300ms; }
.hero-cta { animation-delay: 450ms; }

.nav-link-item {
  opacity: 0;
  transform: translateY(-10px);
  animation: nav-drop 360ms ease-out forwards;
}

.nav-link-item:nth-child(1) { animation-delay: 100ms; }
.nav-link-item:nth-child(2) { animation-delay: 250ms; }
.nav-link-item:nth-child(3) { animation-delay: 400ms; }
.nav-link-item:nth-child(4) { animation-delay: 550ms; }

@keyframes hero-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes nav-drop {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes title-walk {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
