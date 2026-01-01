export const admin = {
  characterCard: {
    revealedTraits: "Revealed Traits",
    noTraitsRevealed: "No traits revealed yet.",
    noTraitsLeft: "No traits left to reveal",
    selectTraitPlaceholder: "Select a trait to reveal...",
    reveal: "Reveal",
  },

  characterForm: {
    namePlaceholder: "Character name",
    requiredLabel: "Mandatory character",
    traitsPlaceholder: "Traits (comma separated)",
    addCharacter: "Add Character",
  },

  charactersList: {
    empty: "No characters to display yet.",
  },
  scenarioForm: {
    labels: {
      scenarioName: "Scenario name",
      description: "Description (optional)",
      minPlayers: "Minimum players",
      maxPlayers: "Maximum players",
    },
    characterList: {
      requiredTag: "(mandatory)",
    },
    validation: {
      nameRequired: "Please enter a scenario name.",
      minPlayersRequired: "Please enter a minimum number of players.",
      maxPlayersRequired: "Please enter a maximum number of players.",
      minGreaterThanMax:
        "Minimum number of players cannot be greater than the maximum.",
      charactersMustMatchMax:
        "Number of characters must match the maximum number of players.",
    },
  },

  adminHome: {
    title: "Admin – Scenarios",

    modal: {
      title: "Create a new scenario",
      close: "Close",
    },

    states: {
      loading: "Loading scenarios...",
      empty: "No scenarios available.",
    },

    errors: {
      loadScenarios: "Failed to load scenarios.",
      createSession: "Failed to create session.",
      serverCommunication: "Failed to communicate with the server.",
    },

    labels: {
      players: "Players",
      unknown: "?",
    },

    actions: {
      openLive: "Open Live",
      delete: "Delete",
      addNewScenario: "+ Add new scenario",
    },

    confirm: {
      deleteScenario: "Delete this scenario?",
    },
  },

  liveSession: {
    title: "Live Session",
    picked: "picked",
    errors: {
      load: "Failed to load session.",
      addCharacter: "Failed to add character.",
      savePhoto: "Failed to save photo.",
      startSession: "Failed to start session.",
    },
    meta: {
      sessionId: "Session ID",
      phase: "Phase",
      players: "Players",
      slots: "Slots",
    },
    play: {
      label: "PLAY:",
      modes: { slow: "Slow", fast: "Fast" },
      start: "PLAY",
      startTitle: "Start reveal phase",
      hint: "(You need a photo for each character before PLAY)",
    },
    desiredPlayers: {
      label: "Number of players:",
      selected: "Selected:",
    },
    states: {
      noSlots:
        "No slots in this session. This likely means the selected scenario has no mandatory characters.",
    },
    slots: {
      slot: "Slot",
      characterId: "Character ID",
      photo: "Photo",
      photoOk: "OK",
      photoMissing: "Missing photo",
      setPhoto: "Set Photo",
    },
    characters: {
      mandatory: "Mandatory characters",
      optional: "Optional characters",
    },
    tooltips: {
      alreadyPicked: "Already picked",
      reachedLimit: "You reached the player limit",
      add: "Add",
    },
    prompts: {
      photoUrl: (slotIndex) => `Paste photo URL for slot ${slotIndex}:`,
    },
  },

  sessionControl: {
    title: "Game Control",
    labels: {
      joinCode: "Join Code",
      joinCodeMissing: "—",
    },
    actions: {
      endSession: "End Session",
    },
    errors: {
      load: "Failed to load session.",
      sendTrait: "Failed to send trait.",
      sendMessage: "Failed to send message.",
      endSession: "Failed to end session.",
    },
  },
};
