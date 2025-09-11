// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::header::{HeaderMap, HeaderValue};
use serde::{Deserialize, Serialize};
use tauri::command;
use std::env;

// Riot API models for deserializing JSON responses.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Account {
    puuid: String,
    game_name: String,
    tag_line: String,
}

// Custom error type for the Tauri command.
#[derive(Debug, Serialize)]
enum CommandError {
    RequestError(String),
    ApiError(String),
    SerializationError(String),
}

impl From<reqwest::Error> for CommandError {
    fn from(err: reqwest::Error) -> Self {
        CommandError::RequestError(err.to_string())
    }
}

// This command is exposed to the frontend via Tauri's `invoke` API.
// It takes a game name, tag line, and regional group, and returns a list of match IDs.
#[tauri::command]
async fn get_match_history(game_name: String, tag_line: String, regional_group: String) -> Result<Vec<String>, CommandError> {
    // Read the API key from the environment.
    let api_key = match env::var("RIOT_API_KEY") {
        Ok(key) => key,
        Err(_) => return Err(CommandError::ApiError("RIOT_API_KEY not found. Please create a .env file and set the key.".to_string())),
    };

    // Create a new HTTP client.
    let client = reqwest::Client::new();

    // Set up headers for the API requests
    let mut headers = HeaderMap::new();
    headers.insert("X-Riot-Token", HeaderValue::from_str(&api_key).unwrap());

    // --- Step 1: Get PUUID from Riot ID (gameName and tagLine) ---
    // The account-v1 API is a global endpoint and uses regional routing for the host.
    // The regional groups are "americas", "europe", and "asia".
    let account_url = format!("https://{}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{}/{}", regional_group, game_name, tag_line);
    let account_response = client
        .get(&account_url)
        .headers(headers.clone())
        .send()
        .await?;

    if !account_response.status().is_success() {
        return Err(CommandError::ApiError(format!("Error fetching Riot ID: {}", account_response.status())));
    }

    let account: Account = account_response.json().await?;
    let puuid = account.puuid;

    // --- Step 2: Get Match IDs from PUUID ---
    // The match-v5 API also uses regional routing based on the regional group.
    let matches_url = format!("https://{}.api.riotgames.com/lol/match/v5/matches/by-puuid/{}/ids?start=0&count=20", regional_group, puuid);
    let matches_response = client
        .get(&matches_url)
        .headers(headers)
        .send()
        .await?;

    if !matches_response.status().is_success() {
        return Err(CommandError::ApiError(format!("Error fetching match history: {}", matches_response.status())));
    }

    let match_ids: Vec<String> = matches_response.json().await?;

    Ok(match_ids)
}

fn main() {
    // Load environment variables from the .env file.
    dotenv::dotenv().ok();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_match_history])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
