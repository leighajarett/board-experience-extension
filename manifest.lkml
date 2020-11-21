application: app {
  file: "bundle.js"
  label: "Board UI App"
  entitlements: {
    local_storage: yes
    navigation: yes
    new_window: yes
    use_form_submit: yes
    use_embeds: yes
    core_api_methods: ["all_boards", "board", "look","query_for_slug","all_themes","default_theme"]
  }
}
