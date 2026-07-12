mod cli;
mod commands;
mod error;
mod models;
mod tool_status;
mod tools;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::health_check,
            commands::preview_command,
            commands::resolve_input_paths,
            commands::start_queue,
            tool_status::tool_statuses,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Image Toolkit");
}
