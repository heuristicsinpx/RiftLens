use serde::Deserialize;
use reqwest::Client;

#[derive(Deserialize)]
struct AccountResponse {
    puuid: String,
    game_name: String,
    tag_line: String,
}

#[tauri::command]
async fn get_match_history(
    game_name: String,
    tag_line: String,
    regional_group: String,
) -> Result<Vec<String>, String> {
    let api_key = std::env::var("RIOT_API_KEY")
        .map_err(|_| "Missing RIOT_API_KEY env variable".to_string())?;

    let client = Client::new();

    // 1. Get PUUID
    let account_url = format!(
        "https://{regional_group}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{}/{}",
        game_name, tag_line
    );

    let account: serde_json::Value = client
        .get(&account_url)
        .header("X-Riot-Token", &api_key)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    println!("Account response = {:?}", account); // <-- log to terminal

    let puuid = account["puuid"].as_str().ok_or("No puuid found")?;

    // 2. Get match IDs
    let matches_url = format!(
        "https://{regional_group}.api.riotgames.com/lol/match/v5/matches/by-puuid/{}/ids?start=0&count=5",
        puuid
    );

    let match_ids: Vec<String> = client
        .get(&matches_url)
        .header("X-Riot-Token", &api_key)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;
    
    println!("Match IDs = {:?}", match_ids); // <-- log to terminal

    Ok(match_ids)
}

fn main() {
    dotenv::dotenv().ok(); // <-- loads .env
    println!("RIOT_API_KEY = {:?}", std::env::var("RIOT_API_KEY")); //API key is getting printed in console 12/09 -> Deft
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_match_history])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

