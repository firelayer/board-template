import { auth } from '../firebase'
import store from '../store'
import router from '../router'

async function onUserUpdate(user) {
  const { meta: { redirectIfAuth } } = router.currentRoute

  store.commit('app/SET_ISAPPREADY', false)

  if (redirectIfAuth) {
    router.push({ name: 'board' })
  }

  store.commit('app/INITIALIZED', { user: { uid: user.uid, email: user.email, displayName: user.displayName || `anon-${user.uid.substr(0, 4)}` } })
  store.commit('app/SET_ISAPPREADY', true)
}

auth().onAuthStateChanged(async (user) => {
  const { name,  meta: { requiresAuth } } = router.currentRoute

  if (name === 'error') {
    store.commit('app/SET_ISAPPREADY', true)

    return
  }

  if (store.state.app.isAppReady) store.commit('app/SET_ISAPPREADY', false)

  if (user) {
    onUserUpdate(user)
  } else {
    if (requiresAuth) {
      router.push({ name: 'login' })
    }

    if (store.state.app.user !== null) store.commit('app/RESET')

    store.commit('app/SET_ISAPPREADY', true)
  }

  return
})
