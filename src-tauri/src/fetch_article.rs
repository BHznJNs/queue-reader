use reqwest::{self, header, Client, Error};
use scraper::{ElementRef, Html, Selector};
use serde::Serialize;
use std::time::{self, SystemTime, UNIX_EPOCH};
use unicode_segmentation::UnicodeSegmentation;

fn get_now() -> Result<u128, String> {
    let now = SystemTime::now();
    let duration_since_epoch = now
        .duration_since(UNIX_EPOCH)
        .map_err(|err| err.to_string())?;
    return Ok(duration_since_epoch.as_millis());
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ArticleInfo {
    title: String,
    link: String,
    description: Option<String>,
    append_time: u128,
    needed_time: usize,
}

fn clinet_factory() -> Result<Client, Error> {
    let timeout = time::Duration::from_secs(5);
    let mut headers = header::HeaderMap::new();
    headers.insert(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0"
            .parse()
            .unwrap(),
    );

    let client = reqwest::ClientBuilder::new()
        .timeout(timeout)
        .default_headers(headers)
        .build();
    return client;
}

#[tauri::command]
pub async fn fetch_article(url: &str) -> Result<ArticleInfo, String> {
    const READING_FACTOR: usize = 250;

    let error_mapper = |err: Error| err.to_string();

    let client = clinet_factory().map_err(error_mapper)?;
    let response = client.get(url).send().await.map_err(error_mapper)?;
    let html = response.text().await.map_err(error_mapper)?;
    let document = Html::parse_document(&html);

    let title_selector = Selector::parse("title").unwrap();
    let description_selector = Selector::parse("meta[name=description]").unwrap();
    let content_selector =
        Selector::parse(&vec!["h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "dl"].join(","))
            .unwrap();

    let mut title_iter = document.select(&title_selector);
    let mut description_iter = document.select(&description_selector);
    let content_iter = document.select(&content_selector);

    let title = title_iter
        .next()
        .ok_or(String::from("parse response error"))?
        .inner_html();
    let description = match description_iter.next() {
        Some(desc) if desc.value().attr("content").is_some() => {
            let desc_str = desc.value().attr("content").unwrap().to_string();
            Some(desc_str)
        }
        _ => None,
    };

    let get_text_content = |el: ElementRef| el.text().collect::<Vec<_>>().join(" ");
    let counter = |content: String| content.split_word_bounds().count();
    let word_count = content_iter
        .map(get_text_content)
        .map(counter)
        .sum::<usize>();
    let needed_time = word_count / READING_FACTOR;
    let append_time = get_now()?;

    return Ok(ArticleInfo {
        title,
        link: url.to_string(),
        description,
        append_time,
        needed_time,
    });
}
