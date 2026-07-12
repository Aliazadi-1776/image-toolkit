mod cli;
mod commands;
mod error;
mod models;
<<<<<<< HEAD
mod tool_status;
mod tools;

=======
mod settings;
mod tool_status;
mod tools;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::health_check,
            commands::preview_command,
            commands::resolve_input_paths,
            commands::start_queue,
<<<<<<< HEAD
            tool_status::tool_statuses,
=======
            tool_status::tool_statuses
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
        ])
        .run(tauri::generate_context!())
        .expect("error while running Image Toolkit");
}
