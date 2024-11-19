use std::fs;
use std::path::{Path, PathBuf};
use std::env;

const MOOD_FILE: &str = "mood_data.txt";

// Helper function to get the file path in the app's data directory
fn get_mood_file_path() -> PathBuf {
    let app_dir = env::var("APPDATA").unwrap_or_else(|_| String::from(".")); // Default to current directory
    let app_path = Path::new(&app_dir).join("MoodTracker");
    app_path.join(MOOD_FILE)
}

// Save mood to a file
#[tauri::command]
fn save_mood(mood: i32) -> Result<String, String> {
    let file_path = get_mood_file_path();
    let content = mood.to_string();

    // Ensure the directory exists
    if let Some(parent) = file_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?; // Ensure the folder exists
    }

    fs::write(file_path, content).map_err(|e| e.to_string())?; // Save mood value
    Ok("Mood saved successfully!".to_string())
}

// Load mood from a file
#[tauri::command]
fn load_mood() -> Result<i32, String> {
    let file_path = get_mood_file_path();

    if file_path.exists() {
        let content = fs::read_to_string(file_path).map_err(|e| e.to_string())?; // Read mood value from file
        content.parse::<i32>().map_err(|e| e.to_string()) // Convert to i32
    } else {
        Ok(3) // Default mood (neutral) if no file exists
    }
}

// Run the Tauri application
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_mood, load_mood]) // Add save_mood and load_mood here
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}