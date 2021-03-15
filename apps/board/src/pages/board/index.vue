<template>
  <div v-if="user" class="page">
    <v-row dense>
      <v-col cols="12">
        <v-card class="pa-2 text-center">
          <div class="headline mb-1">Welcome to the <span class="primary--text">Firelayer</span> Suggestions Board</div>
          <p>If you would like to know more about Firelayer before continuing, go ahead and checkout the documentation website.</p>
          <v-btn
            class="mr-2"
            href="https://firelayer.io/docs"
            target="_blank"
          >
            <v-icon left>mdi-book</v-icon>
            Documentation
          </v-btn>
          <v-btn
            href="https://github.com/firelayer/firelayer"
            target="_blank"
          >
            <v-icon left>mdi-github</v-icon>
            Github
          </v-btn>
          <div>
            <v-divider/>
            This board is also available as a Firelayer template <br/>
            <code>firelayer init myboard -t board</code>
            <v-divider/>
            <div>
              Thank you for participating. Your feedback is very much appreciated.
              <br/>
              On the board bellow you can create new suggestions or <v-icon small color="primary">mdi-menu-up</v-icon> upvote existing ones.
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-center mt-2">
      <v-chip
        v-if="!user.email"
        class="accent pa-2"
        x-large
        outlined
        label
      >
        You can add suggestions as anonymous.<br/>
        To upvote a card you need to login with a verified account.
      </v-chip>
    </div>

    <div class="board my-4">
      <div v-for="list in lists" :key="list.id" class="board-column">
        <div class="text-uppercase font-weight-bold primary--text board-column-label">{{ list.label }}</div>
        <div class="board-column-description caption">{{ list.description }}</div>

        <v-btn
          class="justify-start mt-1 mb-2"
          color="primary"
          @click="openAdd(list)"
        >
          <v-icon small left>mdi-plus</v-icon> Add a Suggestion
        </v-btn>

        <transition-group name="list">
          <v-card v-for="card in parse(cards, list.id)" :key="card.id" class="board-item elevation-1 pa-1">
            <div class="mb-2">{{ card.t }}</div>
            <div v-if="card.votes" class="text-right">
              <v-divider/>
              <div class="d-flex flex-grow align-center">
                <v-chip
                  v-if="user.uid === card.u"
                  color="secondary"
                  small
                  label
                >
                  Owner
                </v-chip>
                <v-btn
                  v-if="user.email && card.votes.indexOf && card.votes.indexOf(user.uid) === -1"
                  outlined
                  small
                  color="primary"
                  @click="upvote(card)"
                >
                  Upvote
                  <v-icon right>mdi-menu-up</v-icon>
                </v-btn>
                <v-spacer/>
                <div class="caption ma-1 primary--text d-flex font-weight-bold">
                  <v-icon small color="primary">mdi-chevron-up</v-icon>
                  {{ card.votes && card.votes.length }}
                </div>
              </div>
            </div>

            <v-divider/>
            <div class="caption text-right">{{ card.n }}</div>

            <!-- options menu -->
            <v-menu v-if="user.admin || card.u === user.uid" offset-y left>
              <template #activator="{ on }">
                <v-btn icon x-small class="board-item-menu" v-on="on">
                  <v-icon color="grey darken-2">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="showDelete(card)">
                  <v-list-item-title>Delete Card</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card>
        </transition-group>
      </div>
    </div>
    <div class="caption mt-5 text-center">
      This board is also available in Github as a Firelayer Template
      <a href="https://github.com/firelayer/board-template" target="_blank" class="font-weight-black">Open on GitHub!</a>
    </div>

    <v-dialog v-model="addDialog" max-width="600">
      <v-card>
        <v-card-title class="title">Add Card to {{ addToList.label }}</v-card-title>
        <div class="pa-3">
          <v-text-field
            ref="suggestion"
            v-model="newCardText"
            label="Suggestion"
            maxlength="150"
            counter="150"
            autofocus
            @keyup.enter="addCard()"
          />
          <v-text-field
            v-model="newCardName"
            maxlength="10"
            counter="10"
            label="User display name"
            @keyup.enter="addCard()"
          />
        </div>
        <v-card-actions class="pa-2">
          <v-spacer/>
          <v-btn @click="addDialog = false">Cancel</v-btn>
          <v-btn :loading="isLoadingSave" color="success" @click="addCard()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete Card</v-card-title>
        <v-card-text>Are you sure you want to delete this card?</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
          <v-btn :loading="isLoadingDelete" color="error" @click="deleteCard()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { realtime, TIMESTAMP } from '../../firebase'
import uniqueid from '../../utils/uniqueid'

const cardsRef = realtime().ref('cards/')

export default {
  data() {
    return {
      unsubscribe: null,
      cards: [],
      lists: [{
        id: 0,
        label: 'Templates (Apps Presets)',
        description: 'Web apps fully integrated with Firebase (blog, chat, chrome extension, etc)',
      }, {
        id: 2,
        label: 'Dashboard TEMPLATE',
        description: 'Integrated with Firebase (User management, CMS, email integrations, etc)',
      }, {
        id: 1,
        label: 'Firelayer CLI',
        description: 'Database seed, migrations, run backups, CI integrations',
      }, {
        id: 3,
        label: 'Random',
        description: 'Random feedback or suggestions',
      }],

      isLoadingSave: false,

      // add variables
      addDialog: false,
      addToList: {},
      newCardText: '',
      newCardName: '',

      // delete variables
      deleteDialog: false,
      cardToDelete: null,
      isLoadingDelete: false,
    }
  },
  computed: {
    ...mapState('app', ['user']),
  },
  mounted() {
    this.getBoard()

    this.newCardName = this.user.displayName.substr(0, 10)
  },
  beforeDestroy() {
    cardsRef.off()
  },
  methods: {
    ...mapActions('app', ['showError', 'showToast', 'showSuccess']),
    openAdd(list) {
      this.addToList = list
      this.addDialog = true
    },
    showDelete(card) {
      this.cardToDelete = card
      this.deleteDialog = true
    },
    parse(cards, listId) {
      return cards.filter((card) => card.l === listId).sort((a,b) => {
        if (a.votes.length < b.votes.length) return 1
        if (a.votes.length > b.votes.length) return -1

        return 0
      })
    },
    async getBoard() {
      cardsRef.on('value', (snapshot) => {
        const cards = []

        snapshot.forEach((childSnapshot) => {
          const doc = childSnapshot.val()
          const votes = Object.keys(doc.v || {})

          cards.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
            votes,
          })
        })

        this.cards = cards
      })
    },
    async addCard() {
      if (!this.newCardText) {
        this.$refs.suggestion.focus()

        return
      }

      this.isLoadingSave = true

      try {
        // votes
        const v = {}

        v[this.user.uid] = 1

        const newCard = {
          l: this.addToList.id,
          t: this.newCardText,
          u: this.user.uid,
          n: this.newCardName || `anon-${this.user.uid.substr(0, 4)}`,
          v,
        }

        await cardsRef.child(uniqueid(4)).set(newCard)

        this.showSuccess('Card Added!')
      } catch (error) {
        this.showError({ error })
      }

      this.isLoadingSave = false
      this.addDialog = false
      this.newCardText = ''
    },
    async deleteCard() {
      this.isLoadingDelete = true

      try {
        await cardsRef.child(this.cardToDelete.id).remove()
      } catch (error) {
        this.showError({ error })
      }

      this.isLoadingDelete = false
      this.cardToDelete = null
      this.deleteDialog = false
    },
    async upvote(card) {
      try {
        await cardsRef.child(`${card.id}/v/${this.user.uid}`).set(1)
      } catch (error) {
        this.showError({ error })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.8s;
}

.list-move {
  transition: transform 0.3s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.board {
  display: flex;
  overflow-x: scroll;

  .board-column {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 200px;
    margin-right: 8px;
    padding: 8px;
    border-radius: 6px;

    &-label {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-description {
      min-height: 80px;
    }

    &:last-of-type {
      margin-right: 0;
    }
  }

  .board-group {
    margin-top: 16px;
    height: 100%;
  }

  .board-item {
    position: relative;
    margin-bottom: 8px;
    border-radius: 6px;
    min-height: 60px;
  }

  .board-item-menu {
    position: absolute;
    top: 6px;
    right: 6px;
  }
}
</style>
