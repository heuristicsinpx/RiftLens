use reqwest::Client;
use serde_json::Value;

// ❌ Remove unused struct or allow dead_code
#[allow(dead_code)]
#[derive(serde::Deserialize)]
struct AccountResponse {
    puuid: String,
    gameName: String,
    tagLine: String,
}

// ✅ Platform to regional group mapping
fn platform_to_regional_group(platform: &str) -> &str {
    match platform.to_lowercase().as_str() {
        // Americas
        "na1" | "br1" | "la1" | "la2" | "oc1" => "americas",
        // Europe
        "euw1" | "eun1" | "tr1" | "ru" => "europe",
        // Asia
        "kr" | "jp1" => "asia",
        // SEA
        "sg2" | "ph2" | "th2" | "tw2" | "vn2" => "sea",
        // fallback
        _ => "americas",
    }
}

// ✅ Tauri command: parameter names must match frontend keys exactly
#[tauri::command]
async fn get_match_history(
    gameName: String,
    tagLine: String,
    platform: String,
) -> Result<Vec<String>, String> {
    let api_key = std::env::var("RIOT_API_KEY")
        .map_err(|_| "Missing RIOT_API_KEY env variable".to_string())?;

    let client = Client::new();

    println!("📌 Received args -> gameName: {}, tagLine: {}, platform: {}", gameName, tagLine, platform);

    // Step 1: Get PUUID from Asia cluster
    let account_url = format!(
        "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{}/{}",
        gameName, tagLine
    );
    println!("🔗 Account URL = {}", account_url);

    let account: Value = client
        .get(&account_url)
        .header("X-Riot-Token", &api_key)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    println!("📝 Account response = {:?}", account);

    let puuid = account["puuid"]
        .as_str()
        .ok_or("No puuid found for this account")?;

    // Step 2: Compute regional group for match API
    let regional_group = platform_to_regional_group(&platform);
    println!("🌍 Detected regional group = {}", regional_group);

    // Step 3: Fetch match IDs
    let matches_url = format!(
        "https://{regional_group}.api.riotgames.com/lol/match/v5/matches/by-puuid/{}/ids?start=0&count=5",
        puuid
    );
    println!("🔗 Matches URL = {}", matches_url);

    let match_ids: Vec<String> = client
        .get(&matches_url)
        .header("X-Riot-Token", &api_key)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json()
        .await
        .map_err(|e| e.to_string())?;

    println!("✅ Match IDs = {:?}", match_ids);

    Ok(match_ids)
}

fn main() {
    dotenv::dotenv().ok();
    println!("🔑 RIOT_API_KEY = {:?}", std::env::var("RIOT_API_KEY"));

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_match_history])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
